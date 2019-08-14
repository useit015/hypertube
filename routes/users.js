const express = require('express')
// const multer = require('multer')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const { randomBytes } = require('crypto')
const User = require('../models/User')
const sendMail = require('../config/mailer')
const validator = require('../config/validator')
const router = express.Router()

const authJwt = (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, user, info) => {
		if (!user) return res.json({ err: true, errors: ['Not logged in']})
		req.user = user
		next()
	})(req, res, next)
}
// const upload = multer({ limits: { fileSize: 4 * 1024 * 1024 } })

const randomHex = () => randomBytes(10).toString('hex')

router.get('/user/:username' /*, authJwt*/, (req, res) => {
	User.find({ username: req.params.username })
		.then(users => {
			response = {
				count: users.length,
				results: []
			}
			users.forEach(user => {
				u = {
					id: user._id,
					firstName: user.firstName,
					lastName: user.lastName,
					username: user.username,
					image: user.image
				}
				response.results.push(u)
			})
			res.json(response)
		})
		.catch(err => res.json({ count: 0, error: `Error while searching for users : ${err}` }))
})

router.post('/login', (req, res) => {
	const { username, password } = req.body
	const data = { username, password }
	validator.login(data, err => {
		if (!err) {
			User.findOne({ username })
				.then(user => {
					if (user) {
						user.cmpPassword(password, (err, match) => {
							if (err) throw err
							if (match && user.verified) {
								res.json(user.addToken())
							} else if (!user.verified) {
								res.json({ err: true, errors: [`User not verified`] })
							} else {
								res.json({ err: true, errors: [`Wrong password`] })
							}
						})
					} else {
						res.json({ err: true, errors: [`Username dosn't exist`] })
					}
				})
				.catch(err => console.log(err))
		} else {
			res.json({ err: true, errors: validator.getErrors(err) })
		}
	})
})

router.post(
	'/register',
	/*upload.single('image'),*/ (req, res) => {
		const { firstName, lastName, username, email, password, confPassword } = req.body
		const data = { firstName, lastName, username, email, password, confPassword }
		validator.register(data, err => {
			if (!err) {
				User.findOne({ $or: [{ email: email }, { username: username }] })
					.then(user => {
						if (user) {
							if (user.email == email && user.username != username)
								res.json({ err: true, errors: ['Email already exists'] })
							else if (user.username == username && user.email != email)
								res.json({ err: true, errors: ['Username already exists'] })
							else res.json({ err: true, errors: ['User already exists'] })
						} else {
							const vkey = randomHex()
							new User({
								firstName,
								lastName,
								username,
								password,
								email,
								vkey
							})
								.save()
								.then(user => {
									sendMail(email, vkey, 'verify')
									res.json(user.addToken())
								})
								.catch(err => console.log(err))
						}
					})
					.catch(err => console.log(err))
			} else {
				res.json({ err: true, errors: validator.getErrors(err) })
			}
		})
	}
)

router.get('/isloggedin', authJwt, (req, res) => {
	res.json(req.user.addToken())
})

router.post('/update', authJwt, (req, res) => {
	const { firstName, lastName, username, email, langue } = req.body
	const user = req.user
	const data = { firstName, lastName, username, email, langue }
	validator.update(data, err => {
		if (!err) {
			user.firstName = data.firstName
			user.lastName = data.lastName
			user.username = data.username
			user.email = data.email
			user.langue = data.langue
			user.save()
				.then(user => res.json(user.addToken()))
				.catch(err => console.log(err))
		} else {
			res.json({ err: true, errors: validator.getErrors(err) })
		}
	})
})

router.get('/verify/:key', (req, res) => {
	User.findOne({ vkey: req.params.key })
		.then(user => {
			if (user) {
				if (!user.verified) {
					user.verified = true
					user.vkey = undefined
					user.save()
						.then(user => res.json(user.addToken()))
						.catch(err => console.log(err))
				} else {
					res.json({ err: true, errors: ['Already verified'] })
				}
			} else {
				res.json({ err: true, errors: ['Invalid key'] })
			}
		})
		.catch(err => console.log(err))
})

router.post('/forgot', (req, res) => {
	const { email } = req.body
	User.findOne({ email })
		.then(user => {
			if (user) {
				user.rkey = randomHex()
				user.save()
					.then(user => {
						sendMail(email, user.rkey, 'recover')
						res.json({ ok: true })
					})
					.catch(err => console.log(err))
			} else {
				res.json({ err: true, errors: [`Email doens't exist`] })
			}
		})
		.catch(err => console.log(err))
})

router.get('/recover/:key', (req, res) => {
	const rkey = req.params.key
	User.findOne({ rkey })
		.then(user => {
			if (user) {
				res.json({ ...user.addToken(), rkey })
			} else {
				res.json({ err: true, errors: ['Invalid key'] })
			}
		})
		.catch(err => console.log(err))
})

router.post('/recovery_check', authJwt, (req, res) => {
	const key = req.params.key
	const { user } = req
	if (user.key == key) {
		user.key = undefined
		user.save()
			.then(user => res.json({ ok: true }))
			.catch(err => console.log(err))
	} else {
		res.json({ err: true, errors: ['Invalid key'] })
	}
})

module.exports = router
