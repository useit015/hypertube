export default {
    showAlert(color, text, comp) {
        comp.alert = {
            state: true,
            color,
            text
        }
    },
    passwordCmp(context) {
        if (context.confPass === context.pass) return ''
        return !context.confPass.length || context.pass === context.confPass ? '' : context.$t('rules.password.match')
    }
}
