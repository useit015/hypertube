<template>
	<v-dialog
		v-model="passDialog"
		fullscreen
		hide-overlay
		transition="dialog-bottom-transition"
		@keydown.esc="passDialog = false"
	>
		<v-card class="dark lighten-3">
			<v-toolbar dark color="grey darken-2" class="elevation-0 px-3">
				<v-toolbar-title class="ml-5 headline font-weight-thin">Change password</v-toolbar-title>
				<div class="flex-grow-1"></div>
				<v-toolbar-items>
					<v-btn
						dark
						text
						color="primary"
						@click="updatePassword"
						v-text="$t('buttons.save')"
						:disabled="!password || !newPassword ||!confNewPassword"
					/>
					<v-btn dark text color="primary" @click="close" v-text="$t('buttons.cancel')"/>
				</v-toolbar-items>
			</v-toolbar>
			<v-layout justify-center align-center class="mt-5">
				<v-flex xs12 sm7 md6 lg5 xl3>
					<v-layout column justify-center class="password__form-container">
						<v-form v-model="passValid" ref="passForm" class="password__form">
							<v-text-field
								outlined
								color="primary"
								class="mb-4"
								v-model="password"
								validate-on-blur
								:rules="rules.password"
								:label="$t('edit.cur')"
								required
								:append-icon="showPass ? 'visibility' : 'visibility_off'"
								:type="showPass ? 'text' : 'password'"
								@click:append="showPass = !showPass"
							/>
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
						</v-form>
					</v-layout>
				</v-flex>
			</v-layout>
		</v-card>
	</v-dialog>
</template>

<script>
	import axios from "axios";
	import rules from "@/assets/rules";
	import utility from "@/assets/utility.js";

	export default {
		props: {
			token: {
				type: String,
				default: ""
			}
		},
		data: () => ({
			rules: {},
			showConfNewPass: false,
			showNewPass: false,
			passDialog: false,
			passValid: false,
			showPass: false,
			password: "",
			newPassword: "",
			confNewPassword: ""
		}),
		async created() {
			this.rules = rules(this);
		},
		methods: {
			...utility,
			async updatePassword() {
				if (this.$refs.passForm.validate()) {
					const url = `https://hypertube.tk/api/users/passwordupdate`;
					const headers = { Authorization: `jwt ${this.token}` };
					const data = {
						password: this.password,
						newPassword: this.newPassword,
						confNewPassword: this.confNewPassword
					};
					axios
						.post(url, data, { headers })
						.then(res => {
							if (!res.data.err) {
								this.$emit("updated", !res.data.err);
							} else {
								this.openAlert(this, "edit.fail");
							}
						})
						.catch(err => this.openAlert(this, "edit.fail"));
					this.passDialog = false;
					this.password = "";
					this.newPassword = "";
					this.confNewPassword = "";
					this.valid = false;
				}
			},
			open() {
				this.passDialog = true;
			},
			close() {
				this.passDialog = false;
				this.password = "";
				this.newPassword = "";
				this.confNewPassword = "";
				this.$refs.passForm.resetValidation();
			},
			passwordMatch() {
				return this.passwordCmp(this);
			}
		}
	};
</script>

<style>
.password__container {
	position: relative;
}

.password__form {
	margin-top: 10vh;
}

.password__form-container {
	max-width: 90vw;
	margin: 0 auto;
}
</style>
