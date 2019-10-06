<template>
	<v-container class="comments__container" align="center" direction="column">
		<h1
			class="movie__title sub text-center font-weight-black text-uppercase mb-5 pb-5"
			v-text="$t('title.comments')"
		></h1>
		<v-row v-for="comment in comments" :key="comment._id" justify="center">
			<v-col lg="10" md="12" sm="10" xs="12" class="comments px-0 py-0 mx-auto">
				<commentTree :node="comment" class="root node"/>
			</v-col>
		</v-row>
		<v-row justify="center">
			<v-btn
				text
				color="primary"
				class="comment__add my-5"
				v-text="$t('buttons.comment')"
				@click="editorState = !editorState"
			/>
		</v-row>
		<v-row justify="center">
			<v-col lg="10" md="12" sm="10" xs="12" class="main__comment px-0">
				<div class="editor__container" v-if="editorState">
					<commentEditor @changed="updateData"/>
					<v-icon class="editor__button" @click="postComment">send</v-icon>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	import axios from "axios";
	import { mapGetters } from "vuex";
	import utility from "@/assets/utility.js";
	import commentTree from "@/components/commentTree";
	import commentEditor from "@/components/commentEditor";

	const format = (comment, username) => ({
		username,
		_id: comment._id,
		body: comment.commentBody,
		date: comment.commentDate,
		imdb: comment.commentImdb,
		user: comment.commentUser,
		children: []
	});

	const recursiveSearch = (arr, comment, username) => {
		if (!comment.commentParent) {
			arr.push(format(comment, username));
			return true;
		} else {
			for (const cur of arr) {
				if (cur._id.toString() == comment.commentParent.toString()) {
					cur.children.push(format(comment, username));
					return true;
				} else {
					if (cur.children.length) {
						if (recursiveSearch(cur.children, comment, username)) {
							return true;
						}
					}
				}
			}
		}
	};

	export default {
		components: {
			commentTree,
			commentEditor
		},
		props: {
			imdb: {
				type: String,
				default: ""
			}
		},
		data: () => ({
			comments: [],
			editorData: "",
			editorState: false
		}),
		computed: mapGetters(["user"]),
		async created() {
			this.$bus.$on("commentAdded", this.addComment);
			const url = `https://hypertube.tk/api/comment/${this.imdb}`;
			const { data } = await axios.get(url);
			if (data.err) {
				this.openAlert(this, "error.comment");
			} else {
				this.comments = data.comments;
			}
		},
		methods: {
			...utility,
			updateData(data) {
				this.editorData = data;
			},
			addComment(comment) {
				recursiveSearch(this.comments, comment, this.user.username);
				this.$bus.$emit("commentDone");
			},
			async postComment() {
				try {
					const url = `https://hypertube.tk/api/comment`;
					const headers = { Authorization: `jwt ${this.user.token}` };
					const opts = {
						commentImdb: this.imdb,
						commentBody: this.editorData.replace(/<p>&nbsp;<\/p>/g, "")
					};
					this.editorData = "";
					this.editorState = false;
					const { data } = await axios.post(url, opts, { headers });
					if (!data.err) {
						this.$bus.$emit("commentAdded", data.comment);
					} else {
						this.openAlert(this, "edit.fail");
					}
				} catch (err) {
					this.openAlert(this, "edit.fail");
				}
			}
		}
	};
</script>

<style>
.comments__container {
	position: relative;
}

.comments {
	background: #ffffff15;
	border-radius: 5px;
	margin-bottom: 0.5rem;
}

.node {
	position: relative;
}

.root.node {
	padding-bottom: 0.5rem;
}

.node > .comment__collapse,
.node::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
}

.node::before {
	width: 1px;
	height: calc(100% - 2.8rem);
	background-color: #64d6c4;
	transform: translate(0.5rem, 1.5rem);
}

.node > .comment__collapse {
	cursor: pointer;
	border-radius: 50%;
	transform: translate(-0.2rem, 0.5rem) scale(0.9);
}

.comment__add {
	transform: scale(1.3);
	letter-spacing: 2px;
}

.main__comment > .editor__container > .ck.ck-reset.ck-editor {
	margin: 0 !important;
}
</style>
