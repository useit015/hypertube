<template>
	<v-container>
		<v-row justify="space-around" align="start">
			<v-col v-if="!!liked.length">
				<v-divider class="my-5"></v-divider>
				<h1
					class="movie__title text-center font-weight-black text-uppercase my-5"
					v-text="$t('title.liked')"
				></h1>
				<v-row justify="center">
					<v-card
						flat
						v-for="movie in liked"
						:key="movie.imdb"
						class="movie__card"
						@click="$router.push(`/watch/${movie.imdb}`)"
					>
						<v-img :src="movie.poster"></v-img>
						<h4 class="text-center py-1">{{ movie.name }}</h4>
					</v-card>
				</v-row>
			</v-col>
		</v-row>
		<v-row justify="space-around" align="start">
			<v-col v-if="!!watched.length">
				<v-divider class="my-5"></v-divider>
				<h1
					class="movie__title text-center font-weight-black text-uppercase my-5"
					v-text="$t('title.watched')"
				></h1>
				<v-row justify="center">
					<v-card
						flat
						v-for="movie in watched"
						:key="movie.imdb"
						class="movie__card"
						@click="$router.push(`/watch/${movie.imdb}`)"
					>
						<v-img :src="movie.poster"></v-img>
						<h4 class="text-center py-1" v-text="movie.name"></h4>
					</v-card>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	export default {
		props: {
			liked: {
				type: Array,
				default: []
			},
			watched: {
				type: Array,
				default: []
			}
		}
	};
</script>

<style>
</style>
