import { getLocalStorageDb, newToDb } from './mock'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'

interface IUser {
  user_id: string;
  email: string;
}

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
  if (userFound) return { status: 409, message: 'User already exists' }

  // Else 'save',
  const user_id = newToDb('users', { email })

  // 'Respond'
  const accessToken = await signAccessToken({ user_id, email })
  return { status: 201, message: 'User created', data: { accessToken } }
}

export const signInEndpoint = async (email: string) => {
  const db = getLocalStorageDb()

  // Find if user already exists.
  const normalEmail = email.toLowerCase().trim()
  const users = Object.values(db.users) as IUser[]
  const userFound = users.find(({ email: dbEmail }: { email: string }) => dbEmail.toLowerCase().trim() === normalEmail)

  if (userFound) {
    const accessToken = await signAccessToken({ user_id: userFound.user_id, email })
    return { status: 200, message: 'Sign-in successful.', data: { accessToken }  }
  }
  // 'Respond'
  return { status: 400, message: 'Invalid sign-in.' }
}

export const isAuthenticatedEndpoint = async (accessToken: string) => {
  const verified = await verifyAccessToken(accessToken) || {}

  // Check 'database'.
  if (verified['user_id']) {
    const { users } = getLocalStorageDb()
    const userId = verified['id'] as string
    if (!users[userId]) return false
  }

  return !!verified
}
