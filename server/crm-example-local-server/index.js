import express from 'express'

const app = express()
const PORT = 3000
const HOST = '127.0.0.1'

// Define routes
app.get('/', (req, res) => {
  res.send('Hello, this is the homepage!')
})

app.get('/about', (req, res) => {
  res.send('Welcome to the about page!')
})

app.get('/contact', (req, res) => {
  res.send('Contact us at example@example.com')
})

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`)
})