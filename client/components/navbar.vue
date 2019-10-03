<template>
	<nav class="navbar" v-show="navbar">
		<v-toolbar color="grey darken-2" dark class="elevation-0 px-3">
			<v-layout align-center justify-space-around>
				<nuxt-link to="/" class="px-4">
					<v-toolbar-title class="text-uppercase grey--text">
						<span>H</span>
						<span class="font-weight-light logo">ypertube</span>
					</v-toolbar-title>
				</nuxt-link>
				<v-spacer></v-spacer>
				<v-spacer></v-spacer>
				<v-btn v-if="!authenticated" @click="changeLange('fr')" icon>FR</v-btn>
				<v-btn v-if="!authenticated" @click="changeLange('en')" icon>EN</v-btn>
				<v-btn text v-if="authenticated" @click="logout">
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
			navbar: false,
			query: ""
		}),
		created() {
			this.$bus.$on("hideNavbar", () => (this.navbar = false));
			this.$bus.$on("showNavbar", () => (this.navbar = true));
		},
		computed: {
			...mapGetters(["authenticated"]),
			...mapGetters(["user"])
		},
		methods: {
			...mapActions({
				out: "logout"
			}),
			async logout() {
				this.out();
				this.$router.push("sign");
			},
			changeLange(lang) {
				if (lang != this.$i18n.locale) {
					this.$i18n.locale = lang;
					this.$bus.$emit("langChange");
				}
			}
		}
	};
</script>

<style>
.navbar {
	z-index: 10;
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
</style>
