<template>
	<v-row justify="center" align="center">
		<v-flex xs12 sm7 md6 lg5 xl3>
			<v-row justify="center" align="center" wrap>
				<v-flex sm6 md4 v-for="(strategy, i) in strategies" :key="i">
					<v-row class="mx-3 my-3" justify="center" align="center">
						<v-btn
							large
							rounded
							outlined
							color="grey darken-2"
							:href="`https://hypertube.tk/api/oauth/${strategy.url}`"
							width="130"
						>
							<v-row justify="center" align="center">
								<span class="text-capitalize font-weight-slim grey--text">{{ strategy.text }}</span>
								<svg-icon
									class="ml-2"
									:width="strategy.text === '42 Intra' ? 30 : 20"
									:height="30"
									:name="strategy.img"
								/>
							</v-row>
						</v-btn>
					</v-row>
				</v-flex>
			</v-row>
		</v-flex>
	</v-row>
</template>

<script>
	export default {
		name: "Strategy",
		data: () => ({
			strategies: [
				{
					text: "42 Intra",
					img: "42",
					url: "ft"
				},
				{
					text: "Google",
					img: "google",
					url: "google"
				},
				{
					text: "Github",
					img: "github",
					url: "git"
				},
				{
					text: "Facebook",
					img: "facebook",
					url: "fb"
				},
				{
					text: "LinkedIn",
					img: "linkedin",
					url: "li"
				},
				{
					text: "Spotify",
					img: "spotify",
					url: "sp"
				}
			]
		})
	};
</script>
