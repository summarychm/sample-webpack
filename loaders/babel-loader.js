const { getOptions } = require("loader-utils");
const babel = require("@babel/core");

/**
 * @param {string | Buffer} [source]
 * @param {any} [sourceMap]
 * @param {any} [meta]
 */
function babelLoader(source, sourceMap, meta) {
	const self = this;
	const defaultOptions = {
		presets: ["@babel/preset-env"],
		sourceMaps: true,
		filename: self.resourcePath.split("/").pop(), //指定文件名用于sourceMap映射
	};
	const options = getOptions(self) || {};
	if (self.cacheable) self.cacheable();
	const callback = self.async();

	babel.transform(source, { ...defaultOptions, ...options }, (err, result) => {
		const { code, map, ast } = result;
		debugger;
		callback(err, code, map, ast);
	});
}
module.exports = babelLoader;
