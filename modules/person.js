import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch(error => {
    console.log('Error connecting to MongoDB:', error.message)
    process.exit(1)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /\d{2,3}-\d{7,8}/.test(v)
      },
      message: 'The entered number is invalid. The number must contain 9 to 11 characters, with the first two or three separated from the rest by a hyphen (-)'
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default mongoose.model('Person', personSchema)
