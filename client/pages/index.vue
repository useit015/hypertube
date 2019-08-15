<template>
	<v-layout column>
		<h1>Home</h1>
	</v-layout>
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

<style>
.toggle {
	overflow: hidden;
}
</style>
