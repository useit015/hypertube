const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		default: ''
	},
	lastName: {
		type: String,
		default: ''
	},
	username: {
		type: String,
		default: ''
	},
	image: {
		type: String,
		default: ''
	},
	email: {
		type: String,
		default: ''
	},
	password: {
		type: String,
		default: ''
	},
	ftId: {
		type: String,
		default: ''
	},
	googleId: {
		type: String,
		default: ''
	},
	githubId: {
		type: String,
		default: ''
	},
	date: {
		type: Date,
		default: Date.now
	}
})

UserSchema.pre('save', function(next) {
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, (err, salt) => {
			if (err) throw err
			bcrypt.hash(this.password, salt, (err, hash) => {
				if (err) return next(err)
				this.password = hash
				next()
			})
		})
	} else {
		next()
	}
})

UserSchema.methods.cmpPassword = function(password, done) {
	bcrypt.compare(password, this.password, (err, match) => {
		if (err) return done(err)
		done(null, match)
	})
}

module.exports = mongoose.model('User', UserSchema)
