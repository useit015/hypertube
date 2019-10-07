<template>
	<div class="movie_card" :style="`background-image:url(${movie.poster_med})`" @click="openMovie">
		<div class="watched__overlay" v-if="movieWatched">
			<v-icon color="primary" class="watched__icon">remove_red_eye</v-icon>
		</div>
		<v-icon color="error" class="liked__icon" v-if="movieLiked">favorite</v-icon>
		<v-layout column justify-end align-center class="overlay">
			<div class="overlay_info pt-5 mt-5">
				<h3 class="headline font-weight-black overlay_title mt-5">{{ stripYear(movie.title) }}</h3>
				<h3 v-if="movie.year" class="overlay_year mt-2">{{ movie.year }}</h3>
			</div>
			<v-rating
				dense
				class="mb-3 mt-auto overlay_rating"
				color="black"
				small
				readonly
				:value="movie.rating / 2"
			></v-rating>
		</v-layout>
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	export default {
		name: "movieCard",
		props: {
			movie: {
				type: Object,
				default: () => ({})
			}
		},
		computed: {
			...mapGetters(["watchedIds", "likedIds"]),
			movieWatched() {
				return (
					this.watchedIds &&
					this.watchedIds.find(cur => cur == this.movie.imdb)
				);
			},
			movieLiked() {
				return (
					this.likedIds &&
					this.likedIds.find(cur => cur == this.movie.imdb)
				);
			}
		},
		methods: {
			stripYear: title => title.replace(/\([0-9]{4}\)/, ""),
			openMovie() {
				this.$router.push(`/watch/${this.movie.imdb}`);
			}
		}
	};
</script>

<style>
.movie_card {
	width: 100%;
	cursor: pointer;
	height: calc(100vw / 4);
	position: relative;
	background-size: cover;
	background-position: center;
}

.overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	transition: 0.3s ease-in;
	background: rgba(255, 255, 255, 0.66);
	opacity: 0;
}

.overlay_info {
	width: 80%;
	color: #212121;
	text-align: center;
}

.overlay_year {
	font-size: 1.4em;
}

.overlay_rating {
	transform: scale(1.1);
}

.movie_card:hover > .overlay {
	opacity: 1;
}

.watched__overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #212121bb;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
}

.liked__icon {
	position: absolute;
	top: 0;
	right: 0;
	transform: translate(-50%, 50%) scale(1.1);
}

.watched__icon {
	transform: translate(50%, 50%) scale(1.25);
}
</style>
