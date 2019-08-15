const reg = {
    name: /^(([a-zA-Z])+([-\ \.])?([a-zA-Z])+)+$/,
    username: /^([a-zA-Z_])+([a-zA-Z0-9-_])*$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    email: /.+@.+\..+/
}

const errors = {
    name: {
        valid: 'Name can contain only letters and valid separators',
        len: 'Name must be at least 3 characters long'
    },
    username: {
        valid: 'Username can contain only letters, numbers, _ and - characters',
        len: 'Username must be between 5 and 30 characters long'
    },
    password: {
        valid: 'Password must contain at least one uppercase, one lowercase, one number and one special char',
        len: 'Password must be at least 8 characters long'
    },
    email: {
        valid: 'E-mail must be valid'
    }
}

const required = v => !!v || 'This field is required'

export default {
    name: [
        required,
        v => reg.name.test(v) || errors.name.valid,
        v => (v.length >= 3 && v.length <= 255) || errors.name.len
    ],
    username: [
        required,
        v => (v.length >= 5 && v.length <= 30) || errors.username.len,
        v => reg.username.test(v) || errors.username.valid
    ],
    password: [required, v => v.length >= 8 || errors.password.len, v => reg.password.test(v) || errors.password.valid],
    email: [required, v => reg.email.test(v) || errors.email.valid]
}
