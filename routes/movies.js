const express = require("express");
const axios = require("axios");
const cloudscraper = require("cloudscraper");

const router = express.Router();

router.post("/", async (req, res) => {
  let { page, query, genre, sort } = req.body;

  let sortType = "";

  if (sort === undefined) sortType = "seeds";

  if (sort === "Popularity") sortType = "seeds";

  if (sort === "Date added") sortType = "dateadded";

  if (sort === "Year") sortType = "year";

  if (sort === "Title") sortType = "title";

  let purl = `https://api.apiumadomain.com/list?sort=${sortType}&short=1&cb=&quality=720p,1080p,3d&page=${page}`;

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
          ...popcornList.filter(cur => {
            for (let item of ytsList) {
              if (cur.imdb === item.imdb) return false;
            }
            return true;
          }),
          ...ytsList
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
