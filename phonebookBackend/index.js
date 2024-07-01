require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/people')
const people = require('./models/people')

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const requestLogger = (request, response, next) => {
  console.log('Method: ', request.method)
  console.log('Path: ', request.path)
  console.log('Body: ', request.body)
  console.log('---')
  next()  
}

morgan.token('body', request => {
  return JSON.stringify(request.body)
})

app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
app.use(cors())

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/api/persons', (request, response) => {
    Person.find ({}).then(people => {
      response.json(people)
    })
})

app.get('/info', (request, response) => {
    response.send(
        `<p>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${Date()}</p>
        </p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
      Person.findById (request.params.id).then(people => {

        if(people === null){
          response.status(404).end()
        }else{
          response.json(people)
        }
    })
})

app.delete('/api/persons/:id', (request, response) =>{
  Person.findByIdAndDelete(request.params.id).then(people =>{
    response.status(204).end()
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === "" || body.number === "") {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  console.log('el nombre es...', body.name)

  Person.findOne({'name': body.name}).then(people =>{
    if(people === null){

        const people = new Person({
        name: body.name,
        number: body.number,
      })
    
        people.save().then(savedPeople => {
        response.json(savedPeople)
      })
    }else if(people.name === body.name){
            console.log(people.name)
            
            return response.status(400).json({
            error: 'name must be unique'
          })
    }
  })
})

app.put('/api/persons/:id', (request,response) => {
  const body = request.body
  const id = request.params.id

  Person.findByIdAndUpdate(request.params.id, request.body).then(people =>{
    people.save().then(updatePeople => {
      response.json(updatePeople)
    })
  })
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
