<template>
	<v-layout justify-center wrap class="user pb-5 mb-5" v-if="loaded">
		<div class="avatar__container">
			<v-avatar tile slot="offset" class="avatar" size="200">
				<img :src="avatar" class="avatar__img">
				<div class="avatar__btn">
					<v-fab-transition>
						<v-btn color="primary" fab small @click.stop="openEditor">
							<v-icon>add_a_photo</v-icon>
						</v-btn>
					</v-fab-transition>
				</div>
			</v-avatar>
		</div>
		<v-container class="mx-0 mb-5 main" fill-height grid-list-xl>
			<v-card class="mx-auto px-4 py-4 mt-4" flat width="100%">
				<v-layout justify-center wrap>
					<v-container>
						<v-tooltip left>
							<template v-slot:activator="{ on }">
								<v-btn class="edit" color="primary" fab small @click="toggleEdit" v-on="on">
									<v-icon v-if="isEditing">close</v-icon>
									<v-icon v-else>edit</v-icon>
								</v-btn>
							</template>
							<span class="fab__tooltip" v-text="$t(`tooltip.edit`)"></span>
						</v-tooltip>
						<v-card-title class="movie__title font-weight-thin mb-5" v-text="$t(`edit.information`)"></v-card-title>
						<v-form class="pt-4" ref="form" v-model="valid" lazy-validation>
							<v-layout wrap>
								<v-flex xs12 md6>
									<v-text-field
										:disabled="!isEditing"
										outlined
										color="primary"
										v-if="renderer"
										:label="$t('firstname')"
										v-model="user.firstName"
										:rules="rules.name"
										required
										@input="sync"
									/>
								</v-flex>
								<v-flex xs12 md6>
									<v-text-field
										:disabled="!isEditing"
										outlined
										color="primary"
										v-if="renderer"
										:label="$t('lastname')"
										v-model="user.lastName"
										:rules="rules.name"
										required
										@input="sync"
									/>
								</v-flex>
								<v-flex xs12 md6>
									<v-text-field
										:disabled="!isEditing"
										outlined
										color="primary"
										v-if="renderer"
										:label="$t('username')"
										v-model="user.username"
										:rules="rules.username"
										required
										@input="sync"
									/>
								</v-flex>
								<v-flex xs12 md6>
									<v-text-field
										:disabled="!isEditing"
										outlined
										color="primary"
										v-if="renderer"
										:label="$t('email')"
										v-model="user.email"
										:rules="rules.email"
										required
										@input="sync"
									/>
								</v-flex>
								<v-flex xs12 md6 class="px-3 my-3 password__container" v-if="!oauthUser">
									<v-layout align-center class="px-3">
										<v-text-field
											disabled
											outlined
											color="primary"
											value="**********"
											v-if="renderer"
											:label="$t('password')"
											type="password"
										></v-text-field>
										<v-btn icon small color="primary" :hidden="!isEditing" class="password__button">
											<v-icon color="grey lighten-2" hidden @click="openPassDialog">edit</v-icon>
										</v-btn>
									</v-layout>
								</v-flex>
								<v-flex xs12 md6>
									<v-select
										:disabled="!isEditing"
										outlined
										color="primary"
										:items="languages"
										v-if="renderer"
										:label="$t('defaultLanguage')"
										v-model="user.langue"
										@input="sync"
									>
										<template slot="selection" slot-scope="data">
											<country-flag :country="getFlag(data.item)"/>
										</template>
										<template slot="item" slot-scope="data">
											<country-flag :country="getFlag(data.item)"/>
										</template>
										<div slot="item" item>item</div>
									</v-select>
								</v-flex>
							</v-layout>
							<v-flex xs12 text-xs-right class="save__container px-0 py-0">
								<v-btn
									:disabled="!valid || !isEditing || !dataChanged"
									class="mx-0 font-weight-light"
									color="primary"
									large
									text
									dark
									v-text="$t('buttons.save')"
									@click="save"
								/>
							</v-flex>
						</v-form>
					</v-container>
				</v-layout>
			</v-card>
		</v-container>
		<profileMovies :liked="liked" :watched="watched"/>
		<passDialog ref="passDialog" :token="user.token" @updated="feedback" v-if="!oauthUser"/>
		<imageEditor ref="editor" @updated="feedback"/>
		<loader v-if="saving" style="opacity:0"/>
	</v-layout>
	<loader v-else/>
</template>

<script>
import axios from "axios";
import rules from "@/assets/rules";
import loader from "@/components/loader";
import utility from "@/assets/utility.js";
import CountryFlag from "vue-country-flag";
import { mapGetters, mapActions } from "vuex";
import passDialog from "@/components/passDialog";
import imageEditor from "@/components/imageEditor";
import profileMovies from "@/components/profileMovies";

