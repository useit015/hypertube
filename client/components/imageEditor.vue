<template>
	<div>
		<v-dialog v-model="dialog" max-width="450" persistent>
			<v-card class="dark lighten-3 editor_dialog" dark>
				<v-layout column align-center justify-center class="pt-5">
					<vue-avatar
						:width="280"
						:height="280"
						:border="0"
						ref="vueavatar"
						@vue-avatar-editor:image-ready="onImageReady"
						@file_error="error = true"
						@file_success="error = false"
						class="mb-3"
					></vue-avatar>
					<vue-avatar-scale
						ref="vueavatarscale"
						@vue-avatar-editor-scale:change-scale="onChangeScale"
						:width="250"
						:min="1"
						:max="3"
						:step="0.02"
					></vue-avatar-scale>
				</v-layout>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn text color="primary" @click="closeEditor">Cancel</v-btn>
					<v-btn text color="primary" @click="saveClicked" :disabled="error">Save</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
	import axios from "axios";
	import { mapGetters, mapActions } from "vuex";
	import VueAvatar from "@/components/VueAvatar";
	import VueAvatarScale from "@/components/VueAvatarScale";

	export default {
		name: "ProfileEditor",
		components: {
			VueAvatar,
			VueAvatarScale
		},
		data: () => ({
			error: true,
			dialog: false
		}),
		computed: mapGetters(["user"]),
		methods: {
			...mapActions(["updateAvatar"]),
			closeEditor() {
				this.dialog = false;
				this.$refs.vueavatar.init();
			},
			pickFile() {
				this.dialog = true;
			},
			onChangeScale(scale) {
				this.$refs.vueavatar.changeScale(scale);
			},
			saveClicked() {
				if (!this.error) {
					const img = this.$refs.vueavatar.getImageScaled().toDataURL();
					const url = `https://hypertube.tk/api/users/image`;
					const headers = { Authorization: `jwt ${this.user.token}` };
					const data = { img };
					axios
						.post(url, data, { headers })
						.then(res => {
							this.$emit("updated", !res.data.err);
							if (res.data.image) this.updateAvatar(res.data.image);
						})
						.catch(err => this.openAlert(this, "edit.fail"));
					this.isEditing = false;
					this.$refs.vueavatarscale.reset();
					this.dialog = false;
				} else {
					this.openAlert(this, "edit.fail");
				}
			},
			onImageReady(scale) {
				this.$refs.vueavatarscale.setScale(scale);
			}
		}
	};
</script>
