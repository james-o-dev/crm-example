import { getUserId } from '../lib/auth.common.js'
import { isUUIDv4, successfulResponse, validationErrorResponse } from '../lib/common.js'
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
  // Validate contact_id.
  if (contactId && !isUUIDv4(contactId)) throw validationErrorResponse({ message: 'Contact ID was invalid.' })

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
  if (reqBody.due_date && isNaN(parseInt(reqBody.due_date))) throw validationErrorResponse({ message: 'Invalid due date.' })

  // Query database.
  // Only set the contact if it exists and it belongs to the user.
  // If it does not, do not create a task and return an error.
  const db = getDb()
  const sql = `
    INSERT INTO tasks (title, notes, due_date, user_id, contact_id)
    SELECT $(title), $(notes), $(due_date), u.user_id, c.contact_id
    FROM users u
    LEFT JOIN contacts c ON c.contact_id = $(contact_id) AND c.user_id = u.user_id
    WHERE u.user_id = $(userId)
    AND ($(contact_id) IS NULL OR c.contact_id = $(contact_id))
    RETURNING task_id
  `
  const sqlParams = {
    userId,
    title: reqBody.title,
    due_date: reqBody.due_date,
    notes: reqBody.notes,
    contact_id: reqBody.contact_id || null,
  }
  const createdTask = await db.oneOrNone(sql, sqlParams)
  const taskId = createdTask?.task_id

  if (taskId) return successfulResponse({ message: 'Task created.', task_id: taskId }, 201)
  // It will only reach below if - an attempt was made to create a task with a contact that does not exist, from the user's perspective.
  // Since it would not have returned the task_id from the query.
  throw validationErrorResponse({ message: 'Contact was not found and could not be associated with this new task.' }, 404)
}

/**
 * Get an existing task.
 *
 * @param {*} reqHeaders
 * @param {*} reqQuery
 */
export const getTaskEndpoint = async (reqHeaders, reqQuery) => {
  const userId = await getUserId(reqHeaders)

  // Request body validation.
  if (!reqQuery.task_id || !isUUIDv4(reqQuery.task_id)) throw validationErrorResponse({ message: 'Invalid Task ID.' })
  const taskId = reqQuery.task_id

  // Query database.
  const db = getDb()
  const sql = `
    SELECT
      t.title,
      t.notes,
      t.due_date,
      t.contact_id,
      c.name AS "contact_name",
      t.date_created,
      t.date_modified
    FROM tasks t
    LEFT JOIN contacts c ON t.contact_id = c.contact_id AND c.user_id = t.user_id
    WHERE t.user_id = $(userId) AND t.task_id = $(taskId)
  `
  const sqlParams = { userId, taskId }
  const task = await db.oneOrNone(sql, sqlParams)

  if (task) return successfulResponse({ task })
  throw validationErrorResponse({ message: 'Task not found.' }, 404)
}

/**
 * Update an existing task.
 *
 * @param {*} reqHeaders
 * @param {*} reqQuery
 */
export const updateTaskEndpoint = async (reqHeaders, reqBody) => {
  const userId = await getUserId(reqHeaders)

  // Request body validation.
  if (!reqBody) throw validationErrorResponse({ message: 'Missing request body.' })
  if (!reqBody.title) throw validationErrorResponse({ message: 'Missing title.' })
  if (reqBody.due_date && isNaN(parseInt(reqBody.due_date))) throw validationErrorResponse({ message: 'Invalid due date.' })
  if (!reqBody.task_id || !isUUIDv4(reqBody.task_id)) throw validationErrorResponse({ message: 'Invalid Task ID.' })
  if (reqBody.contact_id && !isUUIDv4(reqBody.contact_id)) throw validationErrorResponse({ message: 'Invalid Contact ID.' })

  // Query database.
  const db = getDb()
  const sql = `
    UPDATE tasks
    SET title = $(title), notes = $(notes), due_date = $(due_date), contact_id = $(contact_id)
    WHERE user_id = $(userId) AND task_id = $(task_id)
    RETURNING task_id
  `
  const sqlParams = {
    userId,
    task_id: reqBody.task_id,
    title: reqBody.title,
    notes: reqBody.notes,
    due_date: reqBody.due_date,
    contact_id: reqBody.contact_id,
  }
  const taskUpdated = await db.oneOrNone(sql, sqlParams)

  if (taskUpdated) return successfulResponse({ message: 'Task updated.' })
  throw validationErrorResponse({ message: 'Task not found.' }, 404)
}

/**
 * Delete an existing task.
 *
 * @param {*} reqHeaders
 * @param {*} reqQuery
 */
export const deleteTaskEndpoint = async (reqHeaders, reqQuery) => {
  const userId = await getUserId(reqHeaders)

  // Request body validation.
  if (!reqQuery.task_id) throw validationErrorResponse({ message: 'Missing Task ID.' })
  const taskId = reqQuery.task_id

  // Query database.
  const db = getDb()
  const sql = `
    DELETE FROM tasks
    WHERE user_id = $(userId) AND task_id = $(taskId)
    RETURNING task_id
  `
  const sqlParams = { userId, taskId }
  const taskDeleted = await db.oneOrNone(sql, sqlParams)

  if (taskDeleted) return successfulResponse({ message: 'Task deleted.' })
  throw validationErrorResponse({ message: 'Task not found.' }, 404)
}