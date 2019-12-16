const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "development",
	devtool: "none",
	context: process.cwd(),
	entry: "./src/index.js",
	output: {
		filename: "bundle.js",
	},
	devServer: {
		contentBase: path.resolve(__dirname, "./dist"),
	},
	resolveLoader: {
		modules: ["loaders", "node_modules"], // loader查找顺序
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env"],
						},
					},
					{
						loader: "banner-loader",
						options: {
							preStr: "/* perStr注释 */",
							postStr: "/* postStr注释 */",
							prefix: path.resolve("./public/banner/perfix.txt"),
							postfix: path.resolve("./public/banner/postfix.txt"),
						},
					},
				],
				include: path.join(__dirname, "src"),
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "2019-12-16",
		}),
	],
};
