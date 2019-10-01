import Vue from 'vue'
import checkToken from '@/assets/token'

export default async ({ store, redirect, app }) => {
    if (!store.getters.authenticated) {
        const authenticated = await checkToken(store)
        if (!authenticated) {
            return redirect('/sign')
        } else {
            new Vue().$socket.client.emit('auth', store.getters.user._id)
            app.i18n.locale = store.getters.user.langue
        }
    }
}
