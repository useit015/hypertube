export default {
    openAlert: (context, text, color = 'error') => {
        context.$bus.$emit('openAlert', { color, text })
    },
    passwordCmp(context) {
        if (context.confPass === context.pass) return ''
        return !context.confPass.length || context.pass === context.confPass ? '' : context.$t('rules.password.match')
    }
}
