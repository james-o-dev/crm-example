const { commonHeaders } = require('../lib/common')
const { signUpNewUser } = require('../lib/common.auth')
const { createNewContact } = require('../lib/common.contacts')
const { createNewTask } = require('../lib/common.tasks')
const { getDb } = require('../lib/db-postgres')

describe('Dashboard tests', () => {
  let user

  const dashboardRequest = async (accessToken) => {
    return fetch(`${process.env.API_HOST}/dashboard`, {
      headers: commonHeaders(accessToken),
    })
  }

  beforeAll(async () => {
    user = await signUpNewUser()
  })

  // Successfully get dashboard results.
  test('Successfully get dashboard results', async () => {
    let data, response
    const db = getDb()

    // Create new contact.
    await createNewContact(user.accessToken)
    // Create new task, it is overdue.
    const task1 = await createNewTask(user.accessToken)
    await db.none('UPDATE tasks SET due_date = \'1\' WHERE task_id = $1', [task1.task_id])

    // Create another task. This one should not have a due date.
    const task2 = await createNewTask(user.accessToken)
    await db.none('UPDATE tasks SET due_date = NULL WHERE task_id = $1', [task2.task_id])

    // Create another task. This one should not be overdue.
    const task3 = await createNewTask(user.accessToken)
    await db.none('UPDATE tasks SET due_date = \'9999999999999\' WHERE task_id = $1', [task3.task_id])

    // Should find both the contact and task.
    response = await dashboardRequest(user.accessToken)
    data = await response.json()
    expect(response.status).toBe(200)
    expect(data.data).toBeTruthy()

    // Expectation:
    // x1 contacts.
    // x3 tasks.
    // x1 overdue tasks.
    expect(data.data.contacts).toBe('1')
    expect(data.data.tasks).toBe('3')
    expect(data.data.tasks_overdue).toBe('1')
  })

  // Invalid token.
  test('Invalid access token', async () => {
    const accessTokens = ['', null, user.refreshToken]

    return Promise.all(accessTokens.map(async (accessToken) => {
      const response = await dashboardRequest(accessToken)
      const data = await response.json()
      expect(response.status).toBe(401)
      expect(data.message).toBe('Unauthorized.')
    }))
  })
})