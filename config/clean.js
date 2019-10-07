const moment = require('moment')
const cron = require('node-cron')
const { join } = require('path')
const { readdirSync, lstatSync, unlinkSync, existsSync, rmdirSync } = require('fs')
const nodemailer = require('nodemailer')

const Movie = require('../models/Movie')
const monthAgo = moment().subtract(1, 'months')._d

const removeFolder = (dirPath) => {
	if (existsSync(dirPath)) {
		if (lstatSync(dirPath).isDirectory()) {
			readdirSync(dirPath).forEach(function(entry) {
				const entryPath = join(dirPath, entry)
				if (lstatSync(entryPath).isDirectory()) {
					removeFolder(entryPath)
				} else {
					unlinkSync(entryPath)
				}
			})
			rmdirSync(dirPath);
		} else {
			unlinkSync(dirPath)
		}
	}
}

const sendMail = async movies => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.MAIL_SMTP,
			port: process.env.MAIL_PORT,
			secure: false,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS
			}
		})
		movies = movies.map(cur => `<li>${cur}</li>`).join("");
		transporter.sendMail({
			from: 'Hypertube Team',
			subject: "Movies deleted",
			html: `<h1>This movies has been deleted: </h1>
							<ul>
								${movies}
							</ul>`,
			to: "ouzzine.ismail@gmail.com"
		})
	} catch (err) {
		console.log(`Can't send mail because of: `, err.message)
	}
}

const cleanOldMovies = () => {
	let movieDeleted = [];
	Movie.find({ date: { $lt: monthAgo }}, (err, movies) => {
		movies.forEach(cur => {
			movieDeleted.push(cur.path)
			removeFolder(cur.path)
			cur.remove()
		})
		if (movieDeleted.length) sendMail(movieDeleted);
	})
}

cron.schedule('0 0 * * *', cleanOldMovies)
