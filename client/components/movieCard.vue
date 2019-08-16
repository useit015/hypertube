<template>
	<div class="movie_card" :style="`background-image:url(${movie.poster_med})`">
		<v-layout column justify-end align-center class="overlay">
			<div class="overlay_info pt-5 mt-5">
				<h3 class="headline font-weight-black overlay_title mt-5">{{ stripYear(movie.title) }}</h3>
				<h3 class="overlay_year mt-2">{{ movie.year }}</h3>
			</div>
			<v-rating
				dense
				class="mb-3 mt-auto overlay_rating"
				color="black"
				small
				:value="movie.rating / 2"
			></v-rating>
		</v-layout>
	</div>
</template>

<script>
	export default {
		props: {
			movie: {
				type: Object,
				default: () => ({})
			}
		},
		methods: {
			stripYear: title => title.replace(/\([0-9]{4}\)/, "")
		}
	};
</script>

<style>
.movie_card {
	width: calc(100vw / 6);
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
</style>
