import img from "../public/image/img.jpg";
import logo from "../public/image/logo.svg";

let num1 = 50;
const num2 = 100;

let sum = (p1, p2) => {
	console.log(p1 + p2);
};
console.log("num1", num1, "num2", num2);
console.log("sum", sum(num1, num2));

let imgImg = document.createElement("img");
imgImg.src = img;
document.body.appendChild(imgImg);
let logoImg = document.createElement("img");
logoImg.style = "width:100px;height:100px;";
logoImg.src = logo;
document.body.appendChild(logoImg);
