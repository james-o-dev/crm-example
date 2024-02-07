const { commonHeaders } = require('../../lib/common')
const { signUpNewUser } = require('../../lib/common.auth')
const { createNewTask, getTaskInDb } = require('../../lib/common.tasks')
const { randomUUID } = require('node:crypto')

describe('Delete task', () => {
  let user

  const deleteTaskRequest = (accessToken, taskId) => {
    return fetch(`${process.env.API_HOST}/task?task_id=${taskId}`, {
      method: 'DELETE',
      headers: commonHeaders(accessToken),
    })
  }

  beforeAll(async () => {
    user = await signUpNewUser()
  })

  // Test: Successfully delete task.
  test('Successfully delete task.', async () => {
    let response, data
    const task = await createNewTask(user.accessToken)

    response = await deleteTaskRequest(user.accessToken, task.task_id)
    data = await response.json()
    expect(data.message).toBe('Task deleted.')
    expect(response.status).toBe(200)

    const dbTask = await getTaskInDb(task.task_id)
    expect(dbTask).toBeFalsy()
  })

  // Incorrect access token.
  test('Incorrect access token', async () => {
    const accessTokens = ['', null, user.refreshToken]

    return Promise.all(accessTokens.map(async (accessToken) => {
      const task = await createNewTask(user.accessToken)

      const response = await deleteTaskRequest(accessToken, task.task_id)
      const data = await response.json()
      expect(response.status).toBe(401)
      expect(data.message).toBe('Unauthorized.')
    }))
  })

  // Incorrect task id.
  test('Incorrect task id', async () => {
    const taskIds = ['', null, user.refreshToken]

    return Promise.all(taskIds.map(async (taskId) => {
      const response = await deleteTaskRequest(user.accessToken, taskId)
      const data = await response.json()
      expect(response.status).toBe(400)
      expect(data.message).toBe('Invalid Task ID.')
    }))
  })

  // Task not found.
  test('Task not found', async () => {
    const response = await deleteTaskRequest(user.accessToken, randomUUID())
    const data = await response.json()
    expect(response.status).toBe(404)
    expect(data.message).toBe('Task not found.')
  })

  // Another user cannot delete task.
  test('Another user cannot delete task.', async () => {
    const [newUser, task] = await Promise.all([
      signUpNewUser(),
      createNewTask(user.accessToken),
    ])

    const response = await deleteTaskRequest(newUser.accessToken, task.task_id)
    const data = await response.json()
    expect(response.status).toBe(404)
    expect(data.message).toBe('Task not found.')

    const taskDb = getTaskInDb(task.task_id)
    expect(taskDb).toBeTruthy()
  })
})