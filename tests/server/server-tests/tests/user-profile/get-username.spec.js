const { commonHeaders, generateRandomString } = require('../../lib/common')
const { signUpNewUser } = require('../../lib/common.auth')

describe('Get username tests', () => {
  let user

  const setUsernameRequest = async (accessToken, username) => {
    return fetch(`${process.env.API_HOST}/user/username`, {
      method: 'PUT',
      headers: commonHeaders(accessToken),
      body: JSON.stringify({ username }),
    })
  }

  const getUsernameRequest = async (accessToken) => {
    return fetch(`${process.env.API_HOST}/user/username`, {
      headers: commonHeaders(accessToken),
    })
  }
  beforeAll(async () => {
    user = await signUpNewUser()
  })

  // Successfully gets username.
  test('Successfully gets username', async () => {
    let response, data

    // Initially get username - should be empty
    response = await getUsernameRequest(user.accessToken)
    data = await response.json()
    expect(response.status).toBe(200)
    expect(data.username).toBe(null)

    // Set username.
    const newUsername = generateRandomString()
    await setUsernameRequest(user.accessToken, newUsername)

    // Get username again.
    response = await getUsernameRequest(user.accessToken)
    data = await response.json()
    expect(response.status).toBe(200)
    expect(data.username).toBe(newUsername)
  })

  // Incorrect token.
  test('Incorrect access token', async () => {
    const accessTokens = ['', null, user.refreshToken]

    return Promise.all(accessTokens.map(async (accessToken) => {
      const response = await getUsernameRequest(accessToken)
      const data = await response.json()
      expect(response.status).toBe(401)
      expect(data.task_id).toBeFalsy()
      expect(data.message).toBe('Unauthorized.')
    }))
  })
})