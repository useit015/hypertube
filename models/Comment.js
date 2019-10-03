const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
  commentImdb: {
    type: String,
    required: true
  },
  commentBody: {
    type: String,
    required: true
  },
  commentDate: {
    type: Date,
    default: Date.now
  },
  commentParent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comments"
  },
  commentUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  }
});

module.exports = mongoose.model('Comment', CommentSchema)