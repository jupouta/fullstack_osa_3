const mongoose = require('mongoose')

if (process.env.NODE_ENV === 'prod') {
    const dotenv = require('dotenv').config()
  }
  
const url = process.env.MONGODB_URI
console.log(url)

mongoose.connect(url)
//mongoose.Promise = global.Promise;

console.log(process.argv)

const Person = mongoose.model('Person', {
  name: String,
  number: String,
  id: Number
})

const argms = process.argv

if (argms[2] && argms[3]) {
    const person = new Person({
        name: argms[2],
        number: argms[3],
        id: Math.floor((Math.random() * 100) + 1)
      })
    
    person
      .save()
      .then(response => {
        console.log(`lisätään henkilö ${argms[2]} numero ${argms[3]} luetteloon`)
        mongoose.connection.close()
      })
} 

if (!(argms[2])) {
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
            console.log(person)
            })
        mongoose.connection.close()
  })
}

