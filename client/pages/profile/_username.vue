<template>
	<v-layout column class="settings user" v-if="loaded">
		<div v-if="user">
			<v-layout class="mt-4 strap dark">
				<v-container py-0>
					<v-layout>
						<v-flex xs12 sm8 md4 class="avatar">
							<v-avatar slot="offset" class="mx-auto d-block" size="200">
								<img :src="`https://hypertube.tk${user.image}`" class="avatar__img">
							</v-avatar>
						</v-flex>
					</v-layout>
				</v-container>
			</v-layout>
			<v-container fill-height grid-list-xl>
				<v-card class="mx-auto px-4 pb-4 mt-4" width="100%">
					<v-layout justify-center wrap>
						<v-container>
							<v-card-title class="heading display-2 font-weight-thin pt-4 pb-3 mb-4">Informations</v-card-title>
							<v-layout wrap>
								<v-flex xs12 sm6>
									<v-text-field
										disabled
										outlined
										color="primary"
										label="First Name"
										v-model="user.firstName"
									></v-text-field>
								</v-flex>
								<v-flex xs12 sm6>
									<v-text-field disabled outlined color="primary" label="Last Name" v-model="user.lastName"></v-text-field>
								</v-flex>
								<v-flex xs12 sm6>
									<v-text-field disabled outlined color="primary" label="Username" v-model="user.username"></v-text-field>
								</v-flex>
							</v-layout>
						</v-container>
					</v-layout>
				</v-card>
			</v-container>
		</div>
		<div v-else>
			<h1>User not found</h1>
		</div>
	</v-layout>
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
