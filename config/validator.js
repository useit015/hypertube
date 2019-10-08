const Joi = require('@hapi/joi')

const opts = {
	allowUnknown: true,
	abortEarly: false
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const usernameRegex = /^([a-zA-Z_])+([a-zA-Z0-9-_])*$/
const nameRegex = /^(([a-zA-Z])+([-\ \.])?([a-zA-Z])+)+$/

const rules = {
	firstName: Joi.string()
		.regex(nameRegex)
		.min(3)
		.max(50)
		.required(),
	lastName: Joi.string()
		.regex(nameRegex)
		.min(3)
		.max(50)
		.required(),
	username: Joi.string()
		.regex(usernameRegex)
		.min(5)
		.max(30)
		.required(),
	email: Joi.string()
		.email({ minDomainSegments: 2 })
		.required(),
	langue: Joi.string().valid('fr', 'en', 'es', 'ar', 'dr')
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
	passwordupdate: (obj, f) => {
		const schema = Joi.object().keys(
			{
				password: passRule,
				newPassword: passRule,
				confNewPassword: Joi.any()
				.valid(Joi.ref('newPassword'))
				.required()
				.options({ language: { any: { allowOnly: 'must match password' } } })
			})
		Joi.validate(obj, schema, opts, f)
	},
	login: (obj, f) => {
		const schema = Joi.object().keys({
			username: rules.username,
			password: passRule
		})
		Joi.validate(obj, schema, opts, f)
	},
	passwordRecover: (obj, f) => {
		const schema = Joi.object().keys(
			{
				newPassword: passRule,
				confNewPassword: Joi.any()
				.valid(Joi.ref('newPassword'))
				.required()
				.options({ language: { any: { allowOnly: 'must match password' } } })
			})
		Joi.validate(obj, schema, opts, f)
	},
}
