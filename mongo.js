const mongoose = require('mongoose')


if (process.argv.length < 3){
    console.log('Please provide the password, name and number as an argumant: node mongo.js <password> name number')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = 
            `mongodb+srv://Abu:${password}@cluster0.ybvdl.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 5){

    const person = new Person({
        name,
        number,
        date: new Date()
    })
    
    person.save().then( result => {
        console.log(`added ${name} ${number} to phonebook`)
        mongoose.connection.close()
    })
}

if(process.argv.length === 3){
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}
