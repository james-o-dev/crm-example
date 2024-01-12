import { verifyAccessToken } from './auth.mock'
import { IContactDB } from './contacts.mock'
import { getLocalStorageDb, newToDb, saveToDb } from './mock'

interface ITask {
  due_date?: string
  key: string
  notes?: string
  title: string
}

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
    .sort((a, b) => a.date_modified < b.date_modified ? -1 : 1)
    .map((task: ITaskResponse) => {
      return {
        contact_id: (contacts[task.contact_id || ''])?.key,
        contact_name: (contacts[task.contact_id || ''])?.name,
        title: task.title,
        due_date: task.due_date,
        key: task.key,
      }
    })

  return { statusCode: 200, ok: true, tasks }
}

export const getTaskEndpoint = async (accessToken: string, taskId: string) => {
  const verifiedToken = await verifyAccessToken(accessToken) || {}
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const db = getLocalStorageDb()
  const dbTask = db.tasks[taskId]
  if (dbTask.user_id !== verifiedToken['user_id']) return { statusCode: 403, ok: false, message: 'Forbidden.' }

  let contact_name
  if (dbTask.contact_id && db.contacts[dbTask.contact_id]) {
    contact_name = db.contacts[dbTask.contact_id].name
  }

  const task = {
    ...dbTask,
    contact_name,
  }

  return { statusCode: 200, ok: true, task }
}

export const updateTaskEndpoint = async (accessToken: string, payload: ITask) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const taskId = payload.key || ''

  const { tasks } = getLocalStorageDb()
  const task = tasks[taskId]
  if (task.user_id !== verifiedToken['user_id']) return { statusCode: 403, ok: false, message: 'Forbidden.' }

  saveToDb('tasks', taskId, payload)

  return { statusCode: 200, ok: true, message: 'Contact updated.' }
}
