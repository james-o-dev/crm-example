const { contentTypeHeader, generateRandomPassword, generateRandomEmail } = require('../lib/common')
const { signUpNewUser } = require('../lib/common.users')

describe('Sign In tests', () => {
  let user

  beforeAll(async () => {
    user = await signUpNewUser()
  })

  /**
   * Sign in a user.
   *
   * @param {object} param
   * @param {string} param.email
   * @param {string} param.password
   * @param {string} param.confirmPassword
   */
  const signUpRequest = async ({ email, password }) => {
    return fetch(`${process.env.API_HOST}/auth/sign-in`, {
      method: 'POST',
      headers: {
        ...contentTypeHeader,
      },
      body: JSON.stringify({ email, password }),
    })
  }

  // Test: Successfully signs in.
  test('Successfully signs in', async () => {
    const { email, password } = user

    const response = await signUpRequest({ email, password })
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.accessToken).toBeTruthy()
    expect(data.refreshToken).toBeTruthy()
  })

  // Test: No password.
  test('No password', async () => {
    const passwords = [null, '']
    return Promise.all(passwords.map(async password => {
      const response = await signUpRequest({ email: user.email, password })
      const data = await response.json()
      expect(response.status).toBe(400)
      expect(data.accessToken).toBeFalsy()
      expect(data.refreshToken).toBeFalsy()
      expect(data.message).toBe('No password provided.')
    }))
  })

  // Test: Password invalid.
  test('Password invalid', async () => {
    const response = await signUpRequest({ email: user.email, password: generateRandomPassword() })
    const data = await response.json()
    expect(response.status).toBe(401)
    expect(data.accessToken).toBeFalsy()
    expect(data.refreshToken).toBeFalsy()
    expect(data.message).toBe('Invalid sign-in.')
  })

  // Test: User not found.
  test('User not found', async () => {
    const response = await signUpRequest({ email: generateRandomEmail(), password: user.password })
    const data = await response.json()
    expect(response.status).toBe(401)
    expect(data.accessToken).toBeFalsy()
    expect(data.refreshToken).toBeFalsy()
    expect(data.message).toBe('Invalid sign-in.')
  })
})