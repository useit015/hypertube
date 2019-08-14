<template>
	<v-app dark>
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
				const url = `https://hypertube.tk/users/isloggedin`;
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
