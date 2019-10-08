const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const FortyTwoStrategy = require('passport-42').Strategy
const GithubStrategy = require('passport-github').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy
const SpotifyStrategy = require('passport-spotify').Strategy;
const { randomBytes } = require('crypto')
const request = require('request')
const User = require('../models/User')

const findUser = async (data, done, type) => {
	try {
		let query = {}
		query[`${type}Id`] = data[`${type}Id`]
		const user = await User.findOne(query)
		if (!user) {
			const user = await User.findOne({ email: data.email })
			if (!user || !data.email) {
				new User(data).save().then(user => done(null, user)).catch()
			} else {
				user[`${type}Id`] = data[`${type}Id`]
				user.save().then(user => done(null, user)).catch()
			}
		} else {
			done(null, user)
		}
	} catch (err) {
		done(err, false)
	}
}

const generateUsername = async (firstName, lastName) => {
	let username = (firstName[0]+lastName).slice(0,8).toLowerCase();
	let user = await User.findOne({ username })
	let i = 1;
	while (user) {
		username = (firstName.substring(0,i)+lastName).slice(0,8).toLowerCase();
		user = await User.findOne({ username })
		i++;
	}
	return username
}

const checkUsername = async username => {
	let user = await User.findOne({ username })
	let i = 0;
	while (user) {
		username += i
		user = await User.findOne({ username })
		i++;
	}
	return username
}

module.exports = passport => {
	passport.serializeUser((user, done) => done(null, user.id))
	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user)
		})
	})
	const opts = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
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
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_OAUTH_ID,
				clientSecret: process.env.GOOGLE_OAUTH_PASS,
				callbackURL: `${process.env.API_URL}/oauth/googlered`
			},
			async (accessToken, refreshToken, profile, done) => {
				const userName = await generateUsername(profile.name.givenName, profile.name.familyName)
				const user = {
					firstName: profile.name.givenName,
					lastName: profile.name.familyName,
					image: profile.photos[0].value,
					username: userName,
					email: profile.emails[0].value,
					googleId: profile.id,
					verified: true
				}
				findUser(user, done, 'google')
			}
		)
	)
	passport.use(
		new GithubStrategy(
			{
				clientID: process.env.GIT_OAUTH_ID,
				clientSecret: process.env.GIT_OAUTH_PASS,
				callbackURL: `${process.env.API_URL}/oauth/git_ret`
			},
			async (accessToken, refreshToken, profile, done) => {
				const username = await checkUsername(profile.username)
				let user = {
					firstName: '',
					lastName: '',
					username,
					image: profile.photos[0].value,
					githubId: profile.id,
					verified: true
				}
				if (profile._json.email) user.email = profile._json.email
				findUser(user, done, 'github')
			}
		)
	)
	passport.use(
		new FortyTwoStrategy(
			{
				clientID: process.env.FT_OAUTH_ID,
				clientSecret: process.env.FT_OAUTH_PASS,
				callbackURL: `${process.env.API_URL}/oauth/ft_ret`
			},
			async (accessToken, refreshToken, profile, done) => {
				const username = await checkUsername(profile.username)
				const user = {
					firstName: profile.name.givenName,
					lastName: profile.name.familyName,
					username,
					image: profile.photos[0].value,
					email: profile.emails[0].value,
					ftId: profile.id,
					verified: true
				}
				findUser(user, done, 'ft')
			}
		)
	)
	passport.use(
		new FacebookStrategy(
			{
				clientID: process.env.FB_OAUTH_ID,
				clientSecret: process.env.FB_OAUTH_PASS,
				callbackURL: `${process.env.API_URL}/oauth/fb_ret`
			},
			async (accessToken, refreshToken, profile, done) => {
				const opts = {
					url: 'https://graph.facebook.com/v4.0/me?fields=id,email,first_name,last_name',
					headers: { Authorization: `Bearer ${accessToken}` }
				}
				request(opts, async (err, res) => {
					const profile = JSON.parse(res.body)
					const userName = await generateUsername(profile.first_name, profile.last_name)
					const user = {
						firstName: profile.first_name,
						lastName: profile.last_name,
						username: userName,
						image: `https://graph.facebook.com/${profile.id}/picture?width=300&height=300`,
						email: profile.email,
						fbId: profile.id,
						verified: true
					}
					findUser(user, done, 'fb')
				})
			}
		)
	)
	passport.use(
		new LinkedInStrategy(
			{
				clientID: process.env.LI_OAUTH_ID,
				clientSecret: process.env.LI_OAUTH_SECRET,
				callbackURL: `${process.env.API_URL}/oauth/li_ret`,
				scope: ['r_emailaddress', 'r_liteprofile']
			},
			async (token, tokenSecret, profile, done) => {
				const photos = profile.photos
				const userName = await generateUsername(profile.name.givenName, profile.name.familyName)
				const user = {
					firstName: profile.name.givenName,
					lastName: profile.name.familyName,
					username: userName,
					image: photos[photos.length - 1].value,
					email: profile.emails[0].value,
					liId: profile.id,
					verified: true
				}
				findUser(user, done, 'li')
			}
		)
	)
	passport.use(
		new SpotifyStrategy(
			{
				clientID: process.env.SP_CLIENT_ID,
				clientSecret: process.env.SP_CLIENT_SECRET,
				callbackURL: `${process.env.API_URL}/oauth/sp_ret`
			},
			async (accessToken, refreshToken, expires_in, profile, done) => {
				const username = await checkUsername(profile.displayName)
				const user = {
					firstName: '',
					lastName: '',
					username,
					image: profile.photos[0],
					email: profile._json.email,
					spId: profile.id,
					verified: true
				}
				findUser(user, done, 'sp')
			}
		)
	)
}
