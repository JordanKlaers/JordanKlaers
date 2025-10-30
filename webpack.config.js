const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

function resolve(dir) {
	return path.join(__dirname, './', dir);
}

module.exports = {
	entry: {
		ieCSSVariables_head: './src/ie11CustomProperties.js',
		app: './src/main.js',
	},

	mode: 'development',
	devtool: 'inline-source-map',

	devServer: {
		port: 9000,
		hot: true,
		static: {
			directory: path.join(__dirname, 'public'), // optional
		},
		open: true,
		client: {
			overlay: {
				warnings: false, // don't show warnings
				errors: true,    // show errors only
			},
		},
	},

	resolve: {
		extensions: ['.js', '.vue', '.json', '.scss'],
		alias: {
			src: resolve('src'),
			_mixins_: resolve('src/mixins'),
			_scss_: resolve('src/assets/scss'),
			_icomoon_: resolve('src/assets/icomoon'),
			_images_: resolve('src/assets/image/'),
			_store_: resolve('src/store'),
			_gsap_: resolve('src/assets/scripts/gsap'),
		},
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: { presets: ['@babel/preset-env'] },
				},
			},
			{
				test: /\.(scss|css)$/,
				use: [
					MiniCssExtractPlugin.loader, // or "style-loader" if you prefer inline
					{
						loader: 'css-loader',
						options: { url: false, sourceMap: true },
					},
					'sass-loader',
				],
			},
			{
				test: /\.(jpe?g|png|woff2?|eot|ttf|svg)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'assets/[name][ext][query]',
				},
			},
		],
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'Jordan Klaers',
			template: 'src/index.html',
			chunks: ['ieCSSVariables_head', 'app'],
		}),
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
		new webpack.DefinePlugin({
			__VUE_OPTIONS_API__: true,
			__VUE_PROD_DEVTOOLS__: false,
		}),
	],

	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'docs/'),
		clean: true,
		publicPath: '/',
	},
};
