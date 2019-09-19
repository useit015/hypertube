const express = require("express");
const axios = require("axios");
const cloudscraper = require("cloudscraper");

const router = express.Router();
const torrentStream = require('torrent-stream');
const { extname } = require('path')

const testDownload = uri => {

	const engine = torrentStream(uri);

	engine.on('ready', function() {
		console.log('***********************************');
		engine.files = engine.files.sort(function (a, b) {
			return b.length - a.length
		}).slice(0, 1)
		let file = engine.files[0]
		file.createReadStream().pipe(res)
		console.log('File found! (' + file.name + ')')
		console.log('***********************************');
	});
}

router.get('/:id/:i', async (req, res) => {
	const url = `https://api.apiumadomain.com/movie?cb=&quality=720p,1080p,3d&page=1&imdb=${req.params.id}`;
	const { data } = await axios.get(url);
	const range = req.headers.range
	console.log('range -->', range);
	const engine = torrentStream(data.items[req.params.i].torrent_magnet);
	engine.on('ready', () => {
		engine.files = engine.files.sort(function (a, b) {
			return b.length - a.length
		}).slice(0, 1)
		let file = engine.files[0]
		const parts = range.replace(/bytes=/, "").split("-")
		const start = parseInt(parts[0], 10)
		const end = parts[1] ? parseInt(parts[1], 10) : file.length - 1
		const chunksize = end - start + 1
		const head = {
			'Content-Range': `bytes ${start}-${end}/${file.length}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
		}
		res.writeHead(206, head);
		const stream = file.createReadStream({start, end}).on('end', () => {
			console.log('Response stream has reached is end')
			res.end()
		})
		stream.pipe(res)
	});
})

router.post("/", async (req, res) => {
  let { page, query, genre, sort } = req.body;

  let sortType = "";

  if (sort === undefined) sortType = "seeds";

  if (sort === "Popularity") sortType = "seeds";

  if (sort === "Date added") sortType = "dateadded";

  if (sort === "Year") sortType = "year";

  if (sort === "Title") sortType = "title";

  let purl = `https://api.apiumadomain.com/list?sort=${sortType}&short=0&cb=&quality=720p,1080p,3d&page=${page}`;

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
          poster_med: cur.poster_med
        }));
      }
    } catch (error) {
      console.log("got error : ", error.message);
    }

    return res.json(popcornList);
  }
});

module.exports = router;
