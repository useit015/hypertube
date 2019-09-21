const passport = require('passport')
const express = require('express')
const router = express.Router()

router.get('/ft', passport.authenticate('42'))
router.get('/fb', passport.authenticate('facebook', { scope: ['email'] }))
router.get('/git', passport.authenticate('github'))
router.get('/li', passport.authenticate('linkedin'))
router.get('/tw', passport.authenticate('twitchtv'))
router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['http://www.googleapis.com/auth/userinfo.profile', 'http://www.googleapis.com/auth/userinfo.email']
	})
)

module.exports = router
