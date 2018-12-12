const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'prod') {
    const dotenv = require('dotenv').config()
  }
  
const url = `mongodb://${process.env.USERNAME}:${process.env.PASSWORD}@ds255463.mlab.com:55463/fullstack-persons`
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