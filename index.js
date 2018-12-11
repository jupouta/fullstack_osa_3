const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())

morgan.token('content', function getContent(req, res) {
  const content = JSON.stringify(req.body)
  return content
});
app.use(
  morgan(':method :url :status :content :res[content-length] - :response-time ms')
  )

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
      },
      {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
      },
      {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
      }
]

app.get('/info', (req, res) => {
    const date = Date()
    const structure = '<div>puhelinluettelossa on '+persons.length+' henkilön tiedot</div><p>'+date+'</p>'
    res.send(structure)
})
  
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)
    console.log(person)
    
    if ( person ) {
        res.json(person)
      } else {
        res.status(404).end()
      }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ error: 'name or number missing' })
    }
    
    const personNames = persons.map(person => person.name)
    console.log(personNames)
    if (personNames.includes(body.name)) {
      return response.status(400).json({error: 'name must be unique'})
    }

    const newPerson = {
      name: body.name,
      number: body.number,
      id: Math.floor((Math.random() * 100) + 1)
    }

    console.log(newPerson)

    persons = persons.concat(newPerson)

    response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})