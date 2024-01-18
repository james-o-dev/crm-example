import { verifyAccessToken } from './auth.mock'
import { getLocalStorageDb } from './mock'

/**
 * Notification categories:
 * * Tasks that are due soon (within 24h)
 * * Tasks that are overdue.
 */

/**
 * Endpoint: Get notifications.
 *
 * @param {string} accessToken
 * @param {boolean} [numberOnly=false] True to only return the number of notifications. Default false, return details.
 */
export const getNotificationsEndpoint = async (accessToken, numberOnly = false) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const { tasks } = getLocalStorageDb()
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tasksArray = Object.values(tasks)
    // Only return tasks that are owned by the user.
    .filter((task) => task.user_id === verifiedToken['user_id'])
    .map((task) => {
      // Filter according to requirements of what tasks should be included in notifications.

      // Skip if not due date.
      if (!task.due_date) return null

      // Due date is less than now.
      if (task.due_date <= Date.now()) return {
        type: 'task_overdue',
        title: 'Task overdue',
        message: `'${task.title}' is overdue`,
        key: task.key,
      }

      // Due date is soon (24 hours from now).
      if (task.due_date > Date.now() && task.due_date <= tomorrow.getTime())  return {
        type: 'task_soon',
        title: 'Task due soon',
        message: `'${task.title}' is due soon`,
        key: task.key,
      }

      return null
    })
    .filter((notification) => notification) // Remove nulls.

  // Format the number
  // If none - return empty string.
  // If 1 to 9, return number string
  // If greater than 9, return '9+'
  const number = tasksArray.length === 0 ? '' : (
    tasksArray.length > 9 ? '9+' : tasksArray.length.toString()
  )

  return { statusCode: 200, ok: true, number, details: !numberOnly ? tasksArray : null }
}
