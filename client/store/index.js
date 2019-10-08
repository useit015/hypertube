export const state = () => ({
	user: {},
	authenticated: false
})

export const getters = {
	user: state => state.user,
	token: state => state.user.token,
	authenticated: state => state.authenticated,
	liked: state =>
		state.user.movies ? state.user.movies.filter(cur => cur.liked) : [],
	watched: state =>
		state.user.movies ? state.user.movies.filter(cur => cur.watched) : [],
	likedIds: state =>
		state.user.movies
			? state.user.movies.filter(cur => cur.liked).map(cur => cur.imdb)
			: [],
	watchedIds: state =>
		state.user.movies
			? state.user.movies.filter(cur => cur.watched).map(cur => cur.imdb)
			: [],
	incompleteProfile: state => {
		if (state.authenticated) {
			return (
				!state.user.email ||
				!state.user.lastName ||
				!state.user.firstName ||
				!state.user.username
			)
		}
	},
	oauthUser: state => {
		if (state.authenticated) {
			return (
				!!state.user.fbId ||
				!!state.user.ftId ||
				!!state.user.liId ||
				!!state.user.spId ||
				!!state.user.githubId ||
				!!state.user.googleId
			)
		}
	}
}

export const mutations = {
	login: (state, user) => {
		state.authenticated = true
		state.user = user
	},
	logout: state => {
		state.user = {}
		state.authenticated = false
		localStorage.clear()
	},
	updateUser: (state, user) => {
		state.user = user
	},
	updateAvatar: (state, image) => {
		state.user.image = `${image}?${new Date().getTime()}`
	},
	markAsWatched: (state, { imdb, title, poster }) => {
		const movie = { imdb, poster, name: title, watched: true }
		if (state.user.movies && state.user.movies.length) {
			let i = -1
			let MovieFound = false
			while (++i < state.user.movies.length) {
				if (state.user.movies[i].imdb == imdb) {
					MovieFound = true
					break
				}
			}
			if (MovieFound) {
				state.user.movies[i] = [
					{ ...state.user.movies[i], watched: true }
				]
			} else {
				state.user.movies.push(movie)
			}
		} else {
			state.user.movies = [movie]
		}
	},
	updateMovies: (state, movies) => {
		state.user.movies = [...movies]
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
		commit('logout')
	},
	updateUser: ({ commit }, user) => {
		commit('updateUser', JSON.parse(user))
	},
	updateAvatar: ({ commit }, image) => {
		commit('updateAvatar', image)
	},
	markAsWatched: ({ commit }, payload) => {
		commit('markAsWatched', payload)
	},
	updateMovies: ({ commit }, movies) => {
		commit('updateMovies', movies)
	}
}

export const strict = false
