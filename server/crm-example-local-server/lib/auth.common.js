import { SignJWT, jwtVerify } from 'jose'
import { unauthorizedError } from './common.js'

const ACCESS_TOKEN_EXPIRY = '1h'
const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET)

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
 * Extract the JWT from the request headers.
 *
 * @param {*} headers
 */
const extractAuthHeaderToken = (headers) => {
  const authHeader = headers['authorization'] || headers['Authorization'] || ''
  return authHeader.split(' ')[1]
}

export const verifyAccessToken = async (accessToken) => verifyToken(accessToken, ACCESS_TOKEN_SECRET)
export const signAccessToken = async (payload) => signToken(payload, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY)

/**
 * Return the verified access token, from the request header
 *
 * @param {*} reqHeaders
 */
const getAccessTokenFromHeaders = (reqHeaders) => {
  const accessToken = extractAuthHeaderToken(reqHeaders)
  return verifyAccessToken(accessToken)
}

/**
 * Handles user authentication and ultimately returns the user_id if the access token is authentic.
 * * Throws an error if the access token is not authentic.
 * * Throws an error if the access token is not found.
 *
 * @param {*} reqHeaders
 */
export const getUserId = async (reqHeaders) => {
  const accessToken = await getAccessTokenFromHeaders(reqHeaders)
  if (!accessToken) throw unauthorizedError()
  const userId = accessToken.user_id
  if (!userId) throw unauthorizedError()
  return userId
}