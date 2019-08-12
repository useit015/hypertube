require('dotenv').config()
const https = require('https')
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const { resolve } = require('path')
// const ejs = require('ejs')
const { readFileSync } = require('fs')

const options = {
	key: readFileSync('./key.pem'),
	cert: readFileSync('./certificate.pem')
}

const app = express()
const indexPath = resolve(__dirname, 'client', 'dist')

require('./config/passport')(passport)

app.use(passport.initialize())

mongoose
	.connect(process.env.MONGO_URI, {
		useCreateIndex: true,
		useNewUrlParser: true
	}).then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err))

app.use(express.urlencoded({ extended: true }))

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use(express.static(indexPath))

const PORT = process.env.PORT || 80
const SPORT = 443

https
	.createServer(options, app)
	.listen(SPORT, () => console.log(`Server started on port ${SPORT}`))
app
	.listen(PORT, () => console.log(`Server started on port ${PORT}`))