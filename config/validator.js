const Joi = require('@hapi/joi')

const opts = {
	allowUnknown: true,
	abortEarly: false
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

module.exports = {
	getErrors: err => err.details.map(cur => cur.message),
	register: (obj, f) => {
		const schema = Joi.object().keys({
			username: Joi.string().alphanum().min(5).max(30).required(),
			email: Joi.string().email({ minDomainSegments: 2 }).required(),
			password: Joi.string().regex(passwordRegex).required(),
			confPassword: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
		})
		Joi.validate(obj, schema, opts, f)
	},
	login: (obj, f) => {
		const schema = Joi.object().keys({
			email: Joi.string().email({ minDomainSegments: 2 }).required(),
			password: Joi.string().regex(passwordRegex).required()
		})
		Joi.validate(obj, schema, opts, f)
	}
}
