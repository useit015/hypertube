<template>
	<v-overlay :value="open" color="black" opacity=".9">
		<div class="movie_poster" :style="`background-image:url(${movie.poster_big});`"></div>
		<div class="movie_content">
			<h1 class="movie_title display-1 font-weight-black text-uppercase mb-3">{{ movie.title }}</h1>
			<v-row align="center" justify="start" class="movie_info">
				<span class="movie_genre mx-4">{{ genre }}</span>
				<v-icon>calendar_today</v-icon>
				<span class="movie_year ml-2 mr-4">{{ movie.year }}</span>
				<v-icon>access_time</v-icon>
				<span class="movie_duration ml-2 mr-4">{{ `${movie.runtime} min` }}</span>
				<v-rating dense class="mx-3" color="white" small readonly :value="movie.rating / 2"/>
			</v-row>
		</div>
		<v-btn
			fab
			top
			right
			small
			outlined
			absolute
			color="primary"
			class="movie_close"
			@click="open = false"
		>
			<v-icon>close</v-icon>
		</v-btn>
	</v-overlay>
</template>

<script>
	import axios from "axios";
	export default {
		name: "movieDesc",
		props: {
			genres: {
				type: Object,
				default: () => ({
					"12": "Adventure",
					"14": "Fantasy",
					"16": "Animation",
					"18": "Drama",
					"27": "Horror",
					"28": "Action",
					"35": "Comedy",
					"36": "History",
					"37": "Western",
					"53": "Thriller",
					"80": "Crime",
					"99": "Documentary",
					"878": "Science Fiction",
					"9648": "Mystery",
					"10402": "Music",
					"10749": "Romance",
					"10751": "Family",
					"10752": "War",
					"10770": "TV Movie"
				})
			}
		},
		data: () => ({
			open: false,
			movie: {}
		}),
		computed: {
			// poster() {
			// 	const path = this.movie.poster_big
			// 	if (!path) return "";
			// 	return `https://image.tmdb.org/t/p/w780${path}`;
			// },
			// year() {
			// 	if (!this.movie.release_date) return "";
			// 	return this.movie.release_date.split("-")[0];
			// },
			genre() {
				if (!this.movie.genres || !this.movie.genres.length) return "";
				return this.movie.genres[0];
			}
			// duration() {
			// 	if (!this.genres || !this.movie.genre_ids) return "";
			// 	return this.genres[this.movie.genre_ids[0]];
			// }
		},
		created() {
			this.$bus.$on("openDesc", this.openDesc);
		},
		methods: {
			async openDesc(id) {
				// try {
				// 	const TMDB_KEY = "76dc6a53508624a4aa33450eff1abea3";
				// 	const url = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_KEY}&external_source=imdb_id`;
				// 	const { data } = await axios.get(url);
				// 	this.movie = data.movie_results[0];
				// 	this.open = true;
				// } catch (err) {
				// 	console.log("Got error here --> ", err);
				// }
				try {
					const url = `https://api.apiumadomain.com/movie?cb=&quality=720p,1080p,3d&page=1&short=1&imdb=${id}`;
					const { data } = await axios.get(url);
					this.movie = data;
					this.open = true;
				} catch (err) {
					console.log("Got error here --> ", err);
				}
			}
		}
	};
</script>

<style>
.v-overlay__content {
	width: 100vw;
}
.movie_poster {
	width: 70vmin;
	height: 100vh;
	background-position: top left;
	background-size: cover;
	pointer-events: none;
	filter: saturate(116%);
	-webkit-filter: saturate(116%);
	mask-image: -webkit-gradient(
		linear,
		right top,
		left top,
		color-stop(1, rgba(0, 0, 0, 1)),
		color-stop(0.5, rgba(0, 0, 0, 1)),
		color-stop(0, rgba(0, 0, 0, 0))
	);
	-webkit-mask-image: -webkit-gradient(
		linear,
		right top,
		left top,
		color-stop(1, rgba(0, 0, 0, 1)),
		color-stop(0.5, rgba(0, 0, 0, 1)),
		color-stop(0, rgba(0, 0, 0, 0))
	);
}
.movie_content {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.movie_title {
	text-shadow: 1px 1px 5px #000;
}
.movie_close {
	transform: translate(-50%, 125%);
}
</style>
