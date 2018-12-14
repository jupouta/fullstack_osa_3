const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

if(process.env.NODE_ENV !== 'prod') {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI
mongoose.connect(url)

const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('content', function getContent(req, res) {
  const content = JSON.stringify(req.body)
  return content
})
app.use(
  morgan(':method :url :status :content :res[content-length] - :response-time ms'))

app.get('/info', (req, res) => {
  const date = Date()
  Person
    .find({})
    .then(persons => {
      const structure = '<div>puhelinluettelossa on '+persons.length+' henkilön tiedot</div><p>'+date+'</p>'
      res.send(structure)
    })
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
      if (person) {
        const formattedPerson = Person.format(person)
        res.json(formattedPerson)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(404).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(person => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const newPerson = new Person ({
    name: body.name,
    number: body.number
  })

  Person
    .find({ name: body.name })
    .then(result => {
      if (result.length > 0) {
        return response.status(404).json({ error: 'name must be unique' })
      } else {
        newPerson
          .save()
          .then(result => {
            console.log('here the new')
            response.json(Person.format({ name: result.name, number: result.number }))
          })
      }
    })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const newPerson = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, newPerson, { new: true } )
    .then(updatedPerson => {
      response.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})