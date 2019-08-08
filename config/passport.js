const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/User')

module.exports = passport => {
	passport.use(
		new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
			User.findOne({ email })
				.then(user => {
					if (user) {
						bcrypt.compare(password, user.password, (err, match) => {
							if (err) throw err
							if (match) {
								done(null, user)
							} else {
								done(null, false, { msg: 'Invalid password' })
							}
						})
					} else {
						done(null, false, { msg: `Email doesn't exist` })
					}
				}).catch(err => console.log(err))
		})
	)
	passport.serializeUser((user, done) => done(null, user.id))
	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user)
		})
	})
}