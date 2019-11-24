//@ts-check
const webpack = require("webpack");
const { getOptions } = require("loader-utils");
let validateOptions = require("schema-utils");
const mime = require("mime");
let schema = {
	type: "object",
	properties: {
		limit: { type: "number" },
		name: { type: "string" },
	},
	additionalProperties: false,
};

/**
 * @param {string | Buffer} [source]
 * @param {any} [sourceMap]
 * @param {any} [meta]
 */
function urlLoader(source, sourceMap, meta) {
	/** @type {webpack.loader.LoaderContext} */
	const self = this;
	const options = getOptions(self) || {};
	validateOptions(schema, options, "urlLoader");
	if (self.cacheable) self.cacheable();

	if (source && options.limit > source.length) {
		let ext = mime.getType(this.resourcePath); // 使用mime生成文件类型
		source = `data:${ext};base64,${source.toString("base64")}`;
		return `module.exports=${JSON.stringify(source)}`;
	} else {
		return require("./file-loader").call(self, source, sourceMap, meta);
	}
}
urlLoader.raw = true; // 获取二进制source
module.exports = urlLoader;
