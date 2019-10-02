export const state = () => ({
    user: {},
    movies: {},
    authenticated: false
})

export const getters = {
    user: state => state.user,
    movies: state => state.movies,
    liked: state => state.user.liked,
    token: state => state.user.token,
    watched: state => state.user.watched,
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
    addMovie: (state, movie) => {
        state.movies[movie.imdb] = movie
    },
    removeMovie: (state, imdb) => {
        delete state.movies[imdb]
    },
    markAsWatched: (state, imdb) => {
        if (state.user.watched && state.user.watched.length) {
            state.user.watched.push(imdb)
        } else {
            state.user.watched = [imdb]
        }
    },
    updateLikes: (state, liked) => {
        state.user.liked = [...liked]
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
    addMovie: ({ commit }, movie) => {
        commit('addMovie', movie)
    },
    removeMovie: ({ commit }, imdb) => {
        commit('removeMovie', imdb)
    },
    markAsWatched: ({ commit }, imdb) => {
        commit('markAsWatched', imdb)
    },
    updateLikes: ({ commit }, liked) => {
        commit('updateLikes', liked)
    }
}

export const strict = false
