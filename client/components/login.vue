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
					<v-layout column justify-center align-center class="mt-5 py-4">
						<v-btn class="cta_btn" rounded large outlined color="primary" @click.prevent="login">Login</v-btn>
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
				username: [
					v => !!v || 'This field is required',
					v => (v.length >= 5 && v.length <= 30 ) || 'Username must be between 5 and 30 characters long',
					v => (/^([a-zA-Z_])+([a-zA-Z0-9-_])*$/.test(v)) || 'Username can contain only letters, numbers, _ and - characters'
				],
				password: [
					v => !!v || 'This field is required',
					v => v.length >= 8 || 'Password must be at least 8 characters long',
					v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v) || 'Password must contain at least one uppercase, one lowercase, one number and one special char'
				]
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

