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
		},
		methods: mapActions(["login"]),
		async beforeCreate() {
			try {
				const token = localStorage.getItem("token");
				const url = `https://hypertube.tk/api/users/isloggedin`;
				const headers = { Authorization: `jwt ${token}` };
				const res = await axios.get(url, { headers });
				if (!res.data.err) {
					this.login(res.data);
					this.$router.push("/library");
				}
			} catch (err) {
				console.log("Got error here -->", err);
			}
		}
	};
</script>

<style>
.app {
	background: #424242;
	background: -webkit-linear-gradient(
		#424242 10%,
		#353535 30%,
		#272727 60%,
		#212121 90%
	);
	background: linear-gradient(
		#424242 10%,
		#353535 30%,
		#272727 60%,
		#212121 90%
	) !important;
}
.cta_btn {
	border: 1px solid rgba(100, 214, 196, 0.5) !important;
	height: 40px !important;
	transform: scale(1.1);
	letter-spacing: 2px;
	font-weight: 300;
}
</style>

