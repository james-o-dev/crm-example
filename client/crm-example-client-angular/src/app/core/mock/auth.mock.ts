import { getLocalStorageDb, newToDb } from './mock'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'

export interface IUser {
  key: string;
  email: string;
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
    const { payload } = await jwtVerify(token, secret)
    return payload || null
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

export const verifyAccessToken = (accessToken: string) => verifyToken(accessToken, tempAccessTokenSecret)
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
    return { statusCode: 200, ok: true, message: 'Sign-in successful.', accessToken  }
  }
  // 'Respond'
  return { statusCode: 400, ok: false, message: 'Invalid sign-in.' }
}

export const isAuthenticatedEndpoint = async (accessToken: string) => {
  try {
    const verified = await verifyAccessToken(accessToken) || {}

    if (!verified || !verified['user_id']) return { ok: false, statusCode: 400, message: 'Invalid token.' }

    // Check 'database'.
    if (verified['user_id']) {
      const { users } = getLocalStorageDb()
      const userId = verified['user_id'] as string
      if (!users[userId]) return { ok: false, statusCode: 400, message: 'Invalid token.' }
    }

    return { ok: true, statusCode: 200, message: 'Access token verified.' }
  } catch (error) {
    console.error('isAuthenticatedEndpoint ', error)
    return { ok: false, statusCode: 400, message: 'Invalid token.' }
  }
}
