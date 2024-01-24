import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { getDb } from './lib/db/db-postgres.js'
import { isAuthenticatedEndpoint, signInEndpoint, signUpEndpoint } from './services/auth.js'
import { controllerHandler } from './lib/common.js'
import { getContactEndpoint, getContactsEndpoint, newContactEndpoint, updateContactArchiveStatusEndpoint, updateContactEndpoint } from './services/contacts.js'
import { getUsername, setUsername } from './services/user-profile.js'

const app = express()
const PORT = 3000
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

app.listen(PORT, () => {
  // Initially instantiate the database singleton class on start-up.
  getDb()
  console.log(`Server running at http://${HOST}:${PORT}/`)
})