const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

if(process.env.NODE_ENV !== 'prod') {
  const dotenv = require('dotenv').config()
}

const url = `mongodb://${process.env.USERNAME}:${process.env.PASSWORD}@ds255463.mlab.com:55463/fullstack-persons`
mongoose.connect(url)

const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('content', function getContent(req, res) {
  const content = JSON.stringify(req.body)
  return content
});
app.use(
  morgan(':method :url :status :content :res[content-length] - :response-time ms')
  )

// let persons = [
//     {
//         "name": "Arto Hellas",
//         "number": "040-123456",
//         "id": 1
//       },
//       {
//         "name": "Martti Tienari",
//         "number": "040-123456",
//         "id": 2
//       },
//       {
//         "name": "Arto Järvinen",
//         "number": "040-123456",
//         "id": 3
//       },
//       {
//         "name": "Lea Kutvonen",
//         "number": "040-123456",
//         "id": 4
//       }
// ]

app.get('/info', (req, res) => {
    const date = Date()
    const structure = '<div>puhelinluettelossa on '+persons.length+' henkilön tiedot</div><p>'+date+'</p>'
    res.send(structure)
})
  
app.get('/api/persons', (req, res) => {
    Person
      .find({})
      .then(persons => {
        res.json(persons.map(Person.format))
      })
})

app.get('/api/persons/:id', (req, res) => {
    Person
      .findById(req.params.id)
      .then(person => {
        const formattedPerson = Person.format(person)
        console.log('haettu hlö', formattedPerson)
        res.json(formattedPerson)
      })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    Person
      .findById(request.params.id)
      .then(person => {
        response.json(person.format)
      })
  })

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)

    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ error: 'name or number missing' })
    }
    
    // const personNames = persons.map(person => person.name)

    // if (personNames.includes(body.name)) {
    //   return response.status(400).json({error: 'name must be unique'})
    // }

    const newPerson = new Person ({
        name: body.name,
        number: body.number
      })
  
    newPerson
      .save()
      .then(savedPerson => {
        response.json(Person.format(savedPerson))
      })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})