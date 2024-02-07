const { commonHeaders } = require('../../lib/common')
const { signUpNewUser } = require('../../lib/common.auth')
const { createNewContact } = require('../../lib/common.contacts')
const { getTaskObject, getTaskInDb } = require('../../lib/common.tasks')
const { randomUUID } = require('node:crypto')

describe('Add task tests', () => {
  let user, contact

  beforeAll(async () => {
    user = await signUpNewUser()
    contact = await createNewContact(user.accessToken)
  })

  const addTaskRequest = (accessToken, payload) => {
    return fetch(`${process.env.API_HOST}/task`, {
      method: 'POST',
      headers: commonHeaders(accessToken),
      body: JSON.stringify(payload),
    })
  }

  // Test: Successfully adds task.
  test('Successfully adds task - without contact.', async () => {
    let response, data, payload

    payload = getTaskObject()
    response = await addTaskRequest(user.accessToken, payload)
    data = await response.json()
    expect(response.status).toBe(201)
    expect(data.message).toBe('Task created.')
    expect(data.task_id).toBeTruthy()
  })

  // Test: Successfully adds task + contact.
  test('Successfully adds task - with contact.', async () => {
    let response, data, payload

    payload = getTaskObject(contact.contact_id)
    response = await addTaskRequest(user.accessToken, payload)
    data = await response.json()
    expect(response.status).toBe(201)
    expect(data.message).toBe('Task created.')
    expect(data.task_id).toBeTruthy()

    // Check the db.
    data = await getTaskInDb(data.task_id)
    expect(data.contact_id).toBe(contact.contact_id)
  })

  // Test: Incorrect access token.
  test('Incorrect access token', async () => {
    const accessTokens = ['', null, user.refreshToken]

    return Promise.all(accessTokens.map(async (accessToken) => {
      const response = await addTaskRequest(accessToken, getTaskObject())
      const data = await response.json()
      expect(response.status).toBe(401)
      expect(data.task_id).toBeFalsy()
      expect(data.message).toBe('Unauthorized.')
    }))
  })

  // Title is required.
  test('Title is required', async () => {
    const response = await addTaskRequest(user.accessToken, { ...getTaskObject(), title: '' })
    const data = await response.json()
    expect(response.status).toBe(400)
    expect(data.task_id).toBeFalsy()
    expect(data.message).toBe('Missing title.')
  })

  test('Invalid due date', async () => {
    const response = await addTaskRequest(user.accessToken, { ...getTaskObject(), due_date: 'invalid' })
    const data = await response.json()
    expect(response.status).toBe(400)
    expect(data.task_id).toBeFalsy()
    expect(data.message).toBe('Invalid due date.')
  })

  // Contact not found.
  test('Contact not found', async () => {
    const response = await addTaskRequest(user.accessToken, getTaskObject(randomUUID()))
    const data = await response.json()
    expect(response.status).toBe(404)
    expect(data.task_id).toBeFalsy()
    expect(data.message).toBe('Contact was not found and could not be associated with this new task.')

    const dbData = await getTaskInDb(data.task_id)
    expect(dbData).toBeFalsy()
  })

  // Must not set a contact that does not belong to the user.
  test('Must not set a contact that does not belong to the user', async () => {
    // New user.
    const newUser = await signUpNewUser()
    // New contact.
    const newContact = await createNewContact(newUser.accessToken)

    // Below, use old user with new contact.

    const response = await addTaskRequest(user.accessToken, getTaskObject(newContact.contact_id))
    const data = await response.json()
    expect(response.status).toBe(404)
    expect(data.task_id).toBeFalsy()
    expect(data.message).toBe('Contact was not found and could not be associated with this new task.')

    const dbData = await getTaskInDb(data.task_id)
    expect(dbData).toBeFalsy()
  })
})