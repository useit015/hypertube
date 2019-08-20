<template>
	<v-navigation-drawer class="genre_drawer" permanent :mini-variant="mini">
		<v-list nav dense class="genre_list">
			<v-btn icon @click.stop="mini = !mini">
				<v-icon>{{ `chevron_${mini ? "right" : "left"}` }}</v-icon>
			</v-btn>
			<v-divider class="mb-3"></v-divider>
			<v-list-item link v-for="(genre, i) in genres" :key="i" @click="filterMovie(genre)">
				<v-list-item-icon>
					<v-img width="40" class="genre_logo" :src="`/${genre}.svg`"/>
				</v-list-item-icon>
				<v-list-item-title class="text-capitalize">{{ $t(genre) }}</v-list-item-title>
			</v-list-item>
			<v-divider></v-divider>
			<v-list-item v-if="!mini">
				<v-col class="d-flex" align="start" justify="center">
					<v-icon small color="primary" class="sort_icon">sort</v-icon>
					<v-select
						:value="$t(items[0])"
						:item-text="items_t"
						:items="items"
						class="subtitle-2"
						solo
						@change="sortMovie"
						flat
					></v-select>
				</v-col>
			</v-list-item>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
	export default {
		data: () => ({
			genres: [
				"popular",
				"action",
				"adventure",
				"animation",
				"comedy",
				"history",
				"sport",
				"family",
				"drama",
				"mystery",
				"documentary",
				"fantasy",
				"western",
				"war",
				"crime",
				"music",
				"romance",
				"horror",
				"sci-fi",
				"thriller",
				"biography"
			],
			items: ["Popularity", "Date added", "Year", "Title"],
			mini: true,
			drawer: true
		}),
		computed: {
			items_t() {
				return items.map(cur => $t(cur));
			}
		},
		methods: {
			filterMovie(genre) {
				this.$bus.$emit("filterMovie", genre);
				this.mini = true;
			},
			sortMovie(item) {
				this.$bus.$emit("sortMovie", item);
				this.mini = true;
			}
		}
	};
</script>

<style>
.genre_drawer {
	z-index: 2;
	position: fixed;
}
.v-navigation-drawer__content::-webkit-scrollbar {
	background-color: transparent !important;
	width: 6px;
}
.v-navigation-drawer__content::-webkit-scrollbar-thumb {
	background-color: rgba(255, 255, 255, 0.2) !important;
	border-radius: 5px;
}
.genre_list {
	margin-top: 64px;
}
.sort_icon {
	margin: -2rem 1.7rem 0 -0.4rem;
	transform: scale(1.8);
}
</style>
