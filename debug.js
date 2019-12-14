const webpack = require("webpack");
const config = require("./webpack.config");
let compiler = webpack(config, handle);
function handle(err, data) {
	console.log("============ arguments begin ====================");
	console.log(arguments);
	console.log("============ arguments end ======================");
}
compiler.run((err, stats) => {
	if (err) console.error(err);
	console.log(stats);
});
