require('dotenv').config();

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URL);

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },

  number: {
    type: String,
    minlength: 8,
    validate: {
      validator(v) {
        return (/^[0-9][0-9][0-9]?-\d*$/).test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, 'User phone number required'],
  },
  id: Number,
});

personSchema.set('toJSON', {
  transform: (document, dbObject) => {
    dbObject.id = dbObject._id.toString();
    delete dbObject._id;
    delete dbObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
