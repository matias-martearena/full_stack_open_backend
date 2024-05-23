import mongoose from 'mongoose'

if (process.argv.length < 3) {
  console.log('Give passowrd as agument')
  process.exit(1)
}

// NOTE: Error
if (process.argv.length === 4 || process.argv.length > 5) {
  console.log('Error: Argument not valid')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://mongodbmatiasmartearena:${password}@cluster0.8u2jbh2.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// NOTE: Create a number
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result => {
    console.log(`Added ${result.name} ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}

// NOTE: Show all contacts
if (process.argv.length === 3) {
  Person.find().then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
