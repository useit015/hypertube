const express = require("express");
const router = express.Router();
const axios = require("axios");
const cloudscraper = require("cloudscraper");
const torrentStream = require('torrent-stream');
const FFmpeg = require('fluent-ffmpeg');
const pump = require('pump')
const { extname, resolve, join, dirname } = require('path')
const fs = require('fs');

const movieList = {}
const downloadList = {}

const stream = (range, file, res, engine) => {
	const parts = range.replace(/bytes=/, '').split('-')
	const start = parseInt(parts[0], 10)
	const end = parts[1] ? parseInt(parts[1], 10) : file.length - 1
	const chunksize = end - start + 1
	const name = file.name.split('.').slice(0, -1).join('.');
	const ext = file.name.split('.').pop();
	const finalExt = ext == 'mp4' || ext == 'webm' ? ext : 'webm'
	const head = {
		'Content-Range': `bytes ${start}-${end}/${file.length}`,
		'Accept-Ranges': 'bytes',
		'Content-Length': chunksize,
		'Content-Type': `video/${finalExt}`,
	}
	res.writeHead(206, head)
	let stream
	if (finalExt == ext) {
		stream = file.createReadStream({ start, end })
	} else {
		stream = new FFmpeg(file.createReadStream())
			.videoCodec('libvpx')
			.audioCodec('libvorbis')
			.format('webm')
			.audioBitrate(128 * 100)
			.videoBitrate(8 * 1000)
			.outputOptions([
				'-threads 8',
				'-deadline realtime',
				'-error-resilient 1'
			])
	}
	if (engine)
		stream
			.on('data', data => console.log('i have downloaded --> ', engine.swarm.downloaded))
			.on('error', err => console.log('Here is your error -->', err.message))
			.on('end', () => {
				console.log('Here is the end !')
				engine.destroy(() => console.log('--> i destroyed the engine --->'))
				res.end()
			})
	pump(stream, res, err => console.log('error in pump !!!'))
}

router.get('/:id', async (req, res) => {
	const range = req.headers.range
	console.log('range -->', range);
	if (range) {
		const downloaded = downloadList[req.params.id]
		if (downloaded) return stream(range, downloaded, res)

		const torrent = movieList[req.params.id]
		if (torrent) {
			const uploadPath = resolve(dirname(__dirname), 'movies')
			const engine = torrentStream(torrent.magnet, { path: uploadPath });
			engine.on('torrent', () => {
				engine.files = engine.files.sort((a, b) => b.length - a.length)
				const file = engine.files[0]
				downloadList[req.params.id] = file
				stream(range, file, res, engine)
			})
		}
	}
})

router.post("/", async (req, res) => {
	let { page, query, genre, sort } = req.body;
	
	console.log("__dir")

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

    try {
      if (data.MovieList.length) {
        popcornList = data.MovieList.map(cur => ({
          title: cur.title,
          year: cur.year,
          rating: cur.rating,
          imdb: cur.imdb,
          poster_med: cur.poster_med
        }));
      }
    } catch (error) {
      console.log("got error : ", error.message);
    }

    try {
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
            for (let item of popcornList) {
              if (cur.imdb === item.imdb) return false;
            }
            return true;
		  }),
		  ...popcornList
        ];
        return res.json(merged);
      });
    } catch (error) {
      console.log("got error : ", error.message);
    }
  } else {
    if (genre) purl = `${purl}&genre=${genre}`;

    let popcornList = [];

    const { data } = await axios.get(purl);

    try {
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
    } catch (error) {
      console.log("got error : ", error.message);
    }
	popcornList.forEach(movie => {
		movie.items.forEach(cur => {
			movieList[cur.id] = {
				magnet: cur.magnet,
				size: cur.size
			}
		})
	})
    return res.json(popcornList);
  }
});

module.exports = router;
