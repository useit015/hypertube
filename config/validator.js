const Joi = require('@hapi/joi')

const opts = {
	allowUnknown: true,
	abortEarly: false
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

const rules = {
	firstName: Joi.string()
		.min(3)
		.max(50)
		.required(),
	lastName: Joi.string()
		.min(3)
		.max(50)
		.required(),
	username: Joi.string()
		.alphanum()
		.min(5)
		.max(30)
		.required(),
	email: Joi.string()
		.email({ minDomainSegments: 2 })
		.required()
}

const passRule = Joi.string()
	.regex(passwordRegex)
	.required()

module.exports = {
	getErrors: err => err.details.map(cur => cur.message),
	register: (obj, f) => {
		const schema = Joi.object().keys({
			...rules,
			password: passRule,
			confPassword: Joi.any()
				.valid(Joi.ref('password'))
				.required()
				.options({ language: { any: { allowOnly: 'must match password' } } })
		})
		Joi.validate(obj, schema, opts, f)
	},
	update: (obj, f) => {
		const schema = Joi.object().keys(rules)
		Joi.validate(obj, schema, opts, f)
	},
	login: (obj, f) => {
		const schema = Joi.object().keys({
			email: rules.email,
			password: passRule
		})
		Joi.validate(obj, schema, opts, f)
	}
}
