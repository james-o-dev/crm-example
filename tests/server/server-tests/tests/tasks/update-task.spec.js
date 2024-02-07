const { commonHeaders } = require('../../lib/common')
const { signUpNewUser } = require('../../lib/common.auth')
const { createNewContact } = require('../../lib/common.contacts')
const { createNewTask, getTaskObject, getTaskInDb } = require('../../lib/common.tasks')
const { randomUUID } = require('node:crypto')

describe('Update task tests', () => {
  let user, task, contact

  const updateTasksRequest = (accessToken, payload) => {
    return fetch(`${process.env.API_HOST}/task`, {
      method: 'PUT',
      headers: commonHeaders(accessToken),
      body: JSON.stringify(payload),
    })
  }

  const getUpdateTaskObject = (taskId, contactId = null) => {
    return { ...getTaskObject(contactId), task_id: taskId }
  }

  beforeAll(async () => {
    user = await signUpNewUser()
    contact = await createNewContact(user.accessToken)
    task = await createNewTask(user.accessToken)
  })

  // Test: Successfully updates a task.
  test('Successfully updates a task.', async () => {
    let response, data

    const payload = {
      ...getUpdateTaskObject(task.task_id, contact.contact_id),
      due_date: null, // Test that it can set due_date to null.
    }

    response = await updateTasksRequest(user.accessToken, payload)
    data = await response.json()
    expect(data.message).toBe('Task updated.')
    expect(response.status).toBe(200)

    const dbTask = await getTaskInDb(task.task_id)
    expect(dbTask.title).toBe(payload.title)
    expect(dbTask.notes).toBe(payload.notes)
    // expect(dbTask.due_date).toBe(`${payload.due_date}`) // Test if due_date was updated.
    expect(dbTask.due_date).toBe(null) // Test if due_date was set to null.
    expect(dbTask.contact_id).toBe(payload.contact_id)
  })

  // Incorrect access token.
  test('Incorrect access token', async () => {
    const accessTokens = ['', null, user.refreshToken]
    const payload = getUpdateTaskObject(task.task_id)

    return Promise.all(accessTokens.map(async (accessToken) => {
      const response = await updateTasksRequest(accessToken, payload)
      const data = await response.json()
      expect(data.message).toBe('Unauthorized.')
      expect(response.status).toBe(401)
    }))
  })

  // Missing title.
  test('Missing title', async () => {
    const tests = ['', null]
    const payload = getUpdateTaskObject(task.task_id)

    return Promise.all(tests.map(async (title) => {
      const response = await updateTasksRequest(user.accessToken, { ...payload, title })
      const data = await response.json()
      expect(data.message).toBe('Missing title.')
      expect(response.status).toBe(400)
    }))
  })

  // Invalid due date.
  test('Invalid due date', async () => {
    const payload = getUpdateTaskObject(task.task_id)

    const response = await updateTasksRequest(user.accessToken, { ...payload, due_date: 'due date' })
    const data = await response.json()
    expect(data.message).toBe('Invalid due date.')
    expect(response.status).toBe(400)
  })

  // Invalid task id.
  test('Invalid task id', async () => {
    const tests = ['', null, user.refreshToken]

    return Promise.all(tests.map(async (taskId) => {
      const response = await updateTasksRequest(user.accessToken, getUpdateTaskObject(taskId))
      const data = await response.json()
      expect(data.message).toBe('Invalid Task ID.')
      expect(response.status).toBe(400)
    }))
  })

  // Task not found.
  test('Task not found', async () => {
    const response = await updateTasksRequest(user.accessToken, getUpdateTaskObject(randomUUID()))
    const data = await response.json()
    expect(data.message).toBe('Task and/or contact not found.')
    expect(response.status).toBe(404)
  })

  // Another user may not update task.
  test('Another user may not update task', async () => {
    const newUser = await signUpNewUser()

    const response = await updateTasksRequest(newUser.accessToken, getUpdateTaskObject(task.task_id))
    const data = await response.json()
    expect(data.message).toBe('Task and/or contact not found.')
    expect(response.status).toBe(404)
  })

  // Invalid contact.
  test('Invalid contact.', async () => {
    const newUser = await signUpNewUser()

    const response = await updateTasksRequest(newUser.accessToken, getUpdateTaskObject(task.task_id, 'invalid contact'))
    const data = await response.json()
    expect(data.message).toBe('Invalid Contact ID.')
    expect(response.status).toBe(400)
  })

  // Contact not found.
  test('Contact not found.', async () => {
    const newUser = await signUpNewUser()

    const response = await updateTasksRequest(newUser.accessToken, getUpdateTaskObject(task.task_id, randomUUID()))
    const data = await response.json()
    expect(data.message).toBe('Task and/or contact not found.')
    expect(response.status).toBe(404)
  })

  // Cannot update with contact that does not belong to user.
  test('Cannot update task with a contact that does not belong to user.', async () => {
    const newUser = await signUpNewUser()
    const newContact = await createNewContact(newUser.accessToken)

    const response = await updateTasksRequest(user.accessToken, getUpdateTaskObject(task.task_id, newContact.contact_id))
    const data = await response.json()
    expect(data.message).toBe('Task updated.')
    expect(response.status).toBe(200)

    // Check the database - the contact should be null.
    const dbTask = await getTaskInDb(task.task_id)
    expect(dbTask.contact_id).toBe(null)
  })
})