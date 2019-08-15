<template>
	<v-app dark class="app">
		<v-content>
			<v-container>
				<nuxt/>
			</v-container>
		</v-content>
		<v-footer fixed app>
			<span>&copy; 2019</span>
		</v-footer>
	</v-app>
</template>

<script>
	import axios from "axios";

	export default {
		data() {
			return {};
		},
		async beforeCreate() {
			try {
				const token = localStorage.getItem("token");
				const url = `https://hypertube.tk/api/users/isloggedin`;
				const headers = { Authorization: `jwt ${token}` };
				const res = await axios.get(url, { headers });
				if (!res.data.err) {
					localStorage.setItem("token", res.data.token);
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

