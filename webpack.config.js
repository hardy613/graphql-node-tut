const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')
const Dotenv = require('dotenv-webpack')

const dotEnv = new Dotenv()

const appHtmlPlugin = new HtmlWebpackPlugin({
	filename: 'index.html',
	template: resolve(__dirname, 'src/index.html'),
	chunk: ['index'],
	excludeChunks: ['outbound']
})

const outboundHtmlPlugin = new HtmlWebpackPlugin({
	filename: '-/index.html',
	template: resolve(__dirname, 'src/outbound.html'),
	chunk: ['outbound'],
	excludeChunks: ['app', 'style'],
})

const miniCssPlugin = new MiniCssExtractPlugin({
	filename: 'css/[name].css',
	chunkFilename: 'css/[id].css',
})

module.exports = {
	entry: {
		app: resolve(__dirname, 'src/js/index.js'),
		outbound: resolve(__dirname, 'src/js/outbound.js'),
		style: resolve(__dirname, 'src/scss/index.js'),
	},
	output: {
		publicPath: '/',
		path: resolve(__dirname, 'public'),
		filename: 'js/[name].min.js',
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
			{
				test: /\.(scss)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							minimize: {
								safe: true,
							},
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							autoprefixer: {
								browsers: ['last 2 versions']
							},
							plugins: () => [
								autoprefixer,
							]
						},
					},
					{
						loader: 'sass-loader',
						options: {},
					}
				]
			},
		],
	},
	devServer: {
		historyApiFallback: true,
	},
	plugins: [
		appHtmlPlugin,
		outboundHtmlPlugin,
		miniCssPlugin,
		dotEnv,
	]
}
