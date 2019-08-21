<template>
	<v-layout justify-center align-center class="mt-5">
		<v-flex xs12 sm7 md6 lg5 xl3>
			<v-layout column justify-center>
				<h2 class="display-2 font-weight-thin my-5 py-5 text-center">{{ $t('title') }}</h2>
				<v-form ref="form" v-model="valid" lazy-validation class="mt-5">
					<v-text-field
						outlined
						color="primary"
						v-model="username"
						:rules="rules.username"
						:label="$t('username')"
						required
					></v-text-field>
					<v-text-field
						outlined
						color="primary"
						v-model="password"
						:rules="rules.password"
						:label="$t('password')"
						required
						:append-icon="showPass ? 'visibility' : 'visibility_off'"
						:type="showPass ? 'text' : 'password'"
						@click:append="showPass = !showPass"
						@keyup.13.prevent="logUser"
					></v-text-field>
					<v-layout justify-end align-center>
						<v-btn
							rounded
							text
							small
							color="primary"
							class="caption fgt_btn"
							to="/login/forgot"
							nuxt
						>{{ $t('forgot') }}</v-btn>
					</v-layout>
					<v-layout justify-center align-center class="mt-5 py-4">
						<v-btn
							class="cta_btn"
							rounded
							large
							outlined
							color="primary"
							@click.prevent="logUser"
						>{{ $t('login') }}</v-btn>
					</v-layout>
				</v-form>
			</v-layout>
		</v-flex>
		<alert :data="alert"></alert>
	</v-layout>
</template>

<script>
	import Alert from "./alert";
	import axios from "axios";
	import { mapActions } from "vuex";
	import rules from "@/assets/rules";
	import utility from '../utility.js';

	export default {
		name: "Login",
		components: {
			Alert
		},
		data: () => ({
			alert: {
				state: false,
				color: '',
				text: ''
			},
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
			...mapActions(["login"]),
			...utility,
			async logUser() {
				if (this.$refs.form.validate()) {
					try {
						const url = `https://hypertube.tk/api/users/login`;
						const data = {
							username: this.username,
							password: this.password
						};
						const res = await axios.post(url, data);
						if (!!res.data.err) {
							this.showAlert('red', res.data.errors.join(', '), this)
						}
						else {
							this.login(res.data);
							this.$i18n.locale = res.data.langue;
							this.$router.push("/library");
						}
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


