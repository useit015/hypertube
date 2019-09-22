import checkToken from '@/assets/token'

export default async ({ store, redirect }) => {
    if (!store.getters.authenticated) {
        const authenticated = await checkToken(store)
        if (!authenticated) {
            return redirect('/sign')
        }
    }
}
