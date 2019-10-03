<template>
	<v-layout justify-center align-center class="pt-5 sign_container">
		<v-flex xs12 sm7 md6 lg5 xl3>
			<v-layout column justify-center>
				<h2 class="display-2 font-weight-thin my-5 py-5 text-center">{{$t("recover_password")}}</h2>
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
	import utility from "@/assets/utility.js";
	import alert from "@/components/alert";
	import rules from "@/assets/rules";
	import axios from "axios";

	export default {
		name: "Forgot",
		components: {
			alert
		},
		data: () => ({
			alert: {
				state: false,
				color: "",
				text: ""
			},
			valid: false,
			email: "",
			rules
		}),
		created() {
			this.$bus.$emit("showNavbar");
		},
		beforeDestroy() {
			this.$bus.$emit("hideNavbar");
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
							this.showAlert("red", res.data.errors.join(", "), this);
						} else {
							this.showAlert("green", res.data.status, this);
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
