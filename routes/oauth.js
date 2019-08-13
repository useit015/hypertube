const passport = require('passport')
const express = require('express')
const router = express.Router()

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