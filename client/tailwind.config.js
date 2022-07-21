const plugin = require('tailwindcss/plugin')

module.exports = {
	content: [
		'./src/**/*.jsx',
		'./src/**/*.js',
	],
	theme: {
		extend: {},
	},
	plugins: [plugin(function ({ addUtilities }) {
		addUtilities({
			'.no-scrollbar': {
				/* IE and Edge */
				'-ms-overflow-style': 'none',

				/* Firefox */
				'scrollbar-width': 'none',

				/* Safari and Chrome */
				'&::-webkit-scrollbar': {
					display: 'none'
				}
			}
		}
		)
	})],
}
