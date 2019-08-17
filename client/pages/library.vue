<template>
	<v-layout>
		<drawer/>
		<div v-if="list.length" class="library">
			<movieCard v-for="movie in list" :key="movie.imdb" :movie="movie"/>
		</div>
		<div v-else class="search_placeholder">
			<h1>Nothing found</h1>
		</div>
	</v-layout>
</template>

<script>
	import axios from "axios";
	import drawer from "@/components/drawer";
	import movieCard from "@/components/movieCard";

	const fetchMovieList = async (page, query, genre) => {
		const sortType = query ? "title" : "seeds";
		let url = `https://api.apiumadomain.com/list?sort=${sortType}&short=1&cb=&quality=720p,1080p,3d&page=${page}`;
		if (query) {
			url = `${url}&keywords=${query}`;
		} else if (genre) {
			url = `${url}&genre=${genre}`;
		}
		const { data } = await axios.get(url);
		const popcornList = data.MovieList.map(cur => ({
			title: cur.title,
			year: cur.year,
			rating: cur.rating,
			imdb: cur.imdb,
			poster_med: cur.poster_med
		}));
		if (query) {
			url = `https://yts.lt/api/v2/list_movies.json?query_term=${query}`;
			const res = await axios.get(url);
			const ytsList = res.data.data.movies.map(cur => ({
				title: cur.title,
				year: cur.year,
				rating: cur.rating,
				imdb: cur.imdb_code,
				poster_med: cur.medium_cover_image
			}));
			const merged = [
				...ytsList,
				...popcornList.filter(cur => {
					for (let item of ytsList) {
						if (cur.imdb === item.imdb) return false;
					}
					return true;
				})
			];
			console.log(merged);
		}
		return data;
	};

	export default {
		middleware: "authenticated",
		components: {
			drawer,
			movieCard
		},
		data: () => ({
			page: 1,
			query: "",
			genre: "",
			polling: false
		}),
		async asyncData({ params }) {
			const data = await fetchMovieList(1);
			return { list: data.MovieList };
		},
		created() {
			window.addEventListener("scroll", this.handleScroll);
			this.$bus.$on("searchMovie", this.searchMovie);
			this.$bus.$on("filterMovie", this.filterMovie);
		},
		destroyed() {
			window.removeEventListener("scroll", this.handleScroll);
		},
		computed: {},
		methods: {
			getBottomDist() {
				const offsetHeight = document.body.offsetHeight;
				const { pageYOffset, innerHeight } = window;
				return Math.max(offsetHeight - (pageYOffset + innerHeight), 0);
			},
			async handleScroll() {
				const bottomDist = this.getBottomDist();
				if (!this.polling && bottomDist >= 0 && bottomDist <= 500) {
					this.polling = true;
					const data = await fetchMovieList(
						++this.page,
						this.query,
						this.genre
					);
					this.list = [...this.list, ...data.MovieList];
					this.polling = false;
				}
			},
			async searchMovie(query) {
				if (query) {
					this.genre = "";
				}
				this.page = 1;
				this.query = query;
				const data = await fetchMovieList(this.page, this.query);
				this.list = data.MovieList;
				window.scrollTo(0, 0);
			},
			async filterMovie(genre) {
				if (genre === "popular") {
					genre = "";
				}
				this.page = 1;
				this.genre = genre;
				const data = await fetchMovieList(this.page, this.query, genre);
				this.list = data.MovieList;
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
	margin-left: 80px;
	margin-top: 64px;
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
