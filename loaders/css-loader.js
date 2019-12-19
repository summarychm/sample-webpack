var postcss = require("postcss");
var loaderUtils = require("loader-utils");
var Tokenizer = require("css-selector-tokenizer");

const cssLoader = function(source) {
	const cssPlugin = (postOptions) => {
		return (root) => {
			// 处理import依赖
			root.walkAtRules(/^import$/i, (rule) => {
				rule.remove(); // 删除该import节点,转为添加依赖的方式进行加载
				postOptions.imports.push(rule.params.slice(1, -1));
			});
			// 处理url路径
			root.walkDecls((decl) => {
				var values = Tokenizer.parseValues(decl.value);
				values.nodes.forEach((value) => {
					value.nodes.forEach((item) => {
						if (item.type === "url") {
							item.url = "'+require(" + loaderUtils.stringifyRequest(this, item.url) + ")+'";
						}
					});
				});
				decl.value = Tokenizer.stringifyValues(values);
			});
		};
	};

	let callback = this.async();
	let postOptions = { imports: [] };
	let pipeline = postcss([cssPlugin(postOptions)]);
	pipeline.process(source).then((result) => {
		// 将import的css模块交由cssLoader继续处理
		postOptions.imports.map((url) => "'+require(" + loaderUtils.stringifyRequest(this, "!!css-loader!" + url) + ")+'");
		let importCss = postOptions.imports.join("\r\n");
		let data = "module.exports=`" + importCss + "\r\n" + result.css + "` ";
		callback(null, data);
	});
};

module.exports = cssLoader;
