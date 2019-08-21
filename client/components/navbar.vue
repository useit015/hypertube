<template>
	<nav class="navbar">
		<v-toolbar color="grey darken-2" dark class="elevation-0 px-3">
			<v-layout align-center>
				<nuxt-link to="/" class="px-4">
					<v-toolbar-title class="text-uppercase grey--text">
						<span>H</span>
						<span class="font-weight-light logo">ypertube</span>
					</v-toolbar-title>
				</nuxt-link>
				<v-spacer></v-spacer>
				<v-text-field
					v-if="authenticated"
					hide-details
					append-icon="search"
					single-line
					rounded
					outlined
					class="nav_search"
					v-model="query"
					@keyup.13="searchMovie"
					@change="clearSearch"
				></v-text-field>
				<v-spacer></v-spacer>
				<v-btn @click="changeLange('fr')" icon>FR</v-btn>
				<v-btn @click="changeLange('en')" icon>EN</v-btn>
				<v-btn icon v-if="authenticated" @click="logout">
					<v-icon>exit_to_app</v-icon>
				</v-btn>
			</v-layout>
		</v-toolbar>
	</nav>
</template>

<script>
	import axios from "axios";
	import { mapGetters, mapActions } from "vuex";
	export default {
		name: "Navbar",
		data: () => ({
			query: ""
		}),
		computed: mapGetters(["authenticated"]),
		methods: {
			...mapActions({
				out: 'logout'
			}),
			async logout() {
				try {
					const url = `https://hypertube.tk/api/users/logout`;
					const token = localStorage.getItem('token');
					const headers = { Authorization: `jwt ${token}` }
					const res = await axios.get(url, { headers })
					if (res.data.ok) this.out();
					this.$router.push("/");
				} catch (err) {
					console.log("problem with -->", err);
				}
			},
			searchMovie() {
				this.$bus.$emit("searchMovie", this.query);
			},
			clearSearch() {
				if (!this.query) {
					this.$bus.$emit("searchMovie", this.query);
				}
			},
			changeLange(lang) {
				this.$i18n.locale = lang;
			}
		}
	};
</script>

<style>
.navbar {
	z-index: 3;
	width: 100vw;
	position: fixed;
}
.logo {
	margin-left: -3px;
	letter-spacing: 1px;
}
.nuxt-link-active {
	text-decoration: none;
}
.nav_search > .v-input__control > .v-input__slot > .v-input__append-inner {
	margin-top: 0.45rem !important;
	margin-right: -0.35rem !important;
}
.nav_search > .v-input__control > .v-input__slot {
	height: 2.4rem !important;
	min-height: 2.4rem !important;
	max-width: 30vw !important;
	overflow: hidden;
}
</style>
