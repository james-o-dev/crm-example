const { commonHeaders } = require('../../lib/common')
const { signUpNewUser } = require('../../lib/common.auth')
const { createNewContact } = require('../../lib/common.contacts')

describe('Export Contacts JSON tests', () => {
  let user

  const exportContactsRequest = async (accessToken) => {
    return fetch(`${process.env.API_HOST}/export/contacts/json`, {
      headers: commonHeaders(accessToken),
    })
  }

  beforeAll(async () => {
    user = await signUpNewUser()
  })

  // Successfully exports contacts.
  test('Successfully exports contacts', async () => {
    let data, response

    // Create new contact.
    const contact = await createNewContact(user.accessToken)
    const contact2 = await createNewContact(user.accessToken)

    response = await exportContactsRequest(user.accessToken)
    data = await response.json()
    expect(response.status).toBe(200)
    expect(data.json).toBeTruthy()

    const exported = JSON.parse(data.json)
    expect(exported.length).toBe(2)
    expect(exported.some(c => c.name === contact.name && c.email === contact.email)).toBe(true)
    expect(exported.some(c => c.name === contact2.name && c.email === contact2.email)).toBe(true)
  })

  // Invalid token.
  test('Invalid access token', async () => {
    const accessTokens = ['', null, user.refreshToken]

    return Promise.all(accessTokens.map(async (accessToken) => {
      const response = await exportContactsRequest(accessToken)
      const data = await response.json()
      expect(response.status).toBe(401)
      expect(data.message).toBe('Unauthorized.')
    }))
  })
})