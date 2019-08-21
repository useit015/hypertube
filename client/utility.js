export default {
    showAlert (color, text, comp) {
		comp.alert = {
			state: true,
			color,
			text
		}
	}
}