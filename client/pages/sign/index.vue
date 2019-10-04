<template>
	<v-container class="sign_container">
		<v-layout column>
			<v-flex xs12 sm7 md6 lg5 xl3 class="my-5">
				<v-layout justify-end align-center>
					<v-btn-toggle v-model="login" mandatory rounded class="toggle">
						<v-btn class="pl-5 pr-3" color="primary" outlined v-text="$t('buttons.signup')"/>
						<v-btn class="pr-5 pl-3" color="primary" outlined v-text="$t('buttons.signin')"/>
					</v-btn-toggle>
				</v-layout>
			</v-flex>
			<login v-if="login"/>
			<register v-else/>
			<div class="py-3 mb-3 headline font-weight-thin text-center" v-text="$t('or')"></div>
			<strategy/>
		</v-layout>
	</v-container>
</template>

<script>
	import Login from "@/components/login";
	import Register from "@/components/register";
	import Strategy from "@/components/strategy";

	export default {
		middleware: "loggedIn",
		components: {
			Login,
			Register,
			Strategy
		},
		created() {
			this.$bus.$emit("showNavbar");
		},
		beforeDestroy() {
			this.$bus.$emit("hideNavbar");
		},
		data: () => ({
			login: 1
		})
	};
</script>

<style>
.toggle {
	overflow: hidden;
}
</style>
