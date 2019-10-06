<template>
	<div class="fab__menu-container">
		<v-speed-dial
			v-model="fab"
			direction="bottom"
			class="fab__menu"
			transition="slide-y-reverse-transition"
		>
			<template v-slot:activator>
				<v-btn v-model="fab" color="grey darken-3" fab class="fab__btn">
					<svg x="0px" y="0px" viewBox="0 0 480.3 480.3" class="fab__svg">
						<g>
							<path
								d="M254.15,234.1V13.5c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v220.6c-31.3,6.3-55,34-55,67.2s23.7,60.9,55,67.2v98.2
			c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5v-98.2c31.3-6.3,55-34,55-67.2C309.15,268.2,285.55,240.4,254.15,234.1z M240.65,342.8
			c-22.9,0-41.5-18.6-41.5-41.5s18.6-41.5,41.5-41.5s41.5,18.6,41.5,41.5S263.55,342.8,240.65,342.8z"
							></path>
							<path
								d="M88.85,120.9V13.5c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v107.4c-31.3,6.3-55,34-55,67.2s23.7,60.9,55,67.2v211.4
			c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5V255.2c31.3-6.3,55-34,55-67.2S120.15,127.2,88.85,120.9z M75.35,229.6
			c-22.9,0-41.5-18.6-41.5-41.5s18.6-41.5,41.5-41.5s41.5,18.6,41.5,41.5S98.15,229.6,75.35,229.6z"
							></path>
							<path
								d="M418.45,120.9V13.5c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v107.4c-31.3,6.3-55,34-55,67.2s23.7,60.9,55,67.2v211.5
			c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5V255.2c31.3-6.3,55-34,55-67.2S449.85,127.2,418.45,120.9z M404.95,229.6
			c-22.9,0-41.5-18.6-41.5-41.5s18.6-41.5,41.5-41.5s41.5,18.6,41.5,41.5S427.85,229.6,404.95,229.6z"
							></path>
						</g>
					</svg>
				</v-btn>
			</template>
			<v-tooltip left v-for="item in menu" :key="item.icon">
				<template v-slot:activator="{ on }">
					<v-btn fab small color="grey darken-3" class="fab__button" @click="item.event">
						<v-icon color="primary" v-text="item.icon" class="fab__icon" v-on="on"/>
					</v-btn>
				</template>
				<span class="fab__tooltip" v-text="$t(`tooltip.${item.text}`)"></span>
			</v-tooltip>
		</v-speed-dial>
		<div v-if="search" class="search__overlay">
			<v-btn fab outlined small color="primary" class="back" @click="search = false">
				<v-icon>close</v-icon>
			</v-btn>
			<v-text-field
				autofocus
				v-model="query"
				@keyup.13="searchMovie"
				@change="checkSearch"
				hide-details
				append-icon="search"
				single-line
				outlined
				class="nav_search"
			/>
		</div>
	</div>
</template>

<script>
	import { mapActions } from "vuex";

	export default {
		data() {
			return {
				query: "",
				fab: false,
				search: false,
				direction: "top",
				transition: "slide-y-reverse-transition",
				menu: [
					{
						icon: "search",
						text: "search",
						event: this.openSearch
					},
					{
						icon: "filter_list",
						text: "filter",
						event: this.filters
					},
					{
						icon: "account_circle",
						text: "profile",
						event: this.profile
					},
					{
						icon: "exit_to_app",
						text: "logout",
						event: this.exit
					}
				]
			};
		},
		watch: {
			search() {
				if (this.search) window.scrollTo(0, 0);
				document.documentElement.style.overflow = this.search
					? "hidden"
					: "auto";
			}
		},
		methods: {
			...mapActions(["logout"]),
			openSearch() {
				this.search = true;
			},
			profile() {
				this.$router.push("/profile");
			},
			filters() {
				this.$bus.$emit("openDrawer");
			},
			exit() {
				this.logout();
				this.$router.push("/sign");
			},
			searchMovie() {
				this.$bus.$emit("searchMovie", this.query);
				this.search = false;
				this.menu[0] = {
					icon: "youtube_searched_for",
					text: "clear",
					event: this.clearSearch
				};
			},
			clearSearch() {
				this.query = "";
				this.menu[0] = {
					icon: "search",
					text: "search",
					event: this.openSearch
				};
				this.$bus.$emit("searchMovie", "");
			},
			checkSearch() {
				if (!this.query) this.clearSearch();
			}
		}
	};
</script>

<style>
.fab__menu {
	position: fixed !important;
	top: 1rem;
	right: 1rem;
}

.fab__icon {
	transform: scale(1.1);
}

.fab__svg {
	fill: #64d6c4;
	width: 2rem;
	height: 2rem;
	stroke-width: 5rem;
}

.search__overlay {
	display: none;
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: #00000099;
	display: flex;
	justify-content: center;
	align-items: flex-start;
}

.nav_search > .v-input__control > .v-input__slot > .v-input__append-inner {
	position: absolute;
	top: 0.5rem;
	left: 93%;
	transform: translate(-50%, -50%);
}

.nav_search {
	margin-top: 1rem !important;
}

.nav_search,
.nav_search > .v-input__control > .v-input__slot {
	height: 3rem !important;
	min-height: 3rem !important;
	max-width: 40vw !important;
	overflow: hidden;
	position: relative;
	background: #64d6c422;
	border-radius: 5px;
}
</style>
