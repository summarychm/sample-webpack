const { getOptions } = require("loader-utils");
const babel = require("@babel/core");

/**
 * @param {string | Buffer} [source]
 * @param {any} [sourceMap]
 * @param {any} [meta]
 */
function babelLoader(source, sourceMap, meta) {
	const self = this;
	const options = getOptions(self) || {};
	if (self.cacheable) self.cacheable();
	const callback = self.async();
	babel.transform(
		source,
		{
			sourceMaps: true,
			filename: self.resourcePath.split("/").pop(), //指定文件名用于sourceMap映射
			...options,
		},
		function(err, result) {
			callback(err, result.code, result.map);
		},
	);
}
module.exports = babelLoader;
