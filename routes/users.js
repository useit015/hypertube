const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const User = require('../models/User')
const validator = require('../config/validator')
const router = express.Router()

const addToken = user => {
	const opt = { expiresIn: 7200 }
	const payload = { id: user._id }
	delete user.password
	user.token = jwt.sign(payload, 'secret', opt)
	return user
}

router.post('/login', (req, res) => {
	const { email, password } = req.body
	const data = { email, password }
	validator.login(data, err => {
		if (!err) {
			User.findOne({ email })
				.then(user => {
					if (user) {
						user.cmpPassword(password, (err, match) => {
							if (err) throw err
							if (match) {
								res.json(addToken(user._doc))
							} else {
								res.status(400).json([ `Wrong password` ])
							}
						})
					} else {
						res.status(400).json([ `Email dosn't exist` ])
					}
				})
				.catch(err => console.log(err))
		} else {
			res.status(400).json(validator.getErrors(err))
		}
	})
})

router.post('/register', (req, res) => {
	const { username, email, password, confPassword} = req.body
	const data = { username, email, password, confPassword }
	validator.register(data, err => {
		if (!err) {
			User.findOne({ email })
				.then(user => {
					if (user) {
						res.status(400).json([ 'Email already exists' ])
					} else {
						new User({ username, email, password })
							.save()
							.then(user => res.json(addToken(user._doc)))
							.catch(err => console.log(err))
					}
				})
				.catch(err => console.log(err))
		} else {
			res.status(400).json(validator.getErrors(err))
		}
	})
})

router.get('/google', passport.authenticate('google', {
	scope: [
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email'
	]
}))

router.get('/googlered', passport.authenticate('google'), (req, res) => {
	res.json(req.user)
})

module.exports = router