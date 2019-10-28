<template>
	<v-navigation-drawer class="genre_drawer" v-model="drawer" temporary>
		<v-list nav dense class="genre_list">
			<v-list-item link v-for="(genre, i) in genres" :key="i" @click="filterMovie(genre)">
				<v-list-item-icon>
					<svg-icon class="genre_logo" width="45" :name="genre"/>
				</v-list-item-icon>
				<v-list-item-title class="text-capitalize genre_item" v-text="$t(`genres.${genre}`)"/>
			</v-list-item>
			<v-divider></v-divider>
			<v-list-item>
				<v-col class="d-flex" align="start" justify="center">
					<v-icon small color="primary" class="sort_icon">sort</v-icon>
					<v-select
						:label="$t(`filters.${selected}`)"
						:item-text="trad"
						:items="items"
						class="subtitle-2"
						solo
						@change="sortMovie"
						flat
					/>
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
			items: [
				{
					value: "Popularity",
					text: "Popularity"
				},
				{
					value: "Date added",
					text: "Date added"
				},
				{
					value: "Year",
					text: "Year"
				},
				{
					value: "Title",
					text: "Title"
				}
			],
			drawer: false,
			selected: "Popularity"
		}),
		created() {
			this.$bus.$on("openDrawer", () => (this.drawer = true));
		},
		methods: {
			scroll() {
				document
					.querySelector(".v-navigation-drawer__content")
					.scrollTo(0, 0);
			},
			filterMovie(genre) {
				this.$bus.$emit("filterMovie", genre);
				this.scroll();
				this.drawer = false;
			},
			sortMovie(item) {
				this.$bus.$emit("sortMovie", item);
				this.selected = item;
				this.scroll();
				this.drawer = false;
			},
			trad(item) {
				return this.$t(`filters.${item.value}`);
			}
		}
	};
</script>

<style>
.genre_drawer {
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
	margin-top: 1.5rem;
}

.sort_icon {
	margin: -2rem 1.7rem 0 -0.4rem;
	transform: scale(2) translateX(2px);
}

.genre_item {
	font-size: 1rem !important;
}

.genre_logo {
	height: 2.2rem;
}
</style>
