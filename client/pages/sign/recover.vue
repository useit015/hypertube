<template>
	<v-container class="sign_container">
		<v-layout justify-center align-center class="mt-5">
			<v-flex xs12 sm7 md6 lg5 xl3>
				<v-layout column justify-center class="password__form-container">
					<h2 class="display-2 font-weight-thin my-5 py-5 text-center" v-text="$t('title.forgot')"></h2>
					<v-form v-model="passValid" ref="passForm" class="password__form">
						<v-text-field
							outlined
							color="primary"
							class="mb-4"
							v-model="newPassword"
							validate-on-blur
							:rules="rules.password"
							:label="$t('edit.new')"
							required
							:append-icon="showNewPass ? 'visibility' : 'visibility_off'"
							:type="showNewPass ? 'text' : 'password'"
							@click:append="showNewPass = !showNewPass"
						/>
						<v-text-field
							outlined
							color="primary"
							class="mb-4"
							v-model="confNewPassword"
							:rules="rules.password"
							validate-on-blur
							:label="$t('edit.conf')"
							required
							:append-icon="showConfNewPass ? 'visibility' : 'visibility_off'"
							:type="showConfNewPass ? 'text' : 'password'"
							@click:append="showConfNewPass = !showConfNewPass"
							:error-messages="passwordMatch()"
						/>
						<v-btn
							rounded
							large
							outlined
							color="primary"
							@click="updatePassword"
							v-text="$t('buttons.save')"
							:disabled="!newPassword ||!confNewPassword"
						/>
					</v-form>
				</v-layout>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import axios from "axios";
import rules from "@/assets/rules";
import { mapActions } from "vuex";
import utility from "@/assets/utility.js";

export default {
	middleware: "loggedIn",
	data: () => ({
		rules: {},
		showConfNewPass: false,
		showNewPass: false,
		passValid: false,
		newPassword: "",
		confNewPassword: ""
	}),
	async created() {
		this.rules = rules(this);
		this.$bus.$emit("showNavbar");
	},
	beforeDestroy() {
		this.$bus.$emit("hideNavbar");
	},
	methods: {
		...utility,
		...mapActions(["login"]),
		async updatePassword() {
			if (this.$refs.passForm.validate()) {
				const url = `https://hypertube.tk/api/users/passwordrecovery`;
				const data = {
					rkey: localStorage.getItem("rkey"),
					newPassword: this.newPassword,
					confNewPassword: this.confNewPassword
				};
				axios
					.post(url, data)
					.then(res => {
						if (res.data.err) {
							this.openAlert(this, "edit.fail");
						} else {
							this.login(res.data);
							this.$i18n.locale = res.data.langue;
							localStorage.removeItem("rkey");
							this.$router.push("/");
						}
					})
					.catch(err => this.openAlert(this, "edit.fail"));
				this.newPassword = "";
				this.confNewPassword = "";
			}
		},
		passwordMatch() {
			return this.passwordCmp(this);
		}
	}
};
</script>
