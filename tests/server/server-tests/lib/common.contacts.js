const { commonHeaders, generateRandomString, generateRandomEmail } = require('./common')
const { getDb } = require('./db-postgres')

/**
 * Generate new contact details.
 */
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

/**
 * Create a new contact in the database. Returned the contact details and user_id.
 *
 * @param {string} accessToken
 */
const createNewContact = async (accessToken) => {
  const newContact = generateContact()

  const response = await addContactRequest(accessToken, newContact)
  const data = await response.json()

  return {
    ...newContact,
    contact_id: data.contact_id,
  }
}

/**
 * Get the row of the contact, directly from the DB.
 *
 * @param {string} contactId
 */
const getContactFromDb = async (contactId) => {
  const db = getDb()
  return db.oneOrNone('SELECT * FROM contacts WHERE contact_id = $1', [contactId])
}

module.exports = {
  addContactRequest,
  createNewContact,
  generateContact,
  getContactFromDb,
}