const { generateRandomString, API_TEST_TOKEN, commonHeaders } = require('./common')
const { getDb } = require('./db-postgres')

/**
 * Get a task payload. Used when creating a task.
 *
 * @param {string} [contactId]
 */
const getTaskObject = (contactId = null) => {
  return {
    title: generateRandomString() + API_TEST_TOKEN,
    notes: generateRandomString(),
    due_date: Date.now(),
    contact_id: contactId,
  }
}

/**
 * Get the row of the task, directly from the DB.
 *
 * @param {string} contactId
 */
const getTaskInDb = (taskId) => {
  const db = getDb()
  return db.oneOrNone('SELECT * FROM tasks WHERE task_id = $1', [taskId])
}

/**
 * Create a new task with the user.
 * * Optionally attach the task to a contact.
 *
 * @param {string} accessToken
 * @param {string} [contactId]
 */
const createNewTask = async (accessToken, contactId) => {
  const payload = getTaskObject(contactId)
  const response = await fetch(`${process.env.API_HOST}/task`, {
    method: 'POST',
    headers: commonHeaders(accessToken),
    body: JSON.stringify(payload),
  })
  const data = await response.json()

  return {
    ...payload,
    task_id: data.task_id,
  }
}

module.exports = {
  createNewTask,
  getTaskInDb,
  getTaskObject,
}