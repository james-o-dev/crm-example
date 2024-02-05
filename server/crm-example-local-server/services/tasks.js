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

  return successfulResponse({ message: 'Task created.', task_id: createdTask.task_id }, 201)
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
  if (!reqQuery.task_id) throw validationErrorResponse({ message: 'Missing Task ID.' })
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

  return successfulResponse({ task })
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