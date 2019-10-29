const pump = require('pump')
const axios = require("axios")
const express = require("express")
const FFmpeg = require('fluent-ffmpeg')
const cloudscraper = require("cloudscraper")
const torrentStream = require('torrent-stream')
const { resolve, join, dirname } = require('path')
const fs = require("fs")
const yifysubtitles = require('@amilajack/yifysubtitles')
const router = express.Router()

const Movie = require('../models/Movie')

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
		.on('error', err => converted.destroy())
		.stream()
	return converted
}

const getSubt = async (id, err) => {
	const uploadPath = `./sub/${id}`;

	if (!fs.existsSync(uploadPath)) {
		fs.mkdir(uploadPath, (err) => {
			if (err) throw err
		});
	}

	let langs = ['fr', 'es', 'ar'];

	if (!err) langs.push('en');
	 
	return await yifysubtitles(id, { path: uploadPath, langs });
	
}

const getInfo = async id => {
	try {
		const url = `http://api.themoviedb.org/3/movie/${id}/casts?api_key=${process.env.MOVIEDB}`;
	
		const { data } = await axios.get(url);
	
		return result = {
			cast: data.cast.slice(0,6),
			crew: data.crew.slice(0,1)
		};
	} catch (err) {
		return {
			cast: [],
			crew: []
		}
	}
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

const formatMovieName = (file, year) => {
	let splitted = file.split('.')
	const ext = splitted.pop()
	splitted = splitted.map(cur => cur.split(' ')).flat()
	const name = splitted.filter(cur => !cur.includes(year))
		.filter(cur => !/.*1080p.*/.test(cur) && !/.*720p.*/.test(cur))
		.join(' ')
	return { name, ext}
}

const getTorrentlist = async movie => {
	let allTorrents = [...movie.items, ...movie.items_lang]
	const langs = []

	const movies = await Movie.find( {} ).exec();
	movies.forEach(cur => {
		if (cur.downloaded) {
			for (const torrent of allTorrents) {
				if (torrent.id == cur.torrentID) {
					torrent.downloaded = true
					break;
				}
			}
		}
	})
	allTorrents = allTorrents.map(cur => {
		let language = cur.language
		if (language == "") language = 'us'
		if (language == "pb") language = 'br'
		if (!langs.find(item => item == language)) langs.push(language)
		const { name, ext} = formatMovieName(cur.file, movie.year)
		return {
			ext,
			name,
			language,
			downloaded: cur.downloaded,
			quality: cur.quality,
			id: cur.id,
			size: cur.size_bytes,
			magnet: cur.torrent_magnet,
			peers: cur.torrent_peers,
			seeds: cur.torrent_seeds
		}
	});

	return {
		langs,
		t720: allTorrents.filter(cur => cur.quality == '720p'),
		t1080: allTorrents.filter(cur => cur.quality == '1080p')
	}
}

const fetchMovie = async id => {
	const url = `https://api.apiumadomain.com/movie?cb=&quality=720p,1080p,3d&page=1&imdb=${id}`;
	const { data } = await axios.get(url);
	const { title, year, genres, rating, imdb, poster_big, description, runtime, trailer } = data
	const torrents = await getTorrentlist(data)
	const movie = {
		imdb,
		year,
		genres,
		title,
		rating,
		runtime,
		trailer,
		torrents,
		poster_big: poster_big.replace('http:', 'https:'),
		description
	}
	return movie;
}

const getTorrent = (movie, id) => {
	const torrents = [ ...movie.torrents.t720, ...movie.torrents.t1080 ]
	for (const cur of torrents) {
		if (cur.id == id) return cur
	}
}

module.exports = (movieList, downloadList) => {

	router.get('/info/:imdb', async (req, res) => {
		try {
			const { imdb } = req.params;
			const [ movie, sub, cast ] = await Promise.all([
				fetchMovie(imdb),
				getSubt(imdb, imdb == "tt8752498"),
				getInfo(imdb)
			])
			movie.sub = sub
			movie.cast = cast
			res.json({ movie });
		} catch (err) {
			res.json({ err: true })
		}
	})

	router.get('/download/:torrentID', async (req, res) => {
		const { torrentID } = req.params;
		Movie.findOne({ torrentID }, (err, movie) => {
			if (movie.downloaded) {
				const ext = movie.path.split('.').pop()
				if ( ext == "mp4" || ext == "mkv" || ext == "avi" || ext == "webm") {
						return res.download(movie.path);
					}
					return res.download(`${movie.path}/${movie.name}`);
				} else {
					return res.end();
				}
		});
	})

	router.get('/:imdb/:id', async (req, res) => {
		try {
			const { range } = req.headers
			const { imdb, id } = req.params
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
				torrent.magnet = torrent.magnet.replace(/[^\x00-\x7F]/g, "")
				const uploadPath = resolve(dirname(__dirname), 'movies')
				const engine = torrentStream(torrent.magnet, { path: uploadPath })
				engine.on('torrent', () => {
					engine.files = engine.files.sort((a, b) => b.length - a.length)
					engine.files.forEach((cur, i) => !i ? cur.select() : cur.deselect())
					downloadList[id] = { file: engine.files[0], engine }
					stream(range, engine.files[0], res)
				})
				engine.on('idle', () => {
					const { name } = engine.torrent;
					const path = `${uploadPath}/${name}`;
					Movie.findOne({ path }, (err, movie) => {
						if (movie && !movie.downloaded) {
							movie.torrentID = id;
							movie.name = engine.files[0].name;
							movie.downloaded = true;
							movie.save();
						}
					});
				})
			} else {
				res.sendStatus(416)
			}
		} catch (err) {
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
			let purl = `https://api.apiumadomain.com/list?short=1&sort=${sortType}&cb=&quality=720p,1080p,3d&page=${page}`;
			let yurl = `https://yts.lt/api/v2/list_movies.json?&page=${page}`;
			if (query) {
				purl = `${purl}&keywords=${query}`;
				yurl = `${yurl}&query_term=${query}`;
				let merged = [];
				const { data } = await axios.get(purl);
				if (data.MovieList.length) {
					merged = data.MovieList.map(cur => ({
						title: cur.title,
						year: cur.year,
						rating: cur.rating,
						imdb: cur.imdb,
						poster_med: cur.poster_med.replace('http:', 'https:')
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
					merged = [
						...ytsList.filter(cur => {
							for (const item of merged) {
								if (cur.imdb === item.imdb) return false;
							}
							return true
						}),
						...merged
					];
				}).catch(() => 1);
				return res.json(merged);
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
						poster_med: cur.poster_med.replace('http:', 'https:')
					}));
				}
				return res.json(popcornList);
			}
		} catch (error) {
			res.json([]);
		}
	});

	return router
}
