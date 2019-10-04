import axios from 'axios'

const checkToken = async store => {
    try {
        const token = localStorage.getItem('token')
        const url = `https://hypertube.tk/api/users/isloggedin`
        const headers = { Authorization: `jwt ${token}` }
        const res = await axios.get(url, { headers })
        if (!res.data.err) {
            store.dispatch('login', res.data)
        }
        return !res.data.err
    } catch (err) {
        return
    }
}

export default checkToken
