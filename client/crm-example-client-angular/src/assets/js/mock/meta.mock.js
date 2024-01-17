import { verifyAccessToken } from './auth.mock.js'
import { getLocalStorageDb } from './mock.js'

export const getHomeMetadataEndpoint = async (accessToken) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const db = getLocalStorageDb()

  const contacts = Object.values(db.contacts)
    .filter((contact) => contact.user_id === verifiedToken['user_id'])
    .length

  const tasks = Object.values(db.tasks)
    .filter((task) => task.user_id === verifiedToken['user_id'])
    .length

  const tasks_overdue = Object.values(db.tasks)
    .filter((task) => task.user_id === verifiedToken['user_id'] && task.due_date && task.due_date < Date.now())
    .length

  const data = {
    contacts,
    tasks,
    tasks_overdue,
  }

  return { statusCode: 200, ok: true, data }
}
