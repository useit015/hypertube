<template>
	<div class="grid-container">
		<movieCard v-for="movie in list" :key="movie.imdb" :movie="movie"/>
	</div>
</template>

<script>
	import axios from "axios";
	import movieCard from "@/components/movieCard";

	export default {
		middleware: "authenticated",
		components: {
			movieCard
		},
		async asyncData({ params }) {
			const { data } = await axios.get(
				`https://api.apiumadomain.com/list?sort=seeds&short=1&cb=&quality=720p,1080p,3d&page=1`
			);
			console.log(data.MovieList);
			return { list: data.MovieList };
		}
	};
</script>

<style>
.child-flex {
	/* padding: 0; */
	flex: 0 0 185px !important;
}
.grid-container {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr 1fr 1fr;
	grid-template-areas: ". . . . . ." ". . . . . ." ". . . . . ." ". . . . . .";
}

@media all and (-ms-high-contrast: none) {
	.grid-container {
		display: -ms-grid;
		-ms-grid-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
		-ms-grid-rows: 1fr 1fr 1fr 1fr;
	}
}
</style>
