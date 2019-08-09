const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

module.exports = passport => {
	const PORT = process.env.PORT || 5000
	passport.serializeUser((user, done) => done(null, user.id))
	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user)
		})
	})
	const opts = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
		secretOrKey: 'secret'
	}
	passport.use(
		new JwtStrategy(opts, (jwt_payload, done) => {
			const id = jwt_payload._doc._id
			User.findById(id)
				.then(user => done(null, user ? user : false))
				.catch(err => done(err))
		})
	)
	passport.use(
		new GoogleStrategy({
			clientID: process.env.GOOGLE_OAUTH_ID,
			clientSecret: process.env.GOOGLE_OAUTH_PASS,
			callbackURL: `http://lvh.me:${PORT}/users/googlered`
		}, (accessToken, refreshToken, profile, done) => {
			const email = profile.emails[0].value
			console.log(profile)
			User.findOne({ email })
				.then(user => {
					if (!user) {
						const username = profile.displayName.replace(/ /g, '')
						const email = profile.emails[0].value
						new User({ username, email })
							.save()
							.then(user => done(null, user))
							.catch(err => console.log(err))
					} else {
						done(null, user)
					}
				}).catch(err => done(err, false))
		})
	)
}