const { commonHeaders } = require('../lib/common')
const { signUpNewUser } = require('../lib/common.auth')
const { createNewTask } = require('../lib/common.tasks')
const { getDb } = require('../lib/db-postgres')
const db = getDb()

describe('Notification tests', () => {
  const MILLISECONDS_IN_A_DAY = 86400000

  /**
   * Create a task specifically for notification tests
   *
   * @param {string} accessToken
   * @param {boolean} overdue True to create an overdue task. Falsy to create a task due soon
   */
  const createNotificationTask = async (accessToken, overdue = false) => {
    const task = await createNewTask(accessToken)

    // Task overdue.
    if (overdue) await db.none('UPDATE tasks SET due_date = $1 WHERE task_id = $2', [Date.now() - MILLISECONDS_IN_A_DAY, task.task_id])
    // Task due soon.
    else await db.none('UPDATE tasks SET due_date = $1 WHERE task_id = $2', [Date.now() + MILLISECONDS_IN_A_DAY, task.task_id])

    return task
  }

  describe('Get notification count tests', () => {
    let user

    const notificationCountRequest = async (accessToken) => {
      return fetch(`${process.env.API_HOST}/notifications/count`, {
        headers: commonHeaders(accessToken),
      })
    }

    beforeAll(async () => {
      user = await signUpNewUser()
    })

    // Successfully gets count.
    test('Successfully gets count', async () => {
      let response, data

      await Promise.all([
        // Create a task, overdue.
        createNotificationTask(user.accessToken, true),
        // Create a task, due soon.
        createNotificationTask(user.accessToken),
      ])

      response = await notificationCountRequest(user.accessToken)
      data = await response.json()
      expect(response.status).toBe(200)
      expect(data.count).toBe('2')
    })

    // Abbreviate count if greater than 9
    test('Abbreviate count if greater than 9', async () => {
      let response, data

      // Note: Do not use Promise.all(); It can hang the test (possibly due to database connection pooling?)
      for (let i = 0; i < 10; i++) {
        await createNotificationTask(user.accessToken)
      }

      response = await notificationCountRequest(user.accessToken)
      data = await response.json()
      expect(response.status).toBe(200)
      expect(data.count).toBe('9+')
    })

    // Invalid token.
    test('Invalid access token', async () => {
      const accessTokens = ['', null, user.refreshToken]

      return Promise.all(accessTokens.map(async (accessToken) => {
        const response = await notificationCountRequest(accessToken)
        const data = await response.json()
        expect(response.status).toBe(401)
        expect(data.message).toBe('Unauthorized.')
      }))
    })

    // Other user will get a different count.
    test('Other user will get a different count', async () => {
      let response, data
      const newUser = await signUpNewUser()

      await createNotificationTask(newUser.accessToken)

      response = await notificationCountRequest(newUser.accessToken)
      data = await response.json()
      expect(response.status).toBe(200)
      expect(data.count).toBe('1')
    })
  })

  describe('Get notification detail tests', () => {
    let user

    const notificationDetailRequest = async (accessToken) => {
      return fetch(`${process.env.API_HOST}/notifications/detail`, {
        headers: commonHeaders(accessToken),
      })
    }

    beforeAll(async () => {
      user = await signUpNewUser()
    })

    // Successfully gets count.
    test('Successfully gets details', async () => {
      let response, data

      const [taskOverdue, taskDueSoon] = await Promise.all([
        // Create a task, overdue.
        createNotificationTask(user.accessToken, true),
        // Create a task, due soon.
        createNotificationTask(user.accessToken),
      ])

      response = await notificationDetailRequest(user.accessToken)
      data = await response.json()
      expect(response.status).toBe(200)

      expect(data.detail).toBeTruthy()
      expect(data.detail.length).toBe(2)
      expect(data.detail.some(d => d.type === 'task_overdue' && d.key === taskOverdue.task_id)).toBe(true)
      expect(data.detail.some(d => d.type === 'task_soon' && d.key === taskDueSoon.task_id)).toBe(true)
    })

    // Invalid token.
    test('Invalid access token', async () => {
      const accessTokens = ['', null, user.refreshToken]

      return Promise.all(accessTokens.map(async (accessToken) => {
        const response = await notificationDetailRequest(accessToken)
        const data = await response.json()
        expect(response.status).toBe(401)
        expect(data.message).toBe('Unauthorized.')
      }))
    })

    // Other user will get different details.
    test('Other user will get different details', async () => {
      let response, data
      const newUser = await signUpNewUser()

      const task = await createNotificationTask(newUser.accessToken, true)

      response = await notificationDetailRequest(newUser.accessToken)
      data = await response.json()
      expect(response.status).toBe(200)
      expect(data.detail).toBeTruthy()
      expect(data.detail.length).toBe(1)
      expect(data.detail.some(d => d.type === 'task_overdue' && d.key === task.task_id)).toBe(true)
    })
  })
})