import axios from 'axios'

const checkToken = async store => {
    try {
        const token = localStorage.getItem('token')
        const url = `http://localhost:4000/api/users/isloggedin`
        const headers = { Authorization: `jwt ${token}` }
        const res = await axios.get(url, { headers })
        if (!res.data.err) {
            store.dispatch('login', res.data)
        }
        return !res.data.err
    } catch (err) {
        console.log('Got error here -->', err)
    }
}

export default async ({ store, redirect }) => {
    if (store.getters.authenticated) {
        return redirect('/library')
    }
    const authenticated = await checkToken(store)
    if (authenticated) {
        return redirect('/library')
    }
}
