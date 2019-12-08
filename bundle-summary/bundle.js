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
	// output.publicPath __webpack_public_path__
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
		// 为getter变量定义"a"属性,这样转义后的code就可以通过default.a直接获取commonJS的默认导出.
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
	// mode & 1: value is a module id, require it
	// mode & 2: merge all properties of value into the ns
	// mode & 4: return value when already ns object
	// mode & 8|1: behave like require
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
	__webpack_require__.e = function requireEnsure(chunkId) {
		var promises = [];

		// JSONP chunk loading for javascript
		var installedChunkData = installedChunks[chunkId];
		if (installedChunkData !== 0) {
			// 0 means "already installed".

			// a Promise means "currently loading".
			if (installedChunkData) {
				promises.push(installedChunkData[2]);
			} else {
				// setup Promise in chunk cache
				var promise = new Promise(function(resolve, reject) {
					installedChunkData = installedChunks[chunkId] = [resolve, reject];
				});
				promises.push((installedChunkData[2] = promise));

				// start chunk loading
				var script = document.createElement("script");
				var onScriptComplete;

				script.charset = "utf-8";
				script.timeout = 120;
				if (__webpack_require__.nc) {
					script.setAttribute("nonce", __webpack_require__.nc);
				}
				script.src = jsonpScriptSrc(chunkId);

				// create error before stack unwound to get useful stacktrace later
				var error = new Error();
				onScriptComplete = function(event) {
					// avoid mem leaks in IE.
					script.onerror = script.onload = null;
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
				}, 120000);
				script.onerror = script.onload = onScriptComplete;
				document.head.appendChild(script);
			}
		}
		return Promise.all(promises);
	};

	// webpackBootstrap
	// install a JSONP callback for chunk loading
	function webpackJsonpCallback(data) {
		var chunkIds = data[0];
		var moreModules = data[1];

		// add "moreModules" to the modules object,
		// then flag all "chunkIds" as loaded and fire callback
		var moduleId,
			chunkId,
			i = 0,
			resolves = [];
		for (; i < chunkIds.length; i++) {
			chunkId = chunkIds[i];
			if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
				resolves.push(installedChunks[chunkId][0]);
			}
			installedChunks[chunkId] = 0;
		}
		for (moduleId in moreModules) {
			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
				modules[moduleId] = moreModules[moduleId];
			}
		}
		if (parentJsonpFunction) parentJsonpFunction(data);

		while (resolves.length) {
			resolves.shift()();
		}
	}

	// script path function
	function jsonpScriptSrc(chunkId) {
		return __webpack_require__.p + "" + chunkId + ".bundle.js";
	}

	var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);
	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
	jsonpArray.push = webpackJsonpCallback;
	jsonpArray = jsonpArray.slice();
	for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
	var parentJsonpFunction = oldJsonpFunction;

	// 加载entryModule并返回默认导出
	return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
	"./src/index.js": function(module, __webpack_exports__, __webpack_require__) {
		"use strict";
		__webpack_require__.r(__webpack_exports__); // 将模块标识为es6模块
		// harmony import ,es6引入commonJS模块的情况
		var _moduleB__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/moduleB.js");
		var _moduleB__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_moduleB__WEBPACK_IMPORTED_MODULE_0__);

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
