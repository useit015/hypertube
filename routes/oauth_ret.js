const passport = require('passport')
const express = require('express')
const router = express.Router()

const errorMiddleware = (err, req, res, next) => {
	if (err) return res.redirect('/')
}

const renderMiddleware = (req, res) => {
	const token = req.user.addToken().token
	res.render('redirect', { token })
}

router.get('/ft_ret', passport.authenticate('42'), errorMiddleware, renderMiddleware)
router.get('/git_ret', passport.authenticate('github'), errorMiddleware, renderMiddleware)
router.get('/li_ret', passport.authenticate('linkedin'), errorMiddleware, renderMiddleware)
router.get('/fb_ret', passport.authenticate('facebook'), errorMiddleware, renderMiddleware)
router.get('/sp_ret', passport.authenticate('spotify'), errorMiddleware, renderMiddleware)
router.get('/googlered', passport.authenticate('google'), errorMiddleware, renderMiddleware)

module.exports = router
