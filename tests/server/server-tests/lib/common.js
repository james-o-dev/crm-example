
const API_TEST_EMAIL = '+apitest'

const generateRandomString = () => Math.random().toString().replace(/\./, '')

const generateRandomEmail = () => `test${generateRandomString()}${API_TEST_EMAIL}@test.com`

const generateRandomPassword = () => generateRandomString() + 'aA1!'

module.exports = {
  API_TEST_EMAIL,
  generateRandomEmail,
  generateRandomPassword,
  generateRandomString,
}