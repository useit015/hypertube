export const state = () => ({
    authenticated: false,
    user: {}
})

export const getters = {
    user: state => state.user,
    authenticated: state => state.authenticated
}

export const mutations = {
    login: (state, user) => {
        state.authenticated = true
        state.user = user
    }
}

export const actions = {
    login: ({ commit, dispatch }, user) => {
        if (user._id) {
            localStorage.setItem('token', user.token)
            commit('login', user)
        }
    }
}