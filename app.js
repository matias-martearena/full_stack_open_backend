import fs from 'node:fs'
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'

import { corsMiddleware } from './middlewares/cors.js'
import Person from './modules/person.js'

dotenv.config()

morgan.token('newPerson', (req) => {
  const { name, number } = req.body

  if (name || number) {
    return JSON.stringify({ name, number })
  } else {
    return ' '
  }
})

let persons = JSON.parse(fs.readFileSync('./database/data.json', 'utf-8'))

const app = express()

app.use(express.json())
app.use(corsMiddleware())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :newPerson'))

app.get('/', (req, res) => {
  res.send('<h1>Phonebook backend</h1>')
})

app.get('/info', (req, res) => {
  res.send(`
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>
  `)
})

app.get('/api/persons', (req, res) => {
  Person
    .find()
    .then(person => {
      res.json(person)
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      res.json(person)
    })
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
