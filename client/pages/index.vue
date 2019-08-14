<template>
	<v-layout column>
		<v-flex xs12 sm7 md6 lg5 xl3 class="my-5">
			<v-layout justify-end align-center>
				<v-btn-toggle v-model="login" mandatory rounded>
					<v-btn class="pl-5 pr-3">Sign up</v-btn>
					<v-btn class="pr-5 pl-3">Sign in</v-btn>
				</v-btn-toggle>
			</v-layout>
		</v-flex>
		<login v-if="login"/>
		<register v-else/>
		<div class="py-4 my-3 headline font-weight-thin text-center">OR</div>
		<v-layout justify-center align-center>
			<v-flex xs12 sm7 md6 lg5 xl3>
				<v-layout justify-center align-center wrap>
					<v-flex sm6 md4 v-for="(strategy, i) in strategies" :key="i">
						<v-layout class="mx-3 my-3" justify-center align-center>
							<v-btn rounded large outlined color="grey darken-3" :href="strategy.url">
								<v-layout justify-center align-center>
									<span class="text-capitalize font-weight-slim grey--text">{{ strategy.text }}</span>
									<v-img class="ml-2" width="20" :src="strategy.img"></v-img>
								</v-layout>
							</v-btn>
						</v-layout>
					</v-flex>
				</v-layout>
			</v-flex>
		</v-layout>
	</v-layout>
</template>

<script>
	import Login from "@/components/login";
	import Register from "@/components/register";

	export default {
		components: {
			Login,
			Register
		},
		data: () => ({
			login: false,
			strategies: [
				{
					text: "42 Intra",
					img: "/42.svg",
					url: "https://hypertube.tk/oauth/ft"
				},
				{
					text: "Google",
					img: "/google.svg",
					url: "https://hypertube.tk/oauth/google"
				},
				{
					text: "Github",
					img: "/github.svg",
					url: "https://hypertube.tk/oauth/git"
				},
				{
					text: "Facebook",
					img: "/facebook.svg",
					url: "https://hypertube.tk/oauth/fb"
				},
				{
					text: "LinkedIn",
					img: "/linkedin.svg",
					url: "https://hypertube.tk/oauth/li"
				},
				{
					text: "LinkedIn",
					img: "/linkedin.svg",
					url: "https://hypertube.tk/oauth/li"
				}
			]
		})
	};
</script>
