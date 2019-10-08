<template>
	<div class="video__box">
		<video ref="videoPlayer" class="video-js" @loadeddata="$emit('loaded')" crossorigin="anonymous">
			<track
				v-if="!youtube"
				v-for="(sub, i) in subs"
				:key="i"
				kind="captions"
				:label="sub.lang"
				:srclang="sub.langShort"
				:src="`https://hypertube.tk/${sub.path}`"
				:default="sub.langShort == $i18n.locale"
			>
		</video>
	</div>
</template>

<script>
import videojs from "video.js";
import Youtube from "videojs-youtube";
import utility from "@/assets/utility.js";

export default {
	methods: utility,
	props: {
		id: { type: String, default: "" },
		ext: { type: String, default: "" },
		imdb: { type: String, default: "" },
		youtubeId: { type: String, default: "" },
		subs: { type: Array, default: () => [] },
		youtube: { type: Boolean, default: false }
	},
	data() {
		const ext =
			this.ext == "mp4" || this.ext == "webm"
				? this.ext
				: this.youtube
				? "youtube"
				: "webm";
		const src = this.youtube
			? `https://www.youtube.com/watch?v=${this.youtubeId}`
			: `https://hypertube.tk/api/movies/${this.imdb}/${this.id}`;
		return {
			player: null,
			options: {
				errorDisplay: false,
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
						src,
						type: `video/${ext}`
					}
				],
				userActions: {
					doubleClick: true,
					hotkeys: true
				},
				controlBar: {
					pictureInPictureToggle: !this.youtube
				}
			}
		};
	},
	mounted() {
		const self = this;
		videojs.log.level("off");
		videojs.options.techOrder = ["youtube", "html5"];
		this.player = videojs(this.$refs.videoPlayer, this.options, function() {
			this.on("error", () => {
				self.$emit("playerError");
				self.openAlert(self, "error.torrent");
			});
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
		width: 100vmin;
		margin: 4rem auto 0;
	}

	.vjs-big-play-button {
		left: 50% !important;
		top: 50% !important;
		transform: translate(-50%, -50%);
	}
</style>
