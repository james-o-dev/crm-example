import { verifyAccessToken } from './auth.mock'
import { getLocalStorageDb, newToDb, saveToDb } from './mock'

export const newContactEndpoint = async (accessToken, payload) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const contactId = newToDb('contacts', {
    ...payload,
    user_id: verifiedToken['user_id'],
  })

  return { statusCode: 201, ok: true, message: 'Contact created.', contactId }
}

export const getContactsEndpoint = async (accessToken, filters = {}) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }
  const db = getLocalStorageDb()
  const tasks = Object.values(db.tasks)
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
      const contactTasks = tasks.filter((t) => t.contact_id === contact.key)

      return {
        ...contact,
        num_tasks: Object.keys(contactTasks).length,
      }
    })

  return { statusCode: 200, ok: true, contacts }
}

export const getContactEndpoint = async (accessToken, contactId) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const { contacts } = getLocalStorageDb()
  const contact = contacts[contactId]

  if (contact.user_id !== verifiedToken['user_id']) return { statusCode: 403, ok: false, message: 'Forbidden.' }

  return { statusCode: 200, ok: true, contact }
}

export const updateContactEndpoint = async (accessToken, payload) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const contactId = payload.key || ''

  const { contacts } = getLocalStorageDb()
  const contact = contacts[contactId]
  if (contact.user_id !== verifiedToken['user_id']) return { statusCode: 403, ok: false, message: 'Forbidden.' }

  saveToDb('contacts', contactId, payload)

  return { statusCode: 200, ok: true, message: 'Contact updated.' }
}

const manageContactArchive = async (accessToken, contactId, archive) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const { contacts } = getLocalStorageDb()
  const contact = contacts[contactId]
  if (contact.user_id !== verifiedToken['user_id']) return { statusCode: 403, ok: false, message: 'Forbidden.' }

  contact.archived = archive
  saveToDb('contacts', contactId, contact)

  return { statusCode: 200, ok: true, message: archive ? 'Contact archived.' : 'Contact restored.' }
}

export const archiveContactEndpoint = async (accessToken, contactId) => {
  return manageContactArchive(accessToken, contactId, true)
}

export const restoreContactEndpoint = async (accessToken, contactId) => {
  return manageContactArchive(accessToken, contactId, false)
}
