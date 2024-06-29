const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

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
    response.json(persons)
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
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {

  let min = 20
  let max = 5000

  let maxId = Math.floor(Math.random()*(max-min+1)+min)

  return maxId
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  if(persons.find(person => person.name === body.name)){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.put('/api/persons/:id', (request,response) => {
  const id = Number(request.params.id)
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
    id: id
  }

  persons = persons.filter(person => person.id !== id)

  console.log(persons)
  console.log(id)

  persons = persons.concat(person)

  console.log(persons)

  response.json(person)

})



app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
