<template>
	<div class="comment__node ml-3" :style="`padding-left:${depth + 25}px;`">
		<v-row justify="start" align="baseline" class="my-1 mx-1">
			<nuxt-link
				class="comment__username text-truncate"
				:to="`/profile/${node.username ? node.username : ''}`"
			>{{ node.username ? node.username : 'Deleted account' }}</nuxt-link>
			<span class="comment__time">{{ commentTime }}</span>
			<v-btn
				text
				color="primary"
				class="ml-auto mr-3 reply"
				@click="editorState = !editorState"
				v-text="$t('buttons.reply')"
			/>
		</v-row>
		<div class="comment__text text-truncate pl-1" v-show="!collapsed" v-html="node.body"></div>
		<div class="editor__container" v-if="editorState">
			<commentEditor @changed="editorUpdated"/>
			<v-icon class="editor__button" @click="postReply">send</v-icon>
		</div>
		<v-icon
			color="primary"
			class="comment__collapse"
			@click="toggleCollapse"
		>{{ collapsed ? 'add_circle' : 'remove_circle' }}</v-icon>
		<commentTree
			v-show="!collapsed && node.children.length"
			class="node"
			v-for="child in node.children"
			:key="child._id"
			:node="child"
			:depth="depth + 1"
		/>
	</div>
</template>

<script>
	import axios from "axios";
	import moment from "moment";
	import { mapGetters } from "vuex";
	import utility from "@/assets/utility.js";
	import commentEditor from "@/components/commentEditor";

	export default {
		name: "commentTree",
		components: {
			commentEditor
		},
		props: {
			node: {
				type: Object,
				default: () => ({})
			},
			depth: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				collapsed: false,
				editorState: false,
				editorData: ""
			};
		},
		computed: {
			...mapGetters(["user"]),
			commentTime() {
				return moment(this.node.date)
					.locale(this.$i18n.locale)
					.fromNow();
			}
		},
		methods: {
			...utility,
			editorUpdated(data) {
				this.editorData = data;
			},
			toggleCollapse() {
				this.collapsed = !this.collapsed;
			},
			async postReply() {
				if (this.editorData) {
					try {
						const url = `https://hypertube.tk/api/comment`;
						const headers = { Authorization: `jwt ${this.user.token}` };
						const opts = {
							commentImdb: this.node.imdb,
							commentBody: this.editorData,
							commentParent: this.node._id
						};
						this.editorData = "";
						this.editorState = false;
						const { data } = await axios.post(url, opts, { headers });
						if (!data.err) {
							this.$bus.$emit("commentAdded", data.comment);
						}
					} catch (err) {
						this.openAlert(this, "edit.fail");
					}
				}
			}
		}
	};
</script>

<style>
.comment__node {
	font-size: 1.4rem;
	letter-spacing: 1px;
	padding-bottom: 0.3rem;
}

.comment__username {
	font-size: 0.75em;
	color: #64d6c4;
	padding: 0.5rem 0 0 0;
	font-weight: 700;
	text-decoration: none;
}

.comment__username:focus {
	outline: none;
}

.comment__time {
	margin-left: 0.5rem;
	font-size: 0.9rem;
	color: #64d6c4;
}

.comment__text {
	padding: 0 0 0.2rem 0;
}

.comment__text > p {
	margin: -0.2rem 0 0 0;
}

.comment__editor {
	max-width: 80%;
}

.reply {
	transform: translate(-5%, 5%);
}

.editor__container {
	position: relative;
}

.editor__button {
	cursor: pointer;
	position: absolute;
	top: 0;
	right: 0;
	transform: translate(-100%, 25%);
}
</style>
