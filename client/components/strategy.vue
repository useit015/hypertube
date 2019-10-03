<template>
	<v-layout justify-center align-center>
		<v-flex xs12 sm7 md6 lg5 xl3>
			<v-layout justify-center align-center wrap>
				<v-flex sm6 md4 v-for="(strategy, i) in strategies" :key="i">
					<v-layout class="mx-3 my-3" justify-center align-center>
						<v-btn
							large
							rounded
							outlined
							color="grey darken-2"
							:href="`https://hypertube.tk/api/oauth/${strategy.url}`"
							width="130"
						>
							<v-layout justify-center align-center>
								<span class="text-capitalize font-weight-slim grey--text">{{ strategy.text }}</span>
								<v-img class="ml-2" :width="strategy.text === '42 Intra' ? 30 : 20" :src="strategy.img"></v-img>
							</v-layout>
						</v-btn>
					</v-layout>
				</v-flex>
			</v-layout>
		</v-flex>
	</v-layout>
</template>

<script>
	export default {
		name: "Strategy",
		data: () => ({
			strategies: [
				{
					text: "42 Intra",
					img: "/42.svg",
					url: "ft"
				},
				{
					text: "Google",
					img: "/google.svg",
					url: "google"
				},
				{
					text: "Github",
					img: "/github.svg",
					url: "git"
				},
				{
					text: "Facebook",
					img: "/facebook.svg",
					url: "fb"
				},
				{
					text: "LinkedIn",
					img: "/linkedin.svg",
					url: "li"
				},
				{
					text: "Twitch",
					img: "/twitch.svg",
					url: "tw"
				}
			]
		})
	};
</script>
