import express from 'express'
import fs from 'node:fs'

const app = express()
let persons = JSON.parse(fs.readFileSync('./data.json', 'utf-8'))

app.use(express.json())

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
      error: 'content missing'
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
