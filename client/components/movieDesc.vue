<template>
	<v-overlay :value="open" color="black" opacity=".9">
		<div class="movie_poster" :style="`background-image:url(${movie.poster_big});`"></div>
		<div class="movie_content">
			<h1 class="movie_title display-1 font-weight-black text-uppercase mb-3">{{ movie.title }}</h1>
			<v-row align="center" justify="start" class="movie_info mb-5">
				<span class="movie_genre mx-4 text-capitalize title">{{ genre }}</span>
				<v-icon>calendar_today</v-icon>
				<span class="movie_year ml-2 mr-4">{{ movie.year }}</span>
				<v-icon>access_time</v-icon>
				<span class="movie_duration ml-2 mr-4">{{ `${movie.runtime} min` }}</span>
				<v-rating dense class="mx-3" color="white" small readonly :value="movie.rating / 2"/>
			</v-row>
			<p class="movie_desc">{{ movie.description }}</p>
			<v-row justify="end" class="mr-5">
				<v-btn text rounded color="white" class="movie_action mr-2">
					<v-icon>favorite</v-icon>
				</v-btn>
				<v-btn text rounded color="white" class="movie_action" @click="openTrailer">
					<v-img ref="img" src="/trailer.svg" width="20" class="movie_trailer"/>
				</v-btn>
			</v-row>
			<v-row justify="center">
				<v-list dense>
					<v-list-item-group color="primary">
						<v-list-item v-for="(item, i) in movie.items" :key="i">
							<!-- <v-list-item-icon>
							<v-icon v-text="item.icon"></v-icon>
							</v-list-item-icon>-->
							<v-list-item-content>
								<nuxt-link :to="`/watch/${id}/${i}`">{{ item.file }}</nuxt-link>
								<!-- <v-list-item-title nuxt :to="`/watch/${id}/${i}`">{{ item.file }}</v-list-item-title> -->
							</v-list-item-content>
						</v-list-item>
					</v-list-item-group>
				</v-list>
			</v-row>
		</div>
		<v-row v-if="trailer" column align="center" justify="center" class="trailer_overlay">
			<v-btn
				fab
				top
				right
				small
				outlined
				absolute
				color="primary"
				class="trailer_close"
				@click="trailer = false"
			>
				<v-icon>close</v-icon>
			</v-btn>
			<youtube fitParent :player-vars="vars" ref="youtube" :video-id="movie.trailer"/>
		</v-row>
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
		data: () => ({
			id: null,
			open: false,
			movie: {},
			timer: null,
			trailer: false,
			vars: { autoplay: 1 }
		}),
		computed: {
			genre() {
				if (!this.movie.genres || !this.movie.genres.length) return "";
				return this.movie.genres.join(",");
			}
		},
		created() {
			this.$bus.$on("openDesc", this.openDesc);
		},
		methods: {
			async openDesc(id) {
				try {
					this.id = id;
					const url = `https://api.apiumadomain.com/movie?cb=&quality=720p,1080p,3d&page=1&imdb=${id}`;
					const { data } = await axios.get(url);
					this.movie = data;
					this.open = true;
				} catch (err) {
					console.log("Got error here --> ", err);
				}
			},
			openTrailer() {
				this.trailer = true;
				this.$bus.$emit("openTrailer", this.trailer);
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
	width: 50vw;
}
.movie_title {
	text-shadow: 2px 2px 7px rgba(0, 0, 0, 0.4);
}
.movie_desc,
.movie_content {
	text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
}
.movie_close {
	z-index: 2 !important;
	transform: translate(-50%, 125%);
}

.trailer_close {
	z-index: 2 !important;
	transform: translate(0%, 225%);
}

@media all and (max-width: 1200px) {
	.movie_content {
		width: 60vw;
	}
}

@media all and (max-width: 1000px) {
	.movie_content {
		width: 70vw;
	}
}

@media all and (max-width: 700px) {
	.movie_content {
		width: 80vw;
	}
}

@media all and (min-width: 1700px) {
	.movie_content {
		width: 40vw;
	}
}
.trailer_overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.8);
	z-index: 4;
	padding: 0 5rem;
}
.movie_trailer {
	transform: scale(0.85);
}
iframe {
	position: absolute;
	left: 0.7rem;
	width: 100vw;
	height: 100vh;
}
</style>
