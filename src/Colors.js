function toObj(c1, c2, c3) {
	return {lineColor: c1, fillColorTop: c2, fillColorBottom: c3}
}

const colors = {
	blue: toObj('#399af7', '#cbe6fd', '#dcf0fe'),
	red: toObj('#d35400', '#FFCED6', '#FFD5D9'),
	purple: toObj('#B14CF5', '#F0C9FF', '#F9DBFE'),
	green: toObj('#3DAD62', '#D1FAE2', '#E5FFF2')
}

function getColors(theme, props) {
	if (theme == null) {
		return {
			lineColor: props.lineColor,
			fillColorTop: props.fillColorTop,
			fillColorBottom: props.fillColorBottom
		}
	}

	if (theme in colors) {
		return colors[theme];
	}
}

export default getColors;