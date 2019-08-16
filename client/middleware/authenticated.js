export default ({ store, redirect }) => {
    if (!store.state.authenticated) {
        return redirect('/sign')
    }
}
