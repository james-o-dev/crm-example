import { getUserId } from '../lib/auth.common.js'
import { successfulResponse } from '../lib/common.js'
import { getDb } from '../lib/db/db-postgres.js'

/**
 * Search records belonging to the user.
 *
 * @param {*} reqHeaders
 * @param {*} reqQuery
 */
export const searchEndpoint = async (reqHeaders, reqQuery) => {
  const userId = await getUserId(reqHeaders)

  const q = reqQuery.q

  const db = getDb()

  const sqlContacts = `
    SELECT contact_id, name
    FROM contacts c
    WHERE c.user_id = $(userId)
    AND (name || email || phone || notes) ILIKE '%$(q#)%'
  `
  const sqlTasks = `
    SELECT task_id, title
    FROM tasks t
    WHERE t.user_id = $(userId)
    AND (title || notes) ILIKE '%$(q#)%'
  `

  // Batch together for performance.
  const [contacts, tasks] = await db.task(t => t.batch([
    t.any(sqlContacts, {userId, q}),
    t.any(sqlTasks, {userId, q}),
  ]))

  let found = []
  contacts.forEach((contact) => {
    found.push({
      type: 'contact',
      key: contact.contact_id,
      name: contact.name,
    })
  })

  tasks.forEach((task) => {
    found.push({
      type: 'task',
      key: task.task_id,
      name: task.title,
    })
  })

  return successfulResponse({ found })
}