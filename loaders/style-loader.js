//@ts-check
const webpack = require("webpack");
const { stringifyRequest } = require("loader-utils");

/** 动态创建style标签,将source加载到页面中
 * @param {string | Buffer} [source]
 * @param {any} [sourceMap]
 * @param {any} [meta]
 */
function styleLoader(source, sourceMap, meta) {}

// 使用pitch流程,优先由自己处理, pitch -> normal
styleLoader.pitch = function(remainingRequest) {
	/** @type {webpack.loader.LoaderContext} */
	// @ts-ignore
	const self = this;
	// 1.将剩余的loader地址头部加入"!!"后转为相对地址
	// 2.让webpack只使用这些inline-loader来处理module.
	let relativePath = stringifyRequest(self, `!!${remainingRequest}`);
	// 3.让remainingRequest涉及的inline-loader来处理source.
	// 4.将最终结果作为模块导出
	let styleStr = `
    let style=document.createElement('style');
    style.innerHTML=require(${relativePath});
    document.head.appendChild(style);
  `;
	return styleStr;
};
module.exports = styleLoader;