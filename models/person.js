const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'prod') {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI
mongoose.connect(url)


const PersonSchema = new mongoose.Schema({
  name: String,
  number: String
})

PersonSchema.statics.format = function(Person) {
  return {
    name: Person.name,
    number: Person.number,
    id: Person._id
  }
}

const Person = mongoose.model('Person', PersonSchema)

module.exports = Person