import Vue from 'vue'

export const state = () => ({
    user: {},
    movie: {},
    watching: false,
    authenticated: false
})

export const getters = {
    user: state => state.user,
    movie: state => state.movie,
    watching: state => state.watching,
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
    updateUser: (state, user) => {
        state.user = user
    },
    updateAvatar: (state, image) => {
        state.user.image = `${image}?${new Date().getTime()}`
    },
    watch: (state, movie) => {
        state.movie = movie
        state.watching = true
    },
    exitWatch: state => {
        state.movie = {}
        state.watching = false
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
    updateUser: ({ commit }, user) => {
        commit('updateUser', JSON.parse(user))
    },
    updateAvatar: ({ commit }, image) => {
        commit('updateAvatar', image)
    },
    // watch: ({ commit }, movie) => {
    //     new Vue().$socket.client.emit('watch', movie)
    //     commit('watch', movie)
    // },
    exitWatch: ({ commit }) => {
        commit('exitWatch')
    }
}

export const strict = false
