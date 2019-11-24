//@ts-check
const webpack = require("webpack");

/** 处理css中url引入方式由绝对地址改为require方式.
 * @param {string} [source]
 * @param {any} [sourceMap]
 * @param {any} [meta]
 */
function cssLoader(source, sourceMap, meta) {
	/** @type {webpack.loader.LoaderContext} */
	const self = this;
	if (self.cacheable) self.cacheable();
	const callback = self.async();

	const reg = /url\((.+?)\)/g; // 非贪婪模式
	let pos = 0; //匹配游标起始点

	let result = ["let list=[];"]; // 存储匹配到的资源集合
	let current = null; // 正则匹配结果
	while ((current = reg.exec(source))) {
		const [matchUrl, g] = current;
		pos = reg.lastIndex; // 更新游标位置
		//获取资源在source的起始位置
		let last = pos - matchUrl.length;
		// 获取资源前缀内容str
		let preStr = source.slice(pos, last);
		// 将前缀内容缓存到list中
		result.push(`list.push(${JSON.stringify(preStr)});`);
		// 将资源引入方式改为require的形式,稍后由file-loader引入
		result.push(`list.push('url('+require(${g})+')');`);
	}
	// 将poststr内容缓存到list中
	result.push(`list.push(${JSON.stringify(source.slice(pos))})`);
	// 将list转为字符串
	result.push(`module.exports=list.join("");`);

	callback(null, result.join("\r\n"));
}
module.exports = cssLoader;
