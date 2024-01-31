
const API_TEST_EMAIL = '+apitest'

/**
 * Generate a random string.
 * * String of numbers.
 */
const generateRandomString = () => Math.random().toString().replace(/\./, '')

/**
 * Generate a random valid email.
 * * Test user that will get cleaned up on teardown.
 */
const generateRandomEmail = () => `test${generateRandomString()}${API_TEST_EMAIL}@test.com`

/**
 * Generate a random valid password.
 */
const generateRandomPassword = () => generateRandomString() + 'aA1!'

/**
 * Spread this object in the headers to add the Auth header.
 *
 * @param {string} token
 */
const authHeader = (token) => ({ authorization: `Bearer ${token}` })

module.exports = {
  API_TEST_EMAIL,
  authHeader,
  generateRandomEmail,
  generateRandomPassword,
  generateRandomString,
}