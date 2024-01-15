import { verifyAccessToken } from './auth.mock'
import { IContactDB } from './contacts.mock'
import { getLocalStorageDb } from './mock'
import { ITaskDB } from './tasks.mock'

interface ISearchResponse {
  name: string
  key: string
  type: string
}

export const searchEndpoint = async (accessToken: string, q: string) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  if (!q) return { statusCode: 200, ok: true, found: [] }

  const stringNormalize = (s = '') => s.toLowerCase().replace(/\s*/g, '')

  let found: ISearchResponse[] = []
  const qNormal = stringNormalize(q)

  const db = getLocalStorageDb()
  const contacts = Object.values<IContactDB>(db.contacts)
  const tasks = Object.values<ITaskDB>(db.tasks)

  contacts.forEach((contact: IContactDB) => {
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
      } as ISearchResponse)
    }
  })

  tasks.forEach((task: ITaskDB) => {
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
      } as ISearchResponse)
    }
  })

  found = found.sort((a, b) => a.name < b.name ? -1 : 1)

  return { statusCode: 200, ok: true, found }
}
