const User = require('../models/User')
const Movie = require('../models/Movie')

module.exports = (users, movieList, downloadList) => {

	const freeEngine = (downloading, movie) => {
		if (downloading && downloading.engine) {
			downloading.engine.destroy(() => {
				console.log('i destroyed the engine for --> ', movie.name)
			})
			delete downloadList[movie.id]
			delete movieList[movie.id]
		}
	}

	const cleanup = socket => {
		Object.values(movieList).forEach(movie => {
			if (movie.users) {
				if (movie.users.has(socket.id)) {
					movie.users.delete(socket.id)
					if (!movie.users.size) {
						freeEngine(downloadList[movie.id], movie)
					}
				}
			} else {
				freeEngine(downloadList[movie.id], movie)
			}
		})
	}

	return socket => {
		console.log('i am the socket --> ', socket.id)
		socket.on('watch', ({ id, imdb, title, poster }) => {
			if (downloadList[id]) {
				let { path } = downloadList[id].engine
				const { name } = downloadList[id].engine.torrent
				path = `${path}/${name}`
				Movie.findOne({ path }, (err, movie) => {
					if (!movie) {
						new Movie({
							imdb,
							path
						}).save()
					} else {
						movie.date = Date.now()
						movie.save()
					}
				})
			}
			console.log('i have --> ', users[socket.id], socket.id)
			User.findById(users[socket.id], (err, user) => {
				console.log('user is -> ', user)
				if (user) {
					if (user.movies.length) {
						const movie = user.movies.find(cur => cur.imdb == imdb)
						if (movie) {
							movie.watched = true
						} else {
							user.watched.push({ imdb, name: title, watched: true, poster})
						}
						user.markModified('movies')
						user.save()
					}
				}
			})
		})
		socket.on('auth', id => users[socket.id] = id)
		socket.on('cleanup', () => cleanup(socket))
		socket.on('disconnect', () => cleanup(socket))
	}

}
