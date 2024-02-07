
const API_TEST_TOKEN = '+apitest'

/**
 * Generate a random string.
 * * String of numbers.
 */
const generateRandomString = () => Math.random().toString().replace(/\./, '')

/**
 * Generate a random valid email.
 * * Test user that will get cleaned up on teardown.
 */
const generateRandomEmail = () => `test${generateRandomString()}${API_TEST_TOKEN}@test.com`

/**
 * Generate a random valid password.
 */
const generateRandomPassword = () => generateRandomString() + 'aA1!'

/**
 * Content type header.
 */
const contentTypeHeader = ({ 'Content-Type': 'application/json' })

/**
 * Spread this object in the headers to add the Auth header.
 *
 * @param {string} token
 */
const authHeader = (token) => ({ authorization: `Bearer ${token}` })

/**
 * Spread this object in the headers to add common headers.
 *
 * @param {string} token
 */
const commonHeaders = (token) => ({ ...authHeader(token), ...contentTypeHeader })

/**
 * Delay promise.
 *
 * @param {number} [timeout=1000]  Number in milliseconds.
 */
const delay = (timeout = 1000) => new Promise(resolve => setTimeout(resolve, timeout))

module.exports = {
  API_TEST_TOKEN,
  authHeader,
  commonHeaders,
  contentTypeHeader,
  delay,
  generateRandomEmail,
  generateRandomPassword,
  generateRandomString,
}