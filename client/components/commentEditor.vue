<template>
	<ckeditor :editor="editor" v-model="editorData" :config="editorConfig" class="comment__editor"></ckeditor>
</template>

<script>
	import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
	import CKEditor from "@ckeditor/ckeditor5-vue";

	export default {
		components: {
			ckeditor: CKEditor.component
		},
		data() {
			return {
				editor: ClassicEditor,
				editorData: "",
				editorConfig: {
					removePlugins: ["Heading", "Link"],
					toolbar: {
						items: ["bold", "italic", "undo", "redo"]
					}
				}
			};
		},
		watch: {
			editorData() {
				this.$emit("changed", this.editorData);
			}
		}
	};
</script>

<style>
.ck.ck-editor__main {
	font-size: 1rem !important;
}

.ck.ck-editor__main > .ck-editor__editable {
	border: none !important;
	background-color: #64d6c420 !important;
}

.ck.ck-toolbar {
	border: none !important;
	background-color: #64d6c420;
}

.ck.ck-editor__editable.ck-focused {
	box-shadow: none !important;
}

.ck.ck-reset_all,
.ck.ck-reset_all * {
	color: #fff;
}

.ck.ck-content > p {
	margin: 0.5rem 0 1rem !important;
}

.ck.ck-button {
	cursor: pointer;
}

.ck.ck-button:hover {
	background: transparent !important;
}

.ck.ck-button.ck-on {
	background: #00000022 !important;
}

.ck.ck-reset.ck-editor {
	margin: 0 1rem 1rem 0;
}
</style>
