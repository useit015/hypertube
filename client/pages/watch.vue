<template>
    <videoPlayer
        class="video__box"
        ref="videoPlayer"
        :options.sync="options"
        :playsinline="true"
        @loadeddata="onPlayerLoadeddata($event)"
        @statechanged="playerStateChanged($event)"
        @progress="progress"
    />
    <!-- <video
		:src="options.sources[0].src"
		type="video/x-matroska; codecs='theora, vorbis'"
		autoplay
		controls
	></video>-->
</template>

<script>
import { mapGetters } from 'vuex'
import { videoPlayer } from 'vue-video-player'

export default {
    components: {
        videoPlayer
    },
    computed: {
        ...mapGetters(['watching', 'movie']),
        player() {
            return this.$refs.videoPlayer.player
        },
        options() {
            if (!this.watching) return null
            const { id, file } = this.movie
            const ext = file.split('.').pop()
            const finalExt = ext == 'mp4' || ext == 'webm' ? ext : 'webm'
            console.log(ext)
            return {
                fluid: true,
                muted: false,
                preload: 'auto',
                autoplay: true,
                language: this.$i18n.locale,
                playbackRates: [0.5, 1.0, 1.5, 2.0],
                sources: [
                    {
                        type: `video/webm`,
                        src: `http://localhost:4000/api/movies/${id}`
                    }
                ]
            }
        }
    },
    methods: {
        playerStateChanged() {
            const percent = (this.player.bufferedPercent() * 100).toFixed(1)
            console.log('------>', percent + ' %')
            console.log('this.player.buffered() -->', this.player.buffered())
            console.log('this.player.bufferedEnd() -->', this.player.bufferedEnd())
        },
        onPlayerLoadeddata(player) {
            console.log('onPlayerLoadeddata')
        },
        progress() {
            console.log()
        }
    }
}
</script>

<style>
.video__box {
    width: 90vw;
    margin: 6rem auto 0;
}
</style>
