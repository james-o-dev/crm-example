import { verifyAccessToken } from './auth.mock.js'
import { getLocalStorageDb } from './mock.js'

/**
 * Endpoint: Returns records when using the search function
 *
 * @param {string} accessToken
 * @param {string} q Search string
 */
export const searchEndpoint = async (accessToken, q) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  if (!q) return { statusCode: 200, ok: true, found: [] }

  /**
   * Helper: Normalizes the string - so that they can be compared more reliably.
   * * Lower-cased, remove whitespace
   *
   * @param {string} s
   */
  const stringNormalize = (s = '') => s.toLowerCase().replace(/\s*/g, '')

  let found = []
  const qNormal = stringNormalize(q)

  // Get the DB.
  const db = getLocalStorageDb()
  // Get the tables.
  const contacts = Object.values(db.contacts)
  const tasks = Object.values(db.tasks)

  // Find contacts.
  contacts.forEach((contact) => {
    // Include these fields when searching for a contact.
    const search = [
      contact.name,
      contact.email,
      contact.phone,
      contact.notes,
    ]
      .map((s) => stringNormalize(s || ''))
      .join()

    if (search.includes(qNormal)) {
      found.push({
        type: 'contact',
        key: contact.key,
        name: contact.name,
      })
    }
  })

  // Find tasks.
  tasks.forEach((task) => {
    // Include these fields when searching for a task.
    const search = [
      task.title,
      task.notes,
    ]
      .map(s => stringNormalize(s || ''))
      .join()

    if (search.includes(qNormal)) {
      found.push({
        type: 'task',
        key: task.key,
        name: task.title,
      })
    }
  })

  // Sort by the record name.
  found = found.sort((a, b) => a.name < b.name ? -1 : 1)

  // Respond.
  return { statusCode: 200, ok: true, found }
}
