const express = require('express')
const router = express.Router()
const { resolve, dirname } = require('path')

router.get('/', (req, res) => {
	const indexPath = resolve(dirname(__dirname), 'client', 'dist', 'index.html')
	res.sendFile(indexPath)
})

router.get('/.well-known/acme-challenge/662ASEOEU9f38su8J_kp6TFIjT_VCLWy_38xt84pAVU', (req, res) => {
	res.send('662ASEOEU9f38su8J_kp6TFIjT_VCLWy_38xt84pAVU.gqRYBTE-bpfs5Qi3YVbzmSEA2KYJPJBsg2KtP-6UiC4')
})

module.exports = router