const { generateRandomPassword, commonHeaders, delay } = require('../../lib/common')
const { signUpNewUser, signInRequest, authenticateRequest } = require('../../lib/common.auth')

describe('Change Password tests', () => {
  let user

  beforeAll(async () => {
    user = await signUpNewUser()
  })

  /**
   * Change password request.
   *
   * @param {string} accessToken
   */
  const  changePasswordRequest = async (accessToken, oldPassword, newPassword, confirmPassword) => {
    return fetch(`${process.env.API_HOST}/auth/change-password`, {
      method: 'PUT',
      headers: commonHeaders(accessToken),
      body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
    })
  }

  // Test: Successfully changes password.
  test('Successfully changes password', async () => {
    let response, data
    const { email, accessToken, password: oldPassword } = user
    const newPassword = generateRandomPassword()

    response = await changePasswordRequest(accessToken, oldPassword, newPassword, newPassword)
    data = await response.json()
    expect(response.status).toBe(200)
    expect(data.message).toBe('Password has been changed. Existing tokens have been invalidated.')

    // Should not authenticate.
    response = await authenticateRequest(user.accessToken)
    data = await response.json()
    expect(response.status).toBe(401)
    expect(data.message).toBe('Unauthorized.')

    // Attempt to sign in again, with old password.
    response = await signInRequest(email, oldPassword)
    data = await response.json()
    expect(response.status).toBe(401)
    expect(data.accessToken).toBeFalsy()
    expect(data.refreshToken).toBeFalsy()
    expect(data.message).toBe('Invalid sign-in.')

    // Wait at least one second, for JWTs to have a different iat value.
    await delay()

    // Attempt to sign in again, with new password.
    response = await signInRequest(email, newPassword)
    data = await response.json()
    // Update stored users with updated values.
    user.accessToken = data.accessToken
    user.refreshToken = data.refreshToken
    user.password = newPassword
  })

  // Invalid access token.
  test('Invalid access token', async () => {
    const { password: oldPassword } = user
    const newPassword = generateRandomPassword()

    const response = await changePasswordRequest('invalid-token', oldPassword, newPassword, newPassword)
    const data = await response.json()
    expect(response.status).toBe(401)
    expect(data.message).toBe('Unauthorized.')
  })

  // Invalid old password.
  test('Invalid old password', async () => {
    const { accessToken } = user
    const oldPassword = generateRandomPassword()
    const newPassword = generateRandomPassword()

    const response = await changePasswordRequest(accessToken, oldPassword, newPassword, newPassword)
    const data = await response.json()
    expect(response.status).toBe(401)
    expect(data.message).toBe('Old password does not match current password.')
  })

  // Invalid new password.
  test('Invalid password', async () => {
    const { accessToken, password: oldPassword } = user
    const passwords = [null, '', 'invalid password']

    return Promise.all(passwords.map(async password => {
      const response = await changePasswordRequest(accessToken, oldPassword, password, password)
      expect(response.status).toBe(400)
    }))
  })

  // Passwords do not match.
  test('Confirm password not matching', async () => {
    const { accessToken, password: oldPassword } = user
    const password = generateRandomPassword()
    const confirmPassword = generateRandomPassword()

    const response = await changePasswordRequest(accessToken, oldPassword, password, confirmPassword)
    const data = await response.json()
    expect(response.status).toBe(400)
    expect(data.message).toBe('Confirmation password does not match.')
  })
})