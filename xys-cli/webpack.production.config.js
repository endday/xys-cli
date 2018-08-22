var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var merge   = require('webpack-merge');
var projectName = __dirname.match(/[\\|\/]\w+$/)[0].replace(/[\\+|\/+]/g,'');
var styleUtils   = require('./styleloader.config.js');
var pluginsUtils = require('./webpack.plugins.config.js');
var CDN = 'https://sslstatic.xiaoyusan.com/';
var usePostCSS = true;
var baseConfig = {
	entry:{
		app:"./src/js/app.js"
	},
	output: {
		path:path.resolve(__dirname)+'/'+projectName,
		// entry point dist file name
		filename: 'js/[name].[chunkhash:16].js',
		// aysnc loading chunk file root
		publicPath: CDN + projectName + '/',
		chunkFilename: 'js/bundle.[name].[chunkhash:16].js',
		sourceMapFilename: "[file].map"
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.common.js',
			'cube-ui': 'cube-ui/lib'
		}
	},
	module:{
        rules: [
        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: styleUtils.cssLoaders({
					minimize:true,
					sourceMap:false,
					extract:true,
					usePostCSS:usePostCSS
				})
            }
        }, {
            test: /\.ejs$/,
            loader: 'ejs-compiled-loader'
        }, {
            test: /\.jade$/,
            loader: 'jade-loader'
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'file-loader?name=[name].[hash:16].[ext]&outputPath=img/'
            ]
        }, {
            test: /\.js$/,
            exclude: /node_modules/, 
            loader: "babel-loader"
        }]
    }
};

var cssRule = styleUtils.styleLoaders({ minimize:true,sourceMap: false,usePostCSS: usePostCSS,extract:true });
var plugins = pluginsUtils.getPlugins( 'dist' );

const webpackConfig = merge(baseConfig, {
		plugins:plugins,
		module: {
	  		rules: cssRule
		}
	}
);
module.exports = webpackConfig;
