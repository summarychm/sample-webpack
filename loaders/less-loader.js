//@ts-check
const webpack = require("webpack");
const less = require("less");

/** less -> css
 * @param {string} [source]
 * @param {any} [sourceMap]
 * @param {any} [meta]
 */
function lessLoader(source, sourceMap, meta) {
	/** @type {webpack.loader.LoaderContext} */
	const self = this;
	if (self.cacheable) self.cacheable();

	const callback = self.async();
	less.render(source, { filename: self.resource }, (err, data) => {
		// @ts-ignore
		callback(err, data.css, sourceMap, meta);
	});
}
module.exports = lessLoader;
