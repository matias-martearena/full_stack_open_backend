import express from 'express'
import fs from 'node:fs'

const app = express()
const persons = JSON.parse(fs.readFileSync('./data.json', 'utf-8'))

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Phonebook backend</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
