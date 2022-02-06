const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(morgan('tiny'))

app.use(express.json())

app.use(cors())

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

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    ${new Date()}
    `)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if(person)
        res.json(person)
    else
        res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
  
    res.status(204).end()
})

const generateId = () => Math.trunc(Math.random() * 1000000)

app.post('/api/persons/', (req, res) => {
    const body = req.body

    if(!body.name || !body.number){
        
        return res.status(400).json({
        error: 'name or number missing'
        })
    }
    
    if((persons.map(p => p.name)).includes(body.name)){
        return res.status(400).json({
            error:'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        date: new Date(),
        id: generateId()
    }

    persons = persons.concat(person)
    console.log(person)
    res.json(person)

    
//     const note = {
//         content: body.content,
//         important: body.important || false,
//         date: new Date(),
//         id: generateId(),
//     }
//     notes = notes.concat(note)
//     console.log(note)
//   res.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})