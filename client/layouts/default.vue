<template>
	<v-app dark class="app">
		<navbar/>
		<v-content>
			<v-container fluid class="py-0 px-0">
				<nuxt/>
			</v-container>
		</v-content>
		<alert/>
		<v-snackbar v-model="incompleteAlert" color="error" :timeout="10000" top right>
			{{ $t('error.complete') }}
			<v-btn dark text @click="incompleteAlert = false">
				<v-icon>close</v-icon>
			</v-btn>
		</v-snackbar>
	</v-app>
</template>

<script>
	import { mapGetters } from "vuex";
	import alert from "@/components/alert";
	import navbar from "@/components/navbar";

	export default {
		components: {
			alert,
			navbar
		},
		data: () => ({
			incompleteAlert: false
		}),
		computed: mapGetters(["incompleteProfile"]),
		watch: {
			incompleteProfile: {
				immediate: true,
				handler() {
					if (this.incompleteProfile) this.incompleteAlert = true;
				}
			}
		}
	};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Bungee&display=swap");

body {
	overflow: hidden;
}

body::-webkit-scrollbar {
	width: 0.3rem !important;
}
body::-webkit-scrollbar-track {
	background: #212121 !important;
}
body::-webkit-scrollbar-thumb {
	background: #64d6c4 !important;
}

.movie__title {
	font-family: "Bungee", cursive;
	letter-spacing: 3px;
	font-size: 2.2rem;
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
	transition: all 0.4s ease-in-out;
}

.page-enter {
	opacity: 0;
	transform: translate(0, 50vw);
}

.page-leave-to {
	opacity: 0;
	transform: translate(0, -50vw);
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
	margin: 64px auto;
}

@media only screen and (max-width: 1000px) {
	.sign_container {
		margin-top: 56px;
	}
}

.user {
	width: 90vw;
	max-width: 80rem;
	margin: 10rem auto 0;
}

.main {
	flex: 1 1 60vw;
	min-width: 50rem;
	max-width: 60rem;
	overflow: hidden;
}

@media only screen and (max-width: 50rem) {
	.main {
		min-width: 0;
	}
}

.avatar {
	margin: 1rem;
	border-radius: 5px;
}

.avatar__container {
	padding: 12px;
}

.avatar__btn {
	position: absolute;
	top: 85%;
	left: 85%;
	transform: translate(-50%, -50%) scale(0.95);
}

.avatar__img {
	box-shadow: 0 0 0 3px rgba(65, 65, 65, 0.4), 0 1px 5px rgba(0, 0, 0, 0.2);
}

.edit,
.edit:hover,
.edit:focus {
	position: absolute;
}

.edit {
	top: 0;
	left: 100%;
	transform: translate(-75%, -25%);
}

.save__container {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin-top: -0.5rem;
}

.movie__card {
	position: relative;
	margin: 2rem 1rem;
	width: calc(25% - 3rem);
	display: flex;
	flex-direction: column;
	background-color: #42424299 !important;
}

@media only screen and (max-width: 960px) {
	.movie__card {
		width: calc(33% - 2rem);
	}
}

@media only screen and (max-width: 550px) {
	.movie__card {
		width: calc(50% - 2rem);
	}
	.movie__title {
		font-size: 1.7rem;
	}
}

@media only screen and (max-width: 400px) {
	.movie__title.mb-5 {
		margin-bottom: 5px !important;
		padding: 0.8rem 0;
		font-size: 1.4rem;
	}
}

@keyframes showUp {
	from {
		transform: scale(0);
	}
	to {
		transform: scale(1);
	}
}
</style>
