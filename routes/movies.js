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
	const head = {
		'Content-Range': `bytes ${start}-${end}/${file.length}`,
		'Accept-Ranges': 'bytes',
		'Content-Length': chunksize,
		'Content-Type': `video/${finalExt}`,
	}
	return {
		head,
		needConvert,
		resRange: { start, end }
	}
}

const convert = (file, thread = 8) => {
	const stream =  new FFmpeg(file.createReadStream())
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
		stream.ffprobe(function (err, data) {
			if (err)
				console.error('ERROR ==> ', err);
			else
				console.log('METADATA ==> ', data);
		})
		return stream
}

const stream = (range, file, res) => {
	const { head, needConvert, resRange } = extractData(range, file)
	res.writeHead(206, head)
	if (needConvert) {
		pump(convert(file), res, err => {
			if (err) {
				console.log('i got a error in pump -->', err.message)
			}
		})
	} else {
		file.createReadStream(resRange).pipe(res)
	}

}

module.exports = (movieList, downloadList) => {

	router.get('/:id', async (req, res) => {
		const range = req.headers.range
		console.log('range -->', range);
		if (range) {
			const downloading = downloadList[req.params.id]
			if (downloading) return stream(range, downloading.file, res)
			const torrent = movieList[req.params.id]
			if (torrent) {
				const uploadPath = resolve(dirname(__dirname), 'movies')
				const engine = torrentStream(torrent.torrent_magnet, { path: uploadPath })
				engine.on('torrent', () => {
					engine.files = engine.files.sort((a, b) => b.length - a.length)
					const file = engine.files[0]
					downloadList[req.params.id] = { file, engine }
					stream(range, file, res)
				})
				engine.on('download', index => {
					console.log('The engine downloaded this -->', index)
				})
			} else {
				res.end()
			}
		} else {
			res.end()
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
