const express = require('express')
// const multer = require('multer')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const { randomBytes } = require('crypto')
const User = require('../models/User')
const sendMail = require('../config/mailer')
const validator = require('../config/validator')
const router = express.Router()

const authJwt = passport.authenticate('jwt', { session: false })
// const upload = multer({ limits: { fileSize: 4 * 1024 * 1024 } })

const randomHex = () => randomBytes(10).toString('hex')

router.get('/user/:username'/*, authJwt*/, (req, res) => {
	User.find({username: req.params.username})
	.then(users => {
		response = {
			count:users.length,
			results:[]
		}
		users.forEach(user => {
			u = {
				id:user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				username: user.username,
				image: user.image,
			}
			response.results.push(u)
		})
		res.json(response)
	})
	.catch(err => res.json({count:0, error:`Error while searching for users : ${err}`}))
})

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
							if (match && user.verified) {
								res.json(user.addToken())
							} else if (!user.verified){
								res.status(400).json([ `User not verified` ])
							} else {
								res.status(400).json([ `Wrong password` ])
							}
						})
					} else {
						res.status(400).json([ `Email dosn't exist` ])
					}
				}).catch(err => console.log(err))
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
						const vkey = randomHex()
						new User({
							firstName,
							lastName,
							username,
							password,
							email,
							vkey
						}).save().then(user => {
							sendMail(email, vkey, 'verify')
							res.json(user.addToken())
						}).catch(err => console.log(err))
					}
				}).catch(err => console.log(err))
		} else {
			res.status(400).json(validator.getErrors(err))
		}
	})
})

router.post('/update', authJwt, (req, res) => {
	const { firstName, lastName, username, email } = req.body
	const user = req.user
	const data = { firstName, lastName, username, email }
	validator.update(data, err => {
		if (!err) {
			user.firstName = data.firstName
			user.lastName = data.lastName
			user.username = data.username
			user.email = data.email
			user.save()
				.then(user => res.json(user.addToken()))
				.catch(err => console.log(err))
		} else {
			res.status(400).json(validator.getErrors(err))
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
					res.status(400).json([ 'Already verified' ])
				}
			} else {
				res.status(400).json([ 'Invalid key' ])
			}
		}).catch(err => console.log(err))
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
					}).catch(err => console.log(err))
			} else {
				res.status(400).json([ `Email doens't exist` ])
			}
		}).catch(err => console.log(err))
})

router.get('/recover/:key', (req, res) => {
	const rkey = req.params.key
	User.findOne({ rkey })
		.then(user => {
			if (user) {
				res.json({ ...user.addToken(), rkey })
			} else {
				res.status(400).json([ 'Invalid key' ])
			}
		}).catch(err => console.log(err))
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
		res.status(400).json([ 'Invalid key' ])
	}
})

router.get('/google', passport.authenticate('google', {
	scope: [
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email'
	]
}))

router.get('/googlered', passport.authenticate('google'), (req, res) => {
	res.json(req.user.addToken())
})

router.get('/ft', passport.authenticate('42'))

router.get('/ft_ret', passport.authenticate('42'), (req, res) => {
	res.json(req.user.addToken())
})

router.get('/fb', passport.authenticate('facebook'))

router.get('/fb_ret', passport.authenticate('facebook'), (req, res) => {
	res.json(req.user.addToken())
})

router.get('/li', passport.authenticate('linkedin'))

router.get('/li_ret', passport.authenticate('linkedin'), (req, res) => {
	res.json(req.user.addToken())
})

router.get('/git', passport.authenticate('github'))

router.get('/git_ret', passport.authenticate('github'), (req, res) => {
	res.json(req.user.addToken())
})

module.exports = router