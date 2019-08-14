const passport = require('passport')
const express = require('express')
const router = express.Router()

const errorMiddleware = (err, req, res, next) => {
	if (err) return res.redirect('/')
}

const renderMiddleware = (req, res) => {
	res.render('redirect', { token: req.user.addToken().token })
}

router.get('/google', passport.authenticate('google', {
	scope: [
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email'
	]
}))

router.get('/googlered', passport.authenticate('google'), errorMiddleware, renderMiddleware)

router.get('/ft', passport.authenticate('42'))

router.get('/ft_ret', passport.authenticate('42'), errorMiddleware, renderMiddleware)

router.get('/fb', passport.authenticate('facebook', {scope:['email']}))

router.get('/fb_ret', passport.authenticate('facebook'), errorMiddleware, renderMiddleware)

router.get('/li', passport.authenticate('linkedin'))

router.get('/li_ret', passport.authenticate('linkedin'), errorMiddleware, renderMiddleware)

router.get('/git', passport.authenticate('github'))

router.get('/git_ret', passport.authenticate('github'), errorMiddleware, renderMiddleware)

module.exports = router
