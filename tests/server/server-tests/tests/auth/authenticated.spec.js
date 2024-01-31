const { authHeader } = require('../../lib/common')
const { signUpNewUser, expireUserTokens } = require('../../lib/common.users')

describe('Authenticate tests', () => {
  let user

  beforeAll(async () => {
    user = await signUpNewUser()
  })

  /**
   * Authenticate request.
   *
   * @param {string} accessToken
   */
  const authenticateRequest = async (accessToken) => {
    return fetch(`${process.env.API_HOST}/auth/authenticate`, {
      headers: authHeader(accessToken),
    })
  }

  // Test: Successfully authenticates.
  test('Successfully authenticates', async () => {
    const response = await authenticateRequest(user.accessToken)
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.message).toBe('Authenticated.')
  })

  // Test: Incorrect token.
  test('Incorrect token', async () => {
    const response = await authenticateRequest('Incorrect token')
    const data = await response.json()
    expect(response.status).toBe(401)
    expect(data.message).toBe('Unauthorized.')
  })

  // Test: No auth header.
  test('No auth header', async () => {
    const response = await fetch(`${process.env.API_HOST}/auth/authenticate`)
    const data = await response.json()
    expect(response.status).toBe(401)
    expect(data.message).toBe('Unauthorized.')
  })

  // Test: Access token expired.
  test('Tokens expired', async () => {
    // Expire tokens in the DB.
    await expireUserTokens(user.user_id)

    const response = await authenticateRequest(user.accessToken)
    const data = await response.json()
    expect(response.status).toBe(401)
    expect(data.message).toBe('Unauthorized.')
  })
})