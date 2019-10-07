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
  },
  name: {
    type: String,
    default: ''
  },
  torrentID: {
    type: String,
    default: ''
  },
  downloaded: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Movie', MovieSchema)