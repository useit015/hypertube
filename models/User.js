const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { sign } = require('jsonwebtoken')

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
		default: '',
		unique: true
	},
	image: {
		type: String,
		default: ''
	},
	email: String,
	password: {
		type: String,
		default: ''
	},
	ftId: {
		type: String,
		default: ''
	},
	fbId: {
		type: String,
		default: ''
	},
	liId: {
		type: String,
		default: ''
	},
	spId: {
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
	verified: {
		type: Boolean,
		default: false
	},
	vkey: String,
	rkey: String,
	date: {
		type: Date,
		default: Date.now
	},
	langue: {
		type: String,
		enum: ['en', 'fr', 'ar', 'es', 'dr'],
		default: 'en'
	},
	movies: {
		type: Array,
		default: []
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

UserSchema.methods.addToken = function() {
	const opt = { expiresIn: 7200 }
	const payload = { id: this._id }
	const user = this._doc
	delete user.password
	user.token = sign(payload, 'secret', opt)
	return user
}

module.exports = mongoose.model('User', UserSchema)
