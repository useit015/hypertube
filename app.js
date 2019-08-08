const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

const app = express()

require('./config/passport')(passport)

const db = require('./config/keys').mongoURI

app.use(passport.initialize())

mongoose
	.connect(db, { useNewUrlParser: true })
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err))

app.use(express.urlencoded({ extended: true }))

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))