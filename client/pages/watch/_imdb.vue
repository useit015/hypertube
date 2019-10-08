<template>
	<loader v-if="loading"></loader>
	<div class="main__container watch" v-else>
		<div class="watch__overlay" :style="overlay"></div>
		<v-container class="movie__content">
			<v-row class="movie" justify="center" align="start">
				<v-col xs="10" sm="8" md="5" lg="4" xl="3">
					<movie-poster
						:name="movie.title"
						:poster="movie.poster_big"
						:imdb="imdb"
						@trailerOpen="trailer = true"
					/>
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
						<v-btn
							v-for="(genre, i) in movie.genres"
							:key="i"
							outlined
							disabled
							class="mx-3"
							v-text="$t(`genres.${genre}`)"
						/>
					</v-row>
					<p class="movie__desc text-md-left text-center my-5 py-5" v-text="description"></p>
					<movie-filters :torrents="movie.torrents" @play="play"/>
				</v-col>
			</v-row>
			<movie-cast :cast="movie.cast"/>
			<movie-comments :imdb="this.imdb"/>
			<v-row v-if="trailer" column align="center" justify="center" class="trailer_overlay">
				<v-btn fab small outlined color="primary" class="trailer_close" @click="trailer = false">
					<v-icon>close</v-icon>
				</v-btn>
				<movie-player youtube :youtubeId="movie.trailer"/>
			</v-row>
			<v-row v-if="movieLoading" column align="center" justify="center" class="trailer_overlay">
				<v-btn
					fab
					small
					outlined
					color="primary"
					class="trailer_close"
					v-show="playing"
					@click="closeMovie"
				>
					<v-icon>close</v-icon>
				</v-btn>
				<movie-player
					v-show="playing"
					:ext="selected.ext"
					:id="selected.id"
					:imdb="selected.imdb"
					:subs="selected.sub"
					@loaded="movieLoaded"
					@playerError="playerError"
				/>
			</v-row>
			<v-btn fab outlined small color="primary" class="back pl-2" @click="$router.go(-1)">
				<v-icon>arrow_back_ios</v-icon>
			</v-btn>
		</v-container>
		<loader v-if="movieLoading && !playing"></loader>
	</div>
</template>

<script>
import axios from "axios";
import translate from "translate";
import utility from "@/assets/utility";
import loader from "@/components/loader";
import { mapActions, mapGetters } from "vuex";
import movieCast from "@/components/movieCast";
import moviePlayer from "@/components/moviePlayer";
import moviePoster from "@/components/moviePoster";
import movieFilters from "@/components/movieFilters";
import movieComments from "@/components/movieComments";

export default {
	middleware: "authenticated",
	components: {
		loader,
		movieCast,
		moviePlayer,
		moviePoster,
		movieFilters,
		movieComments
	},
	data: () => ({
		movie: {},
		loading: true,
		playing: false,
		trailer: false,
		description: "test",
		movieLoading: false,
		selectedTorrent: null,
		vars: {
			autoplay: 1
		},
		timer: null
	}),
	async created() {
		try {
			const url = `https://hypertube.tk/api/movies/info/${this.imdb}`;
			const { data } = await axios.get(url);
			this.movie = data.movie;
			if (this.locale == "en" || this.locale == "dr") {
				this.description = this.movie.description;
			} else {
				this.description = await translate(this.movie.description, {
					to: this.locale,
					engine: "google",
					key: process.env.translateKey
				});
			}
			this.loading = false;
		} catch (err) {
			this.openAlert(this, "edit.fail");
		}
	},
	watch: {
		trailer() {
			if (this.trailer) window.scrollTo(0, 0);
			document.documentElement.style.overflow = this.trailer
				? "hidden"
				: "auto";
		},
		movieLoading() {
			if (this.movieLoading) window.scrollTo(0, 0);
			document.documentElement.style.overflow = this.movieLoading
				? "hidden"
				: "auto";
		}
	},
	computed: {
		...mapGetters(["user"]),
		imdb() {
			return this.$route.params.imdb;
		},
		overlay() {
			const gradient = [
				"to bottom",
				"rgba(0, 0, 0, 0.6)",
				"rgba(0, 0, 0, 0.8)"
			].join(", ");
			const movie = `url("${this.movie.poster_big}")`;
			return `background-image: linear-gradient(${gradient}), ${movie}`;
		},
		runtime() {
			const { runtime } = this.movie;
			const hours = runtime / 60;
			const mins = runtime % 60;
			return `${hours.toFixed(0)} h ${mins} min`;
		},
		selected() {
			if (this.selectedTorrent) {
				return { ...this.selectedTorrent };
			} else {
				return {
					id: null,
					ext: null,
					sub: null,
					imdb: null
				};
			}
		},
		locale() {
			if (this.$i18n) return this.$i18n.locale;
		},
		userId() {
			return this.user._id;
		}
	},
	methods: {
		...utility,
		...mapActions(["markAsWatched"]),
		play({ ext, id }) {
			const { imdb } = this;
			const sub = this.movie.sub.filter(cur => !!cur.path.length);
			this.selectedTorrent = { id, ext, imdb, sub };
			this.movieLoading = true;
			this.timer=setTimeout(() => {
				this.playerError();
				this.openAlert(this, "edit.fail");
			}, 90000);
		},
		closeMovie() {
			if (this.playing) {
				this.playing = false;
				this.movieLoading = false;
				this.selectedTorrent = null;
				this.$socket.client.emit("cleanup");
			}
		},
		movieLoaded() {
			this.playing = true;
			clearTimeout(this.timer);
			const payload = {
				imdb: this.imdb,
				userId: this.userId,
				title: this.movie.title,
				id: this.selectedTorrent.id,
				poster: this.movie.poster_big
			};
			this.$socket.client.emit("watch", payload);
			this.markAsWatched(payload);
		},
		playerError() {
			this.playing = false;
			this.movieLoading = false;
			this.selectedTorrent = null;
			this.$socket.client.emit("cleanup");
		}
	}
};
</script>

<style>
	.watch {
		margin-top: -5rem;
	}

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
		padding: 0 0 0 2rem;
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

	@media only screen and (max-width: 960px) {
		.movie__details {
			padding: 1rem;
			margin-top: 2rem;
		}
	}
</style>
