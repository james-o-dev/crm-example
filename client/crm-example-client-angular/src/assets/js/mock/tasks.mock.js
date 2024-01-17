import { verifyAccessToken } from './auth.mock.js'
import { getLocalStorageDb, newToDb, removeFromDb, saveToDb } from './mock.js'

export const addTaskEndpoint = async (accessToken, payload) => {
  const verifiedToken = await verifyAccessToken(accessToken) || {}
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const taskId = newToDb('tasks', {
    ...payload,
    user_id: verifiedToken['user_id'],
  })

  return { statusCode: 201, ok: true, message: 'Task created.', taskId }
}

export const getTasksEndpoint = async (accessToken, contactId) => {
  const verifiedToken = await verifyAccessToken(accessToken) || {}
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const db = getLocalStorageDb()
  const contacts = db.contacts
  const tasks = Object.values(db['tasks'] || {})
    .filter(task => task.user_id === verifiedToken['user_id'])
    .filter(task => {
      if (!contactId) return true
      if (contactId === task.contact_id) return true
      return false
    })
    .sort((a, b) => {
      const dueDateSort = (a.due_date || 0) < (b.due_date || 0)
      const dateModifiedSort = (a.date_modified || 0) < (b.date_modified || 0)
      return dueDateSort || dateModifiedSort ? -1 : 1
    })
    .map(task => {
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

export const getTaskEndpoint = async (accessToken, taskId) => {
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

export const updateTaskEndpoint = async (accessToken, payload) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const taskId = payload.key || ''

  const { tasks } = getLocalStorageDb()
  const task = tasks[taskId]
  if (task.user_id !== verifiedToken['user_id']) return { statusCode: 403, ok: false, message: 'Forbidden.' }

  saveToDb('tasks', taskId, payload)

  return { statusCode: 200, ok: true, message: 'Task updated.' }
}

export const deleteTaskEndpoint = async (accessToken, taskId) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const { tasks } = getLocalStorageDb()
  const task = tasks[taskId]
  if (task.user_id !== verifiedToken['user_id']) return { statusCode: 403, ok: false, message: 'Forbidden.' }

  removeFromDb('tasks', taskId)

  return { statusCode: 200, ok: true, message: 'Task deleted.' }
}
