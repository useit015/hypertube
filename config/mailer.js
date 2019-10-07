const ejs = require('ejs')
const { readFile } = require('fs')
const { promisify } = require('util')
const nodemailer = require('nodemailer')
const readFileAsync = promisify(readFile)
const { resolve, dirname } = require('path')

const sendMail = async (to, key, type) => {
	try {
		const path = resolve(dirname(__dirname), 'views', 'mail.ejs')
		const raw = await readFileAsync(path, 'utf8')
		const data = {
			title: type == 'verify' ? 'Verify email' : 'Recover password',
			body: `Please click the button to ${type == 'verify' ? 'verify your email' : 'recover your password'}`,
			action: type == 'verify' ? 'Verify' : 'Recover',
			url: `https://hypertube.tk/api/users/${type}/${key}`
		}
		const html = ejs.render(raw, data)
		const transporter = nodemailer.createTransport({
			host: process.env.MAIL_SMTP,
			port: process.env.MAIL_PORT,
			secure: false,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS
			}
		})
		transporter.sendMail({
			from: 'Hypertube Team',
			subject: data.title,
			html,
			to
		})
	} catch (err) {
		console.log(`Can't send mail because of: `, err.message)
	}
}

module.exports = sendMail
