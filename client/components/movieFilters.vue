<template>
	<div>
		<v-row
			justify-sm="space-between"
			justify="center"
			class="torrent__container mx-auto mx-md-0 my-5"
		>
			<v-btn-toggle mandatory color="primary" class="torrent__filter" v-model="selectedQuality">
				<v-btn
					v-for="qual in qualities"
					:key="qual.value"
					large
					text
					v-if="qualityExists(qual.value)"
					:value="qual.value"
					class="filters"
				>{{ qual.text }}</v-btn>
			</v-btn-toggle>
			<v-btn-toggle mandatory color="primary" class="torrent__filter" v-model="selectedLang">
				<v-btn
					text
					v-for="(lang, i) in torrents.langs"
					:key="i"
					:value="lang"
					v-if="langExists(lang)"
					class="filters"
				>
					<country-flag :country="lang"/>
				</v-btn>
			</v-btn-toggle>
		</v-row>
		<v-list min-width="95%" max-width="95%" class="torrent__list mx-auto mx-md-0">
			<v-list-item-group v-model="selectedTorrent" color="primary">
				<v-list-item class="torrent__item" v-for="(item, i) in filteredTorrentsDisplay" :key="i">
					<v-list-item-icon>
						<v-tooltip color="grey darken-4" right>
							<template v-slot:activator="{ on }">
								<v-icon
									v-text="item.speed.icon"
									:color="item.speed.color"
									class="speed__icon mr-3"
									v-on="on"
								></v-icon>
							</template>
							<span class="tooltip">{{ `Seeds ${item.seeds} / Peers ${item.peers}` }}</span>
						</v-tooltip>
						<v-tooltip color="grey darken-4" right>
							<template v-slot:activator="{ on }">
								<v-icon v-text="item.seekable.icon" v-on="on"></v-icon>
							</template>
							<span class="tooltip">{{ item.seekable.text }}</span>
						</v-tooltip>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title v-text="item.name"></v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list-item-group>
		</v-list>
		<v-row class="my-5" justify="center">
			<v-btn
				outlined
				large
				color="primary"
				class="play__btn my-5 mx-5"
				v-if="filteredTorrentsInfo[selectedTorrent]"
				@click="$emit('play', filteredTorrentsInfo[selectedTorrent])"
			>
				{{ $t('buttons.play') }}
				<v-icon class="play__icon" right>play_circle_filled</v-icon>
			</v-btn>
			<v-btn
				large
				outlined
				target="_blank"
				color="primary"
				class="play__btn download my-5 mx-5"
				v-if="filteredTorrentsInfo[selectedTorrent] && filteredTorrentsInfo[selectedTorrent].downloaded"
				:href="`https://hypertube.tk/api/movies/download/${filteredTorrentsInfo[selectedTorrent].id}`"
			>
				{{ $t('buttons.download') }}
				<v-icon class="play__icon" right>cloud_download</v-icon>
			</v-btn>
		</v-row>
	</div>
</template>

<script>
import CountryFlag from "vue-country-flag";

export default {
	components: {
		CountryFlag
	},
	props: {
		torrents: {
			type: Object,
			default: () => ({})
		}
	},
	data: () => ({
		selectedTorrent: 0,
		selectedLang: "us",
		selectedQuality: "t720",
		qualities: [
			{ value: "t720", text: "720p" },
			{ value: "t1080", text: "1080p" }
		]
	}),
	computed: {
		filteredTorrents() {
			return this.torrents[this.selectedQuality].filter(
				cur => cur.language == this.selectedLang
			);
		},
		filteredTorrentsDisplay() {
			return this.filteredTorrents.map(cur => ({
				name: cur.name,
				seeds: cur.seeds,
				peers: cur.peers,
				seekable: this.seekableIcon(cur.ext),
				speed: this.speedIcon(cur.seeds, cur.peers)
			}));
		},
		filteredTorrentsInfo() {
			return this.filteredTorrents.map(cur => ({
				id: cur.id,
				ext: cur.ext,
				downloaded: cur.downloaded
			}));
		}
	},
	methods: {
		seekableIcon(ext) {
			if (ext == "mp4" || ext == "webm") {
				return {
					icon: "fast_forward",
					text: "This movie is seekable"
				};
			} else {
				return {
					icon: "live_tv",
					text: "This movie is not seekable"
				};
			}
		},
		speedIcon(seeds, peers) {
			const total = parseInt(seeds, 10) + parseInt(peers, 10);
			if (total > 1500) {
				return {
					color: "success",
					icon: "arrow_drop_up"
				};
			} else {
				return {
					color: "error",
					icon: "arrow_drop_down"
				};
			}
		},
		qualityExists(quality) {
			if (!this.torrents) return;
			const list = this.torrents[quality];
			if (!list) return;
			return list.filter(cur => cur.language == this.selectedLang).length;
		},
		langExists(lang) {
			if (!this.torrents) return;
			const list = this.torrents[this.selectedQuality];
			if (!list) return;
			return list.filter(cur => cur.language == lang).length;
		}
	}
};
</script>

<style>
	.torrent__container {
		width: 95% !important;
	}

	.torrent__filter {
		margin: 0.5rem 0;
	}

	.torrent__filter,
	.torrent__list {
		background: none !important;
		text-align: center;
		border-radius: 5px;
	}

	.torrent__list {
		padding: 0 !important;
		border: 1px solid #64d6c450 !important;
	}

	.torrent__item {
		letter-spacing: 1.5px;
		line-height: 1.5;
		margin: 0 !important;
		border-bottom: 1px solid #64d6c450 !important;
	}

	.torrent__item:last-child:before {
		border-bottom: none !important;
		border-radius: 0 0 4px 4px !important;
	}

	.torrent__item:first-child:before {
		border-radius: 4px 4px 0 0 !important;
	}

	.filters.v-btn--active:hover::before,
	.filters.v-btn--active:before,
	.torrent__item.v-list-item--active:hover::before,
	.torrent__item.v-list-item--active:before {
		opacity: 0.15 !important;
	}

	.play__btn {
		font-family: "Bungee", cursive;
		font-size: 1.2em;
		transform: scale(1.2);
	}

	.play__btn.download {
		margin-left: 2.5rem !important;
	}

	.back,
	.play__btn {
		border-color: #64d6c499 !important;
	}

	.play__icon {
		transform: scale(1.5);
		margin: -3px 0 0 0.75rem !important;
	}

	.theme--dark.v-btn-toggle .v-btn.v-btn {
		border-color: #64d6c450 !important;
	}

	.speed__icon {
		transform: scale(1.5);
	}

	.tooltip {
		font-size: 1.05em;
		letter-spacing: 1px;
	}

	@media only screen and (max-width: 600px) {
		.torrent__filter {
			width: 100% !important;
			display: flex;
			justify-content: center;
			margin-bottom: 1rem;
		}
	}
</style>
