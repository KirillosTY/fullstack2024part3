const express =  require("express")
const app = express()
var morgan = require('morgan')
const cors = require('cors')
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
require('dotenv').config()
const personDB = require('./modules/person')
const person = require("./modules/person")

morgan.token('json',function get(req){
    return JSON.stringify(req.body)
})

app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.json(req,res)
    ].join(' ')
  }))



app.get('/api/persons/', (request, response) => {
    personDB.find({}).then(result => 
    response.json(result))

})

app.get('/api/persons/:id', (request, response,next) => {
    console.log(request.params.id)
    const person = personDB.findById(request.params.id)
    .then(personFound => {
        if(personFound){
            response.json(personFound)

        } else {    
            response.status(404).end()
        }
    }).catch(error =>{
       next(error)
    })

})


app.get('/info', (request, response) => {

    const currentTime = new Date()
    personDB.find({}).then(result => {
        response.send(`<p>Phonebook has info for ${result.length} people</p> 
        <br/>
        <p>${currentTime}</p>  `)
    })
  

})

app.post('/api/persons/', (request, response) => {
    const person = new personDB(request.body)
    const wasFound = false;
    if(wasFound){
        response.status(406).send({error:"name must be unique"}).end()


    }else if(!(person.number ==="" || person.number===null
    || person.name ==="" || person.name===null)){
        
        person.save().then(savedPerson => {
            response.json(savedPerson).status(200).end()
        })
           
    } else {
        response.status(400).end()
    }


})

app.put('/api/persons/:id', (request, response, next) => {
    const personToUpdate = request.body
    personDB.findByIdAndUpdate(request.params.id, personToUpdate, {new:true})
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => {
        next(error)
    })

})

app.delete('/api/persons/:id', (request, response, next) => {
 

    personDB.findByIdAndDelete(request.params.id).then(deletedPerson => {
        if(deletedPerson){
            response.status(204).end()
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
    
})


const errorHandler = (error, request, response, next) => {

    console.log(error.message)
    if(error.name === 'CastError'){
        return response.status(400).send({error: 'false Id'})
    }
    
    next(error)
}

app.use(errorHandler)


PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})