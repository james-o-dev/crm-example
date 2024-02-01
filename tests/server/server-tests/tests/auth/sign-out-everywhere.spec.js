const { commonHeaders } = require('../../lib/common')
const { authenticateRequest, signUpNewUser, expireUserTokens } = require('../../lib/common.auth')

describe('Sign out everywhere tests', () => {
  let user

  beforeAll(async () => {
    user = await signUpNewUser()
  })

  /**
   * Make 'sign-out-everywhere' request.
   *
   * @param {string} accessToken
   */
  const signOutEverywhereRequest = async (accessToken) => {
    return fetch(`${process.env.API_HOST}/auth/sign-out-everywhere`, {
      headers: commonHeaders(accessToken),
    })
  }

  // Test: Successfully authenticates.
  test('Successfully signs out everywhere', async () => {
    let response, data

    // Establish that the user is authenticated.
    response = await authenticateRequest(user.accessToken)
    expect(response.status).toBe(200)

    // Make response to sign out everywhere.
    response = await signOutEverywhereRequest(user.accessToken)
    data = await response.json()
    expect(response.status).toBe(200)
    expect(data.message).toBe('Signed out of all devices. Existing tokens have been invalidated.')

    // Attempt to authenticate again, it should fail.
    response = await authenticateRequest(user.accessToken)
    expect(response.status).toBe(401)
  })

  // Test: Incorrect token.
  test('Incorrect token', async () => {
    const response = await authenticateRequest('Incorrect token')
    const data = await response.json()
    expect(response.status).toBe(401)
    expect(data.message).toBe('Unauthorized.')
  })

  // Test: Access token expired.
  test('Access token expired', async () => {
    await expireUserTokens(user.user_id)
    const response = await authenticateRequest(user.accessToken)
    const data = await response.json()
    expect(response.status).toBe(401)
    expect(data.message).toBe('Unauthorized.')
  })
})