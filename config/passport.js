const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const FortyTwoStrategy = require('passport-42').Strategy
const GithubStrategy = require('passport-github').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy
const request = require('request')
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
			callbackURL: `https://hypertube.tk/oauth/googlered`
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
			callbackURL: `https://hypertube.tk/oauth/git_ret`
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
			callbackURL: `https://hypertube.tk/oauth/ft_ret`
		}, (accessToken, refreshToken, profile, done) => {
			const user = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				username: profile.username,
				image: profile.photos[0].value,
				email: profile.emails[0].value,
				ftId: profile.id,
				verified: true
			}
			findUser(user, done, 'ft')
		})
	)
	passport.use(new FacebookStrategy({
		clientID: process.env.FB_OAUTH_ID,
		clientSecret: process.env.FB_OAUTH_PASS,
		callbackURL: "https://hypertube.tk/oauth/fb_ret"
	  }, (accessToken, refreshToken, profile, done) => {
		const opts = {
			url: 'https://graph.facebook.com/v4.0/me?fields=id,email,first_name,last_name',
			headers: { 'Authorization': `Bearer ${accessToken}` }
		}
		request(opts, (err, res) => {
			const profile = JSON.parse(res.body)
			const user = {
				firstName: profile.first_name,
				lastName: profile.last_name,
				username: profile.first_name+'_'+profile.last_name,
				image: `https://graph.facebook.com/${profile.id}/picture?width=300&height=300`,
				email: profile.email,
				fbId: profile.id,
				verified: true
			}
			findUser(user, done, 'fb')
		})
	})
	)
	passport.use(new LinkedInStrategy({
		clientID: process.env.LI_OAUTH_ID,
		clientSecret: process.env.LI_OAUTH_SECRET,
		callbackURL: "https://hypertube.tk/oauth/li_ret",
		scope: ['r_emailaddress', 'r_liteprofile']
	},
	function(token, tokenSecret, profile, done) {
		const photos = profile.photos
		const user = {
			  firstName: profile.name.givenName,
			  lastName: profile.name.familyName,
			  username: profile.name.givenName+'_'+profile.name.familyName,
			  image: photos[photos.length - 1].value,
			  email: profile.emails[0].value,
			  liId: profile.id,
			  verified: true
		}
		findUser(user, done, 'li')
	}
	))
}