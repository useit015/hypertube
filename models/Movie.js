const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
  imdb: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  path: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Movie', MovieSchema)