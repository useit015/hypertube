const passport = require('passport')
const express = require('express')
const router = express.Router()

router.get('/google', passport.authenticate('google', {
	scope: [
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email'
	]
}))

router.get('/googlered', passport.authenticate('google'), (err, req, res, next) => {
	if (err) return res.status(400).json({error:{name:err.name, message:err.message}})
}, (req, res) => {
	res.json(req.user.addToken())
})

router.get('/ft', passport.authenticate('42'))

router.get('/ft_ret', passport.authenticate('42'), (err, req, res, next) => {
	if (err) return res.status(400).json({error:{name:err.name, message:err.message}})
}, (req, res) => {
	res.json(req.user.addToken())
})

router.get('/fb', passport.authenticate('facebook'))

router.get('/fb_ret', passport.authenticate('facebook'), (err, req, res, next) => {
	if (err) return res.status(400).json({error:{name:err.name, message:err.message}})
}, (req, res) => {
	res.json(req.user.addToken())
})

router.get('/li', passport.authenticate('linkedin'))

router.get('/li_ret', passport.authenticate('linkedin'), (err, req, res, next) => {
	if (err) return res.status(400).json({error:{name:err.name, message:err.message}})
}, (req, res) => {
	res.json(req.user.addToken())
})

router.get('/git', passport.authenticate('github'))

router.get('/git_ret', passport.authenticate('github'), (err, req, res, next) => {
	if (err) return res.status(400).json({error:{name:err.name, message:err.message}})
}, (req, res) => {
	res.json(req.user.addToken())
})

module.exports = router