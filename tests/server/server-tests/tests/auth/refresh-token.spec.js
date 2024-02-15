const { authHeader } = require('../../lib/common')
const { authenticateRequest, signUpNewUser, expireUserTokens } = require('../../lib/common.auth')

describe('Refresh access token tests', () => {
  let user

  beforeAll(async () => {
    user = await signUpNewUser()
  })

  /**
   * Make a refresh access token request.
   *
   * @param {string} refreshToken
   */
  const refreshTokenRequest = async (refreshToken) => {
    return fetch(`${process.env.API_HOST}/auth/refresh`, {
      headers: authHeader(refreshToken),
    })
  }

  // Test: Successfully authenticates.
  test('Successfully authenticates', async () => {
    let response, data

    response = await refreshTokenRequest(user.refreshToken)
    data = await response.json()
    expect(response.status).toBe(200)
    expect(data.accessToken).toBeTruthy()
    const newAccessToken = data.accessToken

    // Check that new access token is usable.
    response = await authenticateRequest(newAccessToken)
    expect(response.status).toBe(200)
  })

  // Test: Incorrect refresh token.
  test('Incorrect refresh token', async () => {
    const refreshTokens = ['', null, user.accessToken]

    return Promise.all(refreshTokens.map(async (refreshToken) => {
      const response = await refreshTokenRequest(refreshToken)
      const data = await response.json()
      expect(response.status).toBe(401)
      expect(data.accessToken).toBeFalsy()
      expect(data.message).toBe('Unauthorized.')
    }))
  })

  // Test: No auth header.
  test('No auth header', async () => {
    const response = await fetch(`${process.env.API_HOST}/auth/refresh`)
    const data = await response.json()
    expect(response.status).toBe(401)
    expect(data.message).toBe('Unauthorized.')
  })

  // Test: Access token expired.
  test('Tokens expired', async () => {
    // Expire tokens in the DB.
    await expireUserTokens(user.accessToken)

    const response = await refreshTokenRequest(user.refreshToken)
    const data = await response.json()
    expect(response.status).toBe(401)
    expect(data.message).toBe('Unauthorized.')
  })
})