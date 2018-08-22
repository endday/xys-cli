var ExtractTextPlugin = require('extract-text-webpack-plugin');
exports.cssLoaders = function (options) {
	options = options || {};
  
	var cssLoader = {
	  	loader: 'css-loader',
	  	options: {
			importLoaders: 1,
			minimize  : options.minimize,
			sourceMap : options.sourceMap
	  	}
	};
  
	var postcssLoader = {
		loader: 'postcss-loader',
	  	options: {
			sourceMap : options.sourceMap
	  	}
	};
  
	function generateLoaders (loader, loaderOptions) {
		var loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];
		//这里特殊处理下
		//由于需要做vw的适配，故样式里的px单位会全部转成vw
		//但由于会引入第三方的插件，可能会引入一些样式，这里的样式又不能转成vw
		//所以在import css文件时，不用postcss处理，而开发过程中用scss，来避免业务样式与第三方插件同时转vw
		if( loader == 'css' ){
			loaders = [cssLoader];
		}
	  	if ( loader && loader != 'css' ) {
			loaders.push({
		  		loader: loader + '-loader',
		  		options: Object.assign({}, loaderOptions, {
					sourceMap : options.sourceMap
		  		})
			});
	  	}
  
		
	  	if (options.extract) {
			return ExtractTextPlugin.extract({
		  		use: loaders,
		  		fallback: 'vue-style-loader'
			});
		} else {
			return ['vue-style-loader'].concat(loaders)
	  	}
	}
	return {
	  	css: generateLoaders("css"),
	  	postcss: generateLoaders(),
	  	scss: generateLoaders('sass'),
	  	// stylus: generateLoaders('stylus'),
	  	// styl: generateLoaders('stylus'),
	  	// less: generateLoaders('less'),
	  	// sass: generateLoaders('sass', { indentedSyntax: true }),
	}
}
  
// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
	var output = [];
	var loaders = exports.cssLoaders(options)
  
	for (var extension in loaders) {
		var loader = loaders[extension]
	  	output.push({
			test: new RegExp('\\.' + extension + '$'),
			use: loader
	  	});
	}
	return output
}