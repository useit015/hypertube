<template>
	<loader v-if="loading"></loader>
	<div class="main__container watch" v-else>
		<div class="watch__overlay" :style="overlay"></div>
		<div class="movie_content">
			<v-row class="movie" justify="center" align="center">
				<v-col xs="10" sm="8" md="5">
					<v-img :src="movie.poster_big" class="movie__img"></v-img>
				</v-col>
				<v-col xs="12" sm="10" md="7" class="movie__details">
					<h1 class="movie_title font-weight-black text-uppercase py-5 my-5">{{ movie.title }}</h1>
					<v-row align="center" justify="start" class="movie_info my-5">
						<span class="movie_genre mx-4 text-capitalize title">{{ genre }}</span>
						<v-icon>calendar_today</v-icon>
						<span class="movie_year ml-2 mr-4">{{ movie.year }}</span>
						<v-icon>access_time</v-icon>
						<span class="movie_duration ml-2 mr-4">{{ `${movie.runtime} min` }}</span>
						<v-rating dense class="mx-3" color="white" small readonly :value="movie.rating / 2"/>
					</v-row>
					<p class="movie_desc my-5 py-5">{{ movie.description }}</p>
					<v-row justify="end" class="mr-5">
						<v-btn text rounded color="white" class="movie_action mr-2">
							<v-icon>favorite</v-icon>
						</v-btn>
						<v-btn text rounded color="white" class="movie_action" @click>
							<v-img ref="img" src="/trailer.svg" width="20" class="movie_trailer"/>
						</v-btn>
					</v-row>
					<v-row justify="center">
						<v-btn nuxt outlined :to="`/watch/${movie.imdb}`" color="primary">Watch</v-btn>
					</v-row>
				</v-col>
			</v-row>
		</div>
	</div>
</template>

<script>
	import axios from "axios";
	import loader from "@/components/loader";
	import { mapGetters, mapActions } from "vuex";

	export default {
		components: {
			loader
		},
		data: () => ({
			movie: {},
			loading: true,
			open: false,
			trailer: false,
			vars: { autoplay: 1 }
		}),
		async created() {
			try {
				if (!this.movieFromStore) {
					const url = `https://hypertube.tk/api/movies/info/${this.imdb}`;
					const { data } = await axios.get(url);
					this.movie = data.movie;
					this.movie.sub = data.sub;
					this.movie.cast = data.info;
					this.addMovie(this.movie);
					this.loading = false;
				} else {
					this.movie = { ...this.movieFromStore };
					this.loading = false;
				}
			} catch (err) {
				console.log("i agot an error with --> ", err.message);
			}
		},
		beforeDestroy() {
			this.removeMovie(this.imdb);
		},
		computed: {
			...mapGetters(["movies"]),
			imdb() {
				return this.$route.params.imdb;
			},
			movieFromStore() {
				return this.movies[this.imdb];
			},
			genre() {
				if (!this.movie.genres || !this.movie.genres.length) return "";
				return this.movie.genres.join(", ");
			},
			overlay() {
				return `background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url('${
					this.movie.poster_big
				}')`;
			}
		},
		methods: {
			...mapActions(["addMovie", "removeMovie"]),
			watchMovie(movie) {
				// this.$socket.client.emit("watch", movie);
				// let ext = movie.file.split(".").pop();
				// ext = ext == "mp4" || ext == "webm" ? ext : "webm";
				// this.$router.push(`v/${this.id}/${movie.id}.${ext}`);
			}
		}
	};
</script>

<style>
.watch__overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-position: center;
	background-size: cover;
}

.movie {
	/* display: flex;
	align-items: center;
	flex-wrap: wrap; */
}

.movie__details {
	/* margin-top: -5rem; */
	/* width: 70vw; */
}

.movie__img {
	/* width: 30vw; */
	/* max-width: 10rem; */
	/* margin-right: 5rem; */
}
</style>
