export default {
    openAlert: (context, text, color = 'error') => {
        if (context) {
            if (context.$t && context.$bus) {
                text = context.$t(text)
                context.$bus.$emit('openAlert', { color, text })
            }
        }
    },
    passwordCmp(context) {
        if (context.confPass === context.pass) return ''
        return !context.confPass.length || context.pass === context.confPass ? '' : context.$t('rules.password.match')
    }
}
