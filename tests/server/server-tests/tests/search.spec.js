const { commonHeaders, API_TEST_TOKEN, generateRandomString } = require('../lib/common')
const { signUpNewUser } = require('../lib/common.auth')
const { createNewContact } = require('../lib/common.contacts')
const { createNewTask } = require('../lib/common.tasks')

describe('Search tests', () => {
  let user

  const searchRequest = async (accessToken, q) => {
    return fetch(`${process.env.API_HOST}/search?q=${q}`, {
      headers: commonHeaders(accessToken),
    })
  }

  beforeAll(async () => {
    user = await signUpNewUser()
  })

  // Successfully get search results.
  test('Successfully get search results', async () => {
    let data, response

    // Create new contact.
    const contact = await createNewContact(user.accessToken)
    // Create new task.
    const task = await createNewTask(user.accessToken, contact.contact_id)

    // Should find both the contact and task.
    response = await searchRequest(user.accessToken, encodeURIComponent(API_TEST_TOKEN))
    data = await response.json()
    expect(response.status).toBe(200)
    expect(data.found).toBeTruthy()
    expect(data.found.length).toBe(2)
    expect(data.found.some(d => d.type === 'contact' && d.key === contact.contact_id)).toBe(true)
    expect(data.found.some(d => d.type === 'task' && d.key === task.task_id)).toBe(true)

    // Should find nothing.
    response = await searchRequest(user.accessToken, generateRandomString())
    data = await response.json()
    expect(response.status).toBe(200)
    expect(data.found).toBeTruthy()
    expect(data.found.length).toBe(0)
  })

  // Invalid token.
  test('Invalid access token', async () => {
    const accessTokens = ['', null, user.refreshToken]

    return Promise.all(accessTokens.map(async (accessToken) => {
      const response = await searchRequest(accessToken, encodeURIComponent(API_TEST_TOKEN))
      const data = await response.json()
      expect(response.status).toBe(401)
      expect(data.message).toBe('Unauthorized.')
    }))
  })
})