import { verifyAccessToken } from './auth.mock'
import { getLocalStorageDb, newToDb, saveToDb } from './mock'

/**
 * Endpoint: Create new contact
 *
 * @param {string} accessToken User
 * @param {object} payload
 */
export const newContactEndpoint = async (accessToken, payload) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const contactId = newToDb('contacts', {
    ...payload,
    user_id: verifiedToken['user_id'],
  })

  return { statusCode: 201, ok: true, message: 'Contact created.', contactId }
}

/**
 * Get list of contacts owned by the user.
 *
 * @param {string} accessToken User
 * @param {object} [filters]
 * @param {boolean} [filters.archived] True to only return archived contacts
 */
export const getContactsEndpoint = async (accessToken, filters = {}) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  // Get `tasks` and `contacts` 'tables'.
  const db = getLocalStorageDb()
  const tasks = Object.values(db.tasks)
  // Map the task 'table'.
  const contacts = Object.values(db['contacts'] || {})
    // Only return the user's contacts.
    .filter((contact) => contact.user_id === verifiedToken['user_id'])
    // Apply filters.
    .filter((contact) => {

      // Exclude archived, unless the filter is all.
      if (!filters.archived && contact.archived) return false

      // Filter only for archived and the contact is not archived.
      if (filters.archived && !contact.archived) return false

      return true
    })
    .sort((a, b) => a.date_modified < b.date_modified ? -1 : 1)
    .map((contact) => {
      // Task-related values for the contact.

      // Get contact tasks.
      const contactTasks = tasks.filter((t) => t.contact_id === contact.key)

      return {
        ...contact,
        num_tasks: Object.keys(contactTasks).length, // Number of current tasks for this contact.
      }
    })

  return { statusCode: 200, ok: true, contacts }
}

/**
 * Get details of a single contact, owned by the user.
 *
 * @param {string} accessToken
 * @param {string} contactId
 */
export const getContactEndpoint = async (accessToken, contactId) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  // Get contacts 'table'.
  const { contacts } = getLocalStorageDb()
  const contact = contacts[contactId]
  // The contact must belong to the user.
  if (contact.user_id !== verifiedToken['user_id']) return { statusCode: 403, ok: false, message: 'Forbidden.' }

  return { statusCode: 200, ok: true, contact }
}

/**
 * Endpoint: Update a contact
 *
 * @param {string} accessToken
 * @param {object} payload Update the contact record with this object. `key` is required
 */
export const updateContactEndpoint = async (accessToken, payload) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  // The contact_id is the `key`, i.e. primary key.
  const contactId = payload.key || ''

  // Get contacts 'table'.
  const { contacts } = getLocalStorageDb()
  const contact = contacts[contactId]
  // The contact must belong to the user.
  if (contact.user_id !== verifiedToken['user_id']) return { statusCode: 403, ok: false, message: 'Forbidden.' }

  // Update the contact.
  saveToDb('contacts', contactId, payload)

  return { statusCode: 200, ok: true, message: 'Contact updated.' }
}

/**
 * Helper: Toggle archive status of a contact
 *
 * @param {string} accessToken
 * @param {string} contactId
 * @param {boolean} archive
 */
const manageContactArchive = async (accessToken, contactId, archive) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  // Get contacts 'table'.
  const { contacts } = getLocalStorageDb()
  const contact = contacts[contactId]
  // The contact must belong to the user.
  if (contact.user_id !== verifiedToken['user_id']) return { statusCode: 403, ok: false, message: 'Forbidden.' }

  // Set the `archived` value of the contact.
  contact.archived = archive
  saveToDb('contacts', contactId, contact)

  // Respond.
  return { statusCode: 200, ok: true, message: archive ? 'Contact archived.' : 'Contact restored.' }
}

/**
 * Endpoint: Archive a contact
 *
 * @param {string} accessToken
 * @param {string} contactId
 */
export const archiveContactEndpoint = async (accessToken, contactId) => {
  return manageContactArchive(accessToken, contactId, true)
}

/**
 * Endpoint: Restore a contact
 *
 * @param {string} accessToken
 * @param {string} contactId
 */
export const restoreContactEndpoint = async (accessToken, contactId) => {
  return manageContactArchive(accessToken, contactId, false)
}
