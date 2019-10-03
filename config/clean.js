const moment = require('moment')
const cron = require('node-cron')
const { join } = require('path')
const { readdirSync, lstatSync, unlinkSync, existsSync, rmdirSync } = require('fs')
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

const cleanOldMovies = () => {
	console.log('i am cleaning the old movies...')
	Movie.find({ date: { $lt: monthAgo }}, (err, movies) => {
		movies.forEach(cur => {
			console.log(`deleting ${cur.path}...`)
			removeFolder(cur.path)
			cur.remove()
		})
	})
}

cron.schedule('0 0 * * *', cleanOldMovies)
