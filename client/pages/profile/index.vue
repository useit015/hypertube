<template>
<v-layout column class="settings user" v-if="loaded">
	<v-layout class="mt-4 strap dark">
		<v-container py-0>
			<v-layout>
				<v-flex xs12 sm8 md4 class="avatar">
					<v-avatar slot="offset" class="mx-auto d-block" size="200">
						<img :src="`https://hypertube.tk${user.image}`" class="avatar__img">
						<div class="avatar__btn">
							<v-fab-transition>
								<v-btn color="dark" fab small @click.stop="openEditor">
									<v-icon>add_a_photo</v-icon>
								</v-btn>
							</v-fab-transition>
						</div>
					</v-avatar>
				</v-flex>
			</v-layout>
		</v-container>
	</v-layout>
	<v-container fill-height grid-list-xl>
		<v-card class="mx-auto px-4 pb-4 mt-4" width="100%">
			<v-layout justify-center wrap>
				<v-container>
					<v-btn class="edit" color="primary" fab small @click="isEditing = !isEditing">
						<v-icon v-if="isEditing">close</v-icon>
						<v-icon v-else>edit</v-icon>
					</v-btn>
					<v-card-title class="heading display-2 font-weight-thin pt-4 pb-3 mb-4">
						Informations
					</v-card-title>
					<v-form class="mt-4" ref="form" v-model="valid" lazy-validation>
						<v-layout wrap>
							<v-flex xs12 sm6>
								<v-text-field
									:disabled="!isEditing"
									outlined
									color="primary"
									label="First Name"
									v-model="user.firstName"
									:rules="rules.name"
									required
								></v-text-field>
							</v-flex>
							<v-flex xs12 sm6>
								<v-text-field
									:disabled="!isEditing"
									outlined
									color="primary"
									label="Last Name"
									v-model="user.lastName"
									:rules="rules.name"
									required
								></v-text-field>
							</v-flex>
							<v-flex xs12 sm6>
								<v-text-field
									:disabled="!isEditing"
									outlined
									color="primary"
									label="Username"
									v-model="user.username"
									:rules="rules.username"
									required
								></v-text-field>
							</v-flex>
							<v-flex xs12 sm6>
								<v-text-field
									:disabled="!isEditing"
									outlined
									color="primary"
									label="Email"
									v-model="user.email"
									:rules="rules.email"
									required
								></v-text-field>
							</v-flex>
							<v-flex xs12 sm6 class="px-3 my-3">
								<v-layout align-center class="px-3">
									<v-text-field 
										disabled
										outlined
										color="primary"
										value="**********"
										label="Password"
										type="password"
									></v-text-field>
									<v-icon color="light" class="ml-3" @click="passDialog = true">edit</v-icon>
								</v-layout>
							</v-flex>
							<v-flex xs12 sm6>
								<v-select
									:disabled="!isEditing"
									outlined
									color="primary"
									:items="languages"
									label="Default Language"
									v-model="user.langue"
								></v-select>
							</v-flex>
							<v-flex xs12 text-xs-right>
								<v-btn
									:disabled="!isEditing"
									class="mx-0 font-weight-light"
									color="primary"
									large
									dark
									@click="updateUser"
								>Save</v-btn>
							</v-flex>
						</v-layout>
					</v-form>
				</v-container>
			</v-layout>
		</v-card>
		<v-dialog v-model="passDialog" max-width="500" persistent>
			<v-card class="dark lighten-3">
			<v-container>
				<h5 class="display-1 display-2 text-xs-center text-md-left font-weight-thin pt-3 pb-3 mb-4 hidden-sm-and-down">Change password</h5>
				<v-form v-model="valid" class="my-4">
					<v-text-field
						outlined
						color="primary"
						class="mb-4"
						v-model="password"
						validate-on-blur
						:rules="rules.password"
						label="Current password"
						required
						:append-icon="showPass ? 'visibility' : 'visibility_off'"
						:type="showPass ? 'text' : 'password'"
						@click:append="showPass = !showPass"
					></v-text-field>
					<v-text-field
						outlined
						color="primary"
						class="mb-4"
						v-model="newPassword"
						validate-on-blur
						:rules="rules.password"
						label="New password"
						required
						:append-icon="showNewPass ? 'visibility' : 'visibility_off'"
						:type="showNewPass ? 'text' : 'password'"
						@click:append="showNewPass = !showNewPass"
					></v-text-field>
					<v-text-field
						outlined
						color="primary"
						class="mb-4"
						v-model="confNewPassword"
						:rules="rules.password"
						validate-on-blur
						label="Confirm new password"
						required
						:append-icon="showConfNewPass ? 'visibility' : 'visibility_off'"
						:type="showConfNewPass ? 'text' : 'password'"
						@click:append="showConfNewPass = !showConfNewPass"
						:error-messages="passwordMatch()"
					></v-text-field>
				</v-form>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn text color="primary" @click="updatePassword">Save</v-btn>
					<v-btn text color="primary" @click="closePass">Cancel</v-btn>
				</v-card-actions>
			</v-container>
		</v-card>
		</v-dialog>
	</v-container>
