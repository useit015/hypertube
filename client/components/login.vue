<template>
	<v-layout justify-center align-center class="mt-5">
		<v-flex xs12 sm7 md6 lg5 xl3>
			<v-layout column justify-center>
				<h2 class="display-2 font-weight-thin my-5 py-5 text-center" v-text="$t('title.login')"></h2>
				<v-form ref="form" v-model="valid" lazy-validation class="mt-5">
					<v-text-field
						v-if="renderer"
						outlined
						color="primary"
						v-model="username"
						validate-on-blur
						:rules="rules.username"
						:label="$t('username')"
						required
					></v-text-field>
					<v-text-field
						v-if="renderer"
						outlined
						color="primary"
						v-model="password"
						validate-on-blur
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
							to="/sign/forgot"
							nuxt
							v-text="$t('buttons.forgot')"
						/>
					</v-layout>
					<v-layout justify-center align-center class="mt-5 py-4">
						<v-btn
							class="cta_btn"
							rounded
							large
							outlined
							color="primary"
							@click.prevent="logUser"
							v-text="$t('buttons.login')"
						/>
					</v-layout>
				</v-form>
			</v-layout>
		</v-flex>
	</v-layout>
</template>

<script>
	import axios from "axios";
	import { mapActions } from "vuex";
	import rules from "@/assets/rules";
	import utility from "@/assets/utility.js";

	export default {
		name: "Login",
		data: () => ({
			valid: false,
			renderer: true,
			showPass: false,
			username: "",
			password: "",
			rules: {}
		}),
		created() {
			this.rules = rules(this);
			this.$bus.$on("langChange", this.langChange);
		},
		methods: {
			...utility,
			...mapActions(["login"]),
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
							this.openAlert(this, `api.login.${res.data.errors[0]}`);
						} else {
							this.login(res.data);
							this.$i18n.locale = res.data.langue;
							this.$router.push("/");
						}
					} catch (err) {
						this.openAlert(this, "edit.fail");
					}
				}
			},
			langChange() {
				if (this.$refs.form) this.$refs.form.resetValidation();
				this.renderer = false;
				this.$nextTick(() => (this.renderer = true));
			}
		}
	};
</script>

<style>
.fgt_btn {
	margin-top: -0.5rem !important;
}
</style>
