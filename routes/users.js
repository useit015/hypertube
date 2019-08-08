const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = require('../models/User')

router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/moot',
		failureRedirect: '/',
		failureFlash: true
	})(req, res, next)
})

router.get('/register', (req, res) => {
	res.send('register nigga')
})

router.post('/register', (req, res) => {
	const { username, email, password, confPassword} = req.body
	// ! Must validate input
	User.findOne({ email })
		.then(result => {
			if (result) {
				res.send('Email already exists')
			} else {
				const newUser = new User({ username, email, password })
				bcrypt.genSalt(10, (err, salt) => {
					if (err) throw err
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err
						newUser.password = hash
						newUser
							.save()
							.then(user => res.send('Success'))
							.catch(err => console.log(err))
					})
				})
			}
		})
		.catch(err => console.log(err))
})

module.exports = router