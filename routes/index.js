const express = require('express')
const router = express.Router()
const { resolve, dirname } = require('path')

router.get('/', (req, res) => {
	const indexPath = resolve(dirname(__dirname), 'client', 'dist', 'index.html')
	res.sendFile(indexPath)
})

module.exports = router