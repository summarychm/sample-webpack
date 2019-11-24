//@ts-check
const webpack = require("webpack");
const { getOptions, getCurrentRequest } = require("loader-utils");
const validateOptions = require("schema-utils");
const fs = require("fs");
const { SourceNode, SourceMapConsumer } = require("source-map");

const schema = {
	type: "object",
	properties: {
		preStr: { type: "string" },
		postStr: { type: "string" },
		prefix: { type: "string" },
		postfix: { type: "string" },
	},
	additionalProperties: false,
};

/**
 * 读取文件内容(Promise),路径为空则内容为"".
 * @param {string} filePath 文件绝对路径
 */
function getFileContents(filePath) {
	return new Promise((resolve, reject) => {
		if (!filePath) resolve("");
		fs.readFile(filePath, "utf8", (err, data) => {
			err ? reject(err) : resolve(data);
		});
	});
}

/**
 * @param {string | Buffer} [source]
 * @param {any} [map]
 * @param {any} [meta]
 */
function banderLoader(source, map, meta) {
	/** @type {webpack.loader.LoaderContext} */
	const self = this;
	const options = getOptions(self) || {};
	validateOptions(schema, options, "bander-loader"); //校验参数
	const callback = self.async();
	const { prefix, postfix, perStr, postStr } = options;

	if (prefix || postfix) {
		Promise.all([getFileContents(prefix), getFileContents(postfix)])
			.then((data) => {
				// 将文件添加到依赖中
				prefix && self.addDependency(prefix);
				postfix && self.addDependency(postfix);
				finalCallBack(source, data[0], data[1]);
			})
			.catch(callback);
	} else if (perStr || postStr) {
		finalCallBack(perStr + source + postStr);
	} else {
		let noStrError = new Error("没有传递{prefix, postfix, perStr, postStr}中任意参数!");
		callback(noStrError, source);
	}

	// emit callback
	async function finalCallBack(content, prefix, postfix) {
		// 维护sourceMap
		if (map) {
			var currentRequest = getCurrentRequest(self);
			var node = SourceNode.fromStringWithSourceMap(content, await new SourceMapConsumer(map));
			node.prepend(prefix);
			node.add(postfix);
			var result = node.toStringWithSourceMap({
				file: currentRequest,
			});
			map = result.map.toJSON();
			callback(null, result.code, map);
		} else callback(null, prefix + content + postStr);
	}
}
module.exports = banderLoader;
