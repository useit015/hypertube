const rules = context => {
    const reg = {
        name: /^(([a-zA-Z])+([-\ \.])?([a-zA-Z])+)+$/,
        username: /^([a-zA-Z_])+([a-zA-Z0-9-_])*$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    }

    const required = v => !!v || context.$t('rules.required')

    return {
        name: [
            required,
            v => reg.name.test(v) || context.$t('rules.name.valid'),
            v => (v && (v.length >= 3 && v.length <= 255)) || context.$t('rules.name.len')
        ],
        username: [
            required,
            v => (v && (v.length >= 5 && v.length <= 30)) || context.$t('rules.username.len'),
            v => reg.username.test(v) || context.$t('rules.username.valid')
        ],
        password: [
            required,
            v => (v && v.length >= 8) || context.$t('rules.password.len'),
            v => reg.password.test(v) || context.$t('rules.password.valid')
        ],
        email: [required, v => reg.email.test(v) || context.$t('rules.email.valid')],
        avatar: [
            v => (!!v && !!v.name) || context.$t('rules.required'),
            v => (!!v && ['image/png', 'image/jpeg'].includes(v.type)) || context.$t('rules.avatar.ext'),
            v => (!!v && v.size) <= 1024 * 1024 * 4 || context.$t('rules.avatar.size')
        ]
    }
}

export default rules
