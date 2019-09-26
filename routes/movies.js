const pump = require('pump')
const axios = require("axios")
const express = require("express")
const FFmpeg = require('fluent-ffmpeg')
const cloudscraper = require("cloudscraper")
const torrentStream = require('torrent-stream')
const { resolve, join, dirname } = require('path')
const fs = require("fs");
const request = require("request");
const OS = require("opensubtitles-api");
const router = express.Router()

const OpenSubtitles = new OS({
  useragent: "TemporaryUserAgent",
  username: "hypertube1337",
  password: "Test@1337",
  ssl: true
});

OpenSubtitles.login();

const extractData = (range, file) => {
	const parts = range.replace(/bytes=/, '').split('-')
	const start = parseInt(parts[0], 10)
	const end = parts[1] ? parseInt(parts[1], 10) : file.length - 1
	const chunksize = end - start + 1
	const splited = file.name.split('.')
	const ext = splited.pop()
	const fileName = splited.join('.')
	const finalExt = ext == 'mp4' || ext == 'webm' ? ext : 'webm'
	const needConvert = finalExt != ext
	let head
	if (!needConvert) {
		head = {
			'Content-Range': `bytes ${start}-${end}/${file.length}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4'
		}
	} else {
		head = {
			'Content-Range': `bytes ${start}-${end}/*`,
			'Content-Type': 'video/webm'
		}
	}
	return {
		head,
		needConvert,
		resRange: { start, end }
	}
}

const convert = (file, thread = 4) => {
	const converted = new FFmpeg(file.createReadStream())
		.videoCodec('libvpx')
		.audioCodec('libvorbis')
		.format('webm')
		.audioBitrate(128)
		.videoBitrate(8000)
		.outputOptions([
			`-threads ${thread}`,
			'-deadline realtime',
			'-error-resilient 1'
		])
		.on('error', err => {
			converted.destroy()
			console.log('Encoding error -->', err.message)
		})
		.stream()
	return converted
}

const getSubt = id => {
	const uploadPath = "./sub/";
	OpenSubtitles.search({
		imdbid: id
	}).then(subtitles => {
		Object.keys(subtitles).forEach(async sub => {
			let file = fs.createWriteStream(
				uploadPath + `${sub}-${subtitles[sub].filename}`
			);
	
			request.get(subtitles[sub].vtt, (err, response, body) =>
				response.pipe(file)
			);
		});
	});
}

const stream = (range, file, res) => {
	const { head, needConvert, resRange } = extractData(range, file)
	res.writeHead(206, head)
	if (needConvert) {
		pump(convert(file), res)
	} else {
		file.createReadStream(resRange).pipe(res)
	}
}

const fetchMovie = async imdb => {
	try {
		const url = `https://api.apiumadomain.com/movie?cb=&quality=720p,1080p,3d&page=1&imdb=${imdb}`;
		const { data } = await axios.get(url);
		return data
	} catch (err) {
		console.log('I got an error with --> ', err.message)
	}
}

const getTorrent = (movie, id) => {
	const list = [ ...movie.items, ...movie.items_lang ]
	for (const cur of list) {
		if (cur.id == id) return cur
	}
}

module.exports = (movieList, downloadList) => {

	router.get('/info/:imdb', async (req, res) => {
		try {
			const { imdb } = req.params
			const movie = await fetchMovie(imdb)
			res.json(movie)
		} catch (err) {
			console.log("Got error here --> ", err.message)
		}
	})

	router.get('/:imdb/:id', async (req, res) => {
		try {
			const { range } = req.headers
			const { imdb, id } = req.params
			console.log('range -->', range)
			if (range) {
				const downloaded = downloadList[id]
				if (downloaded) return stream(range, downloaded.file, res)
				let torrent = movieList[id]
				if (!torrent) {
					const movie = await fetchMovie(imdb, id)
					torrent = getTorrent(movie, id)
					if (!torrent) return res.end()
					movieList[id] = torrent
				}
				const uploadPath = resolve(dirname(__dirname), 'movies')
				const engine = torrentStream(torrent.torrent_magnet, { path: uploadPath })
				engine.on('torrent', () => {
					engine.files = engine.files.sort((a, b) => b.length - a.length)
					engine.files.forEach((cur, i) => !i ? cur.select() : cur.deselect())
					downloadList[id] = { file: engine.files[0], engine }
					stream(range, engine.files[0], res)
				})
				engine.on('download', index => {
					const completion = 100 * engine.swarm.downloaded / engine.files[0].length
					console.log('completion is -->', completion);
					console.log('The engine downloaded this -->', index)
					console.log('for --> ', engine.files[0].name)
				})
			} else {
				res.sendStatus(416)
			}
		} catch (err) {
			console.log('I got an error with --> ', err)
		}
	})

	router.post("/", async (req, res) => {
		try {
			let { page, query, genre, sort } = req.body;
			let sortType = "";
			if (sort === undefined) sortType = "seeds";
			if (sort === "Popularity") sortType = "seeds";
			if (sort === "Date added") sortType = "dateadded";
			if (sort === "Year") sortType = "year";
			if (sort === "Title") sortType = "title";
			let purl = `https://api.apiumadomain.com/list?sort=${sortType}&cb=&quality=720p,1080p,3d&page=${page}`;
			let yurl = `https://yts.lt/api/v2/list_movies.json?&page=${page}`;
			if (query) {
				purl = `${purl}&keywords=${query}`;
				yurl = `${yurl}&query_term=${query}`;
				let popcornList = [];
				const { data } = await axios.get(purl);
				if (data.MovieList.length) {
					popcornList = data.MovieList.map(cur => ({
						title: cur.title,
						year: cur.year,
						rating: cur.rating,
						imdb: cur.imdb,
						poster_med: cur.poster_med
					}));
				}
				cloudscraper.get(`${yurl}`).then(result => {
					let ytsList = [];
					const resultP = JSON.parse(result);
					if (resultP.data.movie_count) {
						ytsList = resultP.data.movies.map(cur => ({
							title: cur.title,
							year: cur.year,
							rating: cur.rating,
							imdb: cur.imdb_code,
							poster_med: cur.medium_cover_image
						}));
					}
					const merged = [
						...ytsList.filter(cur => {
							for (const item of popcornList) {
								if (cur.imdb === item.imdb) return false;
							}
							return true;
						}),
						...popcornList
					];
					return res.json(merged);
				});
			} else {
				if (genre) purl = `${purl}&genre=${genre}`;
				let popcornList = [];
				const { data } = await axios.get(purl);
				if (data.MovieList.length) {
					popcornList = data.MovieList.map(cur => ({
						title: cur.title,
						year: cur.year,
						rating: cur.rating,
						imdb: cur.imdb,
						poster_med: cur.poster_med,
						items: [...cur.items, ...cur.items_lang].map(cur => ({
							id: cur.id,
							size: cur.size_bytes,
							magnet: cur.torrent_magnet
						}))
					}));
				}
				return res.json(popcornList);
			}
		} catch (error) {
			console.log("got error : ", error.message);
		}
	});

	return router
}
