import { getUserId } from '../lib/auth.common.js'
import { successfulResponse } from '../lib/common.js'
import { getDb } from '../lib/db/db-postgres.js'

/**
 * Get data for the dashboard / home.
 *
 * @param {*} reqHeaders
 */
export const dashboardDataEndpoint = async (reqHeaders) => {
  const userId = await getUserId(reqHeaders)

  const db = getDb()

  const sqlActiveContacts = `
    SELECT COUNT(contact_id)
    FROM contacts
    WHERE user_id = $1
    AND archived <> TRUE
  `
  const sqlTasks = `
    SELECT COUNT(task_id)
    FROM tasks
    WHERE user_id = $1
  `
  const sqlOverdueTasks = `
    SELECT COUNT(task_id)
    FROM tasks
    WHERE user_id = $1
    AND due_date IS NOT NULL
    AND due_date < now_unix_timestamp()
  `
  const [activeContacts, tasks, overdueTasks] = await db.task(t => Promise.all([
    t.one(sqlActiveContacts, [userId]),
    t.one(sqlTasks, [userId]),
    t.one(sqlOverdueTasks, [userId]),
  ]))

  const data = {
    contacts: activeContacts.count,
    tasks: tasks.count,
    tasks_overdue: overdueTasks.count,
  }
  return successfulResponse({ data })
}