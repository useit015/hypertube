const moment = require('moment')
const { dirname, resolve, join } = require('path')
const { readdirSync, statSync, lstatSync, unlinkSync, existsSync, rmdirSync } = require('fs')

const removeFolder = (dirPath) => {
	if (existsSync(dirPath)) {
		readdirSync(dirPath).forEach(function(entry) {
			const entryPath = join(dirPath, entry)
			if (lstatSync(entryPath).isDirectory()) {
				removeFolder(entryPath)
			} else {
				unlinkSync(entryPath)
			}
		})
		rmdirSync(dirPath);
	}
}

const dirPath = resolve(dirname(__dirname), 'movies')
const monthAgo = moment().subtract(1, 'months')._d

readdirSync(dirPath).forEach(cur => {
	const filePath = `${dirPath}/${cur}`
	const { birthtime } = statSync(filePath)
	if (monthAgo > birthtime) {
		removeFolder(filePath)
		console.log(`Deleted ${cur} successfuly`)
	}
})
