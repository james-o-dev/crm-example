import { verifyAccessToken } from './auth.mock'
import { IContactDB } from './contacts.mock'
import { getLocalStorageDb, newToDb } from './mock'

export interface ITaskDB {
  contact_id?: string
  date_created: number
  date_modified: number
  due_date?: string
  key: string
  notes?: string
  title: string
  user_id: string
}

interface ITaskResponse extends ITaskDB {
  contact?: IContactDB
}

export const addTaskEndpoint = async (accessToken: string, payload: object) => {
  const verifiedToken = await verifyAccessToken(accessToken) || {}
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const taskId = newToDb('tasks', {
    ...payload,
    user_id: verifiedToken['user_id'],
  })

  return { statusCode: 201, ok: true, message: 'Task created.', taskId }
}

export const getTasksEndpoint = async (accessToken: string, contactId?: string) => {
  const verifiedToken = await verifyAccessToken(accessToken) || {}
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const db = getLocalStorageDb()
  const contacts = db.contacts
  const tasks = (Object.values(db['tasks'] || {}) as ITaskDB[])
    .filter((task: ITaskDB) => task.user_id === verifiedToken['user_id'])
    .filter((task: ITaskDB) => {
      if (!contactId) return true
      if (contactId === task.contact_id) return true
      return false
    })
    .map((task: ITaskResponse) => {
      if (task.contact_id) {
        task.contact = contacts[task.contact_id]
      }

      return task
    })
    .sort((a, b) => a.date_modified < b.date_modified ? -1 : 1)

  return { statusCode: 200, ok: true, tasks }
}
