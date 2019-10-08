<template>
	<div v-if="navbar">
		<nav class="navbar">
			<v-toolbar color="grey darken-2" dark class="elevation-0 px-3">
				<v-layout align-center justify-space-around>
					<nuxt-link to="/" class="px-4">
						<v-toolbar-title class="text-uppercase grey--text">
							<span>H</span>
							<span class="font-weight-light logo">ypertube</span>
						</v-toolbar-title>
					</nuxt-link>
					<v-spacer></v-spacer>
					<v-select
						class="navbar__lang"
						solo
						small
						flat
						dense
						hide-details
						color="primary"
						:items="languages"
						v-model="chosenLang"
						v-if="!authenticated"
					>
						<template slot="selection" slot-scope="data">
							<country-flag :country="getFlag(data.item)"/>
						</template>
						<template slot="item" slot-scope="data">
							<country-flag :country="getFlag(data.item)"/>
						</template>
						<div slot="item" item>item</div>
					</v-select>
					<v-btn text large v-if="authenticated" @click="exit">
						<span v-text="$t('tooltip.logout')"></span>
						<v-icon class="ml-2">exit_to_app</v-icon>
					</v-btn>
				</v-layout>
			</v-toolbar>
		</nav>
		<v-footer class="footer grey darken-3">
			<v-container class="py-0">
				<v-row justify="center">
					<div class="footer__content grey--text">
						<span>Made with</span>
						<v-icon color="red" class="mx-1 pb-1">favorite</v-icon>
						<span>by onahiz, iouzzine, yez-zain</span>
					</div>
				</v-row>
			</v-container>
		</v-footer>
	</div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import CountryFlag from "vue-country-flag";

export default {
	name: "Navbar",
	components: {
		CountryFlag
	},
	data: () => ({
		navbar: false,
		chosenLang: "en",
		query: "",
		languages: ["en", "fr", "ar", "es", "dr"]
	}),
	created() {
		this.$bus.$on("hideNavbar", () => (this.navbar = false));
		this.$bus.$on("showNavbar", () => (this.navbar = true));
	},
	computed: {
		...mapGetters(["authenticated"]),
		...mapGetters(["user"])
	},
	watch: {
		chosenLang() {
			if (this.chosenLang != this.$i18n.locale) {
				this.$i18n.locale = this.chosenLang;
				this.$bus.$emit("langChange");
			}
		}
	},
	methods: {
		...mapActions(["logout"]),
		exit() {
			this.logout();
			this.$router.push("/sign");
		},
		getFlag(lang) {
			return lang == "en"
				? "us"
				: lang == "ar"
				? "sa"
				: lang == "dr"
				? "ma"
				: lang;
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

	.footer {
		position: absolute;
		top: 100%;
		left: 0;
		transform: translateY(-100%);
		width: 100vw;
	}

	.footer__content {
		letter-spacing: 1px;
		word-spacing: 3px;
	}

	.navbar__lang {
		max-width: 4.5rem;
	}

	.theme--dark.v-text-field--solo.navbar__lang
		> .v-input__control
		> .v-input__slot {
		background: transparent;
	}
</style>
