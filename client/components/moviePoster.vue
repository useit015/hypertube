<template>
	<v-hover class="hover">
		<template v-slot:default="{ hover }">
			<v-card class="mx-auto">
				<v-img :src="poster" v-on:error="imageLoadError" class="movie__img" hover></v-img>
				<v-fade-transition>
					<v-overlay v-show="hover" class="movie__img--overlay" absolute>
						<svg
							x="0px"
							y="0px"
							viewBox="0 0 58 58"
							class="movie__action trailer"
							@click="$emit('trailerOpen')"
						>
							<g>
								<path
									d="M36.537,28.156l-11-7c-0.308-0.195-0.698-0.208-1.019-0.033C24.199,21.299,24,21.635,24,22v14
												c0,0.365,0.199,0.701,0.519,0.877C24.669,36.959,24.834,37,25,37c0.187,0,0.374-0.053,0.537-0.156l11-7
												C36.825,29.66,37,29.342,37,29S36.825,28.34,36.537,28.156z M26,34.179V23.821L34.137,29L26,34.179z"
								></path>
								<path
									d="M57,6H47H11H1C0.448,6,0,6.447,0,7v11v11v11v11c0,0.553,0.448,1,1,1h10h36h10c0.552,0,1-0.447,1-1V40V29V18V7
												C58,6.447,57.552,6,57,6z M10,28H2v-9h8V28z M2,30h8v9H2V30z M12,40V29V18V8h34v10v11v11v10H12V40z M56,28h-8v-9h8V28z M48,30h8v9
												h-8V30z M56,8v9h-8V8H56z M2,8h8v9H2V8z M2,50v-9h8v9H2z M56,50h-8v-9h8V50z"
								></path>
							</g>
						</svg>
						<v-icon
							class="movie__action like"
							:color="movieLiked ? 'error' : 'white'"
							@click="toggleLikeMovie"
						>favorite</v-icon>
					</v-overlay>
				</v-fade-transition>
			</v-card>
		</template>
	</v-hover>
</template>

<script>
	import axios from "axios";
	import utility from "@/assets/utility.js";
	import { mapGetters, mapActions } from "vuex";
	import { log } from "util";

	export default {
		props: {
			imdb: {
				type: String,
				default: ""
			},
			name: {
				type: String,
				default: ""
			},
			poster: {
				type: String,
				default: "https://via.placeholder.com/800?text=No+Picture"
			}
		},
		computed: {
			...mapGetters(["token", "likedIds"]),
			movieLiked() {
				return this.likedIds.find(cur => cur == this.imdb);
			}
		},
		methods: {
			...utility,
			...mapActions(["updateMovies"]),
			async toggleLikeMovie() {
				try {
					const url = `https://hypertube.tk/api/users/like`;
					const headers = { Authorization: `jwt ${this.token}` };
					const { imdb, name, poster } = this;
					const opts = { imdb, name, poster };
					const { data } = await axios.post(url, opts, { headers });
					if (!data.err) {
						this.updateMovies(data.user.movies);
						this.openAlert(
							this,
							`title.${data.liked ? "" : "un"}like`,
							"green"
						);
					} else {
						this.openAlert(this, "edit.fail");
					}
				} catch (err) {
					this.openAlert(this, "edit.fail");
				}
			},
			imageLoadError() {
				this.openAlert(this, "error.link");
			}
		}
	};
</script>

<style>
.movie__img > .v-responsive__content {
	box-shadow: inset 0 0 20px 2px rgba(0, 0, 0, 0.5),
		0 0 2px 20px rgba(0, 0, 0, 0.5);
}

.movie__img {
	border-radius: 5px !important;
}

.movie__img--overlay {
	transition: all 0.3s ease-in;
}

.movie__img--overlay > .v-overlay__content {
	width: 100%;
	height: 100%;
}

.movie__action {
	position: absolute;
	cursor: pointer;
	transition: all 0.2s ease-in;
}

.movie__action.like {
	top: 0;
	right: 0;
	transform: translate(-75%, 75%) scale(1.2);
}

.movie__action.trailer {
	top: 50%;
	left: 50%;
	width: 4rem;
	fill: #fff;
	transform: translate(-50%, -50%);
}

.movie__action.like:hover,
.movie__action.like:focus {
	color: #e53935;
}

.movie__action.trailer:hover,
.movie__action.trailer:focus {
	fill: #64d6c4;
}
</style>
