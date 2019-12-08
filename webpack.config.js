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
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
				include: path.join(__dirname, "src"),
				exclude: /node_modules/,
			},
		],
	},
	plugins: [],
};
