import checkToken from '@/assets/token'

export default async ({ store, redirect, app }) => {
    if (!store.getters.authenticated) {
        const authenticated = await checkToken(store)
        if (!authenticated) {
            return redirect('/sign')
        } else {
            app.i18n.locale = store.getters.user.langue
        }
    }
}