</v-layout>
</template>

<script>
	import axios from "axios";
	import rules from "@/assets/rules";
	import loader from "@/components/loader";
	import { mapGetters } from "vuex";
	export default {
		middleware: "authenticated",
		components: {
			loader
		},
		data: () => ({
			loaded: false,
			isEditing: false,
			passDialog: false,
			showPass: false,
			showNewPass: false,
			showConfNewPass: false,
			rules,
			valid: false,
			firstName: "",
			lastName: "",
			username: "",
			email: "",
			password: "",
			newPassword: "",
			confNewPassword: "",
			langue: "",
			languages: ["en", "fr"]
		}),
		computed: {
			...mapGetters(["user"])
		},
		async created() {
			this.loaded = true;
		},
		methods: {
			toggleEdit () {
				this.isEditing = !this.isEditing
			},
			closePass () {
				this.passDialog = false
				this.password = ""
				this.newPassword = ""
				this.confNewPassword = ""
			},
			passwordMatch() {
				if (this.confNewPassword === this.newPassword) return "";
				return !this.confNewPassword.length ||
					this.newPassword === this.confNewPassword
					? ""
					: "Passwords must match";
			},
			async updateUser() {
				if (this.$refs.form.validate()) {
					try {
						const url = `https://hypertube.tk/api/users/update`;
						const headers = { Authorization: `jwt ${this.user.token}` }
						const data = {
							firstName: this.user.firstName,
							lastName: this.user.lastName,
							username: this.user.username,
							email: this.user.email,
							langue: this.user.langue
						};
						const res = await axios.post(url, data, { headers });
						console.log(res.data);
					} catch (err) {
						console.error(err);
					}
				}
			},
			async updatePassword() {
				if (this.$refs.form.validate()) {
					try {
						const url = `https://hypertube.tk/api/users/passwordupdate`;
						const headers = { Authorization: `jwt ${this.user.token}` }
						const data = {
							password: this.password,
							newPassword: this.newPassword,
							confNewPassword: this.confNewPassword
						};
						const res = await axios.post(url, data, { headers });
						if (!res.err) {
							console.log(res.data);
							this.password = ''
							this.newPassword = ''
							this.confNewPassword = ''
							this.valid = false
							this.passDialog = false
						} else {
							console.log(res.data);
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
.user {
	margin-top: 70px;
}
.avatar {
	position: relative;
	flex-shrink: 0;
}
.avatar__btn {
	position: absolute;
	top: 85%;
	left: 85%;
	transform: translate(-50%, -50%) scale(.95);
}
.avatar__img {
	box-shadow: 0 0 0 3px rgba(65, 65, 65, 0.4),
		0 1px 5px rgba(0, 0, 0, .2);
}
.edit, .edit:hover, .edit:focus {
	position: absolute;
}
.edit {
	right: 0;
	transform: translate(20%, -30%);
}
</style>
