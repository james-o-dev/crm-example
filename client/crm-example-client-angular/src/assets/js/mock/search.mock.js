import { verifyAccessToken } from './auth.mock.js'
import { getLocalStorageDb } from './mock.js'

export const searchEndpoint = async (accessToken, q) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  if (!q) return { statusCode: 200, ok: true, found: [] }

  const stringNormalize = (s = '') => s.toLowerCase().replace(/\s*/g, '')

  let found = []
  const qNormal = stringNormalize(q)

  const db = getLocalStorageDb()
  const contacts = Object.values(db.contacts)
  const tasks = Object.values(db.tasks)

  contacts.forEach((contact) => {
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

  tasks.forEach((task) => {
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

  found = found.sort((a, b) => a.name < b.name ? -1 : 1)

  return { statusCode: 200, ok: true, found }
}
