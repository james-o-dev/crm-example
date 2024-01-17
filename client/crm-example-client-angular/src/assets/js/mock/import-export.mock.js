import { verifyAccessToken } from './auth.mock.js'
import { getLocalStorageDb, newToDb } from './mock.js'

export const exportContactsJsonEndpoint = async (accessToken) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const { contacts } = getLocalStorageDb()
  const contactsReduced = Object.values(contacts)
  .filter((contact) => contact.user_id === verifiedToken['user_id'])
  .map((contact) => {
    return {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      notes: contact.notes,
      archived: contact.archived,
    }
  })

  const json = JSON.stringify(contactsReduced)

  // Ideally it would be uploaded to a file storage service separately and then a short-lived URL to it will be returned.
  return { statusCode: 200, ok: true, json }
}

export const importContactsJsonEndpoint = async (accessToken, payload) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  try {
    // Ideally the input file would be uploaded to a file storage service separately and the server would read it separately.
    const importing = JSON.parse(payload)

    importing
      .forEach((contact) => {
        contact.user_id = verifiedToken['user_id']
        newToDb('contacts', contact)
      })

    return { statusCode: 200, ok: true, message: 'Contacts imported.' }
  } catch (error) {
    return { statusCode: 500, ok: false, message: 'Error with import.' }
  }
}
