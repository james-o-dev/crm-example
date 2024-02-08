export const API_TEST_TOKEN = '+apitest'

/**
 * Generate a random string.
 * * String of numbers.
 */
export const generateRandomString = () => Math.random().toString().replace(/\./, '')

/**
 * Generate a random valid email.
 * * Test user that will get cleaned up on teardown.
 */
export const generateRandomEmail = () => `test${generateRandomString()}${API_TEST_TOKEN}@test.com`

/**
 * Generate a random valid password.
 */
export const generateRandomPassword = () => generateRandomString() + 'aA1!'

/**
 * Request to clean up test records in the database.
 */
export const cleanUpTests = async () => {
  return fetch(`${Cypress.env('API_HOST')}/test/cleanup`)
}