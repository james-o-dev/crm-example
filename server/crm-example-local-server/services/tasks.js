import { getUserId } from '../lib/auth.common.js'
import { successfulResponse } from '../lib/common.js'
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

// Create new task.

// Update task.

// Delete task.