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
						validate-on-blur
						v-model="password"
						:rules="rules.password"
						label="Password"
						required
						:append-icon="showPass ? 'visibility' : 'visibility_off'"
						:type="showPass ? 'text' : 'password'"
						@click:append="showPass = !showPass"
					></v-text-field>
					<v-layout column justify-center align-center class="mt-5 py-4">
						<v-btn rounded large outlined color="grey" @click.prevent="login">Login</v-btn>
					</v-layout>
				</v-form>
			</v-layout>
		</v-flex>
	</v-layout>
</template>

<script>
	import axios from "axios";
	export default {
		name: "Login",
		data: () => ({
			valid: true,
			showPass: false,
			username: "",
			password: "",
			rules: {
				username: [],
				password: []
			}
		}),
		methods: {
			passwordMatch() {
				return !this.confPassword.length ||
					this.password === this.confPassword
					? ""
					: "Passwords must match";
			},
			async login() {
				try {
					const url = `https://hypertube.tk/users/login`;
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
	};
</script>

