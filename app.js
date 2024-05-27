import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'

import { corsMiddleware } from './middlewares/cors.js'
import { errorHandler } from './middlewares/errorHandler.js'
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

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(corsMiddleware())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :newPerson'))

app.get('/', (req, res) => {
  return res.send('<h1>Phonebook backend</h1>')
})

app.get('/info', (req, res, next) => {
  Person
    .find()
    .then(result => {
      return res.send(`
        <p>Phonebook has info for ${result.length} people</p>
        <p>${new Date()}</p>
      `)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => {
  Person
    .find()
    .then(person => {
      return res.json(person)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person === null) return res.status(404).send({ error: 'Contact not exists' })
      return res.json(person)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { body } = req

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name and number are required fields'
    })
  }

  if (typeof (body.name) !== 'string' || typeof (body.number) !== 'string') {
    return res.status(400).json({
      error: 'Name and number must be string characters'
    })
  }

  // TODO: ----- Show error if contact name already exists -----
  // if (Person.find({ name: body.name })) {
  //   return res.status(400).json({
  //     error: 'The contact name already exists'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(personSaved => {
      return res.json(personSaved)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person
    .findByIdAndDelete(req.params.id)
    .then(result => {
      if (result === null) return res.status(404).send({ error: 'Contact not exists' })
      return res.status(204).end()
    })
    .catch(error => next(error))
})

const unknowEndpoint = (req, res, next) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknowEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT ?? 3001

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
