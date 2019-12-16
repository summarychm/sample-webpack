//@ts-check
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const FileListPlugin = require("./plugins/FileList-Plugin");

/** @type {webpack.Configuration} */
let config = {
	mode: "development",
	entry: "./src/index.js",
	devtool: false,
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	resolveLoader: {
		modules: ["node_modules", "loaders"], // loader查找顺序
	},
	resolve: {
		extensions: [".js", ".jsx"], // 支持的扩展名
	},
	stats: "verbose", // 尽量多的显示log
	module: {
		rules: [
			{
				test: /.jsx?$/,
				use: [
					{
						loader: "banner-loader",
						options: {
							preStr: "/* perStr注释 */",
							postStr: "/* postStr注释 */",
							prefix: path.resolve("./public/banner/perfix.txt"),
							postfix: path.resolve("./public/banner/postfix.txt"),
						},
					},
					{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env"],
						},
					},
				],
				exclude: /node_modules/,
			},
			{
				test: /.txt$/,
				use: {
					loader: "raw-loader",
					options: {
						esModule: false, // 使用commonJS2规范
					},
				},
			},
			{
				test: /.(png|jpg|jpeg|svg)$/,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 1000,
							name: "[contenthash:4].[ext]",
						},
					},
				],
			},
			{
				test: /.less$/,
				use: ["style-loader", "css-loader", "less-loader"],
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "example",
			template: path.resolve(__dirname, "public", "template.html"),
		}),
		new FileListPlugin({ filename: "filelist.md", unit: "kb" }),
	],
};

module.exports = config;
