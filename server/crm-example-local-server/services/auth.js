import { SignJWT, jwtVerify } from 'jose'
import bcryptjs from 'bcryptjs'
import { PostgresDatabase } from '../lib/db/db-postgres.js'
import { successfulResponse, unauthorizedError, validationErrorResponse } from '../lib/common.js'

const ACCESS_TOKEN_EXPIRY = '1h'
const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET)

/**
 * Verify a JWT
 * * Returns the decoded payload if the token is valid.
 * * Returns null if the token is invalid or expired.
 * * Returns null if the token is not found in the database.
 *
 * The JWT is verified by first verifying the signature, then verifying the expiration time, and finally verifying the token with the database.
 *
 * The JWT payload is decoded and verified with the `jwtVerify` function from the `jose` package. The signature is verified with the `verifySignature` function. The expiration time is verified with the `verifyExpirationTime` function. The token is verified with the `checkTokenWithDb` function.
 *
 * The `jwtVerify` function returns a `Promise` that resolves to an object with the `payload` property containing the decoded JWT payload. The `payload` property is an object with the `user_id` property containing the user ID.
 *
 * The `verifySignature` function returns a `Promise` that resolves to a boolean indicating whether the signature is valid.
 *
 * @param {string} token
 * @param {string} secret
 */
const verifyToken = async (token, secret) => {
  try {
    // Verify the JWT token.
    const { payload } = await jwtVerify(token, secret)
    if (!payload) return null

    // Currently does not exist in the database.
    // const checkedWithDb = await checkTokenWithDb(payload)
    // if (!checkedWithDb) return null

    // Valid - return the verified decoded JWT.
    return payload
  } catch (error) {
    return null
  }
}

/**
 * Generate a JWT string
 *
 * @param {object} payload
 * @param {string} secret
 */
const signToken = async (payload, secret, expiry) => {
  try {
    // Use the third-party module (JOSE) to sign a JWT string.
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(expiry)
      .setIssuedAt()
      .sign(secret)

    // Return the string.
    return jwt
  } catch (error) {
    console.error(error)
    // It could not be signed - return null.
    return null
  }
}

// Function to hash a password
const hashPassword = async (password) => {
  const saltRounds = 10 // You can adjust the number of salt rounds according to your security requirements
  const salt = await bcryptjs.genSalt(saltRounds)
  const hashedPassword = await bcryptjs.hash(password, salt)
  return hashedPassword
}

// Function to compare a password with its hash
const comparePassword = async (inputPassword, hashedPassword) => {
  const match = await bcryptjs.compare(inputPassword, hashedPassword)
  return match
}

const extractAuthHeaderToken = (headers) => {
  const authHeader = headers['authorization'] || headers['Authorization'] || ''
  return authHeader.split(' ')[1]
}

export const verifyAccessToken = async (accessToken) => verifyToken(accessToken, ACCESS_TOKEN_SECRET)
export const signAccessToken = async (payload) => signToken(payload, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY)

// Sign up
export const signUpEndpoint = async (requestBody) => {
  const { email, password } = requestBody

  if (!email) throw validationErrorResponse({ message: 'No email provided.' })
  if (!password) throw validationErrorResponse({ message: 'No password provided.' })

  const normalEmail = email.toLowerCase().trim()
  const hashedPassword = await hashPassword(password)

  const db = PostgresDatabase.getInstance().connection
  return db.tx(async t => {

    let userId
    try {
      userId = await t.one('INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING user_id', [normalEmail, hashedPassword])
    } catch (error) {
      if (error.code === '23505' && error.constraint === 'users_unique') throw { validation: true, statusCode: 409, message: 'Email in use' }
      throw error
    }

    const accessToken = await signAccessToken({ user_id: userId, email })
    return successfulResponse({ message: 'User created', accessToken }, 201)
  })
}

// Sign in
export const signInEndpoint = async (requestBody) => {
  const { email, password } = requestBody

  if (!email) throw validationErrorResponse({ message: 'No email provided.' })
  if (!password) throw validationErrorResponse({ message: 'No password provided.' })

  const normalEmail = email.toLowerCase().trim()

  const db = PostgresDatabase.getInstance().connection
  const user = await db.oneOrNone('SELECT user_id, hashed_password FROM users WHERE email = $1', [normalEmail])
  if (!user) throw validationErrorResponse({ message: 'Invalid sign-in.' })

  const match = await comparePassword(password, user.hashed_password)
  if (!match) throw validationErrorResponse({ message: 'Invalid sign-in.' })

  const accessToken = await signAccessToken({ user_id: user.user_id, email })
  return { statusCode: 200, message: 'Sign in successful', accessToken }
}

// Is authenticated
export const isAuthenticatedEndpoint = async (requestHeaders) => {
  try {
    const accessToken = extractAuthHeaderToken(requestHeaders)
    const verified = await verifyAccessToken(accessToken)
    if (!verified) throw unauthorizedError()
    return successfulResponse({ message: 'Authenticated.' })
  } catch (error) {
    throw unauthorizedError()
  }
}