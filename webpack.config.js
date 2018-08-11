const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const htmlPlugin = new HtmlWebpackPlugin({
	filename: 'index.html',
	template: resolve(__dirname, 'src/index.html'),
})
module.exports = {
	entry: resolve(__dirname, 'src/js/index.js'),
	output: {
		path: resolve(__dirname, 'public'),
		filename: 'bundle.min.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							['env', {
								'targets': {
									'node': 'current'
								},
							},],
							'react',
							'stage-0',
						],
					},
				},
			},
		],
	},
	devServer: {
    historyApiFallback: true,
  },
}
