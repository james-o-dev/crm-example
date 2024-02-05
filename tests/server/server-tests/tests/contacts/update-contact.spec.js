const { generateRandomString, commonHeaders } = require('../../lib/common')
const { signUpNewUser } = require('../../lib/common.auth')
const { createNewContact } = require('../../lib/common.contacts')
const { getDb } = require('../../lib/db-postgres')

describe('Update contact tests', () => {
  let user, contact

  beforeAll(async () => {
    user = await signUpNewUser()
    contact = await createNewContact(user.accessToken)
  })

  const updateContactRequest = (accessToken, payload) => {
    return fetch(`${process.env.API_HOST}/contact`, {
      method: 'PUT',
      headers: commonHeaders(accessToken),
      body: JSON.stringify(payload),
    })
  }

  const getContactFromDb = async (contactId) => {
    const db = getDb()
    return db.oneOrNone('SELECT * FROM contacts WHERE contact_id = $1', [contactId])
  }

  // Test: Successfully updates contact.
  test('Successfully updates contact', async () => {
    let response, data
    const newName = generateRandomString()

    const payload = {
      ...contact,
      contact_id: contact.contact_id,
      name: newName,
    }

    response = await updateContactRequest(user.accessToken, payload)
    data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe('Contact updated.')

    // Check DB.
    const fromDb = await getContactFromDb(contact.contact_id)
    expect(fromDb.name).toBe(newName)
  })

  // Test: Incorrect access token.
  test('Incorrect access token', async () => {
    const accessTokens = ['', null, user.refreshToken]
    const newName = generateRandomString()

    const payload = {
      ...contact,
      contact_id: contact.contact_id,
      name: newName,
    }

    return Promise.all(accessTokens.map(async (accessToken) => {
      const response = await updateContactRequest(accessToken, payload)
      const data = await response.json()
      expect(response.status).toBe(401)
      expect(data.message).toBe('Unauthorized.')
    }))
  })

  // Contact ID not provided.
  test('Contact ID not provided', async () => {
    const payload = {
      ...contact,
      contact_id: '',
      name: generateRandomString(),
    }
    const response = await updateContactRequest(user.accessToken, payload)
    const data = await response.json()
    expect(response.status).toBe(400)
    expect(data.message).toBe('Contact ID was not provided.')
  })

  // Name not provided
  test('Name not provided', async () => {
    const payload = {
      ...contact,
      contact_id: contact.contact_id,
      name: '',
    }
    const response = await updateContactRequest(user.accessToken, payload)
    const data = await response.json()
    expect(response.status).toBe(400)
    expect(data.message).toBe('Name was not provided.')
  })

  // Email not provided
  test('Email not provided', async () => {
    const payload = {
      ...contact,
      contact_id: contact.contact_id,
      name: generateRandomString(),
      email: '',
    }
    const response = await updateContactRequest(user.accessToken, payload)
    const data = await response.json()
    expect(response.status).toBe(400)
    expect(data.message).toBe('Email was not provided.')
  })

  // Email in use
  test('Email in use', async () => {
    // New contact.
    const newContact = await createNewContact(user.accessToken)

    // Update contact, with an existing email.
    const payload = {
      ...newContact,
      contact_id: newContact.contact_id,
      name: generateRandomString(),
      email: contact.email, // It is already in use.
    }
    const response = await updateContactRequest(user.accessToken, payload)
    const data = await response.json()
    expect(response.status).toBe(409)
    expect(data.message).toBe('This email is already in use.')
  })
})
