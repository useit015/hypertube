<template>
	<v-navigation-drawer class="genre_drawer" expand-on-hover permanent>
		<v-list nav dense class="genre_list">
			<v-list-item link v-for="(genre, i) in genres" :key="i" @click="filterMovie(genre)">
				<v-list-item-icon>
					<v-img width="40" class="genre_logo" :src="`/${genre}.svg`"/>
				</v-list-item-icon>
				<v-list-item-title class="text-capitalize">{{ genre }}</v-list-item-title>
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
			]
		}),
		methods: {
			filterMovie(genre) {
				this.$bus.$emit("filterMovie", genre);
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
</style>
