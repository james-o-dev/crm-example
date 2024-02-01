const { authHeader, generateRandomString } = require('../../lib/common')
const { signUpNewUser } = require('../../lib/common.auth')
const { createNewContact } = require('../../lib/common.contacts')
const { randomUUID } = require('node:crypto')

describe('Get Contact/s tests', () => {

  describe('Get Contacts tests', () => {
    let user, contact

    beforeAll(async () => {
      user = await signUpNewUser()
      contact = await createNewContact(user.accessToken)
    })

    /**
     * Make get contacts request.
     *
     * @param {string} accessToken
     */
    const getContactsRequest = async (accessToken, archived = false) => {
      return fetch(`${process.env.API_HOST}/contacts?archived=${archived}`, {
        headers: authHeader(accessToken),
      })
    }

    // Get contacts.
    test('Get contacts', async () => {
      const response = await getContactsRequest(user.accessToken)
      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data.contacts).toBeTruthy()
      expect(data.contacts.length >= 1).toBe(true)
      // Should find the created contact in here.
      expect(data.contacts.some(c => c.contact_id === contact.contact_id)).toBe(true)
    })

    // Filter archived contacts
    test('Filter archived contacts', async () => {
      const response = await getContactsRequest(user.accessToken, true)
      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data.contacts).toBeTruthy()
      expect(data.contacts.length >= 1).toBe(false)
      // Should not find the created contact in here.
      expect(data.contacts.some(c => c.contact_id === contact.contact_id)).toBe(false)
    })

    // Invalid token.
    test('Invalid token', async () => {
      const response = await getContactsRequest(generateRandomString())
      const data = await response.json()
      expect(response.status).toBe(401)
      expect(data.contacts).toBeFalsy()
      expect(data.message).toBe('Unauthorized.')
    })

    // Different user cannot get another user's contacts.
    test('Different user cannot get another user\'s contacts.', async () => {
      // New user.
      const otherUser = await signUpNewUser()

      const response = await getContactsRequest(otherUser.accessToken)
      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data.contacts).toBeTruthy()
      expect(data.contacts.length >= 1).toBe(false)
    })
  })

  describe('Get a contact tests', () => {
    let user, contact

    beforeAll(async () => {
      user = await signUpNewUser()
      contact = await createNewContact(user.accessToken)
    })

    /**
     * Make get contact request.
     *
     * @param {string} accessToken
     */
    const getContactRequest = async (accessToken, contactId = false) => {
      return fetch(`${process.env.API_HOST}/contact?contact_id=${contactId}`, {
        headers: authHeader(accessToken),
      })
    }

    // Get contact.
    test('Get contact', async () => {
      const response = await getContactRequest(user.accessToken, contact.contact_id)
      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data.contact).toBeTruthy()
      expect(data.contact.contact_id).toBe(contact.contact_id)
    })

    // Invalid token.
    test('Invalid token', async () => {
      const response = await getContactRequest(generateRandomString(), contact.contact_id)
      const data = await response.json()
      expect(response.status).toBe(401)
      expect(data.contacts).toBeFalsy()
      expect(data.message).toBe('Unauthorized.')
    })

    // Invalid contact ID.
    test('Invalid contact ID', async () => {
      const contactIds = [null, undefined, '', 0, generateRandomString()]

      return Promise.all(contactIds.map(async (contactId) => {
        const response = await getContactRequest(user.accessToken, contactId)
        const data = await response.json()
        expect(response.status).toBe(400)
        expect(data.contacts).toBeFalsy()
        expect(data.message).toBe('Contact ID was not provided or was invalid.')
      }))
    })

    // Contact not found
    test('Contact not found', async () => {
      const response = await getContactRequest(user.accessToken, randomUUID())
      const data = await response.json()
      expect(response.status).toBe(404)
      expect(data.contacts).toBeFalsy()
      expect(data.message).toBe('Contact not found.')
    })

    // Different user cannot get another user's contact.
    test('Different user cannot get another user\'s contact.', async () => {
      // New user.
      const otherUser = await signUpNewUser()

      const response = await getContactRequest(otherUser.accessToken, contact.contact_id)
      const data = await response.json()
      expect(response.status).toBe(404)
      expect(data.contacts).toBeFalsy()
      expect(data.message).toBe('Contact not found.')
    })
  })
})