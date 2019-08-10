const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const OAuth2Strategy = require('passport-oauth2').Strategy
const GithubStrategy = require('passport-github').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const request = require('request')
const User = require('../models/User')

const findUser = (data, done, type) => {
	let query = {}
	query[`${type}Id`] = data[`${type}Id`]
	User.findOne(query)
		.then(user => {
			if (!user) {
				User.findOne({ email: data.email})
					.then(user => {
						if (!user) {
							new User(data)
								.save()
								.then(user => done(null, user))
								.catch(err => console.log(err))
						} else {
							user[`${type}Id`] = data[`${type}Id`]
							user.save()
								.then(user => done(null, user))
								.catch(err => console.log(err))
						}
					}).catch(err => done(err, false))
			} else {
				done(null, user)
			}
		}).catch(err => done(err, false))
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
			callbackURL: `http://lvh.me:${PORT}/users/googlered`
		}, (accessToken, refreshToken, profile, done) => {
			const user = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				image: profile.photos[0].value,
				username: profile.displayName.replace(/ /g, ''),
				email: profile.emails[0].value,
				googleId: profile.id
			}
			findUser(user, done,'google')
		})
	)
	passport.use(
		new GithubStrategy({
			clientID: process.env.GIT_OAUTH_ID,
			clientSecret: process.env.GIT_OAUTH_PASS,
			callbackURL: `http://lvh.me:${PORT}/users/git_ret`
		}, (accessToken, refreshToken, profile, done) => {
			const name = profile.displayName.split(' ').filter(cur => cur.length)
			const user = {
				firstName: name[0],
				lastName: name.slice(1).join(' '),
				username: profile.username,
				image: profile.photos[0].value,
				email: profile._json.email,
				githubId: profile.id
			}
			findUser(user, done,'github')
		})
	)
	passport.use(
		new OAuth2Strategy({
			authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
			tokenURL: 'https://api.intra.42.fr/oauth/token',
			clientID: process.env.FT_OAUTH_ID,
			clientSecret: process.env.FT_OAUTH_PASS,
			callbackURL: `http://lvh.me:${PORT}/users/ft_ret`
		}, (accessToken, refreshToken, profile, done) => {
			const opts = {
				url: 'https://api.intra.42.fr/v2/me',
				headers: { 'Authorization': `Bearer ${accessToken}` }
			}
			request(opts, (err, res) => {
				const profile = JSON.parse(res.body)
				const user = {
					firstName: profile.first_name,
					lastName: profile.last_name,
					username: profile.login,
					image: profile.image_url,
					email: profile.email,
					ftId: profile.id
				}
				findUser(user, done, 'ft')
			})
		})
	)
}