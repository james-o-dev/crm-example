const { commonHeaders, generateRandomString } = require('../../lib/common')
const { signUpNewUser } = require('../../lib/common.auth')
const { getDb } = require('../../lib/db-postgres')

describe('Set username tests', () => {
  let user

  const setUsernameRequest = async (accessToken, username) => {
    return fetch(`${process.env.API_HOST}/user/username`, {
      method: 'PUT',
      headers: commonHeaders(accessToken),
      body: JSON.stringify({ username }),
    })
  }

  const checkUsernameInDb = (email) => {
    const db = getDb()
    return db.oneOrNone('SELECT * FROM users WHERE email = $1', [email])
  }

  beforeAll(async () => {
    user = await signUpNewUser()
  })

  // Successfully sets username.
  test('Successfully sets username', async () => {
    const newUsername = generateRandomString()
    const response = await setUsernameRequest(user.accessToken, newUsername)
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.message).toBe('Username updated.')

    const userInDb = await checkUsernameInDb(user.email)
    expect(userInDb.username).toBe(newUsername)
  })

  // Incorrect token.
  test('Incorrect access token', async () => {
    const accessTokens = ['', null, user.refreshToken]
    const newUsername = generateRandomString()

    return Promise.all(accessTokens.map(async (accessToken) => {
      const response = await setUsernameRequest(accessToken, newUsername)
      const data = await response.json()
      expect(response.status).toBe(401)
      expect(data.task_id).toBeFalsy()
      expect(data.message).toBe('Unauthorized.')
    }))
  })

  // Successfully clears username.
  test('Successfully clears username', async () => {
    const usernames = ['', null]

    return Promise.all(usernames.map(async (username) => {
      const response = await setUsernameRequest(user.accessToken, username)
      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data.message).toBe('Username updated.')

      const userInDb = await checkUsernameInDb(user.email)
      expect(userInDb.username).toBe(null)
    }))
  })

  // Username is taken.
  test('Username is taken', async () => {
    let response, data
    // Generate new user and username.
    const newUser = await signUpNewUser()
    const newUsername = generateRandomString()

    // Set username of an existing user.
    response = await setUsernameRequest(user.accessToken, newUsername)
    data = await response.json()
    expect(response.status).toBe(200)
    expect(data.message).toBe('Username updated.')

    // Attempt to update username of new user user.
    response = await setUsernameRequest(newUser.accessToken, newUsername)
    data = await response.json()
    expect(response.status).toBe(409)
    expect(data.message).toBe('Username already taken.')

    // Should not have updated the username in the database.
    const userInDb = await checkUsernameInDb(newUser.email)
    expect(userInDb.username).toBe(null)
  })
})