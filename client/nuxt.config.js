import colors from 'vuetify/es5/util/colors'
require('dotenv').config()

export default {
    mode: 'spa',
    /*
     ** Headers of the page
     */
    head: {
        titleTemplate: '%s - ' + process.env.npm_package_name,
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || ''
            }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },
    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#64D6C4' },
    loadingIndicator: {
        name: 'rectangle-bounce',
        color: '#64D6C4',
        background: colors.grey.darken3
    },
    /*
     ** Global CSS
     */
    css: ['video.js/dist/video-js.css'],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        { src: '~/plugins/bus' },
        { src: '~/plugins/i18n' },
        {
            src: '~/plugins/socket.js',
            ssr: false
        }
    ],
    /*
     ** Nuxt.js dev-modules
     */
    devModules: ['@nuxtjs/vuetify'],
    /*
     ** Nuxt.js modules
     */
    modules: ['@nuxtjs/axios', '@nuxtjs/svg-sprite'],
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: {},
    /*
     ** vuetify module configuration
     ** https://github.com/nuxt-community/vuetify-module
     */
    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        defaultAssets: {
            font: true,
            icons: 'md'
        },
        theme: {
            dark: true,
            themes: {
                dark: {
                    primary: '#64D6C4',
                    accent: colors.grey.darken3,
                    secondary: colors.amber.darken3,
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent3
                }
            }
        }
    },
    /*
     ** Build configuration
     */
    build: {
        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {}
    },
    env: {
        translateKey: process.env.translateKey
    }
}
