(function(modules) {
	var installedModules = {}; // modules cache

	// 存放chunks加载状态
	// undefined = 未加载, null = preloaded/prefetched
	// Promise = 加载中, 0 = 已加载
	var installedChunks = { main: 0 };

	/** webpack模拟实现的require语句
	 * @param {string} moduleId
	 */
	function __webpack_require__(moduleId) {
		// Check if module is in cache
		if (installedModules[moduleId]) return installedModules[moduleId].exports;

		// 创建新module并存入cache
		var module = {
			i: moduleId,
			l: false, // 是否加载完毕
			exports: {}, // 模块默认输出
		};
		installedModules[moduleId] = module;

		// Execute the module function
		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		module.l = true; // 标示为已加载

		return module.exports; // 返回模块的默认输出
	}

	// expose the modules object (__webpack_modules__)
	__webpack_require__.m = modules;
	// expose the module cache
	__webpack_require__.c = installedModules;
	// output.publicPath,用于加载被分割出去的异步代码
	__webpack_require__.p = "";

	/** 判断模块是否存在指定属性(hasOwnProperty)
	 * @param {object} object 模块
	 * @param {string} property 属性
	 */
	__webpack_require__.o = function(object, property) {
		return Object.prototype.hasOwnProperty.call(object, property);
	};

	/** 为exports指定属性添加getter描述符
	 * @param {object} exports exports
	 * @param {string} name 属性名
	 * @param {function} getter getterFunction
	 */
	__webpack_require__.d = function(exports, name, getter) {
		if (!__webpack_require__.o(exports, name)) {
			Object.defineProperty(exports, name, { enumerable: true, get: getter });
		}
	};

	/** 将模块标识为es6模块
	 * @param {object} exports 模块
	 * 指定 Symbol.toStringTag 和 "__esModule"
	 */
	__webpack_require__.r = function(exports) {
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		Object.defineProperty(exports, "__esModule", { value: true });
	};

	/** 获取模块默认导出,并通过"a"属性来兼容esModule引入commonJS的情况.
	 * 如: import obj from "module.exports"
	 * @param {*} module
	 */
	__webpack_require__.n = function(module) {
		var getter =
			module && module.__esModule
				? function getDefault() {
						return module["default"];
				  }
				: function getModuleExports() {
						return module;
				  };
		// 为getter变量定义"a"属性,这样转义后的code就可以通过default.a获取commonJS的"default"导出.
		__webpack_require__.d(getter, "a", getter);
		return getter;
	};

	/** 异步加载的错误函数
	 * @param {any} err
	 */
	__webpack_require__.oe = function(err) {
		console.error(err);
		throw err;
	};

	// create a fake namespace object
	// 将commonJS模块转为esModule模块
	// mode & 1: value is a module id, require it
	// mode & 2: merge all properties of value into the ns
	// mode & 4: return value when already ns object
	// mode & 8|1: behave like require

	/** 创建一个命名空间对象,将commonJS模块转为esModule模块(转为esModule利用二进制+位运算实现)
	 * @param {*} value
	 * @param {*} mode "0bxxx1" 模块加载方式(来源linux的权限位概念) 1,2,4,8->2的0-3次方
	 * mode & 1: value是模块ID,加载该模块并赋值给value
	 * mode & 8|1: 直接返回module.exports的内容
	 * mode & 2: 将value的所有的属性合并到新ns属性上
	 * mode & 4: 是一个esModule,直接返回
	 */
	__webpack_require__.t = function(value, mode) {
		if (mode & 1) value = __webpack_require__(value);
		if (mode & 8) return value;
		if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
		var ns = Object.create(null);
		__webpack_require__.r(ns);
		Object.defineProperty(ns, "default", { enumerable: true, value: value });
		if (mode & 2 && typeof value != "string")
			for (var key in value)
				__webpack_require__.d(
					ns,
					key,
					function(key) {
						return value[key];
					}.bind(null, key),
				);
		return ns;
	};

	// This file contains only the entry chunk.
	// The chunk loading function for additional chunks
	// 异步加载chunk
	__webpack_require__.e = function requireEnsure(chunkId) {
		var promises = [];

		// chunkId对应的加载状态数组 [resolve, reject,promise]
		var installedChunkData = installedChunks[chunkId];
		// 如果模块还未加载完毕
		if (installedChunkData !== 0) {
			// 如果是一个Promise的话表示正在加载(data为真即为promise),
			// 继续使用该promise等待加载结果
			if (installedChunkData) promises.push(installedChunkData[2]);
			else {
				// 创建一个获取chunk的Promise
				var promise = new Promise(function(resolve, reject) {
					// 将resove,reject,promise实例,缓存到installedChunks[chunkId]中
					installedChunkData = installedChunks[chunkId] = [resolve, reject];
				});
				installedChunkData[2] = promise;
				promises.push(promise);

				// 开始加载代码块
				var script = document.createElement("script");
				script.charset = "utf-8";
				script.timeout = 120;
				script.src = jsonpScriptSrc(chunkId); // 设置源文件路径
				// CSP: HTMLElement 接口的 nonce 属性返回只使用一次的加密数字，被内容安全政策用来决定这次请求是否被允许处理。
				if (__webpack_require__.nc) script.setAttribute("nonce", __webpack_require__.nc);

				var error = new Error(); // 在栈展开之前创建错误以获取有用的堆栈信息
				var onScriptComplete = function(event) {
					script.onerror = script.onload = null; // 避免内存泄漏,IE
					clearTimeout(timeout);
					var chunk = installedChunks[chunkId];
					if (chunk !== 0) {
						if (chunk) {
							var errorType = event && (event.type === "load" ? "missing" : event.type);
							var realSrc = event && event.target && event.target.src;
							error.message = "Loading chunk " + chunkId + " failed.\n(" + errorType + ": " + realSrc + ")";
							error.name = "ChunkLoadError";
							error.type = errorType;
							error.request = realSrc;
							chunk[1](error);
						}
						installedChunks[chunkId] = undefined;
					}
				};
				var timeout = setTimeout(function() {
					onScriptComplete({ type: "timeout", target: script });
				}, 120000); // 超时处理
				script.onerror = script.onload = onScriptComplete;
				document.head.appendChild(script); // 正式开始JSONP
			}
		}
		return Promise.all(promises); // 并行加载所有chunk
	};

	// 重写的push方法,用于window["webpackJsonp"].push调用
	function webpackJsonpCallback(data) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		var chunkIds = data[0]; // 代码块ID
		var moreModules = data[1]; // chunkModules,如果chunk依赖多个模块此处会为多个modules

		// add "moreModules" to the modules object,
		// then flag all "chunkIds" as loaded and fire callback
		//向模块对象上增加更多的模块，然后把所有的chunkIds设置为已经加载并触发回调
		var moduleId,
			chunkId,
			i = 0,
			resolves = [];
		for (; i < chunkIds.length; i++) {
			chunkId = chunkIds[i];
			if (hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
				var chunkResolve = installedChunks[chunkId][0];
				resolves.push(chunkResolve); // 将该chunk的resolve方法存入resolves
			}
			installedChunks[chunkId] = 0; // chunk加载完成
		}
		// 把新获取的模块合并到主modules对象上
		for (moduleId in moreModules) {
			if (hasOwnProperty.call(moreModules, moduleId)) {
				modules[moduleId] = moreModules[moduleId];
			}
		}
		// 如果有父JSONP函数就调用
		if (parentJsonpFunction) parentJsonpFunction(data);

		while (resolves.length) {
			var resolveFn = resolves.shift();
			resolveFn(); // 让resolves集合中的resolve都执行
		}
	}

	// 计算JSON加载的路径
	function jsonpScriptSrc(chunkId) {
		return __webpack_require__.p + "" + chunkId + ".bundle.js";
	}

	var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);
	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray); // 缓存jsonpArray原始push方法
	jsonpArray.push = webpackJsonpCallback; // AOP,将push指向webpackJsonpCallback,

	// 进阶
	jsonpArray = jsonpArray.slice();
	for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
	var parentJsonpFunction = oldJsonpFunction;

	// 加载entryModule并返回默认导出
	return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
	"./src/index.js": function(module, __webpack_exports__, __webpack_require__) {
		"use strict";
		__webpack_require__.r(__webpack_exports__); // 将模块标识为es6模块
		//! harmony import ,es6引入commonJS模块的情况(import obj from "module.exports")
		var _moduleB__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/moduleB.js");
		// 获取module.export的"default"
		var _moduleB__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_moduleB__WEBPACK_IMPORTED_MODULE_0__);
		// 通过"default.a"获取default输出
		console.log("moduleB", _moduleB__WEBPACK_IMPORTED_MODULE_0___default.a);
		var button = document.createElement("button");
		button.innerHTML = "点我btn";

		button.onclick = function() {
			// 魔法注释 /*webpackChunkName: 'title'*/
			__webpack_require__
				.e(/*! import() */ 0)
				.then(__webpack_require__.t.bind(null, "./src/moduleA.js", 7))
				.then(function(result) {
					console.log(result, result["default"]);
				});
		};

		document.body.appendChild(button);
	},

	"./src/moduleB.js": function(module, exports) {
		module.exports = "moduleB";
	},

	/******/
});
