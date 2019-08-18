<template>
	<v-container class="main_container">
		<v-row justify="center">
			<v-col cols="3">
				<v-btn
					block
					large
					depressed
					rounded
					to="/sign"
					nuxt
					color="primary"
					class="mt-5 title font-weight-light"
				>Get Started</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	import Login from "@/components/login";
	import Register from "@/components/register";
	import Strategy from "@/components/strategy";

	export default {
		components: {
			Login,
			Register,
			Strategy
		},
		data: () => ({
			login: 1
		})
	};
</script>
