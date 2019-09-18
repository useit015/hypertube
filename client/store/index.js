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
    },
    logout: state => {
        state.user = {}
        state.authenticated = false
    },
    updateAvatar: (state, image) => {
        state.user.image = `${image}?${new Date().getTime()}`
    }
}

export const actions = {
    login: ({ commit }, user) => {
        if (user._id) {
            localStorage.setItem('token', user.token)
            commit('login', user)
        }
    },
    logout: ({ commit }) => {
        localStorage.clear()
        commit('logout')
    },
    updateAvatar: ({ commit }, image) => {
        commit('updateAvatar', image)
    }
}

export const strict = false