const isExternal = url =>
	url &&
	(url.indexOf(":") > -1 ||
		url.indexOf("//") > -1 ||
		url.indexOf("www.") > -1);

export default {
	middleware: "authenticated",
	components: {
		loader,
		passDialog,
		CountryFlag,
		imageEditor,
		profileMovies
	},
	data() {
		return {
			rules: {},
			storeUser: "",
			languages: ["en", "fr", "ar", "es", "dr"],
			dataChanged: false,
			isEditing: false,
			renderer: true,
			loaded: false,
			saving: false,
			valid: false
		};
	},
	computed: {
		...mapGetters(["user", "liked", "watched", "oauthUser"]),
		langue() {
			return this.user.langue;
		},
		avatar() {
			return !this.user.image
				? "/zdiab.jpg"
				: isExternal(this.user.image)
				? this.user.image
				: `https://hypertube.tk${this.user.image}`;
		}
	},
	watch: {
		langue() {
			this.$i18n.locale = this.langue;
			this.renderer = false;
			this.$nextTick(() => {
				this.renderer = true;
				this.$nextTick(() => (this.valid = this.$refs.form.validate()));
			});
		}
	},
	async created() {
		this.rules = rules(this);
		this.$bus.$emit("showNavbar");
		this.loaded = true;
		this.storeUser = JSON.stringify(this.user);
	},
	beforeDestroy() {
		this.$bus.$emit("hideNavbar");
	},
	methods: {
		...utility,
		...mapActions(["updateUser"]),
		toggleEdit() {
			this.isEditing = !this.isEditing;
		},
		openEditor() {
			this.$refs.editor.pickFile();
		},
		openPassDialog() {
			this.$refs.passDialog.open();
		},
		async save() {
			if (this.$refs.form.validate()) {
				const url = `https://hypertube.tk/api/users/update`;
				const headers = { Authorization: `jwt ${this.user.token}` };
				const data = {
					firstName: this.user.firstName,
					lastName: this.user.lastName,
					username: this.user.username,
					email: this.user.email,
					langue: this.user.langue
				};
				this.saving = true;
				axios
					.post(url, data, { headers })
					.then(res => {
						this.feedback(!res.data.err);
						this.storeUser = JSON.stringify(this.user);
					})
					.catch(err => this.feedback());
				this.isEditing = false;
			}
		},
		toggleEdit() {
			if (this.isEditing) this.updateUser(this.storeUser);
			this.isEditing = !this.isEditing;
		},
		sync() {
			this.dataChanged = JSON.stringify(this.user) !== this.storeUser;
		},
		feedback(state) {
			if (state) {
				this.openAlert(this, "edit.success", "green");
			} else {
				this.openAlert(this, "edit.fail");
			}
			this.saving = false;
		},
		getFlag(lang) {
			return lang == "en"
				? "us"
				: lang == "ar"
				? "sa"
				: lang == "dr"
				? "ma"
				: lang;
		}
	}
};
</script>

<style>
	.user {
		width: 90vw;
		max-width: 80rem;
		margin: 10rem auto 0;
	}

	.main {
		flex: 1 1 60vw;
		min-width: 50rem;
		max-width: 60rem;
		overflow: hidden;
	}

	@media only screen and (max-width: 50rem) {
		.main {
			min-width: 0;
		}
	}

	.password__button {
		position: absolute;
		top: 33%;
		right: 0%;
		transform: translate(-50%, -50%);
	}

	.avatar {
		margin: 1rem;
		border-radius: 5px;
	}

	.avatar__container {
		padding: 12px;
	}

	.avatar__btn {
		position: absolute;
		top: 85%;
		left: 85%;
		transform: translate(-50%, -50%) scale(0.95);
	}

	.avatar__img {
		box-shadow: 0 0 0 3px rgba(65, 65, 65, 0.4), 0 1px 5px rgba(0, 0, 0, 0.2);
	}

	.edit,
	.edit:hover,
	.edit:focus {
		position: absolute;
	}

	.edit {
		top: 0;
		left: 100%;
		transform: translate(-75%, -25%);
	}

	.save__container {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-top: -0.5rem;
	}

	.movie__card {
		position: relative;
		margin: 2rem 1rem;
		width: calc(25% - 3rem);
		display: flex;
		flex-direction: column;
		background-color: #42424299 !important;
	}

	@media only screen and (max-width: 960px) {
		.movie__card {
			width: calc(33% - 2rem);
		}
	}

	@media only screen and (max-width: 550px) {
		.movie__card {
			width: calc(50% - 2rem);
		}
	}
</style>
