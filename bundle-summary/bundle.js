(function(modules) {
	/** chunks加载状态4种 */
	// undefined = 未加载, null = preloaded/prefetched, Promise = 加载中, 0 = 已加载
	var installedChunks = { main: 0 }; // 默认主模块main已加载
	var installedModules = {}; // modules cache

	/** webpack模拟实现的require语句
	 * @param {string} moduleId
	 */
	function __webpack_require__(moduleId) {
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

	__webpack_require__.m = modules; // 将所有的modules挂载到m
	__webpack_require__.c = installedModules; // 将所有已加载modules挂载到c
	__webpack_require__.p = ""; // output.publicPath,用于加载被分割出去的异步代码

	// FIXME 自己注册到全局,方便查看
	window.__webpack_require__ = __webpack_require__;

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

	/** 加载模块,并将commonJS模块转为esModule(二进制+位运算)
	 * @param {*} value
	 * @param {*} mode "0bxxx1" 模块加载方式(来源linux的权限位概念)
	 * 2的0-3次方 1,2,4,8->1,10,100,1000
	 * mode & 1: value是模块ID,加载该模块并赋值给value
	 * mode & 8|1: 直接返回module.exports的内容
	 * mode & 2: 将value的所有的属性合并到新ns属性上
	 * mode & 4: 是一个esModule,直接返回
	 */
	__webpack_require__.t = function(value, mode) {
		if (mode & 1) value = __webpack_require__(value);
		if (mode & 8) return value;
		if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;

		// 将commonJS模块转为esModule模块
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

	/** 异步加载chunks
	 * @param {number|string} chunkId chunkId或moduleId
	 */
	__webpack_require__.e = function requireEnsure(chunkId) {
		var promises = []; // 用于加载chunks,这个promises无用,直接返回promise实例即可.
		// chunkId对应的加载状态数组 [resolve, reject,promise]
		var installedChunkData = installedChunks[chunkId];
		// 如果该chunk还未加载完毕
		if (installedChunkData !== 0) {
			// 如果data非空&不等于0则表示是一个Promise,那就继续使用该promise等待加载结果
			if (installedChunkData) promises.push(installedChunkData[2]);
			else {
				// 创建一个获取chunk的Promise
				var promise = new Promise(function(resolve, reject) {
					// 将resove,reject缓存到installedChunks[chunkId]中
					installedChunkData = installedChunks[chunkId] = [resolve, reject];
				});
				installedChunkData[2] = promise; // 将promise实例缓存到installedChunks[chunkId]中
				promises.push(promise);

				// 开始加载代码块
				var script = document.createElement("script");
				script.charset = "utf-8";
				script.timeout = 120;
				script.src = jsonpScriptSrc(chunkId); // 设置源文件路径
				// CSP: nonce返回一个只使用一次的加密数字,被内容安全政策用来决定这次请求是否被允许处理。
				if (__webpack_require__.nc) script.setAttribute("nonce", __webpack_require__.nc);

				script.onerror = script.onload = onScriptComplete;
				document.head.appendChild(script); // 正式开始JSONP

				// scriptLoad错误处理
				function onScriptComplete(event) {
					script.onerror = script.onload = null; // 避免内存泄漏,IE
					clearTimeout(timeout);
					var chunk = installedChunks[chunkId];
					if (chunk !== 0) {
						if (chunk) {
							var errorType = event && (event.type === "load" ? "missing" : event.type);
							var realSrc = event && event.target && event.target.src;
							var error = new Error(); // 在栈展开之前创建错误以获取有用的堆栈信息
							error.message = "Loading chunk " + chunkId + " failed.\n(" + errorType + ": " + realSrc + ")";
							error.name = "ChunkLoadError";
							error.type = errorType;
							error.request = realSrc;
							chunk[1](error);
						}
						installedChunks[chunkId] = undefined;
					}
				}
				var timeout = setTimeout(function() {
					onScriptComplete({ type: "timeout", target: script });
				}, 120000); // 超时处理
			}
		}
		return Promise.all(promises); // 并行加载chunk,其实可以直接返回promsie实例
	};
	// 计算JSON加载的路径
	function jsonpScriptSrc(chunkId) {
		return __webpack_require__.p + "" + chunkId + ".bundle.js";
	}

	/** 重写的push方法,供window["webpackJsonp"].push调用
	 * @param {ary[]} data chunk信息,[chunkId,chunkData]
	 * chunkId的内容可能为number(installedModuleId)或string(moduleId)
	 */
	function webpackJsonpCallback(data) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		var chunkIds = data[0];
		var moreModules = data[1]; // chunkModules,如果chunk依赖多个模块此处会为多个modules

		var moduleId,
			chunkId,
			i = 0,
			resolves = [];
		// 循环,更新installedChunks中当前chunk的状态
		for (; i < chunkIds.length; i++) {
			chunkId = chunkIds[i];
			// 当前chunk还处于加载中状态的话,则将其resolve方法存入resolves集合中
			if (hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
				var chunkResolve = installedChunks[chunkId][0];
				resolves.push(chunkResolve);
			}
			installedChunks[chunkId] = 0; // !chunk加载完成
		}

		// !将chunkData更新到modules对象上
		for (moduleId in moreModules) {
			if (hasOwnProperty.call(moreModules, moduleId)) modules[moduleId] = moreModules[moduleId];
		}
		// 将data存入到window["webpackJsonp"],用于别的module再请求该chunk时,直接返回结果而不再请求
		if (parentJsonpFunction) parentJsonpFunction(data);

		// 遍历resolves集合将promise全部转为成功态.
		resolves.forEach((resolve) => resolve());
	}

	var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);
	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray); // 缓存jsonpArray原始push方法
	jsonpArray.push = webpackJsonpCallback; // AOP,将push指向webpackJsonpCallback,
	var parentJsonpFunction = oldJsonpFunction;

	// 将window["webpackJsonp"]中的chunkData更新到modules中.
	// 兼容多次引入bundle.js导致重复请求chunk.js的问题
	jsonpArray = jsonpArray.slice();
	for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);

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
});
