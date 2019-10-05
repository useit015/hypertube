<template>
	<v-layout justify-center align-center class="pt-5 sign_container">
		<v-flex xs12 sm7 md6 lg5 xl3>
			<v-layout column justify-center>
				<h2 class="display-2 font-weight-thin my-5 py-5 text-center" v-text="$t('title.forgot')"></h2>
				<v-form ref="form" v-model="valid" lazy-validation class="mt-5" @submit.prevent="recoverPass">
					<v-text-field
						outlined
						color="primary"
						v-model="email"
						:rules="rules.email"
						:label="$t('email')"
						required
						@keyup.13.prevent="recoverPass"
					/>
					<v-layout column justify-center align-center class="py-4">
						<v-btn
							class="cta_btn"
							rounded
							large
							outlined
							color="primary"
							@click.prevent="recoverPass"
							v-text="$t('buttons.send')"
						/>
					</v-layout>
				</v-form>
			</v-layout>
		</v-flex>
	</v-layout>
</template>

<script>
	import axios from "axios";
	import rules from "@/assets/rules";
	import utility from "@/assets/utility";

	export default {
		name: "Forgot",
		data: () => ({
			valid: false,
			email: "",
			rules: {}
		}),
		created() {
			this.rules = rules(this);
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
						this.email = "";
						if (!res.data.ok || !!res.data.err) {
							this.openAlert(this, res.data.errors);
						} else {
							this.openAlert(this, res.data.status, "green");
						}
					} catch (err) {
						this.openAlert(this, "edit.fail");
					}
				}
			}
		}
	};
</script>

