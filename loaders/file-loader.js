//@ts-check
// 官方版 https://github.com/webpack-contrib/file-loader/blob/master/src/index.js
const webpack = require("webpack");
const { getOptions, interpolateName } = require("loader-utils");
let validateOptions = require("schema-utils"); // 参数校验

let schema = {
	type: "object",
	properties: { name: { type: "string", description: "资源名称" } },
	// additionalProperties: false,
};

/**
 * @param {string | Buffer} [source]
 * @param {any} [sourceMap]
 * @param {any} [meta]
 */
function fileLoader(source, sourceMap, meta) {
	/** @type {webpack.loader.LoaderContext} */
	const self = this;
	const options = getOptions(self) || {};
	if (self.cacheable) self.cacheable();

	validateOptions(schema, options, "file-loader");
	let ext = options.name || "[hash].[ext]";
	// 根据占位符生成文件名
	let filename = interpolateName(self, ext, { content: source });
	self.emitFile(filename, source, null); // 加入写入文件队列
	return `module.exports=${JSON.stringify(filename)}`;
}
fileLoader.raw = true; //source无需转换直接传入buffer类型数据

module.exports = fileLoader;
