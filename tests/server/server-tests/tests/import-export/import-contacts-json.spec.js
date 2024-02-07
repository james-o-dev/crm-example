const { commonHeaders } = require('../../lib/common')
const { signUpNewUser } = require('../../lib/common.auth')
const { generateContact, createNewContact } = require('../../lib/common.contacts')
const { getDb } = require('../../lib/db-postgres')

describe('Import Contacts JSON tests', () => {
  let user

  const importContactsRequest = async (accessToken, json) => {
    return fetch(`${process.env.API_HOST}/import/contacts/json`, {
      method: 'POST',
      headers: commonHeaders(accessToken),
      body: JSON.stringify({ json }),
    })
  }

  beforeAll(async () => {
    user = await signUpNewUser()
  })

  // Successfully get search results.
  test('Successfully get search results', async () => {
    // Create new contacts.
    const contact = generateContact()
    const contact2 = generateContact()
    const json = JSON.stringify([contact, contact2])

    const response = await importContactsRequest(user.accessToken, json)
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.message).toBe('Contacts imported.')

    // Find contacts in DB.
    const db = getDb()
    const sql = 'SELECT * FROM contacts WHERE ((name = $1 AND email = $2) OR (name = $3 AND email = $4)) AND user_id = $5'
    const sqlParams = [contact.name, contact.email, contact2.name, contact2.email, user.user_id]
    const checkDb = await db.any(sql, sqlParams)
    expect(checkDb.length).toBe(2)
  })

  // Invalid token.
  test('Invalid access token', async () => {
    const accessTokens = ['', null, user.refreshToken]
    // Create new contacts.
    const contact = generateContact()
    const contact2 = generateContact()
    const json = JSON.stringify([contact, contact2])

    return Promise.all(accessTokens.map(async (accessToken) => {
      const response = await importContactsRequest(accessToken, json)
      const data = await response.json()
      expect(response.status).toBe(401)
      expect(data.message).toBe('Unauthorized.')
    }))
  })

  // Email already exists.
  test('Email already exists', async () => {
    const existingContact = await createNewContact(user.accessToken)

    const contact = generateContact()
    const contact2 = { ...generateContact(), email: existingContact.email }
    const json = JSON.stringify([contact, contact2])

    const response = await importContactsRequest(user.accessToken, json)
    const data = await response.json()
    expect(response.status).toBe(409)
    expect(data.message).toBe('A contact with this email already exists.')

    // Check DB that contacts have not been imported - it rolled back.
    const db = getDb()
    const sql = 'SELECT * FROM contacts WHERE ((name = $1 AND email = $2) OR (name = $3 AND email = $4)) AND user_id = $5'
    const sqlParams = [contact.name, contact.email, contact2.name, contact2.email, user.user_id]
    const checkDb = await db.any(sql, sqlParams)
    expect(checkDb.length).toBe(0)
  })
})