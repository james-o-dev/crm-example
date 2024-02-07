const { commonHeaders } = require('../../lib/common')
const { signUpNewUser } = require('../../lib/common.auth')
const { createNewContact } = require('../../lib/common.contacts')
const { createNewTask } = require('../../lib/common.tasks')
const { randomUUID } = require('node:crypto')

describe('Get task/s tests', () => {

  describe('Get tasks', () => {
    let user, task, contactTask, contact

    const getTasksRequest = (accessToken, contactId) => {
      return fetch(`${process.env.API_HOST}/tasks?contact_id=${contactId || ''}`, {
        headers: commonHeaders(accessToken),
      })
    }

    beforeAll(async () => {
      user = await signUpNewUser()
      contact = await createNewContact(user.accessToken)
      const [task1, task2] = await Promise.all([
        createNewTask(user.accessToken),
        createNewTask(user.accessToken, contact.contact_id),
      ])
      task = task1
      contactTask = task2
    })

    // Test: Successfully gets tasks.
    test('Successfully gets tasks.', async () => {
      let response, data

      response = await getTasksRequest(user.accessToken)
      data = await response.json()
      expect(response.status).toBe(200)
      expect(data.tasks).toBeTruthy()
      expect(data.tasks.length === 2).toBeTruthy()
      expect(data.tasks.some(t => t.task_id === task.task_id)).toBeTruthy()
      expect(data.tasks.some(t => t.task_id === contactTask.task_id)).toBeTruthy()
    })

    // Test: Successfully gets tasks - filter by contact.
    test('Successfully gets tasks - filter by contact.', async () => {
      let response, data

      response = await getTasksRequest(user.accessToken, contact.contact_id)
      data = await response.json()
      expect(response.status).toBe(200)
      expect(data.tasks).toBeTruthy()
      expect(data.tasks.length === 1).toBeTruthy()
      expect(data.tasks.some(t => t.task_id === task.task_id)).toBeFalsy()
      expect(data.tasks.some(t => t.task_id === contactTask.task_id)).toBeTruthy()
    })

    // Incorrect access token.
    test('Incorrect access token', async () => {
      const accessTokens = ['', null, user.refreshToken]

      return Promise.all(accessTokens.map(async (accessToken) => {
        const response = await getTasksRequest(accessToken)
        const data = await response.json()
        expect(response.status).toBe(401)
        expect(data.tasks).toBeFalsy()
        expect(data.message).toBe('Unauthorized.')
      }))
    })

    // Incorrect contact ID.
    test('Invalid Contact ID', async () => {
      const response = await getTasksRequest(user.accessToken, 'invalid contact id')
      const data = await response.json()
      expect(response.status).toBe(400)
      expect(data.tasks).toBeFalsy()
      expect(data.message).toBe('Contact ID was invalid.')
    })

    // Contact not found.
    test('Contact not found', async () => {
      const response = await getTasksRequest(user.accessToken, randomUUID())
      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data.tasks).toBeTruthy()
      expect(data.tasks.length).toBe(0)
    })

    // Only returns user's tasks.
    test('Only returns user\'s tasks.', async () => {
      // New user.
      const newUser = await signUpNewUser()

      // New task.
      const newTask = await createNewTask(newUser.accessToken)

      const response = await getTasksRequest(newUser.accessToken)
      const data = await response.json()
      expect(data.tasks).toBeTruthy()
      expect(data.tasks.length === 1).toBeTruthy()
      expect(data.tasks[0].task_id === newTask.task_id).toBeTruthy()
    })
  })

  describe('Get single task', () => {
    let user, task

    const getTaskRequest = (accessToken, taskId) => {
      return fetch(`${process.env.API_HOST}/task?task_id=${taskId || ''}`, {
        headers: commonHeaders(accessToken),
      })
    }

    beforeAll(async () => {
      user = await signUpNewUser()
      task = await createNewTask(user.accessToken)
    })

    test('Successfully gets task.', async () => {
      let response, data

      response = await getTaskRequest(user.accessToken, task.task_id)
      data = await response.json()
      expect(response.status).toBe(200)
      expect(data.task).toBeTruthy()
      expect(data.task.task_id).toBe()
    })

    // Incorrect access token.
    test('Incorrect access token', async () => {
      const accessTokens = ['', null, user.refreshToken]

      return Promise.all(accessTokens.map(async (accessToken) => {
        const response = await getTaskRequest(accessToken, task.task_id)
        const data = await response.json()
        expect(response.status).toBe(401)
        expect(data.task).toBeFalsy()
        expect(data.message).toBe('Unauthorized.')
      }))
    })

    // Incorrect task id.
    test('Invalid Task ID', async () => {
      const taskIds = ['', null, user.refreshToken]

      return Promise.all(taskIds.map(async (taskId) => {
        const response = await getTaskRequest(user.accessToken, taskId)
        const data = await response.json()
        expect(response.status).toBe(400)
        expect(data.task).toBeFalsy()
        expect(data.message).toBe('Invalid Task ID.')
      }))
    })

    // Task ID not found.
    test('Task not found.', async () => {
      const response = await getTaskRequest(user.accessToken, randomUUID())
      const data = await response.json()
      expect(response.status).toBe(404)
      expect(data.task).toBeFalsy()
      expect(data.message).toBe('Task not found.')
    })

    // Another user cannot get task.
    test('Another user cannot get task.', async () => {
      const newUser = await signUpNewUser()

      const response = await getTaskRequest(newUser.accessToken, task.task_id)
      const data = await response.json()
      expect(response.status).toBe(404)
      expect(data.task).toBeFalsy()
      expect(data.message).toBe('Task not found.')
    })
  })
})