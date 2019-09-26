require('dotenv').config()
const http = require('http')
const https = require('https')
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const BodyParser = require('body-parser')
const cors = require('cors')
const ejs = require('ejs')
const socketIo = require('socket.io')
const { readFileSync } = require('fs')
const { resolve, dirname } = require('path')

const app = express()
const PORT = process.env.PORT || 80
const SPORT = process.env.PORT || 443
const indexPath = resolve(__dirname, 'client', 'dist')
const uploadPath = resolve(__dirname, 'uploads')
const moviePath = resolve(__dirname, 'movies')
const options = {
	key: readFileSync('./key.pem'),
	cert: readFileSync('./certificate.pem')
}

const movieList = {}
const downloadList = {}

// require('./config/clean')
require('./config/passport')(passport)

app.set('view engine', 'ejs')

app.use(cors())
app.use(passport.initialize())
app.use(express.urlencoded({
	limit: '50mb',
	extended: true
}))
app.use(express.json({limit: '50mb'}))

mongoose
	.connect(process.env.MONGO_URI, {
		useCreateIndex: true,
		useNewUrlParser: true
	})
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err))

app.use('/api/users', require('./routes/users'))
app.use('/api/oauth', require('./routes/oauth'))
app.use('/oauth', require('./routes/oauth_ret'))
app.use('/api/movies', require('./routes/movies')(movieList, downloadList));
app.use(express.static(indexPath))
app.use('/uploads', express.static(uploadPath))
app.use('/movies', express.static(moviePath))
app.get(/.*/, (req, res) => res.sendFile(`${indexPath}/index.html`))

const httpServer = http.createServer(app)
const httpsServer = https.createServer(options, app)

const io = socketIo(httpServer, { pingInterval: 10, pingTimeout: 4000 })

io.on('connection', require('./config/socket')(movieList, downloadList))

httpServer.listen(PORT, () => console.log(`Http server started on port ${PORT}`))
httpsServer.listen(SPORT, () => console.log(`Https server started on port ${SPORT}`))
