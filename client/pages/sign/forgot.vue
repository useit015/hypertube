<template>
	<v-layout justify-center align-center class="mt-5">
		<v-flex xs12 sm7 md6 lg5 xl3>
			<v-layout column justify-center>
				<v-form ref="form" v-model="valid" lazy-validation class="mt-5" @submit.prevent="recoverPass">
					<v-text-field
						outlined
						color="primary"
						v-model="email"
						:rules="rules.email"
						:label="$t('email')"
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
						>{{$t("send")}}</v-btn>
					</v-layout>
				</v-form>
			</v-layout>
		</v-flex>
		<alert :data="alert"></alert>
	</v-layout>
</template>

<script>
	import Alert from "@/components/alert";
	import rules from "@/assets/rules";
	import axios from "axios";
	import utility from '../../utility.js';

	export default {
		name: "Forgot",
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
			...utility,
			async recoverPass() {
				if (this.$refs.form.validate()) {
					try {
						const url = `https://hypertube.tk/api/users/forgot`;
						const data = { email: this.email };
						const res = await axios.post(url, data);
						if (!res.data.ok || !!res.data.err) {
							this.showAlert('red', res.data.errors.join(', '), this)
						}
						else {
							this.showAlert('green', "We've sent you an e-mail with recovery steps", this)
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
</style>
