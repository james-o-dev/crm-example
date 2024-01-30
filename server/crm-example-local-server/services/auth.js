import bcryptjs from 'bcryptjs'
import { getDb, isUniqueConstraintError } from '../lib/db/db-postgres.js'
import { successfulResponse, unauthorizedError, validationErrorResponse } from '../lib/common.js'
import { extractAuthHeaderToken, getJwtPayload, getUserId, signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/auth.common.js'

/**
 * Function to hash a password
 *
 * @param {string} inputPassword Input password
 */
const hashPassword = async (inputPassword) => {
  const saltRounds = 10 // You can adjust the number of salt rounds according to your security requirements
  const salt = await bcryptjs.genSalt(saltRounds)
  const hashedPassword = await bcryptjs.hash(inputPassword, salt)
  return hashedPassword
}

/**
 * Function to compare a password with its hash
 *
 * @param {string} inputPassword
 * @param {string} hashedPassword
 */
const comparePassword = async (inputPassword, hashedPassword) => {
  const match = await bcryptjs.compare(inputPassword, hashedPassword)
  return match
}


/**
 * Sign up user endpoint
 *
 * @param {*} requestBody
 */
export const signUpEndpoint = async (requestBody) => {
  const { email, password, confirmPassword } = requestBody

  if (!email) throw validationErrorResponse({ message: 'No email provided.' })
  if (!password) throw validationErrorResponse({ message: 'No password provided.' })
  if (confirmPassword !== password) throw validationErrorResponse({ message: 'Passwords do not match.' })

  const normalEmail = email.toLowerCase().trim()
  const hashedPassword = await hashPassword(password)

  const db = getDb()
  return db.tx(async t => {

    let user
    try {
      user = await t.one('INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING user_id', [normalEmail, hashedPassword])
    } catch (error) {
      // Unique email constraint.
      if (isUniqueConstraintError(error, 'users_unique')) throw validationErrorResponse({ message: 'This email is already in use.' }, 409)
      // Else other error.
      throw error
    }

    const tokenPayload = getJwtPayload(user.user_id, email)
    const accessToken = await signAccessToken(tokenPayload)
    const refreshToken = await signRefreshToken(tokenPayload)
    return successfulResponse({ message: 'User created', accessToken, refreshToken }, 201)
  })
}

/**
 * Sign in user endpoint
 *
 * @param {*} requestBody
 */
export const signInEndpoint = async (requestBody) => {
  const { email, password } = requestBody

  if (!email) throw validationErrorResponse({ message: 'No email provided.' })
  if (!password) throw validationErrorResponse({ message: 'No password provided.' })

  const normalEmail = email.toLowerCase().trim()

  const db = getDb()
  const user = await db.oneOrNone('SELECT user_id, hashed_password FROM users WHERE email = $1', [normalEmail])
  if (!user) throw validationErrorResponse({ message: 'Invalid sign-in.' })

  const match = await comparePassword(password, user.hashed_password)
  if (!match) throw validationErrorResponse({ message: 'Invalid sign-in.' })

  const tokenPayload = getJwtPayload(user.user_id, email)
  const accessToken = await signAccessToken(tokenPayload)
  const refreshToken = await signRefreshToken(tokenPayload)
  return { statusCode: 200, message: 'Sign in successful.', accessToken, refreshToken }
}

/**
 * Authenticate user endpoint
 *
 * @param {*} reqHeaders
 */
export const isAuthenticatedEndpoint = async (reqHeaders) => {
  try {
    await getUserId(reqHeaders)
    return successfulResponse({ message: 'Authenticated.' })
  } catch (error) {
    throw unauthorizedError()
  }
}

/**
 * Refresh the access token
 *
 * @param {*} reqHeaders
 */
export const refreshAccessToken = async (reqHeaders) => {
  try {
    const refreshTokenHeader = extractAuthHeaderToken(reqHeaders)
    const { user_id, email } = await verifyRefreshToken(refreshTokenHeader)

    const jwtPayload = getJwtPayload(user_id, email)
    const accessToken = await signAccessToken(jwtPayload)
    return successfulResponse({ accessToken })
  } catch (error) {
    throw unauthorizedError()
  }
}