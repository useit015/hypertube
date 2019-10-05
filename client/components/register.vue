<template>
	<v-layout justify-center align-center class="mt-5">
		<v-flex xs12 sm7 md6 lg5 xl3>
			<v-layout column justify-center>
				<h2 class="display-2 font-weight-thin mt-3 mb-5 py-4 text-center" v-text="$t('title.register')"></h2>
				<v-form ref="form" v-model="valid" lazy-validation class="form">
					<v-text-field
						v-if="renderer"
						outlined
						color="primary"
						v-model="firstName"
						:rules="rules.name"
						:label="$t('firstname')"
						required
					/>
					<v-text-field
						v-if="renderer"
						outlined
						color="primary"
						v-model="lastName"
						:rules="rules.name"
						:label="$t('lastname')"
						required
					/>
					<v-text-field
						v-if="renderer"
						outlined
						color="primary"
						v-model="username"
						:rules="rules.username"
						:label="$t('username')"
						required
					/>
					<v-text-field
						v-if="renderer"
						outlined
						color="primary"
						v-model="email"
						:rules="rules.email"
						:label="$t('email')"
						required
					/>
					<v-text-field
						v-if="renderer"
						outlined
						color="primary"
						class="my-3"
						v-model="password"
						:rules="rules.password"
						:label="$t('password')"
						required
						:append-icon="showPass ? 'visibility' : 'visibility_off'"
						:type="showPass ? 'text' : 'password'"
						@click:append="showPass = !showPass"
					/>
					<v-text-field
						v-if="renderer"
						outlined
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
					/>
					<v-file-input
						v-if="renderer"
						show-size
						single-line
						@change="selectFile"
						append-icon="camera_alt"
						prepend-icon
						@click:append="selectFile"
						outlined
						:label="$t('avatar')"
						:rules="rules.avatar"
						class="file__input"
					/>
					<v-layout column justify-center align-center class="mt-5 py-4">
						<v-btn
							class="cta_btn"
							rounded
							large
							outlined
							color="primary"
							@click="registerUser"
							v-text="$t('buttons.register')"
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
	import utility from "@/assets/utility.js";

	export default {
		name: "Register",
		data: () => ({
			rules: {},
			valid: false,
			showPass: false,
			showConfPass: false,
			firstName: "",
			lastName: "",
			username: "",
			email: "",
			password: "",
			confPassword: "",
			avatar: null,
			renderer: true
		}),
		created() {
			this.rules = rules(this);
			this.$bus.$on("langChange", this.langChange);
		},
		methods: {
			...utility,
			selectFile(file) {
				this.avatar = file;
			},
			getBase64: file =>
				new Promise((resolve, reject) => {
					if (!file) resolve(this.$t("rules.avatar.empty"));
					if (["image/jpeg", "image/png"].includes(file.type) == false)
						resolve(this.$t("rules.avatar.ext"));
					if (file.size >= 1024 * 1024 * 4)
						resolve(this.$t("rules.avatar.size"));
					const reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = () => resolve(reader.result);
					reader.onerror = error => resolve("");
				}),
			async registerUser() {
				if (this.$refs.form.validate()) {
					try {
						let image = await this.getBase64(this.avatar);
						if (/^data:/.test(image) == false) {
							this.openAlert(this, "error.image");
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
						if (!!res.data.err) {
							this.openAlert(
								this,
								`api.register.${res.data.errors[0]}`
							);
						} else {
							this.openAlert(
								this,
								`api.register.${res.data.status}`,
								"green"
							);
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
			},
			passwordMatch() {
				return this.passwordCmp(this);
			}
		}
	};
</script>
