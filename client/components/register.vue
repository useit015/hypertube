<template>
	<v-layout justify-center align-center class="mt-5">
		<v-flex xs12 sm7 md6 lg5 xl3>
			<div v-if="sent">
				<v-alert dismissible :type="alert.type" class="mb-5">{{ alert.text }}</v-alert>
			</div>
			<v-layout column justify-center>
				<h2 class="display-2 font-weight-thin mt-3 mb-5 py-4 text-center">{{$t('joinus')}}</h2>
				<v-form ref="form" v-model="valid" lazy-validation>
					<v-text-field
						outlined
						color="primary"
						:placeholder="$t('firstname_placeholder')"
						v-model="firstName"
						:rules="rules.name"
						:label="$t('firstname')"
						required
					></v-text-field>
					<v-text-field
						outlined
						color="primary"
						:placeholder="$t('lastname_placeholder')"
						v-model="lastName"
						:rules="rules.name"
						:label="$t('lastname')"
						required
					></v-text-field>
					<v-text-field
						outlined
						color="primary"
						:placeholder="$t('username_placeholder')"
						v-model="username"
						:rules="rules.username"
						:label="$t('username')"
						required
					></v-text-field>
					<v-text-field
						outlined
						color="primary"
						:placeholder="$t('email_placeholder')"
						v-model="email"
						:rules="rules.email"
						:label="$t('email')"
						required
					></v-text-field>
					<v-text-field
						outlined
						:placeholder="$t('password_placeholder')"
						color="primary"
						class="my-3"
						v-model="password"
						:rules="rules.password"
						:label="$t('password')"
						required
						:append-icon="showPass ? 'visibility' : 'visibility_off'"
						:type="showPass ? 'text' : 'password'"
						@click:append="showPass = !showPass"
					></v-text-field>
					<v-text-field
						outlined
						:placeholder="$t('confpassword_placeholder')"
						@keyup.13="registerUser"
						color="primary"
						class="my-3"
						v-model="confPassword"
						:rules="rules.password"
						:label="$t('confpassword')"
						required
						:append-icon="showConfPass ? 'visibility' : 'visibility_off'"
						:type="showConfPass ? 'text' : 'password'"
						@click:append="showConfPass = !showConfPass"
						:error-messages="passwordMatch()"
					></v-text-field>
					<v-file-input
						@change="selectFile"
						append-icon="camera_alt"
						outlined
						:placeholder="$t('avatar_placeholder')"
						:label="$t('avatar')"
						:rules="rules.avatar"
					></v-file-input>
					<v-layout column justify-center align-center class="mt-5 py-4">
						<v-btn
							class="cta_btn"
							rounded
							large
							outlined
							color="primary"
							@click="registerUser"
						>{{$t('register')}}</v-btn>
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
		name: "Register",
		data: () => ({
			alertErr: false,
			sent: false,
			rules,
			valid: false,
			showPass: false,
			showConfPass: false,
			firstName: "",
			lastName: "",
			username: "",
			email: "",
			password: "",
			confPassword: "",
			avatar: null
		}),
		computed: {
			alert() {
				if (this.alertErr) {
					return {
						type: "error",
						text: "Something went wrong, please try again later"
					};
				} else {
					return {
						type: "success",
						text: `User registred succesfully ! please verify your account.`
					};
				}
			}
		},
		methods: {
			selectFile(file) {
				this.avatar = file;
			},
			getBase64: file =>
				new Promise((resolve, reject) => {
					if (!file) resolve("File is empty.");
					if (["image/jpeg", "image/png"].includes(file.type) == false)
						resolve("File must be JPEG or PNG image.");
					if (file.size >= 1024 * 1024 * 4)
						resolve("File size must be less than 4 MB.");
					const reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = () => resolve(reader.result);
					reader.onerror = error => resolve("");
				}),
			passwordMatch() {
				if (this.confPassword === this.password) return "";
				return !this.confPassword.length ||
					this.password === this.confPassword
					? ""
					: "Passwords must match";
			},
			async registerUser() {
				if (this.$refs.form.validate()) {
					try {
						let image = await this.getBase64(this.avatar);
						if (/^data:/.test(image) == false) {
							alert(image);
							return;
						}
						const url = `https://hypertube.tk/api/users/register`;
						const data = {
							firstName: this.firstName,
							lastName: this.lastName,
							username: this.username,
							email: this.email,
							password: this.password,
							confPassword: this.confPassword,
							avatar: image
						};
						const res = await axios.post(url, data);
						this.alertErr = !!res.data.err;
						this.sent = true;
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
.v-input__prepend-outer {
	display: none;
}
</style>


