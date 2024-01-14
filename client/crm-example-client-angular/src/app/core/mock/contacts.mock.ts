import { verifyAccessToken } from './auth.mock'
import { getLocalStorageDb, newToDb, saveToDb } from './mock'
import { ITaskDB } from './tasks.mock'

interface IContact {
  key?: string;
  name: string;
  user_id?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface IContactDB {
  key?: string;
  name: string;
  user_id: string;
  date_created: number;
  date_modified: number;
  email?: string;
  phone?: string;
  notes?: string;
  archived?: boolean;
}

export const newContactEndpoint = async (accessToken: string, payload: object) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const contactId = newToDb('contacts', {
    ...payload,
    user_id: verifiedToken['user_id'],
  })

  return { statusCode: 201, ok: true, message: 'Contact created.', contactId }
}

interface IGetContactsFilters {
  archived?: boolean
}

export const getContactsEndpoint = async (accessToken: string, filters: IGetContactsFilters = {}) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }
  const db = getLocalStorageDb()
  const tasks = Object.values(db.tasks as ITaskDB[])
  const contacts = (Object.values(db['contacts'] || {}) as IContactDB[])
    // Only return the user's contacts.
    .filter((contact: IContactDB) => contact.user_id === verifiedToken['user_id'])
    // Apply filters.
    .filter((contact: IContactDB) => {

      // Exclude archived, unless the filter is all.
      if (!filters.archived && contact.archived) return false

      // Filter only for archived and the contact is not archived.
      if (filters.archived && !contact.archived) return false

      return true
    })
    .sort((a, b) => a.date_modified < b.date_modified ? -1 : 1)
    .map((contact: IContactDB) => {
      const contactTasks: ITaskDB[] = tasks.filter((t: ITaskDB) => t.contact_id === contact.key)

      return {
        ...contact,
        num_tasks: Object.keys(contactTasks).length,
      }
    })

  return { statusCode: 200, ok: true, contacts }
}

export const getContactEndpoint = async (accessToken: string, contactId: string) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const { contacts } = getLocalStorageDb()
  const contact = contacts[contactId]

  if (contact.user_id !== verifiedToken['user_id']) return { statusCode: 403, ok: false, message: 'Forbidden.' }

  return { statusCode: 200, ok: true, contact }
}

export const updateContactEndpoint = async (accessToken: string, payload: IContact) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const contactId = payload.key || ''

  const { contacts } = getLocalStorageDb()
  const contact = contacts[contactId]
  if (contact.user_id !== verifiedToken['user_id']) return { statusCode: 403, ok: false, message: 'Forbidden.' }

  saveToDb('contacts', contactId, payload)

  return { statusCode: 200, ok: true, message: 'Contact updated.' }
}

const manageContactArchive = async (accessToken: string, contactId: string, archive: boolean) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const { contacts } = getLocalStorageDb()
  const contact = contacts[contactId]
  if (contact.user_id !== verifiedToken['user_id']) return { statusCode: 403, ok: false, message: 'Forbidden.' }

  contact.archived = archive
  saveToDb('contacts', contactId, contact)

  return { statusCode: 200, ok: true, message: archive ? 'Contact archived.' : 'Contact restored.' }
}

export const archiveContactEndpoint = async (accessToken: string, contactId: string) => {
  return manageContactArchive(accessToken, contactId, true)
}

export const restoreContactEndpoint = async (accessToken: string, contactId: string) => {
  return manageContactArchive(accessToken, contactId, false)
}
