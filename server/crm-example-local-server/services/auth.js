import bcryptjs from 'bcryptjs'
import { PostgresDatabase, isUniqueConstraintError } from '../lib/db/db-postgres.js'
import { successfulResponse, unauthorizedError, validationErrorResponse } from '../lib/common.js'
import { getAccessTokenFromHeaders, signAccessToken } from '../lib/auth.common.js'

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

  const db = PostgresDatabase.getInstance().connection
  return db.tx(async t => {

    let userId
    try {
      userId = await t.one('INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING user_id', [normalEmail, hashedPassword])
    } catch (error) {
      // Unique email constraint.
      if (isUniqueConstraintError('users_unique')) throw validationErrorResponse({ message: 'This email is already in use.' }, 409)
      // Else other error.
      throw error
    }

    const accessToken = await signAccessToken({ user_id: userId, email })
    return successfulResponse({ message: 'User created', accessToken }, 201)
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

  const db = PostgresDatabase.getInstance().connection
  const user = await db.oneOrNone('SELECT user_id, hashed_password FROM users WHERE email = $1', [normalEmail])
  if (!user) throw validationErrorResponse({ message: 'Invalid sign-in.' })

  const match = await comparePassword(password, user.hashed_password)
  if (!match) throw validationErrorResponse({ message: 'Invalid sign-in.' })

  const accessToken = await signAccessToken({ user_id: user.user_id, email })
  return { statusCode: 200, message: 'Sign in successful.', accessToken }
}

/**
 * Authenticate user endpoint
 *
 * @param {*} requestBody
 */
export const isAuthenticatedEndpoint = async (requestHeaders) => {
  try {
    const verified = await getAccessTokenFromHeaders(requestHeaders)
    if (!verified) throw unauthorizedError()
    return successfulResponse({ message: 'Authenticated.' })
  } catch (error) {
    throw unauthorizedError()
  }
}