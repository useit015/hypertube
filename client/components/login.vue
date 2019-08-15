<template>
	<v-layout justify-center align-center class="mt-5">
		<v-flex xs12 sm7 md6 lg5 xl3>
			<v-layout column justify-center>
				<h2 class="display-2 font-weight-thin my-5 py-5 text-center">Welcome back</h2>
				<v-form ref="form" v-model="valid" lazy-validation class="mt-5">
					<v-text-field
						outlined
						color="primary"
						placeholder="Username goes here"
						v-model="username"
						:rules="rules.username"
						label="Username"
						required
					></v-text-field>
					<v-text-field
						outlined
						placeholder="Password goes here"
						color="primary"
						v-model="password"
						:rules="rules.password"
						label="Password"
						required
						:append-icon="showPass ? 'visibility' : 'visibility_off'"
						:type="showPass ? 'text' : 'password'"
						@click:append="showPass = !showPass"
					></v-text-field>
					<v-layout justify-end align-center>
						<v-btn
							rounded
							text
							small
							color="primary"
							class="caption text-lowercase fgt_btn"
							to="/forgot"
							nuxt
						>I forgot my password</v-btn>
					</v-layout>
					<v-layout justify-center align-center class="mt-5 py-4">
						<v-btn class="cta_btn" rounded large outlined color="primary" @click.prevent="login">Login</v-btn>
					</v-layout>
				</v-form>
			</v-layout>
		</v-flex>
	</v-layout>
</template>

<script>
	import axios from "axios";
	import rules from "@/assets/rules";

	export default {
		name: "Login",
		data: () => ({
			valid: false,
			showPass: false,
			username: "",
			password: "",
			rules: {
				username: rules.username,
				password: rules.password
			}
		}),
		methods: {
			async login() {
				if (this.valid) {
					try {
						const url = `https://hypertube.tk/api/users/login`;
						const data = {
							username: this.username,
							password: this.password
						};
						const res = await axios.post(url, data);
						console.log(res);
					} catch (err) {
						console.error(err);
					}
				}
			}
		}
	};
</script>

<style>
.fgt_btn {
	margin-top: -0.5rem !important;
}
</style>


