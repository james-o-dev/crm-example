import { getUserId } from '../lib/auth.common.js'
import { successfulResponse, validationErrorResponse } from '../lib/common.js'
import { getDb, isUniqueConstraintError } from '../lib/db/db-postgres.js'

/**
 * Add new contact endpoint.
 *
 * @param {*} reqHeaders
 * @param {*} reqBody
 */
export const newContactEndpoint = async (reqHeaders, reqBody) => {
  const userId = await getUserId(reqHeaders)

  if (!reqBody) throw validationErrorResponse({ message: 'Request body was not provided.' })

  // Destructure required values from request.
  const { name, email } = reqBody

  // Validation.
  if (!name) throw validationErrorResponse({ message: 'Name was not provided.' })
  if (!email) throw validationErrorResponse({ message: 'Email was not provided.' })

  // Database query.
  // Insert into database.
  const params = {
    ...reqBody,
    userId,
  }
  const db = getDb()
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

  // Response.
  return successfulResponse({ message: 'Contact created.', contact_id: contactId }, 201)
}

/**
 * Get list of contacts for the user.
 *
 * @param {*} reqHeaders
 * @param {*} reqQuery
 */
export const getContactsEndpoint = async (reqHeaders, reqQuery) => {
  const userId = await getUserId(reqHeaders)

  // Query params.
  // Get only archived.
  const archived = reqQuery.archived === 'true' ? true : false

  // Database query.
  const db = getDb()
  const sql = `
    SELECT contact_id, name, email, phone
    FROM contacts
    -- TODO: Left join for task count.
    WHERE user_id = $(userId) AND archived = $(archived)
  `
  const params = { userId, archived }
  const contacts = await db.any(sql, params)

  // Response.
  return successfulResponse({ contacts })
}

export const getContactEndpoint = async (reqHeaders, reqQuery) => {
  const userId = await getUserId(reqHeaders)

  // Query params.
  // Contact ID is required.
  // Note: using contact_id instead of route params because AWS Lambda functional Urls do not support route params, without API Gateway.
  const contactId = reqQuery.contact_id
  if (!contactId) throw validationErrorResponse({ message: 'Contact ID was not provided.' })

  // Database query.
  const db = getDb()
  const sql = `
    SELECT contact_id, name, email, phone, notes, date_created, date_modified
    FROM contacts
    WHERE user_id = $(userId) AND contact_id = $(contactId)
  `
  const params = { userId, contactId }
  const contact = await db.oneOrNone(sql, params)

  // Response.
  return successfulResponse({ contact })
}

/**
 * Updates a user's contact.
 *
 * @param {*} reqHeaders
 * @param {*} reqBody
 */
export const updateContactEndpoint = async (reqHeaders, reqBody) => {
  const userId = await getUserId(reqHeaders)

  // Destructure required values from request.
  const { contact_id: contactId, name, email } = reqBody

  // Validation.
  if (!contactId) throw validationErrorResponse({ message: 'Contact ID was not provided.' })
  if (!name) throw validationErrorResponse({ message: 'Name was not provided.' })
  if (!email) throw validationErrorResponse({ message: 'Email was not provided.' })

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
  const params = {
    contactId, userId,
    name, email,
    notes: reqBody.notes, phone: reqBody.phone,
  }
  let updated = false
  try {
    const result = await db.one(sql, params)
    updated = !!result.contact_id
  } catch (error) {
    if (isUniqueConstraintError('contacts_unique')) throw validationErrorResponse({ message: 'This email is already in use.' }, 409)
    console.error(error)
    throw error
  }

  if (updated) return successfulResponse({ message: 'Contact updated.' })
  throw validationErrorResponse({ message: 'Contact not found.' }, 404)
}