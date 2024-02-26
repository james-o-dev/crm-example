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
import { authAccessToken, authRefreshToken } from './middleware/auth.middleware.mjs'

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
app.get('/auth/authenticate', authAccessToken, (req, res) => controllerHandler(req, res, isAuthenticatedEndpoint()))

// Refresh access token.
app.get('/auth/refresh', authRefreshToken, (req, res) => controllerHandler(req, res, refreshAccessToken(req.user)))

// Change password.
app.put('/auth/change-password', authAccessToken, (req, res) => controllerHandler(req, res, changePasswordEndpoint(req.user, req.body)))

app.get('/auth/sign-out-everywhere', authAccessToken, (req, res) => controllerHandler(req, res, signOutEverywhereEndpoint(req.user)))

// Contacts routes.

// Get contacts.
app.get('/contacts', authAccessToken, (req, res) => controllerHandler(req, res, getContactsEndpoint(req.user, req.query)))

// Get single contact.
app.get('/contact', authAccessToken, (req, res) => controllerHandler(req, res, getContactEndpoint(req.user, req.query)))

// New contact.
app.post('/contact', authAccessToken, (req, res) => controllerHandler(req, res, newContactEndpoint(req.user, req.body)))

// Update contact.
app.put('/contact', authAccessToken, (req, res) => controllerHandler(req, res, updateContactEndpoint(req.user, req.body)))

// Archive/restore contact.
app.put('/contact/archived', authAccessToken, (req, res) => controllerHandler(req, res, updateContactArchiveStatusEndpoint(req.user, req.body)))

// User profile.

// Get username.
app.get('/user/username', authAccessToken, (req, res) => controllerHandler(req, res, getUsername(req.user)))

// Set username.
app.put('/user/username', authAccessToken, (req, res) => controllerHandler(req, res, setUsername(req.user, req.body)))

// Tasks.

// Get tasks.
app.get('/tasks', authAccessToken, (req, res) => controllerHandler(req, res, getTasksEndpoint(req.user, req.query)))

// Create new task.
app.post('/task', authAccessToken, (req, res) => controllerHandler(req, res, createTaskEndpoint(req.user, req.body)))

// Get a task.
app.get('/task', authAccessToken, (req, res) => controllerHandler(req, res, getTaskEndpoint(req.user, req.query)))

// Update task.
app.put('/task', authAccessToken, (req, res) => controllerHandler(req, res, updateTaskEndpoint(req.user, req.body)))

// Delete task.
app.delete('/task', authAccessToken, (req, res) => controllerHandler(req, res, deleteTaskEndpoint(req.user, req.query)))

// Search.

// Do search.
app.get('/search', authAccessToken, (req, res) => controllerHandler(req, res, searchEndpoint(req.user, req.query)))

// Dashboard / home.

// Get dashboard data.
app.get('/dashboard', authAccessToken, (req, res) => controllerHandler(req, res, dashboardDataEndpoint(req.user)))

// Import / export.

// Export contacts.
app.get('/export/contacts/json', authAccessToken, (req, res) => controllerHandler(req, res, exportContactsJsonEndpoint(req.user)))

// Import contacts.
app.post('/import/contacts/json', authAccessToken, (req, res) => controllerHandler(req, res, importContactsJsonEndpoint(req.user, req.body)))

// Notifications.

// Get notifications count.
app.get('/notifications/count', authAccessToken, (req, res) => controllerHandler(req, res, getNotificationsCountEndpoint(req.user)))

// Get notifications detail.
app.get('/notifications/detail', authAccessToken, (req, res) => controllerHandler(req, res, getNotificationsDetailEndpoint(req.user)))

// Cleanup test records.
app.get('/test/cleanup', (req, res) => controllerHandler(req, res, cleanupTestRecords()))

// Start the server
app.listen(PORT, () => {
  getDb() // Initially instantiate the database singleton class on start-up.
  console.log(`Server running at http://${HOST}:${PORT}/`)
})