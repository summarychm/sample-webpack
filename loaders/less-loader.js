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
	less.render(source, (err, data) => {
		if (err) callback(new Error(err.toString()));
		else callback(null, data.css);
	});
}
module.exports = lessLoader;
