//@ts-check
const { getOptions } = require("loader-utils");
const validateOptions = require("schema-utils");
const schema = {
	type: "object",
	additionalProperties: false, // 不支持自定义属性
	properties: { esModule: { type: "boolean", description: "是否使用esModule" } },
};

module.exports = function rawLoader(source) {
	/** @type {any}  */
	let self = this;
	const options = getOptions(self) || {};
	validateOptions(schema, options, "raw-loader");
	const data = JSON.stringify(source)
		.replace(/\u2028/g, "\\u2028")
		.replace(/\u2029/g, "\\u2029");
	const isEsModule = typeof options.esModule != "undefined" ? options.esModule : true;
	self.callback(null, `${isEsModule ? "export default" : "module.exports="} ${data}`);
};
