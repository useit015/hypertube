<template>
	<div>
		<v-snackbar
			v-for="(alert, i) in alerts"
			:key="i"
			:style="`top:${!i ? 8 : i * 72 + 8}px`"
			v-model="alert.state"
			:color="alert.color"
			:timeout="0"
			top
			right
		>
			{{ alert.text }}
			<v-btn dark text @click="alert.state = false">
				<v-icon>close</v-icon>
			</v-btn>
		</v-snackbar>
	</div>
</template>

<script>
	export default {
		name: "Alert",
		data() {
			return {
				alerts: []
			};
		},
		created() {
			this.$bus.$on("openAlert", this.openAlert);
		},
		methods: {
			openAlert(alert) {
				this.alerts.push({ ...alert, state: true });
				setTimeout(() => this.alerts.shift(), 3000);
			}
		}
	};
</script>

<style>
.v-snack__content {
	padding: 0.75rem 1.5rem !important;
}
</style>
