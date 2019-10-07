const User = require('../models/User')
const Movie = require('../models/Movie')

module.exports = (movieList, downloadList) => {

	const freeEngine = (movie) => {
		if (movie && movie.engine) {
			movie.engine.destroy()
			delete downloadList[movie.engine.infoHash]
			delete movieList[movie.engine.infoHash]
		}
	}

	const cleanup = socket => {
		Object.values(downloadList).forEach(movie => {
			if (movie.users) {
				if (movie.users.has(socket.id)) {
					movie.users.delete(socket.id)
					if (!movie.users.size) {
						freeEngine(movie)
					}
				}
			}
		})
	}

	return socket => {
		socket.on('watch', ({ id, imdb, title, poster, userId }) => {
			if (downloadList[id]) {
				if (downloadList[id].users) {
					downloadList[id].users.add(socket.id)
				} else {
					downloadList[id].users = new Set([ socket.id ])
				}
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

			User.findById(userId, (err, user) => {
				if (user) {
					if (user.movies.length) {
						const movie = user.movies.find(cur => cur.imdb == imdb)
						if (movie) {
							movie.watched = true
						} else {
							user.movies.push({ imdb, name: title, watched: true, poster })
						}
					} else {
						user.movies.push({ imdb, name: title, watched: true, poster })
					}
					user.markModified('movies')
					user.save()
				}
			})
		})

		socket.on('cleanup', () => cleanup(socket))
		socket.on('disconnect', () => cleanup(socket))
	}

}
