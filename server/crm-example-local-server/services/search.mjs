import { successfulResponse } from '../lib/common.mjs'
import { getDb } from '../lib/db/db-postgres.mjs'

/**
 * Search records belonging to the user.
 *
 * @param {*} reqUser
 * @param {*} reqQuery Ensure the 'q' value is URI-encoded. e.g. `?q=encodeURIComponent(search)`
 */
export const searchEndpoint = async (reqUser, reqQuery) => {
  const userId = reqUser.user_id

  const q = decodeURIComponent(reqQuery.q)

  const db = getDb()

  const sqlContacts = `
    SELECT contact_id, name
    FROM contacts c
    WHERE c.user_id = $(userId)
    AND (
      name
      || email
      || COALESCE(phone, '')
      || COALESCE(notes, '')
    ) ILIKE '%$(q#)%'
  `
  const sqlTasks = `
    SELECT task_id, title
    FROM tasks t
    WHERE t.user_id = $(userId)
    AND (
      title
      || COALESCE(notes, '')
    ) ILIKE '%$(q#)%'
  `

  // Batch together for performance.
  const [contacts, tasks] = await db.task(t => Promise.all([
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