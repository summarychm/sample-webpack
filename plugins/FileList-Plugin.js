let validateOptions = require("schema-utils");
let schema = {
	type: "object",
	properties: {
		filename: { type: "string" },
		unit: { type: "string" },
		precision: { type: "number" },
	},
	additionalProperties: false,
};

class FileListPlugin {
	constructor(options) {
		this.options = options || {};
		if (!this.options.filename) this.options.filename = "default.md";
		if (!this.options.unit) this.options.unit = "kb";
		if (!this.options.precision) this.options.precision = 2;
		validateOptions(schema, this.options, "FileListPlugin");
	}
	apply(compiler) {
		compiler.hooks.emit.tapAsync("FileListPlugin", (compilation, callback) => {
			let content = [`##  文件名    资源大小`];
			for (const [filePath, stat] of Object.entries(compilation.assets)) {
				content.push(this.format.call(this, filePath, stat.size()));
			}
			const source = content.join("\r\n");
			compilation.assets[this.options.filename] = {
				source() {
					return source;
				},
				size() {
					return source.length;
				},
			};
			callback();
		});
	}
	format(fileName, size) {
		let { unit, precision } = this.options;
		unit = unit.toLowerCase();
		if (unit === "kb") size = (size / 1024).toFixed(precision) + " " + unit;
		if (unit === "b") size = size + " " + unit;
		return `- ${fileName}    ${size}`;
	}
}
module.exports = FileListPlugin;
