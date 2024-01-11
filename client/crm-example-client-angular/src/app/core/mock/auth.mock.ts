import { getLocalStorageDb, newToDb } from './mock'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'

export interface IUser {
  key: string;
  email: string;
}

// Any object. This is probably a bad idea.
interface AnyObject {
  [key: string]: string;
}

/**
 * Valid units are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min", "mins", "m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w", "year", "years", "yr", "yrs", and "y". It is not possible to specify months. 365.25 days is used as an alias for a year.
 *
 * If the string is suffixed with "ago", or prefixed with a "-", the resulting time span gets subtracted from the current unix timestamp. A "from now" suffix can also be used for readability when adding to the current unix timestamp.
 */
const accessTokenExpiry = '1h'

const tempAccessTokenSecret = new TextEncoder().encode('local development only 9279Y!5e#8%YupZ4%DZJ1*hy$iQM!M')
// const tempRefreshTokenSecret = new TextEncoder().encode(getRandomString())

const verifyToken = async (token: string, secret: Uint8Array) => {
  try {
    // Verify the JWT token.
    const { payload } = await jwtVerify(token, secret)
    if (!payload) return null

    // Currently does not exist in the database.
    const checkedWithDb = await checkTokenWithDb(payload as AnyObject)
    if (!checkedWithDb) return null

    // Valid - return the verified decoded JWT.
    return payload
  } catch (error) {
    return null
  }
}
const signToken = async (payload: object, secret: Uint8Array) => {
  try {
    const jwt = await new SignJWT(payload as JWTPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(accessTokenExpiry)
      .setIssuedAt()
      .sign(secret)
    return jwt
  } catch (error) {
    return null
  }
}

const checkTokenWithDb = async (tokenPayload: AnyObject) => {
  const userId = tokenPayload['user_id']

  // Check 'database'.
  if (userId) {
    const { users } = getLocalStorageDb()
    if (!users[userId]) return false
    // TODO check if token is expired from the DB.
    return true
  }
  return false
}

export const verifyAccessToken = async (accessToken: string) => verifyToken(accessToken, tempAccessTokenSecret)
const signAccessToken = (payload: object) => signToken(payload, tempAccessTokenSecret)

export const signUpEndpoint = async (email: string) => {
  const db = getLocalStorageDb()

  // Find if user already exists.
  const normalEmail = email.toLowerCase().trim()
  const users = Object.values(db.users) as IUser[]
  const userFound = users.find(({ email: dbEmail }: { email: string }) => dbEmail.toLowerCase().trim() === normalEmail)
  if (userFound) return { statusCode: 409, ok: false, message: 'User already exists' }

  // Else 'save',
  const key = newToDb('users', { email })

  // 'Respond'
  const accessToken = await signAccessToken({ user_id: key, email })
  return { statusCode: 201, ok: true, message: 'User created', accessToken }
}

export const signInEndpoint = async (email: string) => {
  const db = getLocalStorageDb()

  // Find if user already exists.
  const normalEmail = email.toLowerCase().trim()
  const users = Object.values(db.users) as IUser[]
  const userFound = users.find(({ email: dbEmail }: { email: string }) => dbEmail.toLowerCase().trim() === normalEmail)

  if (userFound) {
    const accessToken = await signAccessToken({ user_id: userFound.key, email })
    return { statusCode: 200, ok: true, message: 'Sign-in successful.', accessToken }
  }
  // 'Respond'
  return { statusCode: 400, ok: false, message: 'Invalid sign-in.' }
}

export const isAuthenticatedEndpoint = async (accessToken: string) => {
  try {
    const verified = await verifyAccessToken(accessToken) || {}

    if (!verified || !verified['user_id']) return { ok: false, statusCode: 400, message: 'Invalid token.' }

    return { ok: true, statusCode: 200, message: 'Access token verified.' }
  } catch (error) {
    console.error('isAuthenticatedEndpoint ', error)
    return { ok: false, statusCode: 400, message: 'Invalid token.' }
  }
}
