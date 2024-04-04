const express =  require("express")
const app = express()
var morgan = require('morgan')
const cors = require('cors')
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

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

let persons =  [
    {
        "id": 0,
        "name": "teswdwad",
        "number": "sssssssss"
      },
      {
        "name": "tete",
        "number": "dwdwdwdw",
        "id": 1
      }
]
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))




app.get('/api/persons/', (request, response) => {

    response.json(persons)

})

app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(p => p.id === Number(request.params.id))
    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})


app.get('/info', (request, response) => {

    const currentTime = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p> 
    <br/>
    <p>${currentTime}</p>  `)

})

app.post('/api/persons/', (request, response) => {
    const person = request.body
    const wasFound = persons.find(p => p.name === person.name)

    if(wasFound){
        response.status(406).send({error:"name must be unique"}).end()


    }else if(!(person.number ==="" || person.number===null
    || person.name ==="" || person.name===null)){
        const id = Math.random()*10000
        person.id = id
        persons = persons.concat(person)
        response.json(person).status(200).end()
    } else {
        response.status(400).end()
    }
    


})

app.delete('/api/persons/:id', (request, response) => {

    const person = persons.find(p => p.id === Number(request.params.id))
    persons = persons.filter(p => p.id !== Number(request.params.id))
    if(person){
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})


PORT = process.env.PORT || "3001"

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})