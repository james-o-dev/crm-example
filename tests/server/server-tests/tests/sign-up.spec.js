const { generateRandomEmail, generateRandomPassword } = require('../lib/common')
const { signUpRequest } = require('../lib/common.users')

describe('Sign Up tests', () => {
  test('Successfully signs up user', async () => {
    const email = generateRandomEmail()
    const password = generateRandomPassword()
    const response = await signUpRequest({ email, password, confirmPassword: password })
    const data = await response.json()
    expect(response.status).toBe(201)
    expect(data.accessToken).toBeTruthy()
    expect(data.refreshToken).toBeTruthy()
    expect(data.message).toBe('User created')
  })

  test('Invalid email', async () => {
    const emails = [null, '', 'invalid email']
    const password = generateRandomPassword()

    return Promise.all(emails.map(async email => {
      const response = await signUpRequest({ email, password, confirmPassword: password })
      const data = await response.json()
      expect(response.status).toBe(400)
      expect(data.accessToken).toBeFalsy()
      expect(data.refreshToken).toBeFalsy()
    }))
  })

  test('Invalid password', async () => {
    const passwords = [null, '', 'invalid email']
    const email = generateRandomEmail()

    return Promise.all(passwords.map(async password => {
      const response = await signUpRequest({ email, password, confirmPassword: password })
      const data = await response.json()
      expect(response.status).toBe(400)
      expect(data.accessToken).toBeFalsy()
      expect(data.refreshToken).toBeFalsy()
    }))
  })

  test('Confirm password not matching', async () => {
    const email = generateRandomEmail()
    const password = generateRandomPassword()
    const confirmPassword = generateRandomPassword()

    const response = await signUpRequest({ email, password, confirmPassword })
    const data = await response.json()
    expect(response.status).toBe(400)
    expect(data.accessToken).toBeFalsy()
    expect(data.refreshToken).toBeFalsy()
    expect(data.message).toBe('Passwords do not match.')
  })

  test('Email already in use', async () => {
    const email = generateRandomEmail()
    const password = generateRandomPassword()

    // Sign up first.
    await signUpRequest({ email, password, confirmPassword: password })

    // Sign up again.
    const response = await signUpRequest({ email, password, confirmPassword: password })
    const data = await response.json()
    expect(response.status).toBe(409)
    expect(data.accessToken).toBeFalsy()
    expect(data.refreshToken).toBeFalsy()
    expect(data.message).toBe('This email is already in use.')
  })
})