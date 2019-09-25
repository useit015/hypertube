const pump = require('pump')
const axios = require("axios")
const express = require("express")
const FFmpeg = require('fluent-ffmpeg')
const cloudscraper = require("cloudscraper")
const torrentStream = require('torrent-stream')
const { resolve, join, dirname } = require('path')
const router = express.Router()

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

const convert = (file, thread = 2) => {
	return  new FFmpeg(file.createReadStream())
		.videoCodec('libvpx')
		.audioCodec('libvorbis')
		.format('webm')
		.audioBitrate(128)
		.videoBitrate(8 * 1000)
		.outputOptions([
			`-threads ${thread}`,
			'-deadline realtime',
			'-error-resilient 1'
		])
		.on('error', err => console.log('Encoding error -->', err.message))
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

const fetchTorrent = async (imdb, id) => {
	try {
		const url = `https://api.apiumadomain.com/movie?cb=&quality=720p,1080p,3d&page=1&imdb=${imdb}`;
		const { data } = await axios.get(url);
		const list = [ ...data.items, ...data.items_lang ]
		for (const cur of list) {
			if (cur.id == id) return cur
		}
	} catch (err) {
		console.log('I got an error with --> ', err.message)
	}
}

module.exports = (movieList, downloadList) => {

	router.get('/:imdb/:id', async (req, res) => {
		try {
			const { range } = req.headers
			const { imdb, id } = req.params
			console.log('range -->', range);
			if (range) {
				const downloading = downloadList[id]
				if (downloading) return stream(range, downloading.file, res)
				let torrent = movieList[id]
				if (!torrent) {
					console.log('im fetching from api ...')
					torrent = await fetchTorrent(imdb, id)
					console.log('i fetched this from api --> ', torrent.file)
					if (!torrent) return res.end()
					movieList[id] = torrent
				}
				const uploadPath = resolve(dirname(__dirname), 'movies')
				const engine = torrentStream(torrent.torrent_magnet, { path: uploadPath })
				engine.on('torrent', () => {
					engine.files = engine.files.sort((a, b) => b.length - a.length)
					const file = engine.files[0]
					downloadList[id] = { file, engine }
					stream(range, file, res)
				})
				engine.on('download', index => {
					console.log('The engine downloaded this -->', index, 'for --> ', engine.files[0].name)
				})
			} else {
				res.end()
			}
		} catch (err) {
			console.log('I got an error with --> ', err.message)
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
