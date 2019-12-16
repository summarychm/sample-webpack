import list from "../public/list.txt";
const user = require("./userContainer");
require("../public/style.less");

const $root = document.getElementById("root");

var $list = document.createElement("p");
$list.innerText = list;
$root.appendChild($list);

console.log(user.name);

let button = document.createElement("button");
button.innerHTML = "dynamicImport";
button.onclick = function() {
	import(/* webpackChunkName: 'title'*/ "./projectContainer").then((result) => {
		console.log(result, result.default);
	});
};
document.body.appendChild(button);
