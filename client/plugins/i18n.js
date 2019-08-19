import Vue from 'vue'
import VueI18n from 'vue-i18n'

// Tell Vue to use our plugin
Vue.use(VueI18n)

export default ({ app }) => {
    app.i18n = new VueI18n({
        locale: 'en',
        fallbackLocale: 'en',
        messages: {
            en: require('~/static/en.json'),
            fr: require('~/static/fr.json')
        }
    })
}
