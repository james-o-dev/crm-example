import { getUserId } from '../lib/auth.common.mjs'
import { successfulResponse } from '../lib/common.mjs'
import { getDb } from '../lib/db/db-postgres.mjs'

const MILLISECONDS_IN_A_DAY = 86400000

/**
 * SQL for tasks are similar, except for the COUNT aggregation and ordering.
 *
 * @param {boolean} [countOnly] Get count only. If falsy, get task details.
 */
const getTaskSql = (countOnly = false) => {
  return `
    SELECT ${countOnly ? 'COUNT(task_id)' : 'title, task_id, due_date'}
    FROM tasks
    WHERE user_id = $1
    AND due_date IS NOT NULL
    AND due_date <= (now_unix_timestamp() + ${MILLISECONDS_IN_A_DAY})
    ${countOnly ? '' : 'ORDER BY due_date ASC'}
  `
}

/**
 * Get notification count for the customer.
 * * Displayed as a number badge on top of  the  top-bar notification icon.
 * * Including: Tasks
 *
 * @param {*} reqHeaders
 */
export const getNotificationsCountEndpoint = async (reqHeaders) => {
  const userId = await getUserId(reqHeaders)

  const db = getDb()

  const sql = getTaskSql(true)
  const tasks = await db.one(sql, [userId])
  const taskCount = parseInt(tasks.count)

  // Display 9+ if over 9.
  const count = taskCount > 9 ? '9+' : `${taskCount}`

  return successfulResponse({ count })
}

/**
 * Get notification detail for the customer.
 * * Displayed in the notifications table
 * * Including: Tasks
 *
 * @param {*} reqHeaders
 */
export const getNotificationsDetailEndpoint = async (reqHeaders) => {
  const userId = await getUserId(reqHeaders)

  const db = getDb()

  const sql = getTaskSql()
  const tasks = await db.any(sql, [userId])

  const nowUnix = Date.now()
  const detail = tasks.map(task => {
    // Default due soon (based on the query used).
    let type = 'task_soon'
    let title = 'Task due soon'
    let message = `'${task.title}' is due soon`

    // Overdue instead.
    const dueDateNumber = parseInt(task.due_date)
    if (dueDateNumber < nowUnix) {
      type = 'task_overdue'
      title = 'Task overdue'
      message = `'${task.title}' is overdue`
    }

    return {
      type,
      title,
      message,
      key: task.task_id,
    }
  })

  return successfulResponse({ detail })
}
