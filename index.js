require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(morgan('tiny'))

app.use(express.static('build'))
app.use(express.json())

app.use(cors())


app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(persons => {
            res.json(persons)
        })
        .catch(error => next(error))
})

app.get('/info', (req, res) => {
    Person.find({})
        .then(persons => {
            res.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            ${new Date()}
            `)
        })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if(person) {
                res.json({
                    name: person.name,
                    number: person.number,
                    id: person.id
                })
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
    // const id = Number(req.params.id)
    // const person = persons.find(p => p.id === id)

    // if(person)
    //     res.json(person)
    // else
    //     res.status(404).end()
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
    // const id = Number(req.params.id)
    // persons = persons.filter(person => person.id !== id)
    // res.status(204).end()
})


app.post('/api/persons/', (req, res, next) => {
    const body = req.body

    if(!body.name || !body.number){
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
        date: new Date(),
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
        .then(updatePerson => {
            res.json(updatePerson)
        })
        .catch(error => next(error))
})

const errorHandller = (error, req, res, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if(error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    } else if(error.name === 'MongoServerError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

// This has to be the last loaded middelware
app.use(errorHandller)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})