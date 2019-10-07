<template>
	<v-row class="movie" justify="space-around" align="start">
		<v-col xs="10" sm="8" md="5" lg="4" xl="3" class="movie__actors" v-if="director">
			<h1
				class="movie__title sub text-center font-weight-black text-uppercase mb-5 pb-5"
				v-text="$t('cast.director')"
			></h1>
			<v-row justify="center">
				<v-card class="director__card">
					<v-img :src="testImage(director.profile_path)"></v-img>
					<h4 class="text-center" v-text="director.name"></h4>
				</v-card>
			</v-row>
		</v-col>
		<v-col xs="12" sm="10" md="7" lg="6" xl="5" class="movie__actors" v-if="!!cast.cast.length">
			<h1
				class="movie__title sub text-center font-weight-black text-uppercase mb-5 pb-5"
				v-text="$t('cast.actors')"
			></h1>
			<v-row justify="center">
				<v-card v-for="actor in cast.cast" :key="actor.cast_id" class="actor__card">
					<v-img :src="testImage(actor.profile_path)"></v-img>
					<h4 class="text-center mt-auto" v-text="actor.name"></h4>
				</v-card>
			</v-row>
		</v-col>
	</v-row>
</template>

<script>
	export default {
		props: {
			cast: {
				type: Object,
				default: () => ({})
			}
		},
		computed: {
			director() {
				if (!this.cast.crew) return;
				return this.cast.crew[0];
			}
		},
		methods: {
			testImage(base, width = 500) {
				if (base) {
					return `https://image.tmdb.org/t/p/w${width}/${base}`;
				} else {
					return `https://via.placeholder.com/${width}?text=No+Picture`;
				}
			}
		}
	};
</script>

<style>
.movie__title.sub {
	font-size: 2em;
}

.actor__card,
.director__card {
	background-color: rgba(54, 97, 97, 0.2) !important;
	box-shadow: none;
	border-radius: 5px 5px 15px 15px;
	box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.4), 0 0 10px rgba(0, 0, 0, 0.4);
}

.actor__card {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin: 1rem 1rem 3rem;
	width: calc(100% / 3 - 2rem);
}

.director__card {
	margin: 1rem;
	width: 50%;
}

.movie__actors {
	position: relative;
	margin: 5rem 0;
	width: 100%;
}

@media only screen and (max-width: 960px) {
	.actor__card {
		width: calc(33% - 2rem);
	}
	.movie__actors {
		margin: 2rem 0 !important;
	}
}

@media only screen and (max-width: 550px) {
	.actor__card {
		width: calc(50% - 2rem);
	}
}
</style>
