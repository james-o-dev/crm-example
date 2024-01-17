import { verifyAccessToken } from './auth.mock.js'
import { getLocalStorageDb, newToDb, removeFromDb, saveToDb } from './mock.js'

/**
 * Endpoint: Add a task
 *
 * @param {string} accessToken
 * @param {object} payload
 */
export const addTaskEndpoint = async (accessToken, payload) => {
  const verifiedToken = await verifyAccessToken(accessToken) || {}
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const taskId = newToDb('tasks', {
    ...payload,
    user_id: verifiedToken['user_id'],
  })

  return { statusCode: 201, ok: true, message: 'Task created.', taskId }
}

/**
 * Endpoint: Get tasks
 *
 * @param {string} accessToken
 * @param {string} [contactId] Optionally filter to only get tasks belonging to a contact.
 */
export const getTasksEndpoint = async (accessToken, contactId) => {
  const verifiedToken = await verifyAccessToken(accessToken) || {}
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  // Get `tasks` and `contacts` 'tables'.
  const db = getLocalStorageDb()
  const contacts = db.contacts
  // Map the tasks table.
  const tasks = Object.values(db['tasks'] || {})
    // Only get the user's tasks.
    .filter(task => task.user_id === verifiedToken['user_id'])
    .filter(task => { // Filter tasks depending on the contact.
      // Ignore if the `contactId` was not provided.
      if (!contactId) return true
      // Else if it was provided, only get the tasks belonging to the contact.
      if (contactId === task.contact_id) return true
      return false
    })
    .sort((a, b) => {
      const dueDateSort = (a.due_date || 0) < (b.due_date || 0)
      const dateModifiedSort = (a.date_modified || 0) < (b.date_modified || 0)
      // Sort by due date first, then by date modified.
      return dueDateSort || dateModifiedSort ? -1 : 1
    })
    .map(task => {
      return {
        contact_id: (contacts[task.contact_id || ''])?.key,
        contact_name: (contacts[task.contact_id || ''])?.name,
        title: task.title,
        due_date: task.due_date,
        key: task.key,
      }
    })

  return { statusCode: 200, ok: true, tasks }
}

/**
 * Endpoint: Get a task
 *
 * @param {string} accessToken
 * @param {string} taskId
 */
export const getTaskEndpoint = async (accessToken, taskId) => {
  const verifiedToken = await verifyAccessToken(accessToken) || {}
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const db = getLocalStorageDb()
  const dbTask = db.tasks[taskId]
  // Only get the user's task.
  if (dbTask.user_id !== verifiedToken['user_id']) return { statusCode: 403, ok: false, message: 'Forbidden.' }

  // Return the contact name if a contact was associated with the task.
  let contact_name
  if (dbTask.contact_id && db.contacts[dbTask.contact_id]) {
    contact_name = db.contacts[dbTask.contact_id].name
  }

  const task = {
    ...dbTask,
    contact_name,
  }

  return { statusCode: 200, ok: true, task }
}

/**
 * Endpoint: Update an existing task.
 *
 * @param {string} accessToken
 * @param {object} payload
 */
export const updateTaskEndpoint = async (accessToken, payload) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  // The task_id is the `key`, i.e. primary key.
  const taskId = payload.key || ''

  // Get the tasks 'table'.
  const { tasks } = getLocalStorageDb()
  const task = tasks[taskId]
  // The task must belong to the user.
  if (task.user_id !== verifiedToken['user_id']) return { statusCode: 403, ok: false, message: 'Forbidden.' }

  // Update the task.
  saveToDb('tasks', taskId, payload)

  return { statusCode: 200, ok: true, message: 'Task updated.' }
}

/**
 * Endpoint: Delete a task
 *
 * @param {string} accessToken
 * @param {string} taskId
 */
export const deleteTaskEndpoint = async (accessToken, taskId) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  // Get the tasks 'table'.
  const { tasks } = getLocalStorageDb()
  const task = tasks[taskId]
  // The task must belong to the user.
  if (task.user_id !== verifiedToken['user_id']) return { statusCode: 403, ok: false, message: 'Forbidden.' }

  // Delete the task.
  removeFromDb('tasks', taskId)

  return { statusCode: 200, ok: true, message: 'Task deleted.' }
}
