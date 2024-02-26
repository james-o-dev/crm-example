import { successfulResponse, validationErrorResponse } from '../lib/common.mjs'
import { getDb, isUniqueConstraintError } from '../lib/db/db-postgres.mjs'

/**
 * Export the user's contacts as a JSON string.
 * * Ideally it would be uploaded to a file storage service separately and then a short-lived URL to it will be returned.
 *
 * @param {*} reqUser
 */
export const exportContactsJsonEndpoint = async (reqUser) => {
  const userId = reqUser.user_id

  const db = getDb()

  const contacts = await db.any(`
    SELECT
      name,
      email,
      phone,
      notes,
      archived
    FROM contacts
    WHERE user_id = $1
  `, [userId])

  return successfulResponse({ json: JSON.stringify(contacts) })
}

/**
 * Import contacts from a JSON file
 * * Ideally: File is uploaded to a file storage service separately and the server async reads it and creates the contacts. After it is done importing it would email to the user.
 *
 * @param {*} reqUser
 * @param {*} payload
 */
export const importContactsJsonEndpoint = async (reqUser, reqBody) => {
  const userId = reqUser.user_id

  const contacts = JSON.parse(reqBody.json)

  const db = getDb()

  // TODO optimize this.
  try {
    await db.tx(t => Promise.all(
      contacts.map((contact) => {
        return t.none(`
          INSERT INTO contacts (
            name,
            email,
            phone,
            notes,
            archived,
            user_id
          ) VALUES (
            $1, $2, $3, $4, $5, $6
          )
        `, [
          contact.name,
          contact.email,
          contact.phone,
          contact.notes,
          contact.archived,
          userId,
        ])
      }),
    ))
  } catch (error) {
    if (isUniqueConstraintError( error, 'contacts_unique')) throw validationErrorResponse({ message: 'A contact with this email already exists.' }, 409)
    throw error
  }

  // Ideally it would be uploaded to a file storage service separately and then a short-lived URL to it will be returned.
  return successfulResponse({ message: 'Contacts imported.' })
}