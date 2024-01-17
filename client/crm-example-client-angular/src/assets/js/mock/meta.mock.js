import { verifyAccessToken } from './auth.mock.js'
import { getLocalStorageDb } from './mock.js'

/**
 * Endpoint: Get aggregated 'metadata' of the user.
 * * Used in the Home screen
 *
 * @param {string} accessToken
 */
export const getHomeMetadataEndpoint = async (accessToken) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const db = getLocalStorageDb()

  // Number of active contacts.
  const contacts = Object.values(db.contacts)
    .filter((contact) => contact.user_id === verifiedToken['user_id'] && !contact.archived)
    .length

  // Users tasks.
  const tasks = Object.values(db.tasks)
    .filter((task) => task.user_id === verifiedToken['user_id'])

  // Number of overdue tasks.
  const tasks_overdue = tasks
    .filter((task) => task.due_date && task.due_date < Date.now())
    .length

  const data = {
    contacts,
    tasks: tasks.length,
    tasks_overdue,
  }

  return { statusCode: 200, ok: true, data }
}
