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
		@progress="progress"
	></video-player>
</template>

<script>
	import axios from "axios";
	import { videoPlayer } from "vue-video-player";
	import { mapGetters, mapActions } from "vuex";

	export default {
		middleware: "authenticated",
		components: {
			videoPlayer
		},
		data() {
			const { imdb, video } = this.$route.params;
			const [id, ext] = video.split(".");
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
							src: `https://hypertube.tk/api/movies/${imdb}/${id}`
						}
					]
				}
			};
		},
		mounted() {
			console.log("this is current player instance object", this.player);
		},
		computed: {
			...mapGetters(["user", "watched"]),
			player() {
				return this.$refs.videoPlayer.player;
			},
			playerError() {
				return this.$refs.videoPlayer.player.error_;
			},
			watchedMovie() {
				if (!this.watched) return true;
				const { imdb } = this.$route.params;
				return this.watched.includes(imdb);
			}
		},
		methods: {
			...mapActions(["markAsWatched"]),
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
				if (!this.watchedMovie && player.currentTime() > 10) {
					this.markWatched();
				}
			},
			onPlayerLoadeddata(player) {
				console.log("onPlayerLoadeddata");
			},
			onPlayerEnded() {
				console.log("The fucking movie has ended !!");
			},
			progress() {
				console.log();
			},
			markWatched() {
				const { imdb } = this.$route.params;
				const url = `https://hypertube.tk/api/users/watched`;
				const headers = { Authorization: `jwt ${this.user.token}` };
				this.markAsWatched(imdb);
				axios.post(url, { imdb }, { headers });
			}
		},
		beforeDestroy() {
			this.$socket.client.emit("cleanup");
		}
	};
</script>

<style>
.video__box {
	width: 100vw;
	margin: 4rem auto 0;
}
</style>
