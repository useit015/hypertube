<template>
	<div v-if="loaded" class="user">
		<div v-if="user">
			<h1>{{user.firstName}}</h1>
			<h1>{{user.lastName}}</h1>
			<h1>{{user.username}}</h1>
			<img :src="user.image">
		</div>
		<div v-else>
			<h1>User not found</h1>
		</div>
	</div>
	<loader v-else/>
</template>

<script>
	import axios from "axios";
	import loader from "@/components/loader";
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
	export default {
		middleware: "authenticated",
		components: {
			loader
		},
		data: () => ({
			user: null,
			loaded: false
		}),
		async created() {
			console.log(this.$route.params);
			const res = await fetchUser(this.$route.params.username);
			this.user = res;
			this.loaded = true;
		}
	};
</script>
<style>
.user {
	margin-top: 64px;
}
</style>
