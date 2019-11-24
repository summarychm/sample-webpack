//@ts-check
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/** @type {webpack.Configuration} */
let config = {
	mode: "development",
	entry: "./src/index.js",
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
					{
						loader: "hello-loader",
					},
				],
				exclude: /node_modules/,
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
			title: "demo",
		}),
	],
};

module.exports = config;
