<template>
	<v-layout justify-center align-center class="mt-5">
		<v-flex xs12 sm7 md6 lg5 xl3>
			<v-layout column justify-center>
				<h2 class="display-2 font-weight-thin my-5 py-5 text-center">Recover password</h2>
				<div v-if="sent">
					<v-alert :type="alert.type" class="mb-5">{{ alert.text }}</v-alert>
					<v-layout column justify-center align-center class="mt-5 py-5">
						<v-btn class="cta_btn" rounded large outlined color="primary" to="/" nuxt>Go back</v-btn>
					</v-layout>
				</div>
				<v-form v-else v-model="valid" lazy-validation class="mt-5" @submit.prevent="recoverPass">
					<v-text-field
						outlined
						color="primary"
						placeholder="E-mail goes here"
						v-model="email"
						:rules="rules.email"
						label="E-mail"
						required
					></v-text-field>
					<v-layout column justify-center align-center class="py-4">
						<v-btn
							class="cta_btn"
							rounded
							large
							outlined
							color="primary"
							@click.prevent="recoverPass"
						>Send</v-btn>
					</v-layout>
				</v-form>
			</v-layout>
		</v-flex>
	</v-layout>
</template>

<script>
	import rules from "@/assets/rules";
	import axios from "axios";
	export default {
		name: "Forgot",
		data: () => ({
			alertErr: false,
			valid: false,
			sent: false,
			email: "",
			rules
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
						text: `We've sent you an e-mail with recovery steps`
					};
				}
			}
		},
		methods: {
			async recoverPass() {
				if (this.valid) {
					try {
						const url = `https://hypertube.tk/api/users/forgot`;
						const data = { email: this.email };
						const res = await axios.post(url, data);
						this.alertErr = !res.data.ok || !!res.data.err;
						this.sent = true;
					} catch (err) {
						console.error(err);
					}
				}
			}
		}
	};
</script>

<style>
</style>
