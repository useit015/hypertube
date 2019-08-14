const passport = require('passport')
const express = require('express')
const router = express.Router()

const oauthMiddleware = (err, req, res, next) => {
	if (err) return res.redirect('/')
}

router.get('/google', passport.authenticate('google', {
	scope: [
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email'
	]
}))

router.get('/googlered', passport.authenticate('google'), oauthMiddleware, (req, res) => {
	res.render('redirect', { token: req.user.addToken().token })
})

router.get('/ft', passport.authenticate('42'))

router.get('/ft_ret', passport.authenticate('42'), oauthMiddleware, (req, res) => {
	res.render('redirect', { token: req.user.addToken().token })
})

router.get('/fb', passport.authenticate('facebook', {scope:['email']}))

router.get('/fb_ret', passport.authenticate('facebook'), oauthMiddleware, (req, res) => {
	res.render('redirect', { token: req.user.addToken().token })
})

router.get('/li', passport.authenticate('linkedin'))

router.get('/li_ret', passport.authenticate('linkedin'), oauthMiddleware, (req, res) => {
	res.render('redirect', { token: req.user.addToken().token })
})

router.get('/git', passport.authenticate('github'))

router.get('/git_ret', passport.authenticate('github'), oauthMiddleware, (req, res) => {
	res.render('redirect', { token: req.user.addToken().token })
})

module.exports = router
