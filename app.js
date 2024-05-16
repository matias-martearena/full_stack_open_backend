import express from 'express'
import fs from 'node:fs'
import morgan from 'morgan'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()
let persons = JSON.parse(fs.readFileSync('./database/data.json', 'utf-8'))

morgan.token('newPerson', (req) => {
  const { name, number } = req.body

  if (name || number) {
    return JSON.stringify({ name, number })
  } else {
    return ' '
  }
})

app.use(express.json())
app.use(corsMiddleware())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :newPerson'))

app.get('/', (req, res) => {
  res.send('<h1>Phonebook backend</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send(`
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>
  `)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  const person = persons.find(person => person.id === id)

  person ? res.send(person) : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
  } else {
    res.status(404).send('Person was not found')
  }
})

app.post('/api/persons', (req, res) => {
  const { body } = req

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name and number are required fields'
    })
  }

  if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({
      error: 'The contact name already exists'
    })
  }

  const newPerson = {
    id: Math.floor(Math.random() * (10000 - persons.length)),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)

  res.json(newPerson)
})

const PORT = process.env.PORT ?? 3001

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
