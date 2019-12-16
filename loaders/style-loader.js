//@ts-check
const webpack = require("webpack");
const loaderUtils = require("loader-utils");

/** 动态创建style标签,将source加载到页面中
 * @param {string | Buffer} [source]
 * @param {any} [sourceMap]
 * @param {any} [meta]
 */
function styleLoader(source, sourceMap, meta) {}

// 使用pitch流程,优先由自己处理, pitch -> normal
styleLoader.pitch = function(remainingRequest) {
	/** @type {any} */
	const self = this;
	// 1.将剩余的loaderRequest转为相对地址(因为最终运行在浏览器所以要转为moduleId)
	// 2.路径头部加入"!!",让webpack只使用inline-loader来处理module.供loader-runner使用
	let relativePath = loaderUtils.stringifyRequest(self, `!!${remainingRequest}`);
	let styleStr = `
    let style=document.createElement('style');
    style.innerHTML=require(${relativePath});
    document.head.appendChild(style);
  `;
	return styleStr;
};
module.exports = styleLoader;
