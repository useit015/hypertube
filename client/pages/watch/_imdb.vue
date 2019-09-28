<template>
	<loader v-if="loading"></loader>
	<div class="main__container watch" v-else>
		<div class="watch__overlay" :style="overlay"></div>
		<v-container class="movie__content">
			<v-row class="movie" justify="center" align="start">
				<v-col xs="10" sm="8" md="5" lg="4" xl="3">
					<v-hover class="hover">
						<template v-slot:default="{ hover }">
							<v-card class="mx-auto">
								<v-img :src="movie.poster_big" class="movie__img" hover></v-img>
								<v-fade-transition>
									<v-overlay v-show="hover" class="movie__img--overlay" absolute>
										<svg
											x="0px"
											y="0px"
											viewBox="0 0 58 58"
											class="movie__action trailer"
											@click="trailer = true"
										>
											<g>
												<path
													d="M36.537,28.156l-11-7c-0.308-0.195-0.698-0.208-1.019-0.033C24.199,21.299,24,21.635,24,22v14
												c0,0.365,0.199,0.701,0.519,0.877C24.669,36.959,24.834,37,25,37c0.187,0,0.374-0.053,0.537-0.156l11-7
												C36.825,29.66,37,29.342,37,29S36.825,28.34,36.537,28.156z M26,34.179V23.821L34.137,29L26,34.179z"
												></path>
												<path
													d="M57,6H47H11H1C0.448,6,0,6.447,0,7v11v11v11v11c0,0.553,0.448,1,1,1h10h36h10c0.552,0,1-0.447,1-1V40V29V18V7
												C58,6.447,57.552,6,57,6z M10,28H2v-9h8V28z M2,30h8v9H2V30z M12,40V29V18V8h34v10v11v11v10H12V40z M56,28h-8v-9h8V28z M48,30h8v9
												h-8V30z M56,8v9h-8V8H56z M2,8h8v9H2V8z M2,50v-9h8v9H2z M56,50h-8v-9h8V50z"
												></path>
											</g>
										</svg>
										<v-icon class="movie__action like">favorite</v-icon>
									</v-overlay>
								</v-fade-transition>
							</v-card>
						</template>
					</v-hover>
				</v-col>
				<v-col xs="12" sm="10" md="7" class="movie__details">
					<h1
						class="movie__title text-md-left text-center font-weight-black text-uppercase"
					>{{ movie.title }}</h1>
					<v-row align="center" justify="center" justify-md="start" class="movie_info my-5 pt-2">
						<v-icon class="ml-4 movie__icon">calendar_today</v-icon>
						<span class="movie_year ml-2 mr-4">{{ movie.year }}</span>
						<v-icon class="movie__icon">access_time</v-icon>
						<span class="movie_duration ml-2 mr-4">{{ runtime }}</span>
						<v-rating dense class="mx-3" color="white" small readonly :value="movie.rating / 2"/>
					</v-row>
					<v-row align="center" justify="start" class="movie__genre my-5 pt-2">
						<v-btn v-for="(genre, i) in movie.genres" :key="i" outlined disabled class="mx-3">{{ genre }}</v-btn>
					</v-row>
					<p class="movie__desc text-md-left text-center my-5 py-5">{{ movie.description }}</p>
					<v-row justify="space-between" class="my-5 pt-5 ml-4">
						<v-btn-toggle mandatory color="primary" class="quality">
							<v-btn large text :disabled="!qualityExists('720')" value="720p">720p</v-btn>
							<v-btn large text :disabled="!qualityExists('1080')" value="1080p">1080p</v-btn>
						</v-btn-toggle>
						<v-select :items="[1,2,3]" label="Outlined style" outlined></v-select>
					</v-row>
					<v-row class="my-5 py-5 ml-4">
						<v-btn-toggle mandatory color="primary" class="lang">
							<v-btn text v-for="(lang, i) in torrents.langs" :key="i">
								<country-flag :country="lang"/>
							</v-btn>
						</v-btn-toggle>
					</v-row>
				</v-col>
			</v-row>
			<v-row class="movie" justify="space-around" align="start">
				<v-col xs="10" sm="8" md="5" lg="4" xl="3" class="movie__actors">
					<h1 class="movie__title sub text-center font-weight-black text-uppercase mb-5 pb-5">Director</h1>
					<v-row justify="center">
						<v-card class="director__card">
							<v-img :src="testImage(movie.cast.crew[0].profile_path)"></v-img>
							<h4 class="text-center">{{ movie.cast.crew[0].name }}</h4>
						</v-card>
					</v-row>
				</v-col>
				<v-col xs="12" sm="10" md="7" lg="6" xl="5" class="movie__actors">
					<h1 class="movie__title sub text-center font-weight-black text-uppercase mb-5 pb-5">Actors</h1>
					<v-row justify="center">
						<v-card v-for="actor in movie.cast.cast" :key="actor.cast_id" class="actor__card">
							<v-img :src="testImage(actor.profile_path)"></v-img>
							<h4 class="text-center mt-auto">{{ actor.name }}</h4>
						</v-card>
					</v-row>
				</v-col>
			</v-row>
			<v-row v-if="trailer" column align="center" justify="center" class="trailer_overlay">
				<v-btn fab small outlined color="primary" class="trailer_close" @click="trailer = false">
					<v-icon>close</v-icon>
				</v-btn>
				<youtube fitParent :player-vars="vars" ref="youtube" :video-id="movie.trailer"/>
			</v-row>
			<v-btn fab outlined small color="primary" class="back pl-2" @click="$router.push('/')">
				<v-icon>arrow_back_ios</v-icon>
			</v-btn>
		</v-container>
	</div>
