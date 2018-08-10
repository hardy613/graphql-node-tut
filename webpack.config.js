const { resolve } = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const htmlPlugin = new HtmlWebPackPlugin({
	template: resolve(__dirname, 'src/index.html'),
	filename: resolve(__dirname, 'dist/index.html'),
})

module.exports = {
	entry: resolve(__dirname, 'src/js/index.js'),
	output: {
		path: resolve(__dirname, 'dist'),
		filename: 'index.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
		],
	},
	plugins: [htmlPlugin],
}
