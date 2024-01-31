const { generateRandomEmail, generateRandomPassword } = require('./common')

/**
 * Generate and sign up a new user.
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

  return {
    email, password,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  }
}

module.exports = {
  signUpNewUser,
}