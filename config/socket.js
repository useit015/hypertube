module.exports = (movieList, downloadList) => {

	const freeEngine = (movie, fileName) => {
		if (movie && movie.engine) {
			movie.engine.destroy(() => {
				console.log('i destroyed the engine for --> ', fileName)
			})
		}
	}

	const cleanup = socket => {
		Object.values(movieList).forEach(movie => {
			if (movie.users.has(socket.id)) {
				movie.users.delete(socket.id)
				if (!movie.users.size) {
					freeEngine(downloadList[movie.id], movie.file)
					delete downloadList[movie.id]
					delete movieList[movie.id]
				}
			}
		})
	}

	return socket => {
		console.log('i am the socket --> ', socket.id)
		socket.on('watch', data => {
			if (data.id) {
				if (movieList[data.id]) {
					movieList[data.id].users.add(socket.id)
				} else {
					movieList[data.id] = {
						...data,
						users: new Set([ socket.id ])
					}
				}
			}
		})
		socket.on('cleanup', () => cleanup(socket))
		socket.on('disconnect', () => cleanup(socket))
	}

}
