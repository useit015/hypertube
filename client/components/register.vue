<template>
	<v-layout justify-center align-center class="mt-5">
		<v-flex xs12 sm7 md6 lg5 xl3>
			<v-layout column justify-center>
				<h2 class="display-2 font-weight-thin mt-3 mb-5 py-4 text-center">Join Us</h2>
				<v-form ref="form" v-model="valid" lazy-validation>
					<v-text-field
						outlined
						color="primary"
						placeholder="First Name goes here"
						v-model="firstName"
						:rules="rules.name"
						label="First Name"
						required
					></v-text-field>
					<v-text-field
						outlined
						color="primary"
						placeholder="Last Name goes here"
						v-model="lastName"
						:rules="rules.name"
						label="Last Name"
						required
					></v-text-field>
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
						color="primary"
						placeholder="E-mail goes here"
						v-model="email"
						:rules="rules.email"
						label="E-mail"
						required
					></v-text-field>
					<v-text-field
						outlined
						placeholder="Make up a strong password"
						color="primary"
						class="my-3"
						v-model="password"
						:rules="rules.password"
						label="Password"
						required
						:append-icon="showPass ? 'visibility' : 'visibility_off'"
						:type="showPass ? 'text' : 'password'"
						@click:append="showPass = !showPass"
					></v-text-field>
					<v-text-field
						outlined
						placeholder="Can you remember that password ?"
						@keyup.13="registerUser"
						color="primary"
						class="my-3"
						v-model="confPassword"
						label="Confirm Password"
						required
						:append-icon="showConfPass ? 'visibility' : 'visibility_off'"
						:type="showConfPass ? 'text' : 'password'"
						@click:append="showConfPass = !showConfPass"
						:error-messages="passwordMatch()"
					></v-text-field>
					<v-layout column justify-center align-center class="mt-5 py-4">
						<v-btn
							class="cta_btn"
							rounded
							large
							outlined
							color="primary"
							@click.prevent="registerUser"
						>Register</v-btn>
					</v-layout>
				</v-form>
			</v-layout>
		</v-flex>
	</v-layout>
</template>

<script>
	import axios from "axios";
	export default {
		name: "Register",
		data: () => ({
			valid: true,
			showPass: false,
			showConfPass: false,
			firstName: "",
			lastName: "",
			username: "",
			email: "",
			password: "",
			confPassword: "",
			rules: {
				name: [
					v => !!v || 'This field is required',
					v => (/^(([a-zA-Z])+([-\ \.])?([a-zA-Z])+)+$/.test(v)) || 'Name can contain only letters and valid separators',
					v => (v.length >= 3 && v.length <= 255 ) || 'Name must be at least 3 characters long'
				],
				username: [
					v => !!v || 'This field is required',
					v => (v.length >= 5 && v.length <= 30 ) || 'Username must be between 5 and 30 characters long',
					v => (/^([a-zA-Z_])+([a-zA-Z0-9-_])*$/.test(v)) || 'Username can contain only letters, numbers, _ and - characters'
				],
				password: [
					v => !!v || 'This field is required',
					v => v.length >= 8 || 'Password must be at least 8 characters long',
					v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v) || 'Password must contain at least one uppercase, one lowercase, one number and one special char'
				],
				email: [
					v => !!v || "E-mail is required",
					v => /.+@.+\..+/.test(v) || "E-mail must be valid"
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
			async registerUser() {
				try {
					const url = `https://hypertube.tk/users/register`;
					const data = {
						firstName: this.firstName,
						lastName: this.lastName,
						username: this.username,
						email: this.email,
						password: this.password,
						confPassword: this.confPassword
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

