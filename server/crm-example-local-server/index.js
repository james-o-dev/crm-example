import 'dotenv/config'
import express from 'express'
import { PostgresDatabase } from './lib/db/db-postgres.js'
import { signIn, signUp } from './services/auth.js'
import { controllerHandler } from './lib/common.js'

const app = express()
const PORT = 3000
const HOST = 'localhost'

app.use(express.json())

// Health-check.
app.get('/', async (req, res) => res.status(200).json({ message: 'CRM Example API. For personal/demonstration/educational purposes only.' }))

// Auth routes

// Sign-up
app.post('/auth/sign-up', (req, res) => controllerHandler(req, res, signUp(req.body)))

// Sign-in
app.post('/auth/sign-in', (req, res) => controllerHandler(req, res, signIn(req.body)))

app.listen(PORT, () => {

  // Connect to the database on start-up.
  PostgresDatabase.getInstance().connect()

  console.log(`Server running at http://${HOST}:${PORT}/`)
})