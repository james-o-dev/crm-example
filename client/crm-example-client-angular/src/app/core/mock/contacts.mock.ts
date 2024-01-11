import { verifyAccessToken } from './auth.mock'
import { getLocalStorageDb, newToDb, saveToDb } from './mock'

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
  date_created: string;
  date_modified: string;
  email?: string;
  phone?: string;
  notes?: string;
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

export const getContactsEndpoint = async (accessToken: string) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const db = getLocalStorageDb()
  const contacts = (Object.values(db['contacts'] || {}) as IContactDB[])
    .filter((contact: IContactDB) => contact.user_id === verifiedToken['user_id'])
    .sort((a, b) => a.date_modified < b.date_modified ? -1 : 1)

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
