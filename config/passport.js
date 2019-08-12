const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const FortyTwoStrategy = require('passport-42').Strategy
const GithubStrategy = require('passport-github').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

const findUser = async (data, done, type) => {
	try {
		let query = {}
		query[`${type}Id`] = data[`${type}Id`]
		const user = await User.findOne(query)
		if (!user) {
			const user = await User.findOne({ email: data.email})
			if (!user || !data.email) {
				new User(data).save()
					.then(user => done(null, user))
			} else {
				user[`${type}Id`] = data[`${type}Id`]
				user.save()
					.then(user => done(null, user))
			}
		} else {
			done(null, user)
		}
	} catch (err) {
		done(err, false)
	}
}

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
			const id = jwt_payload.id
			User.findById(id)
				.then(user => done(null, user ? user : false))
				.catch(err => done(err))
		})
	)
	passport.use(
		new GoogleStrategy({
			clientID: process.env.GOOGLE_OAUTH_ID,
			clientSecret: process.env.GOOGLE_OAUTH_PASS,
			callbackURL: `https://api.hypertube.tk/users/googlered`
		}, (accessToken, refreshToken, profile, done) => {
			const user = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				image: profile.photos[0].value,
				username: profile.displayName.replace(/ /g, ''),
				email: profile.emails[0].value,
				googleId: profile.id,
				verified: true
			}
			findUser(user, done,'google')
		})
	)
	passport.use(
		new GithubStrategy({
			clientID: process.env.GIT_OAUTH_ID,
			clientSecret: process.env.GIT_OAUTH_PASS,
			callbackURL: `https://api.hypertube.tk/users/git_ret`
		}, (accessToken, refreshToken, profile, done) => {
			const user = {
				firstName: '',
				lastName: '',
				username: profile.username,
				image: profile.photos[0].value,
				email: profile._json.email,
				githubId: profile.id,
				verified: true
			}
			if (profile.displayName) {
				const name = profile.displayName
									.split(' ')
									.filter(cur => cur.length)
				user.firstName = name[0]
				user.lastName = name.slice(1).join(' ')
			}
			findUser(user, done,'github')
		})
	)
	passport.use(
		new FortyTwoStrategy({
			clientID: process.env.FT_OAUTH_ID,
			clientSecret: process.env.FT_OAUTH_PASS,
			callbackURL: `https://api.hypertube.tk/users/ft_ret`
		}, (accessToken, refreshToken, profile, done) => {
			const user = {
				firstName: profile.name.familyName,
				lastName: profile.name.givenName,
				username: profile.username,
				image: profile.profileUrl,
				email: profile.emails[0].value,
				ftId: profile.id,
				verified: true
			}
			findUser(user, done, 'ft')
		})
	)
}