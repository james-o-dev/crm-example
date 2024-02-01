const { commonHeaders, generateRandomString, generateRandomEmail } = require('./common')

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

module.exports = {
  createNewContact,
  addContactRequest,
  generateContact,
}