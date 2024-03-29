const { generateRandomPassword, generateRandomEmail } = require('../../lib/common')
const { signUpNewUser, signInRequest } = require('../../lib/common.auth')

describe('Sign In tests', () => {
  let user

  beforeAll(async () => {
    user = await signUpNewUser()
  })

  // Test: Successfully signs in.
  test('Successfully signs in', async () => {
    const { email, password } = user

    const response = await signInRequest(email, password)
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.accessToken).toBeTruthy()
    expect(data.refreshToken).toBeTruthy()
  })

  // Test: No password.
  test('No password', async () => {
    const passwords = [null, '']
    return Promise.all(passwords.map(async password => {
      const response = await signInRequest(user.email, password)
      const data = await response.json()
      expect(response.status).toBe(400)
      expect(data.accessToken).toBeFalsy()
      expect(data.refreshToken).toBeFalsy()
      expect(data.message).toBe('No password provided.')
    }))
  })

  // Test: Password invalid.
  test('Password invalid', async () => {
    const response = await signInRequest(user.email, generateRandomPassword())
    const data = await response.json()
    expect(response.status).toBe(401)
    expect(data.accessToken).toBeFalsy()
    expect(data.refreshToken).toBeFalsy()
    expect(data.message).toBe('Invalid sign-in.')
  })

  // Test: User not found.
  test('User not found', async () => {
    const response = await signInRequest(generateRandomEmail(), user.password)
    const data = await response.json()
    expect(response.status).toBe(401)
    expect(data.accessToken).toBeFalsy()
    expect(data.refreshToken).toBeFalsy()
    expect(data.message).toBe('Invalid sign-in.')
  })
})