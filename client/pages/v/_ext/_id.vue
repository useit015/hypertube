<template>
	<video-player
		class="video__box"
		ref="videoPlayer"
		:options="options"
		:playsinline="true"
		@ended="onPlayerEnded($event)"
		@loadeddata="onPlayerLoadeddata($event)"
		@statechanged="playerStateChanged($event)"
		@progress="progress"
	></video-player>
</template>

<script>
	import { videoPlayer } from "vue-video-player";

	export default {
		components: {
			videoPlayer
		},
		data() {
			const { id, ext } = this.$route.params;
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
							src: `https://hypertube.tk/api/movies/${id}`
						}
					]
				}
			};
		},
		mounted() {
			console.log("this is current player instance object", this.player);
		},
		computed: {
			player() {
				return this.$refs.videoPlayer.player;
			},
			playerError() {
				return this.$refs.videoPlayer.player.error_;
			}
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
			onPlayerLoadeddata(player) {
				console.log("onPlayerLoadeddata");
			},
			onPlayerEnded() {
				console.log("The fucking movie has ended !!");
			},
			progress() {
				console.log();
			}
		},
		beforeDestroy() {
			this.$socket.client.emit("cleanup");
		}
	};
</script>

<style>
.video__box {
	width: 90vw;
	margin: 6rem auto 0;
}
</style>
