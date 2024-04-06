require('dotenv').config()

const mongoose = require('mongoose')
const password = process.argv[2]

mongoose.set('strictQuery',false)
mongoose.connect(process.env.MONGODB_URL)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number
})


personSchema.set('toJSON', {
    transform: (document, dbObject) => {
        dbObject.id = dbObject._id.toString()
        delete dbObject._id
        delete dbObject.__v
    }
})


module.exports = mongoose.model('Person', personSchema)
