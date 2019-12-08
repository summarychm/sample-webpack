import moduleB from "./moduleB";

console.log("moduleB", moduleB);
let button = document.createElement("button");
button.innerHTML = "点我btn";
button.onclick = function() {
	// 魔法注释 /*webpackChunkName: 'title'*/
	import("./moduleA").then(function(result) {
		console.log(result, result.default);
	});
};
document.body.appendChild(button);
