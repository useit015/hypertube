<template>
	<div class="main_container">
		<video id="videoPlayer" controls>
			<source
				:src="`http://hypertube.tk/api/movies/${$route.params.imdb}/${$route.params.torrent}`"
				type="video/mp4"
			>
		</video>
	</div>
</template>

<script>
	export default {
		created() {
			console.log(
				"this.$route.params.torrent -->",
				this.$route.params.torrent
			);
			console.log("this.$route.params.imdb -->", this.$route.params.imdb);
		}
	};
</script>

<style>
</style>
