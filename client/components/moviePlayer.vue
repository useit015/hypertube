<template>
	<video-player
		class="video__box"
		ref="videoPlayer"
		:options="options"
		:playsinline="true"
		@ended="onPlayerEnded($event)"
		@loadeddata="onPlayerLoadeddata($event)"
		@statechanged="playerStateChanged($event)"
		@timeupdate="onPlayerTimeupdate($event)"
	></video-player>
</template>

<script>
	import { videoPlayer } from "vue-video-player";

	export default {
		components: {
			videoPlayer
		},
		props: {
			id: { type: String, default: "" },
			ext: { type: String, default: "" },
			imdb: { type: String, default: "" }
		},
		data() {
			const ext = this.ext == "mp4" || this.ext == "webm" ? this.ext : "webm";
			return {
				options: {
					fluid: true,
					muted: false,
					preload: "auto",
					autoplay: true,
					language: this.$i18n.locale,
					playbackRates: [0.5, 1.0, 1.5, 2.0],
					sources: [
						{
							type: `video/${ext}`,
							src: `https://hypertube.tk/api/movies/${this.imdb}/${
								this.id
							}`
						}
					]
				}
			};
		},
		methods: {
			playerStateChanged() {
				// const percent = (this.player.bufferedPercent() * 100).toFixed(1);
				// console.log("------>", percent + " %");
				// console.log("this.player.buffered() -->", this.player.buffered());
				// console.log(
				// 	"this.player.bufferedEnd() -->",
				// 	this.player.bufferedEnd()
				// );
			},
			onPlayerTimeupdate(player) {
				console.log("currentTime -->", player.currentTime());
				// if (!this.watchedMovie && player.currentTime() > 10) {
				// 	this.markWatched();
				// }
			},
			onPlayerLoadeddata(player) {
				this.$emit("loaded");
			},
			onPlayerEnded() {
				console.log("The fucking movie has ended !!");
			}
		}
	};
</script>

<style>
.video__box {
	width: 100vw;
	margin: 4rem auto 0;
}

.vjs-big-play-button {
	left: 50% !important;
	top: 50% !important;
	transform: translate(-50%, -50%);
}
</style>
