import { successfulResponse, validationErrorResponse } from './lib/common.mjs'
import { changePasswordEndpoint, isAuthenticatedEndpoint, refreshAccessToken, signInEndpoint, signOutEverywhereEndpoint, signUpEndpoint } from './services/auth.mjs'
import { getContactEndpoint, getContactsEndpoint, newContactEndpoint, updateContactArchiveStatusEndpoint, updateContactEndpoint } from './services/contacts.mjs'
import { dashboardDataEndpoint } from './services/dashboard.mjs'
import { exportContactsJsonEndpoint, importContactsJsonEndpoint } from './services/import-export.mjs'
import { getNotificationsCountEndpoint, getNotificationsDetailEndpoint } from './services/notifications.mjs'
import { searchEndpoint } from './services/search.mjs'
import { createTaskEndpoint, deleteTaskEndpoint, getTaskEndpoint, getTasksEndpoint, updateTaskEndpoint } from './services/tasks.mjs'
import { cleanupTestRecords } from './services/test.mjs'
import { getUsername, setUsername } from './services/user-profile.mjs'

/**
 * Main function handler.
 *
 * @param {*} event
 */
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
    // 'Health check' / introduction route.
    if (reqPath === '/' && reqMethod === 'GET') response = successfulResponse({ message: 'CRM Example API. For personal/demonstration/educational purposes only.' })

    // Auth routes.

    // Sign-up.
    if (reqPath === '/auth/sign-up' && reqMethod === 'POST') response = await signUpEndpoint(reqBody)

    // Sign-in.
    if (reqPath === '/auth/sign-in' && reqMethod === 'POST') response = await signInEndpoint(reqBody)

    // Authenticate.
    if (reqPath === '/auth/authenticate' && reqMethod === 'GET') response = await isAuthenticatedEndpoint(reqHeaders)

    // Refresh access token.
    if (reqPath === '/auth/refresh' && reqMethod === 'GET') response = await refreshAccessToken(reqHeaders)

    // Change password.
    if (reqPath === '/auth/change-password' && reqMethod === 'PUT') response = await changePasswordEndpoint(reqHeaders, reqBody)

    // Sign out everywhere.
    if (reqPath === '/auth/sign-out-everywhere' && reqMethod === 'GET') response = await signOutEverywhereEndpoint(reqHeaders)

    // Contacts routes.

    // Get contacts.
    if (reqPath === '/contacts' && reqMethod === 'GET') response = await getContactsEndpoint(reqHeaders, reqQueryStringParameters)

    // Get single contact.
    if (reqPath === '/contact' && reqMethod === 'GET') response = await getContactEndpoint(reqHeaders, reqQueryStringParameters)

    // New contact.
    if (reqPath === '/contact' && reqMethod === 'POST') response = await newContactEndpoint(reqHeaders, reqBody)

    // // Update contact.
    if (reqPath === '/contact' && reqMethod === 'PUT') response = await updateContactEndpoint(reqHeaders, reqBody)

    // Archive/restore contact.
    if (reqPath === '/contact/archived' && reqMethod === 'PUT') response = await updateContactArchiveStatusEndpoint(reqHeaders, reqBody)

    // User profile.

    // Get username.
    if (reqPath === '/user/username' && reqMethod === 'GET') response = await getUsername(reqHeaders)

    // Set username.
    if (reqPath === '/user/username' && reqMethod === 'PUT') response = await setUsername(reqHeaders, reqBody)

    // Tasks.

    // Get tasks.
    if (reqPath === '/tasks' && reqMethod === 'GET') response = await getTasksEndpoint(reqHeaders, reqQueryStringParameters)

    // Create new task.
    if (reqPath === '/task' && reqMethod === 'POST') response = await createTaskEndpoint(reqHeaders, reqBody)

    // Get a task.
    if (reqPath === '/task' && reqMethod === 'GET') response = await getTaskEndpoint(reqHeaders, reqQueryStringParameters)

    // Update task.
    if (reqPath === '/task' && reqMethod === 'PUT') response = await updateTaskEndpoint(reqHeaders, reqBody)

    // Delete task.
    if (reqPath === '/task' && reqMethod === 'DELETE') response = await deleteTaskEndpoint(reqHeaders, reqQueryStringParameters)

    // Search.

    // Do search.
    if (reqPath === '/search' && reqMethod === 'GET') response = await searchEndpoint(reqHeaders, reqQueryStringParameters)

    // Dashboard / home.

    // Get dashboard data.
    if (reqPath === '/dashboard' && reqMethod === 'GET') response = await dashboardDataEndpoint(reqHeaders)

    // Import / export.

    // Export contacts.
    if (reqPath === '/export/contacts/json' && reqMethod === 'GET') response = await exportContactsJsonEndpoint(reqHeaders)

    // Import contacts.
    if (reqPath === '/import/contacts/json' && reqMethod === 'POST') response = await importContactsJsonEndpoint(reqHeaders, reqBody)

    // Notifications.

    // Get notifications count.
    if (reqPath === '/notifications/count' && reqMethod === 'GET') response = await getNotificationsCountEndpoint(reqHeaders)

    // Get notifications detail.
    if (reqPath === '/notifications/detail' && reqMethod === 'GET') response = await getNotificationsDetailEndpoint(reqHeaders)

    // Cleanup test records.
    if (reqPath === '/test/cleanup' && reqMethod === 'GET') response = await cleanupTestRecords()

  } catch (error) {
    if (error.validation) {
      response = error
    } else {
      console.error(error)
      response = validationErrorResponse({ message: 'Server Error.' }, 500) // 500 Internal Server Error.
    }
  }

  // Lambda response.
  return {
    statusCode: response.statusCode,
    body: JSON.stringify({
      ...response,
      statusCode: undefined, // Remove these from the response body.
      validation: undefined, // Remove these from the response body.
    }),
    headers: {
      'Content-Type': 'application/json',
      // Note: Configure CORS in the Lambda settings.
      // 'Access-Control-Allow-Origin': allowedOrigins.has(origin) ? origin : '',
      // 'Access-Control-Allow-Origin': reqOrigin,
      // 'Access-Control-Allow-Credentials': true,
    }
  }
}