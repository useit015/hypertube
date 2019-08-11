const express = require('express')
// const multer = require('multer')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const User = require('../models/User')
const validator = require('../config/validator')
const router = express.Router()

const authJwt = passport.authenticate('jwt', { session: false })
// const upload = multer({ limits: { fileSize: 4 * 1024 * 1024 } })

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

router.post('/register', /*upload.single('image'),*/ (req, res) => {
	const { firstName, lastName, username, email, password, confPassword } = req.body
	const data = { firstName, lastName, username, email, password, confPassword }
	validator.register(data, err => {
		if (!err) {
			User.findOne({ email })
				.then(user => {
					if (user) {
						res.status(400).json([ 'Email already exists' ])
					} else {
						new User({ firstName, lastName, username, email, password })
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

router.post('/update', authJwt, (req, res) => {
	const { firstName, lastName, username, email } = req.body
	const data = { firstName, lastName, username, email }
	validator.update(data, err => {
		if (!err) {
			req.user.firstName = data.firstName
			req.user.lastName = data.lastName
			req.user.username = data.username
			req.user.email = data.email
			req.user
				.save()
				.then(user => res.json(addToken(user._doc)))
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
	res.json(addToken(req.user._doc))
})

router.get('/ft', passport.authenticate('42'))

router.get('/ft_ret', passport.authenticate('42'), (req, res) => {
	res.json(addToken(req.user._doc))
})

router.get('/git', passport.authenticate('github'))

router.get('/git_ret', passport.authenticate('github'), (req, res) => {
	res.json(addToken(req.user._doc))
})

module.exports = router