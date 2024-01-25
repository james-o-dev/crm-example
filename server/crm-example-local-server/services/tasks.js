import { getUserId } from '../lib/auth.common.js'
import { successfulResponse, validationErrorResponse } from '../lib/common.js'
import { getDb } from '../lib/db/db-postgres.js'


/**
 * Get tasks belonging to the user
 * * Optional filter to specific contact.
 *
 * @param {*} reqHeaders
 * @param {*} reqQuery
 */
export const getTasksEndpoint = async (reqHeaders, reqQuery) => {
  const userId = await getUserId(reqHeaders)

  // Get query params.
  const contactId = reqQuery.contact_id || null

  // Query database.
  const db = getDb()
  const sql = `
    SELECT
      t.task_id,
      t.title,
      t.due_date,
      t.contact_id,
      c.name AS "contact_name"
    FROM tasks t
    LEFT JOIN contacts c ON t.contact_id = c.contact_id AND c.user_id = t.user_id
    WHERE t.user_id = $(userId)
    AND ($(contactId) IS NULL OR t.contact_id = $(contactId))
    ORDER BY t.due_date, t.date_modified
  `
  const sqlParams = {
    userId, contactId,
  }
  const tasks = await db.any(sql, sqlParams)

  return successfulResponse({ tasks })
}

// Get task.

/**
 * Create a new task.
 *
 * @param {*} reqHeaders
 * @param {*} reqBody
 */
export const createTaskEndpoint = async (reqHeaders, reqBody) => {
  const userId = await getUserId(reqHeaders)

  // Request body validation.
  if (!reqBody) throw validationErrorResponse({ message: 'Missing request body.' })
  if (!reqBody.title) throw validationErrorResponse({ message: 'Missing title.' })

  // Query database.
  const db = getDb()
  const sql = `
    INSERT INTO tasks (title, notes, due_date, contact_id, user_id)
    VALUES ($(title), $(notes), $(due_date), $(contact_id), $(userId))
    RETURNING task_id
  `
  const sqlParams = {
    userId,
    title: reqBody.title,
    due_date: reqBody.due_date,
    notes: reqBody.notes,
    contact_id: reqBody.contact_id,
  }
  const createdTask = await db.one(sql, sqlParams)

  return successfulResponse({ message: 'Task created.', task_id: createdTask.task_Id }, 201)
}

// Update task.

// Delete task.