var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const pluginList = {
	1  : new ExtractTextPlugin({
		filename: 'css/style.css',
		allChunks:true
	}),
	2  : new ExtractTextPlugin({
		filename: 'css/style.[contenthash:16].css',
		allChunks:true
	}),
	3  : new webpack.optimize.ModuleConcatenationPlugin(),
	4  : new webpack.HashedModuleIdsPlugin(),
	5  : new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function (module, count) {
			// any required modules inside node_modules are extracted to vendor
			//console.log(module.resource);
			return (
				module.resource && 
				/\.js$/.test(module.resource) && 
				(module.resource.indexOf('node_modules') !== -1))
			}
		}),
	6  : new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			minChunks: Infinity
		}),
	7  : new HtmlWebpackPlugin({
			filename:'{{htmlName}}',
			template: './src/{{htmlName}}',
			chunks: ['manifest']
		}),
	8  : new InlineManifestWebpackPlugin({
			name: 'webpackManifest'
		}),
	9  : new HtmlWebpackPlugin({
			filename:'{{htmlName}}',
			template: './src/{{htmlName}}'
		}),
	10 : new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
	11 : new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings  : false,//当删除没有用处的代码时，显示警告
			},
			//sourceMap:true,
			output: {
				comments: false
			}
		}),
	12 : new BundleAnalyzerPlugin({
			//  可以是`server`，`static`或`disabled`。
            //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
            //  在“静态”模式下，会生成带有报告的单个HTML文件。
            //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
            analyzerMode: 'server',
            //  将在“服务器”模式下使用的主机启动HTTP服务器。
            analyzerHost: '127.0.0.1',
            //  将在“服务器”模式下使用的端口启动HTTP服务器。
            analyzerPort: 8888, 
            //  路径捆绑，将在`static`模式下生成的报告文件。
            //  相对于捆绑输出目录。
            reportFilename: 'report.html',
            //  模块大小默认显示在报告中。
            //  应该是`stat`，`parsed`或者`gzip`中的一个。
            //  有关更多信息，请参见“定义”一节。
            defaultSizes: 'parsed',
            //  在默认浏览器中自动打开报告
            openAnalyzer: true,
            //  如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成
            generateStatsFile: false, 
            //  如果`generateStatsFile`为`true`，将会生成Webpack Stats JSON文件的名字。
            //  相对于捆绑输出目录。
            statsFilename: 'stats.json',
            //  stats.toJson（）方法的选项。
            //  例如，您可以使用`source：false`选项排除统计文件中模块的来源。
            //  在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
            statsOptions: null,
            logLevel: 'info' //日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
		}),
	13 : new webpack.optimize.CommonsChunkPlugin({
			name: 'app',
			async: 'vendorasync',
			children: true,
			minChunks: 2
		}),
	14  : new PreloadWebpackPlugin({
			rel: 'preload',
			include: ['vendor','vendorasync','app','manifest']
		})
};
exports.getPlugins = function ( action ) {
	var pluginIndex = [];
	if( action == 'dev' ){
		pluginIndex = [1,3,4,5,6,13,7,9,14];
	}else if( action == 'dist' ){
		pluginIndex = [2,3,4,5,6,13,7,9,14,10,11];
	}else if( action == 'analyze' ){
		pluginIndex = [2,5,6,13,7,9,10,11,12];
	}
	var plugins = [];
	pluginIndex.map(function(index){
		plugins.push( pluginList[index] );
	});
	return plugins;
}