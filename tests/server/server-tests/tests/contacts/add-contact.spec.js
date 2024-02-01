const { commonHeaders, generateRandomString, generateRandomEmail, delay } = require('../../lib/common')
const { signUpNewUser, expireUserTokens, signInRequest } = require('../../lib/common.auth')

describe('Add contact tests', () => {
  let user

  beforeAll(async () => {
    user = await signUpNewUser()
  })

  const generateContact = () => {
    return {
      name: generateRandomString(),
      email: generateRandomEmail(),
      phone: '',
      notes: 'This is a test contact.',
    }
  }

  /**
   * Make a refresh access token request.
   *
   * @param {string} accessToken
   * @param {object} body
   * @param {string} body.name
   * @param {string} body.email
   * @param {string} [body.phone]
   * @param {string} [body.notes]
   */
  const addContactRequest = async (accessToken, { name, email, phone, notes }) => {
    return fetch(`${process.env.API_HOST}/contact`, {
      method: 'POST',
      headers: commonHeaders(accessToken),
      body: JSON.stringify({ name, email, phone, notes }),
    })
  }

  // Test: Successfully authenticates.
  test('Successfully authenticates', async () => {
    let response, data

    response = await addContactRequest(user.accessToken, generateContact())
    data = await response.json()
    expect(response.status).toBe(201)
    expect(data.message).toBe('Contact created.')
    expect(data.contact_id).toBeTruthy()
  })

  // Test: Incorrect access token.
  test('Incorrect access token', async () => {
    const accessTokens = ['', null, user.refreshToken]

    return Promise.all(accessTokens.map(async (accessToken) => {
      const response = await addContactRequest(accessToken, generateContact())
      const data = await response.json()
      expect(response.status).toBe(401)
      expect(data.accessToken).toBeFalsy()
      expect(data.message).toBe('Unauthorized.')
    }))
  })

  // Test: Access token expired.
  test('Tokens expired', async () => {
    let response, data
    // Expire tokens in the DB.
    await expireUserTokens(user.user_id)

    response = await addContactRequest(user.accessToken, generateContact())
    data = await response.json()
    expect(response.status).toBe(401)
    expect(data.accessToken).toBeFalsy()
    expect(data.message).toBe('Unauthorized.')

    // Wait at least one second, for JWTs to have a different iat value.
    await delay()

    // Sign in again to get new tokens, once this test is successful.
    response = await signInRequest(user.email, user.password)
    data = await response.json()
    user.accessToken = data.accessToken
    user.refreshToken = data.refreshToken
  })

  // Name is required.
  test('Name is required', async () => {
    const response = await addContactRequest(user.accessToken, { ...generateContact(), name: '' })
    const data = await response.json()
    expect(response.status).toBe(400)
    expect(data.contact_id).toBeFalsy()
    expect(data.message).toBe('Name was not provided.')
  })

  // Email is required.
  test('Email is required', async () => {
    const response = await addContactRequest(user.accessToken, { ...generateContact(), email: '' })
    const data = await response.json()
    expect(response.status).toBe(400)
    expect(data.contact_id).toBeFalsy()
    expect(data.message).toBe('Email was not provided.')
  })

  // Invalid email format
  test('Invalid email format', async () => {
    const response = await addContactRequest(user.accessToken, { ...generateContact(), email: generateRandomString() })
    const data = await response.json()
    expect(response.status).toBe(400)
    expect(data.contact_id).toBeFalsy()
    expect(data.message).toBe('Invalid email format.')
  })

  // TODO: Potential duplicates.
})