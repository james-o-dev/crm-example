import { getLocalStorageDb, newToDb } from './mock.js'
import { SignJWT, jwtVerify } from 'jose'

/**
 * Valid units are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min", "mins", "m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w", "year", "years", "yr", "yrs", and "y". It is not possible to specify months. 365.25 days is used as an alias for a year.
 *
 * If the string is suffixed with "ago", or prefixed with a "-", the resulting time span gets subtracted from the current unix timestamp. A "from now" suffix can also be used for readability when adding to the current unix timestamp.
 */
const accessTokenExpiry = '1h'

/**
 * Generate a random string to act as the JWT access token secret.
 */
const tempAccessTokenSecret = new TextEncoder().encode('local development only 9279Y!5e#8%YupZ4%DZJ1*hy$iQM!M')
// const tempRefreshTokenSecret = new TextEncoder().encode(getRandomString())

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
    const checkedWithDb = await checkTokenWithDb(payload)
    if (!checkedWithDb) return null

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
const signToken = async (payload, secret) => {
  try {
    // Use the third-party module (JOSE) to sign a JWT string.
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(accessTokenExpiry)
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
 * Check that the user of the token is still in the database
 * * Checks the User UD
 * * Returns true if valid, false if not
 *
 * @param {string} tokenPayload
 */
const checkTokenWithDb = async (tokenPayload) => {
  const userId = tokenPayload['user_id']

  // Check 'database'.
  if (userId) {
    const { users } = getLocalStorageDb()
    if (!users[userId]) return false
    // TODO check if token is expired from the DB - i.e. check `iat` value.
    return true
  }
  return false
}

/**
 * Verify an access token
 *
 * @param {string} accessToken
 */
export const verifyAccessToken = async (accessToken) => verifyToken(accessToken, tempAccessTokenSecret)

/**
 * Sign / generate an access token
 *
 * @param {object} payload
 */
const signAccessToken = (payload) => signToken(payload, tempAccessTokenSecret)

/**
 * Endpoint: Sign-up a user.
 * * Currently: Only email is required, passwords and other values in the future
 * * Returns `201` if user was successfully created.
 *    * Also returns a JWT in the response.
 * * Returns `409` if user already exists.
 *
 * @param {string} email
 */
export const signUpEndpoint = async (email) => {
  const db = getLocalStorageDb()

  // Find if user already exists.
  const normalEmail = email.toLowerCase().trim()
  const users = Object.values(db.users)
  const userFound = users.find(({ email: dbEmail }) => dbEmail.toLowerCase().trim() === normalEmail)
  // If so, respond with a 409 conflict response.
  if (userFound) return { statusCode: 409, ok: false, message: 'User already exists' }

  // Else 'save',
  const key = newToDb('users', { email })

  // 'Respond'
  const accessToken = await signAccessToken({ user_id: key, email })
  return { statusCode: 201, ok: true, message: 'User created', accessToken }
}

/**
 * Endpoint: Sign-in a user.
 * * Currently: Only email is required, passwords and other values in the future
 * * Returns a JWT in the response.
 *
 * @param {string} email
 */
export const signInEndpoint = async (email) => {
  const db = getLocalStorageDb()

  // Find if user already exists.
  const normalEmail = email.toLowerCase().trim()
  const users = Object.values(db.users)
  const userFound = users.find(({ email: dbEmail }) => dbEmail.toLowerCase().trim() === normalEmail)

  if (userFound) {
    // User was found - sign in and return with a JWT/s.
    const accessToken = await signAccessToken({ user_id: userFound.key, email })
    return { statusCode: 200, ok: true, message: 'Sign-in successful.', accessToken }
  }
  // Respond - unable to sign in.
  return { statusCode: 400, ok: false, message: 'Invalid sign-in.' }
}

/**
 * Endpoint Is the access token JWT valid?
 * * Used while routing between client pages, to check guarded/protected routes
 *
 * @param {string} accessToken
 */
export const isAuthenticatedEndpoint = async (accessToken) => {
  try {
    const verified = await verifyAccessToken(accessToken) || {}

    if (!verified || !verified['user_id']) return { ok: false, statusCode: 400, message: 'Invalid token.' }

    return { ok: true, statusCode: 200, message: 'Access token verified.' }
  } catch (error) {
    console.error('isAuthenticatedEndpoint ', error)
    return { ok: false, statusCode: 400, message: 'Invalid token.' }
  }
}
