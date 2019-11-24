//@ts-check
const webpack = require("webpack");
const { getOptions } = require("loader-utils");
const validateOptions = require("schema-utils");
const fs = require("fs");
const sourceMap = require("source-map");

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
 * @param {sourceMap.RawSourceMap} [map]
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
				prefix && self.addDependency(prefix); // 将文件添加到依赖中
				postfix && self.addDependency(postfix); // 将文件添加到依赖中
				callback(null, data[0] + source + data[1]);
			})
			.catch(callback);
	} else if (perStr || postStr) {
		callback(null, perStr + source + postStr);
	} else {
		let noStrError = new Error("没有传递{prefix, postfix, perStr, postStr}中任意参数!");
		callback(noStrError, source);
	}
	// TODO 支持用户传递sourceMpa的场景,更新sourceMap
	// 学习如何在loader中生成sourceMap,并使用
}
module.exports = banderLoader;
