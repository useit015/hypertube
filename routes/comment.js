const express = require("express");
const mongoose = require('mongoose')
const router = express.Router();
const User = require('../models/User')
const Comment = require('../models/Comment')
const authJwt = require('../middleware/auth')

const format = (comment, username) => ({
  username,
  _id: comment._id,
  imdb: comment.commentImdb,
  body: comment.commentBody,
  user: comment.commentUser,
  date: comment.commentDate,
  children: []
})

const recursiveSearch = (arr, comment, users) => {
  for (const cur of arr) {
    if (cur._id.toString() == comment.commentParent.toString()) {
      cur.children.push(format(comment, users[comment.commentUser]))
      return true
    } else {
      if (cur.children.length) {
         if (recursiveSearch(cur.children, comment, users)) {
           return true
         }
      }
    }
  }
}

const formatComments = (imdb, comments, users) => {
  const finalcomments = []
  comments.forEach((comment, i) => {
    if (comment.commentImdb == imdb) {
      if (!comment.commentParent) {
        finalcomments.push(format(comment, users[comment.commentUser]))
      } else {
        recursiveSearch(finalcomments, comment, users)
      }
    } 
  })
  return finalcomments
}

const getUniqueUsers = (imdb, comments) => {
  const users = comments.map(comment => {
    if (comment.commentImdb == imdb) {
      return comment.commentUser.toString()
    } 
  })
  return [ ...new Set(users) ]
}

router.post('/', authJwt, async (req, res) => {
  try {
    const newComment = {
      commentImdb: req.body.commentImdb,
      commentBody: req.body.commentBody,
      commentParent: req.body.commentParent,
      commentUser: req.user.id
    };
    await new Comment(newComment).save((err, comment) => {
      if (err) return res.json({ err: true, errors: [err] })
      res.json({ comment })
    })
  } catch (err) {
    res.json({ err: true, errors: [err] })
  }
})

router.get('/:imdb', async (req, res) => {
  const { imdb } = req.params
  Comment.find({}, (err, comments) => {
      if (err) return res.json({ err: true, errors: [err] })
      const users = getUniqueUsers(imdb, comments)
      User.find({
        '_id': { $in: users.map(cur => mongoose.Types.ObjectId(cur)) }
      }, '_id username', (err, dbUsers) => {
        if (err) return res.json({ err: true, errors: [err] })
        const finalUsers = {}
        dbUsers.forEach(cur => finalUsers[cur._id] = cur.username)
        const finalcomments = formatComments(imdb, comments, finalUsers)
        res.json({ comments: finalcomments })
      })
  })
})

module.exports = router
