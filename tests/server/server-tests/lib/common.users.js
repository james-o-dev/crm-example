const { generateRandomEmail, generateRandomPassword } = require('./common')
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
    headers: {
      'Content-Type': 'application/json',
    },
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
  return db.none('UPDATE users SET iat = (now_unix_timestamp() / 1000) WHERE user_id = $1', [userId])
}

module.exports = {
  expireUserTokens,
  signUpNewUser,
}