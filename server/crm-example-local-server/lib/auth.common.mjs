import { SignJWT, jwtVerify } from 'jose'
import { getDb } from './db/db-postgres.mjs'

// These environment variables are required. Stop the server if they are not set.
[
  'ACCESS_TOKEN_EXPIRY',
  'REFRESH_TOKEN_EXPIRY',
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
].forEach(varName => {
  if (!process.env[varName]) throw new Error(`'${varName}' environment variable was not set.`)
})

const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET)
const REFRESH_TOKEN_SECRET = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET)

export const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+-])[A-Za-z\d!@#$%^&*()_+-]{8,}$/
export const PASSWORD_REGEXP_MESSAGE = 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*()_+-), with a minimum length of 8 characters.'


// Standard email format. Also includes '+' symbol.
export const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

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
export const verifyToken = async (token, secret) => {
  try {
    // Verify the JWT token.
    const { payload } = await jwtVerify(token, secret)
    if (!payload) return null

    // Check the database.
    const db = getDb()
    const user = await db.oneOrNone('SELECT iat FROM users WHERE user_id = $1', [payload.user_id])
    // User was not found.
    if (!user) return null
    // Check that it is still valid, according to the DB iat.
    if (user.iat) {
      const dbIat = parseInt(user.iat)
      const jwtIat = payload.iat
      // JWT was invalidated.
      if (jwtIat <= dbIat) return null
    }

    // Valid - return the verified decoded JWT.
    return payload
  } catch (error) {
    return null
  }
}

/**
 * Extract the JWT from the request headers.
 *
 * @param {*} headers
 */
export const extractAuthHeaderToken = (headers) => {
  const authHeader = headers['authorization'] || headers['Authorization'] || ''
  return authHeader.split(' ')[1]
}

export const verifyAccessToken = async (accessToken) => verifyToken(accessToken, ACCESS_TOKEN_SECRET)
export const signAccessToken = async (payload) => signToken(payload, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY)

export const verifyRefreshToken = async (refreshToken) => verifyToken(refreshToken, REFRESH_TOKEN_SECRET)
export const signRefreshToken = async (payload) => signToken(payload, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY)

/**
 * Return the object used as the payload for JWT tokens.
 *
 * @param {string} userId
 * @param {string} email
 */
export const getJwtPayload = (userId, email) => ({ email, user_id: userId })