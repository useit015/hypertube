<template>
	<v-layout justify-center wrap class="user" v-if="loaded && userLoaded">
		<div class="avatar__container">
			<v-avatar tile slot="offset" class="avatar" size="200">
				<img :src="avatar" class="avatar__img">
			</v-avatar>
		</div>
		<v-container class="mx-0 mb-5 main" fill-height grid-list-xl>
			<v-card class="mx-auto px-4 py-4 mt-4" flat width="100%">
				<v-layout justify-center wrap>
					<v-container>
						<v-card-title class="movie__title font-weight-thin mb-5">Informations</v-card-title>
						<v-layout wrap>
							<v-flex xs12 md6>
								<v-text-field
									outlined
									disabled
									color="primary"
									:label="$t('firstname')"
									v-model="userLoaded.firstName"
								></v-text-field>
							</v-flex>
							<v-flex xs12 md6>
								<v-text-field
									disabled
									outlined
									color="primary"
									:label="$t('lastname')"
									v-model="userLoaded.lastName"
								></v-text-field>
							</v-flex>
							<v-flex>
								<v-text-field
									disabled
									outlined
									color="primary"
									:label="$t('username')"
									v-model="userLoaded.username"
								></v-text-field>
							</v-flex>
						</v-layout>
					</v-container>
				</v-layout>
			</v-card>
		</v-container>
		<v-container>
			<v-row justify="space-around" align="start">
				<v-col v-if="!!liked.length">
					<v-divider class="my-5"></v-divider>
					<h1 class="movie__title text-center font-weight-black text-uppercase my-5">Liked Movies</h1>
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
		</v-container>
		<v-container>
			<v-row justify="space-around" align="start">
				<v-col v-if="!!watched.length">
					<v-divider class="my-5"></v-divider>
					<h1 class="movie__title text-center font-weight-black text-uppercase my-5">Watched Movies</h1>
					<v-row justify="center">
						<v-card
							flat
							v-for="movie in watched"
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
		</v-container>
	</v-layout>
	<div class="not__found" v-else-if="!userLoaded && loaded">
		<h1 class="ml-5">User not found</h1>
		<v-btn fab outlined small color="primary" class="back__nt pl-2" nuxt to="/">
			<v-icon>arrow_back_ios</v-icon>
		</v-btn>
	</div>
	<loader v-else/>
</template>

<script>
	import axios from "axios";
	import loader from "@/components/loader";
	import { mapGetters, mapActions } from "vuex";

	const fetchUser = async username => {
		const token = localStorage.getItem("token");
		const res = await axios.get(
			`https://hypertube.tk/api/users/user/${username}`,
			{ headers: { Authorization: `jwt ${token}` } }
		);
		if (!res.data.err) {
			return res.data;
		} else {
			return null;
		}
	};

	const isExternal = url =>
		url &&
		(url.indexOf(":") > -1 ||
			url.indexOf("//") > -1 ||
			url.indexOf("www.") > -1);

	export default {
		middleware: "authenticated",
		components: {
			loader
		},
		data: () => ({
			userLoaded: null,
			loaded: false
		}),
		computed: {
			...mapGetters(["user"]),
			avatar() {
				return isExternal(this.user.image)
					? this.userLoaded.image
					: `https://hypertube.tk${this.userLoaded.image}`;
			},
			liked() {
				return this.userLoaded.movies
					? this.userLoaded.movies.filter(cur => cur.liked)
					: [];
			},
			watched() {
				return this.userLoaded.movies
					? this.userLoaded.movies.filter(cur => cur.watched)
					: [];
			}
		},
		async created() {
			const res = await fetchUser(this.$route.params.username);
			this.userLoaded = res;
			this.loaded = true;
			this.$bus.$emit("showNavbar");
			if (this.$route.params.username === this.user.username) {
				this.$router.push("/profile");
			}
		},
		beforeDestroy() {
			this.$bus.$emit("hideNavbar");
		}
	};
</script>
<style>
.not__found {
	width: 90vw;
	max-width: 80rem;
	margin: 5rem auto 0;
}

.back__nt {
	position: absolute;
	top: 5rem;
	left: 1rem;
	transform: translate(10%, 10%);
	border-radius: 5px !important;
}
</style>