</template>

<script>
	import axios from "axios";
	import loader from "@/components/loader";
	import CountryFlag from "vue-country-flag";
	import { mapGetters, mapActions } from "vuex";

	export default {
		middleware: "authenticated",
		components: {
			loader,
			CountryFlag
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
				this.$bus.$emit("enterMoviePage");
				if (!this.movieFromStore) {
					const url = `https://hypertube.tk/api/movies/info/${this.imdb}`;
					const { data } = await axios.get(url);
					console.log("data -->", data);
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
			this.$bus.$emit("leaveMoviePage");
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
			overlay() {
				return `background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url('${
					this.movie.poster_big
				}')`;
			},
			runtime() {
				const { runtime } = this.movie;
				const hours = runtime / 60;
				const mins = runtime % 60;
				return `${hours.toFixed(0)} h ${mins} min`;
			},
			torrents() {
				return this.movie.torrents;
			}
		},
		methods: {
			...mapActions(["addMovie", "removeMovie"]),
			testImage(base, width = 500) {
				if (base) {
					return `https://image.tmdb.org/t/p/w${width}/${base}`;
				} else {
					return `https://via.placeholder.com/${width}?text=No+Picture`;
				}
			},
			qualityExists(quality) {
				if (!this.torrents) return;
				const list = this.torrents[`t${quality}`];
				return list && list.length;
			},
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
@import url("https://fonts.googleapis.com/css?family=Bungee&display=swap");

.watch__overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-position: center;
	background-size: cover;
	filter: blur(6px);
	-webkit-filter: blur(6px);
}

.movie__content {
	font-size: 1.2rem;
	margin: 10rem auto;
}

.movie__details {
	position: relative;
	padding: 2rem 0 0 2rem;
}

.movie__actors {
	position: relative;
	margin: 5rem 0;
	width: 100%;
}

.movie__title {
	font-family: "Bungee", cursive;
	letter-spacing: 3px;
	font-size: 2.2em;
	text-shadow: 0 0 15px rgba(100, 214, 197, 0.5);
}

.movie__title.sub {
	font-size: 2em;
}

.movie__img > .v-responsive__content {
	box-shadow: inset 0 0 20px 2px rgba(0, 0, 0, 0.5),
		0 0 2px 20px rgba(0, 0, 0, 0.5);
}

.movie__img {
	border-radius: 5px !important;
}

.movie__genre > .theme--dark.v-btn.v-btn--disabled {
	color: #fff !important;
	text-shadow: 0 0 15px rgba(100, 214, 197, 0.5);
	border-color: #fff;
	box-shadow: inset 0 0 5px rgba(100, 214, 197, 0.5),
		inset 0 0 10px rgba(100, 214, 197, 0.5),
		0 0 10px rgba(100, 214, 197, 0.5), 0 0 5px rgba(100, 214, 197, 0.5) !important;
}

.movie__icon,
.v-rating > .v-icon {
	text-shadow: 0 0 25px rgba(100, 214, 197, 0.5),
		0 0 20px rgba(100, 214, 197, 0.5), 0 0 15px rgba(255, 255, 255, 0.5),
		0 0 10px rgba(100, 214, 197, 0.5), 0 0 5px rgba(100, 214, 197, 0.5);
}

.movie__desc,
.movie__genre > .theme--dark.v-btn.v-btn--disabled {
	letter-spacing: 1.6px;
	line-height: 1.68;
}

.movie__desc {
	font-size: 1.1em;
}

.movie__img--overlay {
	transition: all 0.3s ease-in;
}

.movie__img--overlay > .v-overlay__content {
	width: 100%;
	height: 100%;
}

.movie__action {
	position: absolute;
	cursor: pointer;
	transition: all 0.2s ease-in;
}

.movie__action.like {
	top: 0;
	right: 0;
	transform: translate(-75%, 75%) scale(1.2);
}

.movie__action.trailer {
	top: 50%;
	left: 50%;
	width: 4rem;
	fill: #fff;
	transform: translate(-50%, -50%);
}

.movie__action.like:hover,
.movie__action.like:focus {
	color: #e53935;
}

.movie__action.trailer:hover,
.movie__action.trailer:focus {
	fill: #64d6c4;
}

.trailer_overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.8);
	z-index: 11;
	margin: 0;
	padding: 0 5rem;
}

.trailer_close {
	position: absolute;
	top: 0;
	right: 0;
	transform: translate(-70%, 40%);
	z-index: 15 !important;
}

.actor__card,
.director__card {
	background-color: rgba(54, 97, 97, 0.2) !important;
	box-shadow: none;
	border-radius: 5px 5px 15px 15px;
	box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.4), 0 0 10px rgba(0, 0, 0, 0.4);
}

.actor__card {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin: 1rem 1rem 3rem;
	width: calc(100% / 3 - 2rem);
}

.director__card {
	margin: 1rem;
	width: 50%;
}

.back {
	position: absolute;
	top: 0;
	left: 0;
	transform: translate(75%, 75%);
}

.quality.theme--dark.v-btn-toggle,
.lang.theme--dark.v-btn-toggle {
	background: transparent;
	border-radius: 5px;
}

@media only screen and (max-width: 960px) {
	.actor__card {
		width: calc(33% - 2rem);
	}
	.movie__details {
		padding: 1rem;
		margin-top: 2rem;
	}
}

@media only screen and (max-width: 550px) {
	.actor__card {
		width: calc(50% - 2rem);
	}
}
</style>
