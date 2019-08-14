require('dotenv').config()
const https = require('https')
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const cors = require('cors')
const { resolve } = require('path')
const ejs = require('ejs')
const { readFileSync } = require('fs')

const options = {
	key: readFileSync('./key.pem'),
	cert: readFileSync('./certificate.pem')
}

const app = express()
const indexPath = resolve(__dirname, 'client', 'dist')

require('./config/passport')(passport)

mongoose
	.connect(process.env.MONGO_URI, {
		useCreateIndex: true,
		useNewUrlParser: true
	})
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err))

app.set('view engine', 'ejs')

app.use(passport.initialize())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/oauth', require('./routes/oauth'))
app.use(express.static(indexPath))
app.use(function(req, res) {
	res.json({error: {'message':'Invalid Request'}})
})
const PORT = process.env.PORT || 80
const SPORT = 443

https.createServer(options, app).listen(SPORT, () => console.log(`Server started on port ${SPORT}`))
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
