const passport = require('passport')

module.exports = (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, user, info) => {
		if (!user) return res.json({ err: true, errors: ['Not logged in']})
		req.user = user
		next()
	})(req, res, next)
}
