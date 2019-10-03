<template>
	<v-layout>
		<drawer/>
		<div v-if="list.length" class="library main_container">
			<movieCard v-for="movie in list" :key="movie.imdb" :movie="movie"/>
		</div>
		<div v-else class="search_placeholder">
			<h1>Nothing found</h1>
		</div>
		<fab-menu/>
	</v-layout>
</template>

<script>
	import axios from "axios";
	import fabMenu from "@/components/fabMenu";
	import drawer from "@/components/drawer";
	import movieCard from "@/components/movieCard";

	const fetchMovieList = async (page, query, genre, sort) => {
		const body = { page, query, genre, sort };
		const { data } = await axios.post("https://hypertube.tk/api/movies?", body);
		return data;
	};

	const getBottomDist = () => {
		const offsetHeight = document.body.offsetHeight;
		const { pageYOffset, innerHeight } = window;
		return Math.max(offsetHeight - (pageYOffset + innerHeight), 0);
	};

	export default {
		middleware: "authenticated",
		components: {
			drawer,
			fabMenu,
			movieCard
		},
		data: () => ({
			page: 1,
			query: "",
			genre: "",
			sort: "",
			polling: false
		}),
		async asyncData({ params }) {
			return { list: await fetchMovieList(1) };
		},
		async created() {
			window.addEventListener("scroll", this.handleScroll);
			this.$bus.$on("searchMovie", this.searchMovie);
			this.$bus.$on("filterMovie", this.filterMovie);
			this.$bus.$on("sortMovie", this.sortMovie);
			document.documentElement.style.overflowY = "auto";
		},
		beforeDestroy() {
			window.removeEventListener("scroll", this.handleScroll);
		},
		methods: {
			async handleScroll() {
				const bottomDist = getBottomDist();
				if (!this.polling && bottomDist >= 0 && bottomDist <= 500) {
					this.polling = true;
					const data = await fetchMovieList(
						++this.page,
						this.query,
						this.genre,
						this.sort
					);
					this.list = [...this.list, ...data];
					this.polling = false;
				}
			},
			async searchMovie(query) {
				this.page = 1;
				this.query = query;
				this.genre = query ? "" : this.genre;
				this.sort = this.sort;
				this.list = await fetchMovieList(this.page, this.query, this.sort);
				window.scrollTo(0, 0);
			},
			async filterMovie(genre) {
				this.page = 1;
				this.query = "";
				this.genre = genre === "popular" ? "" : genre;
				this.sort = this.sort;
				this.list = await fetchMovieList(
					this.page,
					this.query,
					this.genre,
					this.sort
				);
				window.scrollTo(0, 0);
			},
			async sortMovie(sort) {
				this.page = 1;
				this.query = this.query;
				this.genre = this.genre;
				this.sort = sort;
				this.list = await fetchMovieList(
					this.page,
					this.query,
					this.genre,
					this.sort
				);
				window.scrollTo(0, 0);
			}
		}
	};
</script>

<style>
.library {
	display: grid;
	flex: 1 1 100%;
	grid-template-columns: repeat(6, 1fr);
}

@media all and (min-width: 1350px) {
	.library {
		grid-template-columns: repeat(7, 1fr);
	}
	.movie_card {
		height: calc(100vw / 7 * 1.5);
	}
}

@media all and (min-width: 1600px) {
	.library {
		grid-template-columns: repeat(8, 1fr);
	}
	.movie_card {
		height: calc(100vw / 8 * 1.5);
	}
}

@media all and (min-width: 1900px) {
	.library {
		grid-template-columns: repeat(9, 1fr);
	}
	.movie_card {
		height: calc(100vw / 9 * 1.5);
	}
}

@media all and (min-width: 2200px) {
	.library {
		grid-template-columns: repeat(10, 1fr);
	}
	.movie_card {
		height: calc(100vw / 10 * 1.5);
	}
}

@media all and (min-width: 2500px) {
	.library {
		grid-template-columns: repeat(11, 1fr);
	}
	.movie_card {
		height: calc(100vw / 11 * 1.5);
	}
}

@media all and (min-width: 2800px) {
	.library {
		grid-template-columns: repeat(12, 1fr);
	}
	.movie_card {
		height: calc(100vw / 12 * 1.5);
	}
}

@media all and (max-width: 1050px) {
	.library {
		grid-template-columns: repeat(5, 1fr);
	}
	.movie_card {
		height: calc(100vw / 5 * 1.5);
	}
}

@media all and (max-width: 800px) {
	.library {
		grid-template-columns: repeat(4, 1fr);
	}
	.movie_card {
		height: calc(100vw / 4 * 1.5);
	}
}

@media all and (max-width: 600px) {
	.library {
		grid-template-columns: repeat(3, 1fr);
	}
	.movie_card {
		height: calc(100vw / 3 * 1.5);
	}
}

@media all and (max-width: 480px) {
	.library {
		grid-template-columns: repeat(2, 1fr);
	}
	.movie_card {
		height: calc(100vw / 2 * 1.5);
	}
}

@media all and (-ms-high-contrast: none) {
	.library {
		display: -ms-grid;
		-ms-grid-columns: repeat(6, 1fr);
	}
}

.search_placeholder {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>
