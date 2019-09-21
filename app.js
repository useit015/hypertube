require('dotenv').config()
const https = require('https')
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const BodyParser = require('body-parser')
const cors = require('cors')
const ejs = require('ejs')
// const { readFileSync } = require('fs')
const { resolve, dirname } = require('path')

const app = express()
const PORT = process.env.PORT || 4000
// const SPORT = process.env.PORT || 443
const indexPath = resolve(__dirname, 'client', 'dist')
const uploadPath = resolve(__dirname, 'uploads')
// const options = {
// 	key: readFileSync('./key.pem'),
// 	cert: readFileSync('./certificate.pem')
// }

// require('./config/passport')(passport)

app.set('view engine', 'ejs')

app.use(cors())
app.use(passport.initialize())
app.use(
	express.urlencoded({
		limit: '50mb',
		extended: true
	})
)
app.use(express.json({ limit: '50mb' }))

mongoose
	.connect(process.env.MONGO_URI, {
		useCreateIndex: true,
		useNewUrlParser: true
	})
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err))

app.use('/api/users', require('./routes/users'))
// app.use('/api/oauth', require('./routes/oauth'))
app.use('/oauth', require('./routes/oauth_ret'))
app.use('/api/movies', require('./routes/movies'))
app.use(express.static(indexPath))
app.use('/uploads', express.static(uploadPath))
app.get(/.*/, (req, res) => res.sendFile(`${indexPath}/index.html`))

app.listen(PORT, () => console.log(`Http server started on port ${PORT}`))
// https
// 	.createServer(options, app)
// 	.listen(SPORT, () => console.log(`Https server started on port ${SPORT}`))
