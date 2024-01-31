const { contentTypeHeader, generateRandomEmail, generateRandomPassword, authHeader } = require('./common')
const jwt = require('jsonwebtoken')
const { getDb } = require('./db-postgres')

/**
 * Generate and sign up a new user.
 * * Returns the generated email, password, access token, refresh token, and user id.
 */
const signUpNewUser = async () => {
  const email = generateRandomEmail()
  const password = generateRandomPassword()

  const response = await fetch(`${process.env.API_HOST}/auth/sign-up`, {
    method: 'POST',
    headers: contentTypeHeader,
    body: JSON.stringify({ email, password, confirmPassword: password }),
  })
  const data = await response.json()
  const decodedToken = jwt.decode(data.accessToken)

  return {
    email, password,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user_id: decodedToken.user_id,
  }
}

/**
 * Expire the user's existing access tokens.
 *
 * @param {string} userId
 */
const expireUserTokens = async (userId) => {
  const db = getDb()
  await db.none('UPDATE users SET iat = (now_unix_timestamp() / 1000) WHERE user_id = $1', [userId])
}

/**
 * Sign in a user.
 *
 * @param {string} email
 * @param {string} password
 */
const signInRequest = async (email, password) => {
  return fetch(`${process.env.API_HOST}/auth/sign-in`, {
    method: 'POST',
    headers: {
      ...contentTypeHeader,
    },
    body: JSON.stringify({ email, password }),
  })
}

/**
 * Authenticate request.
 *
 * @param {string} accessToken
 */
const authenticateRequest = async (accessToken) => {
  return fetch(`${process.env.API_HOST}/auth/authenticate`, {
    headers: authHeader(accessToken),
  })
}

module.exports = {
  authenticateRequest,
  expireUserTokens,
  signUpNewUser,
  signInRequest,
}