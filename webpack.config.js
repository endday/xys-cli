var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var merge   = require('webpack-merge');
var projectName = __dirname.match(/[\\|\/]\w+$/)[0].replace(/[\\+|\/+]/g,'');
var styleUtils   = require('./styleloader.config.js');
var pluginsUtils = require('./webpack.plugins.config.js');
var usePostCSS   = true;

var argv = require('minimist')(process.argv.slice(2));
var action = "dev";
var useWebpackWatch = false;
if( argv['_'][0] == 'analyze' ){
	action = "analyze";
}
//本地编译，开启watch
if( argv['_'][0] == 'npmdev' ){
	useWebpackWatch = true;
}
else{
	//其他编译参数，不需要添加watch
	useWebpackWatch = false;
}
var baseConfig = {
	entry:{
		app:"./src/js/app.js"
	},
	output: {
		path:path.resolve(__dirname)+'/'+projectName,
		// entry point dist file name
		filename: 'js/[name].js',
		// aysnc loading chunk file root
		publicPath:'/static/' + projectName + '/',
		chunkFilename: 'js/bundle.[name].js',
		sourceMapFilename: "[file].map"
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.common.js',
			'cube-ui': 'cube-ui/lib'
		}
	},
	devtool:'#inline-source-map',
	module:{
        rules: [
        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: styleUtils.cssLoaders({
					minimize:false,
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

var cssRule = styleUtils.styleLoaders({ minimize:false,sourceMap: false,usePostCSS: usePostCSS,extract:true });

var plugins = pluginsUtils.getPlugins( action );

const devWebpackConfig = merge(baseConfig, {
		plugins: plugins,
		module: {
	  		rules: cssRule
		},
		watch : useWebpackWatch?true:false,
		watchOptions:{
			aggregateTimeout: 300,
			ignored: /node_modules/
		}
	}
);
module.exports = devWebpackConfig;