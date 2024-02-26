import { EMAIL_REGEXP } from '../lib/auth.common.mjs'
import { isUUIDv4, successfulResponse, validationErrorResponse } from '../lib/common.mjs'
import { getDb, isUniqueConstraintError } from '../lib/db/db-postgres.mjs'

/**
 * Add new contact endpoint.
 *
 * @param {*} reqUser
 * @param {*} reqBody
 */
export const newContactEndpoint = async (reqUser, reqBody) => {
  const userId = reqUser.user_id
  if (!reqBody) throw validationErrorResponse({ message: 'Request body was not provided.' })

  // Destructure required values from request.
  const { name, email } = reqBody

  // Validation.
  if (!name) throw validationErrorResponse({ message: 'Name was not provided.' })
  if (!email) throw validationErrorResponse({ message: 'Email was not provided.' })
  if (!EMAIL_REGEXP.test(email)) throw validationErrorResponse({ message: 'Invalid email format.' })

  // Database query.
  // Insert into database.
  const db = getDb()
  const sql = 'INSERT INTO contacts (user_id, name, email, phone, notes) VALUES ($(userId), $(name), $(email), $(phone), $(notes)) RETURNING contact_id'
  const sqlParams = {
    userId,
    name,
    email,
    phone: reqBody.phone,
    notes: reqBody.notes,
  }
  let contactId
  try {
    const result = await db.one(sql, sqlParams)
    contactId = result.contact_id
  } catch (error) {
    if (isUniqueConstraintError(error, 'contacts_unique')) throw validationErrorResponse({ message: 'This email is already in use.' }, 409)
    console.error(error)
    throw error
  }

  // Response.
  return successfulResponse({ message: 'Contact created.', contact_id: contactId }, 201)
}

/**
 * Get list of contacts for the user.
 *
 * @param {*} reqUser
 * @param {*} reqQuery
 */
export const getContactsEndpoint = async (reqUser, reqQuery) => {
  const userId = reqUser.user_id

  // Query params.
  // Get only archived.
  const archived = reqQuery.archived === 'true' ? true : false

  // Database query.
  const db = getDb()
  const sql = `
    SELECT c.contact_id, c.name, c.email, c.phone,
    (
      SELECT COUNT(*) FROM tasks t WHERE t.contact_id = c.contact_id
    ) AS "num_tasks"
    FROM contacts c
    WHERE c.user_id = $(userId) AND c.archived = $(archived)
  `
  const sqlParams = { userId, archived }
  const contacts = await db.any(sql, sqlParams)

  // Response.
  return successfulResponse({ contacts })
}

export const getContactEndpoint = async (reqUser, reqQuery) => {
  const userId = reqUser.user_id

  // Query params.
  // Contact ID is required.
  // Note: using contact_id instead of route params because AWS Lambda functional Urls do not support route params, without API Gateway.
  const contactId = reqQuery.contact_id || null
  if (!isUUIDv4(contactId)) throw validationErrorResponse({ message: 'Contact ID was not provided or was invalid.' })

  // Database query.
  const db = getDb()
  const sql = `
    SELECT contact_id, name, email, phone, notes, archived, date_created, date_modified
    FROM contacts
    WHERE user_id = $(userId) AND contact_id = $(contactId)
  `
  const sqlParams = { userId, contactId }
  const contact = await db.oneOrNone(sql, sqlParams)

  // Response.
  if (contact) return successfulResponse({ contact })
  throw validationErrorResponse({ message: 'Contact not found.' }, 404)
}

/**
 * Updates a user's contact.
 *
 * @param {*} reqUser
 * @param {*} reqBody
 */
export const updateContactEndpoint = async (reqUser, reqBody) => {
  const userId = reqUser.user_id

  // Destructure required values from request.
  const { contact_id: contactId, name, email } = reqBody

  // Validation.
  if (!contactId) throw validationErrorResponse({ message: 'Contact ID was not provided.' })
  if (!name) throw validationErrorResponse({ message: 'Name was not provided.' })
  if (!email) throw validationErrorResponse({ message: 'Email was not provided.' })
  if (!EMAIL_REGEXP.test(email)) throw validationErrorResponse({ message: 'Invalid email format.' })

  // Database query.
  const db = getDb()
  const sql = `
    UPDATE contacts
    SET name = $(name),
    email = $(email),
    phone = $(phone),
    notes = $(notes)
    WHERE user_id = $(userId) AND contact_id = $(contactId)
    RETURNING contact_id
  `
  const sqlParams = {
    contactId, userId,
    name, email,
    notes: reqBody.notes, phone: reqBody.phone,
  }
  let updated = false
  try {
    const result = await db.oneOrNone(sql, sqlParams)
    updated = !!result?.contact_id
  } catch (error) {
    if (isUniqueConstraintError(error, 'contacts_unique')) throw validationErrorResponse({ message: 'This email is already in use.' }, 409)
    console.error(error)
    throw error
  }

  if (updated) return successfulResponse({ message: 'Contact updated.' })
  throw validationErrorResponse({ message: 'Contact not found.' }, 404)
}

/**
 * Helper: Update the contact 'archived' status.
 *
 * @param {*} reqUser
 * @param {*} reqBody
 * @param {boolean} archiveStatus
 */
export const updateContactArchiveStatusEndpoint = async (reqUser, reqBody) => {
  const userId = reqUser.user_id

  const contactId = reqBody.contact_id
  if (!contactId) throw validationErrorResponse({ message: 'Contact ID was not provided.' })

  const archiveStatus = reqBody.archived || false

  const db = getDb()
  const sql = 'UPDATE contacts SET archived = $(archiveStatus) WHERE user_id = $(userId) AND contact_id = $(contactId) RETURNING contact_id'
  const sqlParams = {
    archiveStatus: archiveStatus || false,
    userId, contactId,
  }
  const updated = await db.oneOrNone(sql, sqlParams)

  if (updated) return successfulResponse({ message: `Contact ${archiveStatus ? 'archived' : 'restored'}.` })
  throw validationErrorResponse({ message: 'Contact not found.' }, 404)
}