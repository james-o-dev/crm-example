import { getAccessTokenFromHeaders } from '../lib/auth.common.js'
import { successfulResponse, unauthorizedError, validationErrorResponse } from '../lib/common.js'
import { PostgresDatabase, isUniqueConstraintError } from '../lib/db/db-postgres.js'

/**
 * Add new contact endpoint.
 *
 * @param {*} reqHeaders
 * @param {*} reqBody
 */
export const newContactEndpoint = async (reqHeaders, reqBody) => {
  const accessToken = await getAccessTokenFromHeaders(reqHeaders)
  if (!accessToken) throw unauthorizedError()
  const userId = accessToken.user_id
  if (!userId) throw unauthorizedError()

  if (!reqBody) throw validationErrorResponse({ message: 'Request body was not provided.' })

  // Destructure required values from request.
  const { name, email } = reqBody

  // Validation.
  if (!name) throw validationErrorResponse({ message: 'Name was not provided.' })
  if (!email) throw validationErrorResponse({ message: 'Email was not provided.' })

  // Future: Duplicate detection?

  // Insert into database.
  const params = {
    ...reqBody,
    userId,
  }
  const db = PostgresDatabase.getInstance().connection
  const sql = 'INSERT INTO contacts (user_id, name, email, phone, notes) VALUES ($(userId), $(name), $(email), $(phone), $(notes)) RETURNING contact_id'
  let contactId

  try {
    const result = await db.one(sql, params)
    contactId = result.contact_id
  } catch (error) {
    if (isUniqueConstraintError('contacts_unique')) throw validationErrorResponse({ message: 'This email is already in use.' }, 409)
    console.error(error)
    throw error
  }

  return successfulResponse({ message: 'Contact created.', contact_id: contactId }, 201)
}