const { commonHeaders } = require('../../lib/common')
const { signUpNewUser } = require('../../lib/common.auth')
const { createNewContact, getContactFromDb } = require('../../lib/common.contacts')
const { randomUUID } = require('node:crypto')

describe('Archive/restore contact tests', () => {
  let user, contact

  beforeAll(async () => {
    user = await signUpNewUser()
    contact = await createNewContact(user.accessToken)
  })

  const archiveContactRequest = (accessToken, payload) => {
    return fetch(`${process.env.API_HOST}/contact/archived`, {
      method: 'PUT',
      headers: commonHeaders(accessToken),
      body: JSON.stringify(payload),
    })
  }

  // Test: Successfully updates contact.
  test('Successfully archives/restores a contact', async () => {
    let response, data, payload, fromDb

    // Archive contact.
    payload = {
      contact_id: contact.contact_id,
      archived: true,
    }
    response = await archiveContactRequest(user.accessToken, payload)
    data = await response.json()
    expect(response.status).toBe(200)
    expect(data.message).toBe('Contact archived.')

    // Check DB.
    fromDb = await getContactFromDb(contact.contact_id)
    expect(fromDb.archived).toBeTruthy()

    // Now restore the contact.
    payload = {
      contact_id: contact.contact_id,
      archived: false,
    }
    response = await archiveContactRequest(user.accessToken, payload)
    data = await response.json()
    expect(response.status).toBe(200)
    expect(data.message).toBe('Contact restored.')

    // Check DB again.
    fromDb = await getContactFromDb(contact.contact_id)
    expect(fromDb.archived).toBeFalsy()
  })

  // Test: Incorrect access token.
  test('Incorrect access token', async () => {
    const accessTokens = ['', null, user.refreshToken]

    const payload = {
      contact_id: contact.contact_id,
      archived: true,
    }

    return Promise.all(accessTokens.map(async (accessToken) => {
      const response = await archiveContactRequest(accessToken, payload)
      const data = await response.json()
      expect(response.status).toBe(401)
      expect(data.message).toBe('Unauthorized.')
    }))
  })

  // Contact ID not provided.
  test('Contact ID not provided', async () => {
    const payload = {
      contact_id: '',
      archived: true,
    }
    const response = await archiveContactRequest(user.accessToken, payload)
    const data = await response.json()
    expect(response.status).toBe(400)
    expect(data.message).toBe('Contact ID was not provided.')
  })

  // Contact not found.
  test('Contact not found', async () => {
    const payload = {
      contact_id: randomUUID(),
      archived: true,
    }
    const response = await archiveContactRequest(user.accessToken, payload)
    const data = await response.json()
    expect(response.status).toBe(404)
    expect(data.message).toBe('Contact not found.')
  })
})
