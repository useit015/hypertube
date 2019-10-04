<template>
	<v-snackbar v-model="data.state" :color="data.color" :timeout="3000" top right>
		{{ data.text }}
		<v-btn dark text @click="data.state = false">
			<v-icon>close</v-icon>
		</v-btn>
	</v-snackbar>
</template>

<script>
	export default {
		name: "Alert",
		data() {
			return {
				data: {
					state: false,
					color: "",
					text: ""
				}
			};
		},
		created() {
			this.$bus.$on("openAlert", this.openAlert);
		},
		methods: {
			openAlert(data) {
				this.data = { ...data, state: true };
			}
		}
	};
</script>

<style>
.v-snack__content {
	padding: 0.75rem 1.5rem !important;
}
</style>
