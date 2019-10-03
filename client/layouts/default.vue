<template>
	<v-app dark class="app">
		<navbar/>
		<v-content>
			<v-container fluid class="py-0 px-0">
				<nuxt/>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
	import axios from "axios";
	import { mapActions } from "vuex";
	import navbar from "@/components/navbar";

	export default {
		components: {
			navbar
		},
		data() {
			return {};
		}
	};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Bungee&display=swap");

body {
	overflow: hidden;
}

.movie__title {
	font-family: "Bungee", cursive;
	letter-spacing: 3px;
	font-size: 2.2em;
	text-shadow: 0 0 15px rgba(100, 214, 197, 0.5);
}

.app {
	background: #424242;
	background: -webkit-linear-gradient(#424242 0%, #212121 100%);
	background: linear-gradient(#424242 0%, #212121 100%) !important;
}

.cta_btn {
	border: 1px solid rgba(100, 214, 196, 0.5) !important;
	height: 40px !important;
	transform: scale(1.1);
	letter-spacing: 2px;
	font-weight: 300;
}

.page-enter-active,
.page-leave-active {
	transition: opacity 0.5s;
}

.page-enter,
.page-leave-to {
	opacity: 0;
}

.trailer_close,
.back {
	position: absolute;
	top: 1rem;
	left: 1rem;
	transform: translate(10%, 10%);
	border-radius: 5px !important;
}

.sign_container {
	margin-top: 64px;
}

@media only screen and (max-width: 1000px) {
	.sign_container {
		margin-top: 56px;
	}
}
</style>
