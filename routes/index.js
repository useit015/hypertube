const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	res.send('trrr')
})

router.get('/moot', (req, res) => {
	res.send('moot')
})

module.exports = router