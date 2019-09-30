<template>
	<div class="video__box">
		<video ref="videoPlayer" class="video-js" @loadeddata="$emit('loaded')" crossorigin="anonymous">
			<track
				v-for="(sub, i) in subs"
				:key="i"
				kind="captions"
				:label="sub.lang"
				:srclang="sub.langShort"
				:src="`http://hypertube.tk/${sub.path}`"
				:default="sub.langShort == $i18n.locale"
			>
		</video>
	</div>
</template>

<script>
	import videojs from "video.js";

	export default {
		props: {
			id: { type: String, default: "" },
			ext: { type: String, default: "" },
			imdb: { type: String, default: "" },
			subs: { type: Array, default: () => [] }
		},
		data() {
			const ext = this.ext == "mp4" || this.ext == "webm" ? this.ext : "webm";
			return {
				player: null,
				options: {
					controls: true,
					fluid: true,
					muted: false,
					preload: "auto",
					autoplay: true,
					liveui: true,
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
		mounted() {
			this.player = videojs(this.$refs.videoPlayer, this.options, () => {
				console.log("its loaded ---->");
			});
		},
		beforeDestroy() {
			if (this.player) {
				this.player.dispose();
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
