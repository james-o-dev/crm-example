// import { changePasswordEndpoint, isAuthenticatedEndpoint, refreshAccessToken, signInEndpoint, signOutEverywhereEndpoint, signUpEndpoint } from './services/auth.js'
// import { getContactEndpoint, getContactsEndpoint, newContactEndpoint, updateContactArchiveStatusEndpoint, updateContactEndpoint } from './services/contacts.js'
// import { getUsername, setUsername } from './services/user-profile.js'
// import { createTaskEndpoint, deleteTaskEndpoint, getTaskEndpoint, getTasksEndpoint, updateTaskEndpoint } from './services/tasks.js'
// import { searchEndpoint } from './services/search.js'
// import { dashboardDataEndpoint } from './services/dashboard.js'
// import { exportContactsJsonEndpoint, importContactsJsonEndpoint } from './services/import-export.js'
// import { getNotificationsCountEndpoint, getNotificationsDetailEndpoint } from './services/notifications.js'
// import { cleanupTestRecords } from './services/test.js'

import { successfulResponse, validationErrorResponse } from './lib/common.mjs'
import { signInEndpoint, signUpEndpoint } from './services/auth.mjs'

export const handler = async (event) => {

  // Get attributes of the request.
  const reqBody = JSON.parse(event.body || null)
  const reqMethod = event.httpMethod || event.requestContext.http.method
  const reqPath = event.requestContext.resourcePath || event.requestContext.http.path
  const reqPathParameters = event.pathParameters // Note: Only available when using API Gateway.
  const reqQueryStringParameters = event.queryStringParameters
  const reqHeaders = event.headers
  const reqOrigin = reqHeaders.origin || reqHeaders.Origin

  // Console log attributes.
  console.log({
    // reqBody, // Do not log the body, for privacy purposes.
    reqMethod,
    reqPath,
    reqPathParameters,
    reqQueryStringParameters,
    reqHeaders,
  })

  // By default, the API is not found or implemented.
  let response = validationErrorResponse({ message: 'API endpoint not found' }, 404)

  try {
    if (reqPath === '/' && reqMethod === 'GET') response = successfulResponse({ message: 'CRM Example API. For personal/demonstration/educational purposes only.' })

    // Auth routes.

    // Sign-up.
    if (reqPath === '/auth/sign-up' && reqMethod === 'POST') response = await signUpEndpoint(reqBody)

    // Sign-in.
    if (reqPath === '/auth/sign-in' && reqMethod === 'POST') response = await signInEndpoint(reqBody)

    // // Authenticate.
    // app.get('/auth/authenticate', (req, res) => controllerHandler(req, res, isAuthenticatedEndpoint(req.headers)))

    // // Refresh access token.
    // app.get('/auth/refresh', (req, res) => controllerHandler(req, res, refreshAccessToken(req.headers)))

    // // Change password.
    // app.put('/auth/change-password', (req, res) => controllerHandler(req, res, changePasswordEndpoint(req.headers, req.body)))

    // app.get('/auth/sign-out-everywhere', (req, res) => controllerHandler(req, res, signOutEverywhereEndpoint(req.headers)))

    // // Contacts routes.

    // // Get contacts.
    // app.get('/contacts', (req, res) => controllerHandler(req, res, getContactsEndpoint(req.headers, req.query)))

    // // Get single contact.
    // app.get('/contact', (req, res) => controllerHandler(req, res, getContactEndpoint(req.headers, req.query)))

    // // New contact.
    // app.post('/contact', (req, res) => controllerHandler(req, res, newContactEndpoint(req.headers, req.body)))

    // // Update contact.
    // app.put('/contact', (req, res) => controllerHandler(req, res, updateContactEndpoint(req.headers, req.body)))

    // // Archive/restore contact.
    // app.put('/contact/archived', (req, res) => controllerHandler(req, res, updateContactArchiveStatusEndpoint(req.headers, req.body)))

    // // User profile.

    // // Get username.
    // app.get('/user/username', (req, res) => controllerHandler(req, res, getUsername(req.headers)))

    // // Set username.
    // app.put('/user/username', (req, res) => controllerHandler(req, res, setUsername(req.headers, req.body)))

    // // Tasks.

    // // Get tasks.
    // app.get('/tasks', (req, res) => controllerHandler(req, res, getTasksEndpoint(req.headers, req.query)))

    // // Create new task.
    // app.post('/task', (req, res) => controllerHandler(req, res, createTaskEndpoint(req.headers, req.body)))

    // // Get a task.
    // app.get('/task', (req, res) => controllerHandler(req, res, getTaskEndpoint(req.headers, req.query)))

    // // Update task.
    // app.put('/task', (req, res) => controllerHandler(req, res, updateTaskEndpoint(req.headers, req.body)))

    // // Delete task.
    // app.delete('/task', (req, res) => controllerHandler(req, res, deleteTaskEndpoint(req.headers, req.query)))

    // // Search.

    // // Do search.
    // app.get('/search', (req, res) => controllerHandler(req, res, searchEndpoint(req.headers, req.query)))

    // // Dashboard / home.

    // // Get dashboard data.
    // app.get('/dashboard', (req, res) => controllerHandler(req, res, dashboardDataEndpoint(req.headers)))

    // // Import / export.

    // // Export contacts.
    // app.get('/export/contacts/json', (req, res) => controllerHandler(req, res, exportContactsJsonEndpoint(req.headers)))

    // // Import contacts.
    // app.post('/import/contacts/json', (req, res) => controllerHandler(req, res, importContactsJsonEndpoint(req.headers, req.body)))

    // // Notifications.

    // // Get notifications count.
    // app.get('/notifications/count', (req, res) => controllerHandler(req, res, getNotificationsCountEndpoint(req.headers)))

    // // Get notifications detail.
    // app.get('/notifications/detail', (req, res) => controllerHandler(req, res, getNotificationsDetailEndpoint(req.headers)))

    // // Cleanup test records.
    // app.get('/test/cleanup', (req, res) => controllerHandler(req, res, cleanupTestRecords()))
  } catch (error) {
    if (error.validation) {
      response = error
    } else {
      console.error(error)
      response = validationErrorResponse({ message: 'Server Error.' }, 500) // 500 Internal Server Error.
    }
  }

  return {
    statusCode: response.statusCode,
    body: JSON.stringify({
      ...response,
      statusCode: undefined, // Remove these from the response body.
      validation: undefined, // Remove these from the response body.
    }),
  }
}