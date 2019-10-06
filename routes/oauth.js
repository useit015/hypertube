const passport = require('passport')
const express = require('express')
const router = express.Router()

router.get('/ft', passport.authenticate('42'))
router.get('/fb', passport.authenticate('facebook', {scope:['email']}))
router.get('/git', passport.authenticate('github'))
router.get('/li', passport.authenticate('linkedin'))
router.get('/sp', passport.authenticate('spotify',  {
	scope: ['user-read-email', 'user-read-private']
}))
router.get('/google', passport.authenticate('google', {
	scope: [
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email'
	]
}))

module.exports = router
