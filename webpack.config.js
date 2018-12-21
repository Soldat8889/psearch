const 
	path = require('path'),
	webpack = require('webpack'),
	CompressionPlugin = require('compression-webpack-plugin'),
	UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
	CleanWebpackPlugin = require('clean-webpack-plugin'),
	ManifestPlugin = require('webpack-manifest-plugin'),
	FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries"),
	MiniCssExtractPlugin = require('mini-css-extract-plugin'),
	OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const 
	development = process.env.NODE_ENV.trim() === "development",
	production = process.env.NODE_ENV.trim() === "production";

let config = {
	devServer: {
		hot: true,
		inline: true
	},
	entry: {
		"main-js": ['@babel/polyfill/noConflict', './public/components/main.jsx'],
		"app": ['@babel/polyfill/noConflict', './public/client/app.js']
	},
	mode: process.env.NODE_ENV.trim(),
	output: {
		path: path.resolve(__dirname, './public/dist'),
		publicPath: '/assets/dist/',
		filename: development ? '[name].js' : '[name].[chunkhash].js'
	},
	devtool: development ? "cheap-module-eval-source-map" : "",
	resolve: {
		extensions: ['.js', '.jsx', 'css', 'scss', 'sass']
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV)
			}
		}),
		new FixStyleOnlyEntriesPlugin(),
	]
};

if (process.env.NODE_ENV.trim() === "production") {
	config.plugins.push(
		new ManifestPlugin()
	);
	config.entry['main-css'] = './public/styles/main-css.css';
	config.plugins.push(
		new OptimizeCSSAssetsPlugin({}),
		new MiniCssExtractPlugin({
			filename: '[name].[hash].css',
			chunkFilename: '[id].[hash].css'
		}),
	);
	config.module.rules.push(
        {
            test: /\.(sa|sc|c)ss$/,
            use: [
        		MiniCssExtractPlugin.loader,
            	'css-loader',
            	'sass-loader'
            ]
        }
	);
	config.plugins.push(
		new CleanWebpackPlugin(['public/dist'], 
		{
			root: path.resolve('./'),
			verbose: true,
			dry: false
		}
	));
	config.plugins.push(
		new webpack.optimize.OccurrenceOrderPlugin()
	);
	config.plugins.push(new UglifyJSPlugin({
		uglifyOptions: {
			warnings: false,
			output: {
				comments: false,
			},
		},
		sourceMap: false
	}));
	config.plugins.push(new CompressionPlugin({
		test: /\.(js|css|jpe?g|png|gif|svg|ico)$/,
		exclude: /node_modules|bower_components/,
		deleteOriginalAssets: false,
		algorithm: 'gzip',
		filename: '[path].gz[query]',
		threshold: 8192,
		minRatio: 0.8,
		compressionOptions: {
			level: 8
		}
    }));
} else if(process.env.NODE_ENV.trim() === "development") {
	console.log('Development')
	config.plugins.push(
		new webpack.NamedModulesPlugin()
	);
	// config.plugins.push(
	// 	new webpack.HotModuleReplacementPlugin()
	// );
	config.entry['main-js'].splice(1, 0, 'react-hot-loader/patch');
}

module.exports = config;