require('dotenv').config()
const http = require('http')
const cors = require('cors')
const https = require('https')
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const socketIo = require('socket.io')
const { resolve } = require('path')
const { readFileSync } = require('fs')

const httpApp = express();
const app = express()
const PORT = process.env.PORT || 80
const SPORT = process.env.PORT || 443
const subPath = resolve(__dirname, 'sub')
const moviePath = resolve(__dirname, 'movies')
const uploadPath = resolve(__dirname, 'uploads')
const indexPath = resolve(__dirname, 'client', 'dist')
const options = {
	key: readFileSync('./key.pem'),
	cert: readFileSync('./certificate.pem')
}

const movieList = {}
const downloadList = {}

require('./config/clean')
require('./config/passport')(passport)

app.set('view engine', 'ejs')

app.use(cors())
app.use(passport.initialize())
app.use(express.urlencoded({
	limit: '50mb',
	extended: true
}))
app.use(express.json({ limit: '50mb' }))

app.use((err, req, res, next) => {
	if (err)
		return res.json({err: 'something is wrong'})
	next()
})

mongoose
	.connect(process.env.MONGO_URI, {
		useCreateIndex: true,
		useNewUrlParser: true
	})
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log('Error connecting to MongoDB: ', err.message))

httpApp.get("*", (req, res) => res.redirect("https://" + req.headers.host));

app.use('/api/users', require('./routes/users'))
app.use('/api/oauth', require('./routes/oauth'))
app.use('/oauth', require('./routes/oauth_ret'))
app.use('/api/movies', require('./routes/movies')(movieList, downloadList));
app.use('/api/comment', require('./routes/comment'));

app.use(express.static(indexPath))
app.use('/uploads', express.static(uploadPath))
app.use('/movies', express.static(moviePath))
app.use('/sub', express.static(subPath))

app.get(/.*/, (req, res) => res.sendFile(`${indexPath}/index.html`))

const httpServer = http.createServer(httpApp)
const httpsServer = https.createServer(options, app)

const io = socketIo(httpsServer, { pingInterval: 10, pingTimeout: 60000, })

io.on('connection', require('./config/socket')(movieList, downloadList))

httpServer.listen(PORT, () => console.log(`Http server started on port ${PORT}`))
httpsServer.listen(SPORT, () => console.log(`Https server started on port ${SPORT}`))
