module.exports = (movieList, downloadList) => {

	const freeEngine = (movie, fileName) => {
		if (movie && movie.engine) {
			movie.engine.destroy(() => {
				console.log('i destroyed the engine for --> ', fileName)
			})
		}
	}

	const cleanup = socket => {
		Object.values(movieList).forEach(cur => {
			cur.users.forEach((id, i) => {
				if (id == socket.id) {
					cur.users.splice(i, 1)
					if (!cur.users.length) {
						freeEngine(downloadList[cur.id], cur.file)
						delete downloadList[cur.id]
						delete movieList[cur.id]
						return
					}
				}
			})
		})
	}

	return socket => {
		console.log('i am the socket --> ', socket.id)
		socket.on('watch', data => {
			if (data.users) {
				data.users.push(socket.id)
			} else {
				data.users = [socket.id]
			}
			movieList[data.id] = data
			console.log('Here is the movieList -->', movieList)
		})
		socket.on('cleanup', () => cleanup(socket))
		socket.on('disconnect', () => cleanup(socket))
	}

}
