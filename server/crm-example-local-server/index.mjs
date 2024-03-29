import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { getDb } from './lib/db/db-postgres.mjs'
import { changePasswordEndpoint, isAuthenticatedEndpoint, refreshAccessToken, signInEndpoint, signOutEverywhereEndpoint, signUpEndpoint } from './services/auth.mjs'
import { controllerHandler } from './lib/common.mjs'
import { getContactEndpoint, getContactsEndpoint, newContactEndpoint, updateContactArchiveStatusEndpoint, updateContactEndpoint } from './services/contacts.mjs'
import { getUsername, setUsername } from './services/user-profile.mjs'
import { createTaskEndpoint, deleteTaskEndpoint, getTaskEndpoint, getTasksEndpoint, updateTaskEndpoint } from './services/tasks.mjs'
import { searchEndpoint } from './services/search.mjs'
import { dashboardDataEndpoint } from './services/dashboard.mjs'
import { exportContactsJsonEndpoint, importContactsJsonEndpoint } from './services/import-export.mjs'
import { getNotificationsCountEndpoint, getNotificationsDetailEndpoint } from './services/notifications.mjs'
import { cleanupTestRecords } from './services/test.mjs'

const app = express()
const PORT = process.env.PORT || 3000
const HOST = 'localhost'

app.use(express.json())
app.use(cors())

// Health-check.
app.get('/', async (req, res) => res.status(200).json({ message: 'CRM Example API. For personal/demonstration/educational purposes only.' }))

// Auth routes.

// Sign-up.
app.post('/auth/sign-up', (req, res) => controllerHandler(req, res, signUpEndpoint(req.body)))

// Sign-in.
app.post('/auth/sign-in', (req, res) => controllerHandler(req, res, signInEndpoint(req.body)))

// Authenticate.
app.get('/auth/authenticate', (req, res) => controllerHandler(req, res, isAuthenticatedEndpoint(req.headers)))

// Refresh access token.
app.get('/auth/refresh', (req, res) => controllerHandler(req, res, refreshAccessToken(req.headers)))

// Change password.
app.put('/auth/change-password', (req, res) => controllerHandler(req, res, changePasswordEndpoint(req.headers, req.body)))

app.get('/auth/sign-out-everywhere', (req, res) => controllerHandler(req, res, signOutEverywhereEndpoint(req.headers)))

// Contacts routes.

// Get contacts.
app.get('/contacts', (req, res) => controllerHandler(req, res, getContactsEndpoint(req.headers, req.query)))

// Get single contact.
app.get('/contact', (req, res) => controllerHandler(req, res, getContactEndpoint(req.headers, req.query)))

// New contact.
app.post('/contact', (req, res) => controllerHandler(req, res, newContactEndpoint(req.headers, req.body)))

// Update contact.
app.put('/contact', (req, res) => controllerHandler(req, res, updateContactEndpoint(req.headers, req.body)))

// Archive/restore contact.
app.put('/contact/archived', (req, res) => controllerHandler(req, res, updateContactArchiveStatusEndpoint(req.headers, req.body)))

// User profile.

// Get username.
app.get('/user/username', (req, res) => controllerHandler(req, res, getUsername(req.headers)))

// Set username.
app.put('/user/username', (req, res) => controllerHandler(req, res, setUsername(req.headers, req.body)))

// Tasks.

// Get tasks.
app.get('/tasks', (req, res) => controllerHandler(req, res, getTasksEndpoint(req.headers, req.query)))

// Create new task.
app.post('/task', (req, res) => controllerHandler(req, res, createTaskEndpoint(req.headers, req.body)))

// Get a task.
app.get('/task', (req, res) => controllerHandler(req, res, getTaskEndpoint(req.headers, req.query)))

// Update task.
app.put('/task', (req, res) => controllerHandler(req, res, updateTaskEndpoint(req.headers, req.body)))

// Delete task.
app.delete('/task', (req, res) => controllerHandler(req, res, deleteTaskEndpoint(req.headers, req.query)))

// Search.

// Do search.
app.get('/search', (req, res) => controllerHandler(req, res, searchEndpoint(req.headers, req.query)))

// Dashboard / home.

// Get dashboard data.
app.get('/dashboard', (req, res) => controllerHandler(req, res, dashboardDataEndpoint(req.headers)))

// Import / export.

// Export contacts.
app.get('/export/contacts/json', (req, res) => controllerHandler(req, res, exportContactsJsonEndpoint(req.headers)))

// Import contacts.
app.post('/import/contacts/json', (req, res) => controllerHandler(req, res, importContactsJsonEndpoint(req.headers, req.body)))

// Notifications.

// Get notifications count.
app.get('/notifications/count', (req, res) => controllerHandler(req, res, getNotificationsCountEndpoint(req.headers)))

// Get notifications detail.
app.get('/notifications/detail', (req, res) => controllerHandler(req, res, getNotificationsDetailEndpoint(req.headers)))

// Cleanup test records.
app.get('/test/cleanup', (req, res) => controllerHandler(req, res, cleanupTestRecords()))

// Start the server
app.listen(PORT, () => {
  getDb() // Initially instantiate the database singleton class on start-up.
  console.log(`Server running at http://${HOST}:${PORT}/`)
})