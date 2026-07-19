/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "static/chunks/fallback/" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "static/webpack/" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("static/webpack/" + __webpack_require__.h() + ".webpack.hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("d16b1e4cfa6aff7a")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "_N_E:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = __webpack_require__.tu(url);
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/runtimeId */
/******/ 	(() => {
/******/ 		__webpack_require__.j = "webpack";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	(() => {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = () => {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: (script) => (script),
/******/ 					createScriptURL: (url) => (url)
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	(() => {
/******/ 		__webpack_require__.ts = (script) => (__webpack_require__.tt().createScript(script));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script url */
/******/ 	(() => {
/******/ 		__webpack_require__.tu = (url) => (__webpack_require__.tt().createScriptURL(url));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		    var currentModuleData = {}, installedModules = __webpack_require__.c, currentChildModule, currentParents = [], registeredStatusHandlers = [], currentStatus = "idle", blockingPromises = 0, blockingPromisesWaiting = [], currentUpdateApplyHandlers, queuedInvalidatedModules;
/******/ 		    __webpack_require__.hmrD = currentModuleData;
/******/ 		    __webpack_require__.i.push(function(options) {
/******/ 		      var module = options.module, require = createRequire(options.require, options.id);
/******/ 		      module.hot = createModuleHotObject(options.id, module);
/******/ 		      module.parents = currentParents;
/******/ 		      module.children = [];
/******/ 		      currentParents = [];
/******/ 		      options.require = require;
/******/ 		    });
/******/ 		    __webpack_require__.hmrC = {};
/******/ 		    __webpack_require__.hmrI = {};
/******/ 		    function createRequire(require, moduleId) {
/******/ 		      var me = installedModules[moduleId];
/******/ 		      if (!me)
/******/ 		        return require;
/******/ 		      var fn = function(request) {
/******/ 		        if (me.hot.active) {
/******/ 		          if (installedModules[request]) {
/******/ 		            var parents = installedModules[request].parents;
/******/ 		            if (parents.indexOf(moduleId) === -1)
/******/ 		              parents.push(moduleId);
/******/ 		          } else {
/******/ 		            currentParents = [moduleId];
/******/ 		            currentChildModule = request;
/******/ 		          }
/******/ 		          if (me.children.indexOf(request) === -1)
/******/ 		            me.children.push(request);
/******/ 		        } else {
/******/ 		          console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 		          currentParents = [];
/******/ 		        }
/******/ 		        return require(request);
/******/ 		      }, createPropertyDescriptor = function(name) {
/******/ 		        return {
/******/ 		          configurable: !0,
/******/ 		          enumerable: !0,
/******/ 		          get: function() {
/******/ 		            return require[name];
/******/ 		          },
/******/ 		          set: function(value) {
/******/ 		            require[name] = value;
/******/ 		          }
/******/ 		        };
/******/ 		      };
/******/ 		      for (var name in require)
/******/ 		        if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e")
/******/ 		          Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 		      fn.e = function(chunkId, fetchPriority) {
/******/ 		        return trackBlockingPromise(require.e(chunkId, fetchPriority));
/******/ 		      };
/******/ 		      return fn;
/******/ 		    }
/******/ 		    function createModuleHotObject(moduleId, me) {
/******/ 		      var _main = currentChildModule !== moduleId, hot = {
/******/ 		        _acceptedDependencies: {},
/******/ 		        _acceptedErrorHandlers: {},
/******/ 		        _declinedDependencies: {},
/******/ 		        _selfAccepted: !1,
/******/ 		        _selfDeclined: !1,
/******/ 		        _selfInvalidated: !1,
/******/ 		        _disposeHandlers: [],
/******/ 		        _main,
/******/ 		        _requireSelf: function() {
/******/ 		          currentParents = me.parents.slice();
/******/ 		          currentChildModule = _main ? void 0 : moduleId;
/******/ 		          __webpack_require__(moduleId);
/******/ 		        },
/******/ 		        active: !0,
/******/ 		        accept: function(dep, callback, errorHandler) {
/******/ 		          if (dep === void 0)
/******/ 		            hot._selfAccepted = !0;
/******/ 		          else if (typeof dep === "function")
/******/ 		            hot._selfAccepted = dep;
/******/ 		          else if (typeof dep === "object" && dep !== null)
/******/ 		            for (var i = 0;i < dep.length; i++) {
/******/ 		              hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 		              hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 		            }
/******/ 		          else {
/******/ 		            hot._acceptedDependencies[dep] = callback || function() {};
/******/ 		            hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 		          }
/******/ 		        },
/******/ 		        decline: function(dep) {
/******/ 		          if (dep === void 0)
/******/ 		            hot._selfDeclined = !0;
/******/ 		          else if (typeof dep === "object" && dep !== null)
/******/ 		            for (var i = 0;i < dep.length; i++)
/******/ 		              hot._declinedDependencies[dep[i]] = !0;
/******/ 		          else
/******/ 		            hot._declinedDependencies[dep] = !0;
/******/ 		        },
/******/ 		        dispose: function(callback) {
/******/ 		          hot._disposeHandlers.push(callback);
/******/ 		        },
/******/ 		        addDisposeHandler: function(callback) {
/******/ 		          hot._disposeHandlers.push(callback);
/******/ 		        },
/******/ 		        removeDisposeHandler: function(callback) {
/******/ 		          var idx = hot._disposeHandlers.indexOf(callback);
/******/ 		          if (idx >= 0)
/******/ 		            hot._disposeHandlers.splice(idx, 1);
/******/ 		        },
/******/ 		        invalidate: function() {
/******/ 		          this._selfInvalidated = !0;
/******/ 		          switch (currentStatus) {
/******/ 		            case "idle":
/******/ 		              currentUpdateApplyHandlers = [];
/******/ 		              Object.keys(__webpack_require__.hmrI).forEach(function(key) {
/******/ 		                __webpack_require__.hmrI[key](moduleId, currentUpdateApplyHandlers);
/******/ 		              });
/******/ 		              setStatus("ready");
/******/ 		              break;
/******/ 		            case "ready":
/******/ 		              Object.keys(__webpack_require__.hmrI).forEach(function(key) {
/******/ 		                __webpack_require__.hmrI[key](moduleId, currentUpdateApplyHandlers);
/******/ 		              });
/******/ 		              break;
/******/ 		            case "prepare":
/******/ 		            case "check":
/******/ 		            case "dispose":
/******/ 		            case "apply":
/******/ 		              (queuedInvalidatedModules = queuedInvalidatedModules || []).push(moduleId);
/******/ 		              break;
/******/ 		            default:
/******/ 		              break;
/******/ 		          }
/******/ 		        },
/******/ 		        check: hotCheck,
/******/ 		        apply: hotApply,
/******/ 		        status: function(l) {
/******/ 		          if (!l)
/******/ 		            return currentStatus;
/******/ 		          registeredStatusHandlers.push(l);
/******/ 		        },
/******/ 		        addStatusHandler: function(l) {
/******/ 		          registeredStatusHandlers.push(l);
/******/ 		        },
/******/ 		        removeStatusHandler: function(l) {
/******/ 		          var idx = registeredStatusHandlers.indexOf(l);
/******/ 		          if (idx >= 0)
/******/ 		            registeredStatusHandlers.splice(idx, 1);
/******/ 		        },
/******/ 		        data: currentModuleData[moduleId]
/******/ 		      };
/******/ 		      currentChildModule = void 0;
/******/ 		      return hot;
/******/ 		    }
/******/ 		    function setStatus(newStatus) {
/******/ 		      currentStatus = newStatus;
/******/ 		      var results = [];
/******/ 		      for (var i = 0;i < registeredStatusHandlers.length; i++)
/******/ 		        results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		      return Promise.all(results).then(function() {});
/******/ 		    }
/******/ 		    function unblock() {
/******/ 		      if (--blockingPromises === 0)
/******/ 		        setStatus("ready").then(function() {
/******/ 		          if (blockingPromises === 0) {
/******/ 		            var list = blockingPromisesWaiting;
/******/ 		            blockingPromisesWaiting = [];
/******/ 		            for (var i = 0;i < list.length; i++)
/******/ 		              list[i]();
/******/ 		          }
/******/ 		        });
/******/ 		    }
/******/ 		    function trackBlockingPromise(promise) {
/******/ 		      switch (currentStatus) {
/******/ 		        case "ready":
/******/ 		          setStatus("prepare");
/******/ 		        case "prepare":
/******/ 		          blockingPromises++;
/******/ 		          promise.then(unblock, unblock);
/******/ 		          return promise;
/******/ 		        default:
/******/ 		          return promise;
/******/ 		      }
/******/ 		    }
/******/ 		    function waitForBlockingPromises(fn) {
/******/ 		      if (blockingPromises === 0)
/******/ 		        return fn();
/******/ 		      return new Promise(function(resolve) {
/******/ 		        blockingPromisesWaiting.push(function() {
/******/ 		          resolve(fn());
/******/ 		        });
/******/ 		      });
/******/ 		    }
/******/ 		    function hotCheck(applyOnUpdate) {
/******/ 		      if (currentStatus !== "idle")
/******/ 		        throw Error("check() is only allowed in idle status");
/******/ 		      return setStatus("check").then(__webpack_require__.hmrM).then(function(update) {
/******/ 		        if (!update)
/******/ 		          return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(function() {
/******/ 		            return null;
/******/ 		          });
/******/ 		        return setStatus("prepare").then(function() {
/******/ 		          var updatedModules = [];
/******/ 		          currentUpdateApplyHandlers = [];
/******/ 		          return Promise.all(Object.keys(__webpack_require__.hmrC).reduce(function(promises, key) {
/******/ 		            __webpack_require__.hmrC[key](update.c, update.r, update.m, promises, currentUpdateApplyHandlers, updatedModules);
/******/ 		            return promises;
/******/ 		          }, [])).then(function() {
/******/ 		            return waitForBlockingPromises(function() {
/******/ 		              if (applyOnUpdate)
/******/ 		                return internalApply(applyOnUpdate);
/******/ 		              return setStatus("ready").then(function() {
/******/ 		                return updatedModules;
/******/ 		              });
/******/ 		            });
/******/ 		          });
/******/ 		        });
/******/ 		      });
/******/ 		    }
/******/ 		    function hotApply(options) {
/******/ 		      if (currentStatus !== "ready")
/******/ 		        return Promise.resolve().then(function() {
/******/ 		          throw Error("apply() is only allowed in ready status (state: " + currentStatus + ")");
/******/ 		        });
/******/ 		      return internalApply(options);
/******/ 		    }
/******/ 		    function internalApply(options) {
/******/ 		      options = options || {};
/******/ 		      applyInvalidatedModules();
/******/ 		      var results = currentUpdateApplyHandlers.map(function(handler) {
/******/ 		        return handler(options);
/******/ 		      });
/******/ 		      currentUpdateApplyHandlers = void 0;
/******/ 		      var errors = results.map(function(r) {
/******/ 		        return r.error;
/******/ 		      }).filter(Boolean);
/******/ 		      if (errors.length > 0)
/******/ 		        return setStatus("abort").then(function() {
/******/ 		          throw errors[0];
/******/ 		        });
/******/ 		      var disposePromise = setStatus("dispose");
/******/ 		      results.forEach(function(result) {
/******/ 		        if (result.dispose)
/******/ 		          result.dispose();
/******/ 		      });
/******/ 		      var applyPromise = setStatus("apply"), error, reportError = function(err) {
/******/ 		        if (!error)
/******/ 		          error = err;
/******/ 		      }, outdatedModules = [];
/******/ 		      results.forEach(function(result) {
/******/ 		        if (result.apply) {
/******/ 		          var modules = result.apply(reportError);
/******/ 		          if (modules)
/******/ 		            for (var i = 0;i < modules.length; i++)
/******/ 		              outdatedModules.push(modules[i]);
/******/ 		        }
/******/ 		      });
/******/ 		      return Promise.all([disposePromise, applyPromise]).then(function() {
/******/ 		        if (error)
/******/ 		          return setStatus("fail").then(function() {
/******/ 		            throw error;
/******/ 		          });
/******/ 		        if (queuedInvalidatedModules)
/******/ 		          return internalApply(options).then(function(list) {
/******/ 		            outdatedModules.forEach(function(moduleId) {
/******/ 		              if (list.indexOf(moduleId) < 0)
/******/ 		                list.push(moduleId);
/******/ 		            });
/******/ 		            return list;
/******/ 		          });
/******/ 		        return setStatus("idle").then(function() {
/******/ 		          return outdatedModules;
/******/ 		        });
/******/ 		      });
/******/ 		    }
/******/ 		    function applyInvalidatedModules() {
/******/ 		      if (queuedInvalidatedModules) {
/******/ 		        if (!currentUpdateApplyHandlers)
/******/ 		          currentUpdateApplyHandlers = [];
/******/ 		        Object.keys(__webpack_require__.hmrI).forEach(function(key) {
/******/ 		          queuedInvalidatedModules.forEach(function(moduleId) {
/******/ 		            __webpack_require__.hmrI[key](moduleId, currentUpdateApplyHandlers);
/******/ 		          });
/******/ 		        });
/******/ 		        queuedInvalidatedModules = void 0;
/******/ 		        return !0;
/******/ 		      }
/******/ 		    }
/******/ 		  
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/_next/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	(() => {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push((options) => {
/******/ 			const originalFactory = options.factory;
/******/ 			options.factory = (moduleObject, moduleExports, webpackRequire) => {
/******/ 				const hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				const cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : () => {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/******/ 	/* webpack/runtime/css loading */
/******/ 	(() => {
/******/ 		var createStylesheet = (chunkId, fullhref, resolve, reject) => {
/******/ 			var linkTag = document.createElement("link");
/******/ 		
/******/ 			linkTag.rel = "stylesheet";
/******/ 			linkTag.type = "text/css";
/******/ 			var onLinkComplete = (event) => {
/******/ 				// avoid mem leaks.
/******/ 				linkTag.onerror = linkTag.onload = null;
/******/ 				if (event.type === 'load') {
/******/ 					resolve();
/******/ 				} else {
/******/ 					var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 					var realHref = event && event.target && event.target.href || fullhref;
/******/ 					var err = new Error("Loading CSS chunk " + chunkId + " failed.\n(" + realHref + ")");
/******/ 					err.code = "CSS_CHUNK_LOAD_FAILED";
/******/ 					err.type = errorType;
/******/ 					err.request = realHref;
/******/ 					linkTag.parentNode.removeChild(linkTag)
/******/ 					reject(err);
/******/ 				}
/******/ 			}
/******/ 			linkTag.onerror = linkTag.onload = onLinkComplete;
/******/ 			linkTag.href = fullhref;
/******/ 		
/******/ 			(function(linkTag) {
/******/ 			          if (typeof _N_E_STYLE_LOAD === "function") {
/******/ 			            const { href, onload, onerror } = linkTag;
/******/ 			            _N_E_STYLE_LOAD(href.indexOf(window.location.origin) === 0 ? new URL(href).pathname : href).then(() => onload == null ? void 0 : onload.call(linkTag, {
/******/ 			              type: "load"
/******/ 			            }), () => onerror == null ? void 0 : onerror.call(linkTag, {}));
/******/ 			          } else
/******/ 			            document.head.appendChild(linkTag);
/******/ 			        })(linkTag)
/******/ 			return linkTag;
/******/ 		};
/******/ 		var findStylesheet = (href, fullhref) => {
/******/ 			var existingLinkTags = document.getElementsByTagName("link");
/******/ 			for(var i = 0; i < existingLinkTags.length; i++) {
/******/ 				var tag = existingLinkTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");
/******/ 				if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return tag;
/******/ 			}
/******/ 			var existingStyleTags = document.getElementsByTagName("style");
/******/ 			for(var i = 0; i < existingStyleTags.length; i++) {
/******/ 				var tag = existingStyleTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href");
/******/ 				if(dataHref === href || dataHref === fullhref) return tag;
/******/ 			}
/******/ 		};
/******/ 		var loadStylesheet = (chunkId) => {
/******/ 			return new Promise((resolve, reject) => {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				if(findStylesheet(href, fullhref)) return resolve();
/******/ 				createStylesheet(chunkId, fullhref, resolve, reject);
/******/ 			});
/******/ 		}
/******/ 		// no chunk loading
/******/ 		
/******/ 		var oldTags = [];
/******/ 		var newTags = [];
/******/ 		var applyHandler = (options) => {
/******/ 			return { dispose: () => {
/******/ 				for(var i = 0; i < oldTags.length; i++) {
/******/ 					var oldTag = oldTags[i];
/******/ 					if(oldTag.parentNode) oldTag.parentNode.removeChild(oldTag);
/******/ 				}
/******/ 				oldTags.length = 0;
/******/ 			}, apply: () => {
/******/ 				for(var i = 0; i < newTags.length; i++) newTags[i].rel = "stylesheet";
/******/ 				newTags.length = 0;
/******/ 			} };
/******/ 		}
/******/ 		__webpack_require__.hmrC.miniCss = (chunkIds, removedChunks, removedModules, promises, applyHandlers, updatedModulesList) => {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			chunkIds.forEach((chunkId) => {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				var oldTag = findStylesheet(href, fullhref);
/******/ 				if(!oldTag) return;
/******/ 				promises.push(new Promise((resolve, reject) => {
/******/ 					var tag = createStylesheet(chunkId, fullhref, () => {
/******/ 						tag.as = "style";
/******/ 						tag.rel = "preload";
/******/ 						resolve();
/******/ 					}, reject);
/******/ 					oldTags.push(oldTag);
/******/ 					newTags.push(tag);
/******/ 				}));
/******/ 			});
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = __webpack_require__.hmrS_jsonp = __webpack_require__.hmrS_jsonp || {
/******/ 			"webpack": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if("webpack" != chunkId) {
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			currentUpdatedModulesList = updatedModulesList;
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		self["webpackHotUpdate_N_E"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		    var currentUpdateChunks, currentUpdate, currentUpdateRemovedChunks, currentUpdateRuntime;
/******/ 		    function applyHandler(options) {
/******/ 		      if (__webpack_require__.f)
/******/ 		        delete __webpack_require__.f.jsonpHmr;
/******/ 		      currentUpdateChunks = void 0;
/******/ 		      function getAffectedModuleEffects(updateModuleId) {
/******/ 		        var outdatedModules = [updateModuleId], outdatedDependencies = {}, queue = outdatedModules.map(function(id) {
/******/ 		          return {
/******/ 		            chain: [id],
/******/ 		            id
/******/ 		          };
/******/ 		        });
/******/ 		        while (queue.length > 0) {
/******/ 		          var queueItem = queue.pop(), moduleId = queueItem.id, chain = queueItem.chain, module = __webpack_require__.c[moduleId];
/******/ 		          if (!module || module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 		            continue;
/******/ 		          if (module.hot._selfDeclined)
/******/ 		            return {
/******/ 		              type: "self-declined",
/******/ 		              chain,
/******/ 		              moduleId
/******/ 		            };
/******/ 		          if (module.hot._main)
/******/ 		            return {
/******/ 		              type: "unaccepted",
/******/ 		              chain,
/******/ 		              moduleId
/******/ 		            };
/******/ 		          for (var i = 0;i < module.parents.length; i++) {
/******/ 		            var parentId = module.parents[i], parent = __webpack_require__.c[parentId];
/******/ 		            if (!parent)
/******/ 		              continue;
/******/ 		            if (parent.hot._declinedDependencies[moduleId])
/******/ 		              return {
/******/ 		                type: "declined",
/******/ 		                chain: chain.concat([parentId]),
/******/ 		                moduleId,
/******/ 		                parentId
/******/ 		              };
/******/ 		            if (outdatedModules.indexOf(parentId) !== -1)
/******/ 		              continue;
/******/ 		            if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 		              if (!outdatedDependencies[parentId])
/******/ 		                outdatedDependencies[parentId] = [];
/******/ 		              addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 		              continue;
/******/ 		            }
/******/ 		            delete outdatedDependencies[parentId];
/******/ 		            outdatedModules.push(parentId);
/******/ 		            queue.push({
/******/ 		              chain: chain.concat([parentId]),
/******/ 		              id: parentId
/******/ 		            });
/******/ 		          }
/******/ 		        }
/******/ 		        return {
/******/ 		          type: "accepted",
/******/ 		          moduleId: updateModuleId,
/******/ 		          outdatedModules,
/******/ 		          outdatedDependencies
/******/ 		        };
/******/ 		      }
/******/ 		      function addAllToSet(a, b) {
/******/ 		        for (var i = 0;i < b.length; i++) {
/******/ 		          var item = b[i];
/******/ 		          if (a.indexOf(item) === -1)
/******/ 		            a.push(item);
/******/ 		        }
/******/ 		      }
/******/ 		      var outdatedDependencies = {}, outdatedModules = [], appliedUpdate = {}, warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 		        console.warn("[HMR] unexpected require(" + module.id + ") to disposed module");
/******/ 		      };
/******/ 		      for (var moduleId in currentUpdate)
/******/ 		        if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 		          var newModuleFactory = currentUpdate[moduleId], result = newModuleFactory ? getAffectedModuleEffects(moduleId) : {
/******/ 		            type: "disposed",
/******/ 		            moduleId
/******/ 		          }, abortError = !1, doApply = !1, doDispose = !1, chainInfo = "";
/******/ 		          if (result.chain)
/******/ 		            chainInfo = `
/******/ 		Update propagation: ` + result.chain.join(" -> ");
/******/ 		          switch (result.type) {
/******/ 		            case "self-declined":
/******/ 		              if (options.onDeclined)
/******/ 		                options.onDeclined(result);
/******/ 		              if (!options.ignoreDeclined)
/******/ 		                abortError = Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 		              break;
/******/ 		            case "declined":
/******/ 		              if (options.onDeclined)
/******/ 		                options.onDeclined(result);
/******/ 		              if (!options.ignoreDeclined)
/******/ 		                abortError = Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 		              break;
/******/ 		            case "unaccepted":
/******/ 		              if (options.onUnaccepted)
/******/ 		                options.onUnaccepted(result);
/******/ 		              if (!options.ignoreUnaccepted)
/******/ 		                abortError = Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 		              break;
/******/ 		            case "accepted":
/******/ 		              if (options.onAccepted)
/******/ 		                options.onAccepted(result);
/******/ 		              doApply = !0;
/******/ 		              break;
/******/ 		            case "disposed":
/******/ 		              if (options.onDisposed)
/******/ 		                options.onDisposed(result);
/******/ 		              doDispose = !0;
/******/ 		              break;
/******/ 		            default:
/******/ 		              throw Error("Unexception type " + result.type);
/******/ 		          }
/******/ 		          if (abortError)
/******/ 		            return {
/******/ 		              error: abortError
/******/ 		            };
/******/ 		          if (doApply) {
/******/ 		            appliedUpdate[moduleId] = newModuleFactory;
/******/ 		            addAllToSet(outdatedModules, result.outdatedModules);
/******/ 		            for (moduleId in result.outdatedDependencies)
/******/ 		              if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 		                if (!outdatedDependencies[moduleId])
/******/ 		                  outdatedDependencies[moduleId] = [];
/******/ 		                addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 		              }
/******/ 		          }
/******/ 		          if (doDispose) {
/******/ 		            addAllToSet(outdatedModules, [result.moduleId]);
/******/ 		            appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 		          }
/******/ 		        }
/******/ 		      currentUpdate = void 0;
/******/ 		      var outdatedSelfAcceptedModules = [];
/******/ 		      for (var j = 0;j < outdatedModules.length; j++) {
/******/ 		        var outdatedModuleId = outdatedModules[j], module = __webpack_require__.c[outdatedModuleId];
/******/ 		        if (module && (module.hot._selfAccepted || module.hot._main) && appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire && !module.hot._selfInvalidated)
/******/ 		          outdatedSelfAcceptedModules.push({
/******/ 		            module: outdatedModuleId,
/******/ 		            require: module.hot._requireSelf,
/******/ 		            errorHandler: module.hot._selfAccepted
/******/ 		          });
/******/ 		      }
/******/ 		      var moduleOutdatedDependencies;
/******/ 		      return {
/******/ 		        dispose: function() {
/******/ 		          currentUpdateRemovedChunks.forEach(function(chunkId) {
/******/ 		            delete installedChunks[chunkId];
/******/ 		          });
/******/ 		          currentUpdateRemovedChunks = void 0;
/******/ 		          var idx, queue = outdatedModules.slice();
/******/ 		          while (queue.length > 0) {
/******/ 		            var moduleId = queue.pop(), module = __webpack_require__.c[moduleId];
/******/ 		            if (!module)
/******/ 		              continue;
/******/ 		            var data = {}, disposeHandlers = module.hot._disposeHandlers;
/******/ 		            for (j = 0;j < disposeHandlers.length; j++)
/******/ 		              disposeHandlers[j].call(null, data);
/******/ 		            __webpack_require__.hmrD[moduleId] = data;
/******/ 		            module.hot.active = !1;
/******/ 		            delete __webpack_require__.c[moduleId];
/******/ 		            delete outdatedDependencies[moduleId];
/******/ 		            for (j = 0;j < module.children.length; j++) {
/******/ 		              var child = __webpack_require__.c[module.children[j]];
/******/ 		              if (!child)
/******/ 		                continue;
/******/ 		              idx = child.parents.indexOf(moduleId);
/******/ 		              if (idx >= 0)
/******/ 		                child.parents.splice(idx, 1);
/******/ 		            }
/******/ 		          }
/******/ 		          var dependency;
/******/ 		          for (var outdatedModuleId in outdatedDependencies)
/******/ 		            if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 		              module = __webpack_require__.c[outdatedModuleId];
/******/ 		              if (module) {
/******/ 		                moduleOutdatedDependencies = outdatedDependencies[outdatedModuleId];
/******/ 		                for (j = 0;j < moduleOutdatedDependencies.length; j++) {
/******/ 		                  dependency = moduleOutdatedDependencies[j];
/******/ 		                  idx = module.children.indexOf(dependency);
/******/ 		                  if (idx >= 0)
/******/ 		                    module.children.splice(idx, 1);
/******/ 		                }
/******/ 		              }
/******/ 		            }
/******/ 		        },
/******/ 		        apply: function(reportError) {
/******/ 		          for (var updateModuleId in appliedUpdate)
/******/ 		            if (__webpack_require__.o(appliedUpdate, updateModuleId))
/******/ 		              __webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 		          for (var i = 0;i < currentUpdateRuntime.length; i++)
/******/ 		            currentUpdateRuntime[i](__webpack_require__);
/******/ 		          for (var outdatedModuleId in outdatedDependencies)
/******/ 		            if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 		              var module = __webpack_require__.c[outdatedModuleId];
/******/ 		              if (module) {
/******/ 		                moduleOutdatedDependencies = outdatedDependencies[outdatedModuleId];
/******/ 		                var callbacks = [], errorHandlers = [], dependenciesForCallbacks = [];
/******/ 		                for (var j = 0;j < moduleOutdatedDependencies.length; j++) {
/******/ 		                  var dependency = moduleOutdatedDependencies[j], acceptCallback = module.hot._acceptedDependencies[dependency], errorHandler = module.hot._acceptedErrorHandlers[dependency];
/******/ 		                  if (acceptCallback) {
/******/ 		                    if (callbacks.indexOf(acceptCallback) !== -1)
/******/ 		                      continue;
/******/ 		                    callbacks.push(acceptCallback);
/******/ 		                    errorHandlers.push(errorHandler);
/******/ 		                    dependenciesForCallbacks.push(dependency);
/******/ 		                  }
/******/ 		                }
/******/ 		                for (var k = 0;k < callbacks.length; k++)
/******/ 		                  try {
/******/ 		                    callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 		                  } catch (err) {
/******/ 		                    if (typeof errorHandlers[k] === "function")
/******/ 		                      try {
/******/ 		                        errorHandlers[k](err, {
/******/ 		                          moduleId: outdatedModuleId,
/******/ 		                          dependencyId: dependenciesForCallbacks[k]
/******/ 		                        });
/******/ 		                      } catch (err2) {
/******/ 		                        if (options.onErrored)
/******/ 		                          options.onErrored({
/******/ 		                            type: "accept-error-handler-errored",
/******/ 		                            moduleId: outdatedModuleId,
/******/ 		                            dependencyId: dependenciesForCallbacks[k],
/******/ 		                            error: err2,
/******/ 		                            originalError: err
/******/ 		                          });
/******/ 		                        if (!options.ignoreErrored) {
/******/ 		                          reportError(err2);
/******/ 		                          reportError(err);
/******/ 		                        }
/******/ 		                      }
/******/ 		                    else {
/******/ 		                      if (options.onErrored)
/******/ 		                        options.onErrored({
/******/ 		                          type: "accept-errored",
/******/ 		                          moduleId: outdatedModuleId,
/******/ 		                          dependencyId: dependenciesForCallbacks[k],
/******/ 		                          error: err
/******/ 		                        });
/******/ 		                      if (!options.ignoreErrored)
/******/ 		                        reportError(err);
/******/ 		                    }
/******/ 		                  }
/******/ 		              }
/******/ 		            }
/******/ 		          for (var o = 0;o < outdatedSelfAcceptedModules.length; o++) {
/******/ 		            var item = outdatedSelfAcceptedModules[o], moduleId = item.module;
/******/ 		            try {
/******/ 		              item.require(moduleId);
/******/ 		            } catch (err) {
/******/ 		              if (typeof item.errorHandler === "function")
/******/ 		                try {
/******/ 		                  item.errorHandler(err, {
/******/ 		                    moduleId,
/******/ 		                    module: __webpack_require__.c[moduleId]
/******/ 		                  });
/******/ 		                } catch (err1) {
/******/ 		                  if (options.onErrored)
/******/ 		                    options.onErrored({
/******/ 		                      type: "self-accept-error-handler-errored",
/******/ 		                      moduleId,
/******/ 		                      error: err1,
/******/ 		                      originalError: err
/******/ 		                    });
/******/ 		                  if (!options.ignoreErrored) {
/******/ 		                    reportError(err1);
/******/ 		                    reportError(err);
/******/ 		                  }
/******/ 		                }
/******/ 		              else {
/******/ 		                if (options.onErrored)
/******/ 		                  options.onErrored({
/******/ 		                    type: "self-accept-errored",
/******/ 		                    moduleId,
/******/ 		                    error: err
/******/ 		                  });
/******/ 		                if (!options.ignoreErrored)
/******/ 		                  reportError(err);
/******/ 		              }
/******/ 		            }
/******/ 		          }
/******/ 		          return outdatedModules;
/******/ 		        }
/******/ 		      };
/******/ 		    }
/******/ 		    __webpack_require__.hmrI.jsonp = function(moduleId, applyHandlers) {
/******/ 		      if (!currentUpdate) {
/******/ 		        currentUpdate = {};
/******/ 		        currentUpdateRuntime = [];
/******/ 		        currentUpdateRemovedChunks = [];
/******/ 		        applyHandlers.push(applyHandler);
/******/ 		      }
/******/ 		      if (!__webpack_require__.o(currentUpdate, moduleId))
/******/ 		        currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 		    };
/******/ 		    __webpack_require__.hmrC.jsonp = function(chunkIds, removedChunks, removedModules, promises, applyHandlers, updatedModulesList) {
/******/ 		      applyHandlers.push(applyHandler);
/******/ 		      currentUpdateChunks = {};
/******/ 		      currentUpdateRemovedChunks = removedChunks;
/******/ 		      currentUpdate = removedModules.reduce(function(obj, key) {
/******/ 		        obj[key] = !1;
/******/ 		        return obj;
/******/ 		      }, {});
/******/ 		      currentUpdateRuntime = [];
/******/ 		      chunkIds.forEach(function(chunkId) {
/******/ 		        if (__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId] !== void 0) {
/******/ 		          promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 		          currentUpdateChunks[chunkId] = !0;
/******/ 		        } else
/******/ 		          currentUpdateChunks[chunkId] = !1;
/******/ 		      });
/******/ 		      if (__webpack_require__.f)
/******/ 		        __webpack_require__.f.jsonpHmr = function(chunkId, promises) {
/******/ 		          if (currentUpdateChunks && __webpack_require__.o(currentUpdateChunks, chunkId) && !currentUpdateChunks[chunkId]) {
/******/ 		            promises.push(loadUpdateChunk(chunkId));
/******/ 		            currentUpdateChunks[chunkId] = !0;
/******/ 		          }
/******/ 		        };
/******/ 		    };
/******/ 		  
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	
/******/ })()

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJpZ25vcmVMaXN0IjpbMF0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZXMiOlsid2VicGFjay1pbnRlcm5hbDovL25leHRqcy93ZWJwYWNrLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoaXMgc291cmNlIHdhcyBnZW5lcmF0ZWQgYnkgTmV4dC5qcyBiYXNlZCBvZmYgb2YgdGhlIGdlbmVyYXRlZCBXZWJwYWNrIHJ1bnRpbWUuXG4vLyBUaGUgbWFwcGluZ3MgYXJlIGluY29ycmVjdC5cbi8vIFRvIGdldCB0aGUgY29ycmVjdCBsaW5lL2NvbHVtbiBtYXBwaW5ncywgdHVybiBvZmYgc291cmNlbWFwcyBpbiB5b3VyIGRlYnVnZ2VyLlxuXG4vKioqKioqLyAoKCkgPT4geyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdFwidXNlIHN0cmljdFwiO1xuLyoqKioqKi8gXHR2YXIgX193ZWJwYWNrX21vZHVsZXNfXyA9ICh7fSk7XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcbi8qKioqKiovIFx0XHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcbi8qKioqKiovIFx0XHRcdGlmIChjYWNoZWRNb2R1bGUuZXJyb3IgIT09IHVuZGVmaW5lZCkgdGhyb3cgY2FjaGVkTW9kdWxlLmVycm9yO1xuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bG9hZGVkOiBmYWxzZSxcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0dmFyIHRocmV3ID0gdHJ1ZTtcbi8qKioqKiovIFx0XHR0cnkge1xuLyoqKioqKi8gXHRcdFx0dmFyIGV4ZWNPcHRpb25zID0geyBpZDogbW9kdWxlSWQsIG1vZHVsZTogbW9kdWxlLCBmYWN0b3J5OiBfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXSwgcmVxdWlyZTogX193ZWJwYWNrX3JlcXVpcmVfXyB9O1xuLyoqKioqKi8gXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlcikgeyBoYW5kbGVyKGV4ZWNPcHRpb25zKTsgfSk7XG4vKioqKioqLyBcdFx0XHRtb2R1bGUgPSBleGVjT3B0aW9ucy5tb2R1bGU7XG4vKioqKioqLyBcdFx0XHRleGVjT3B0aW9ucy5mYWN0b3J5LmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGV4ZWNPcHRpb25zLnJlcXVpcmUpO1xuLyoqKioqKi8gXHRcdFx0dGhyZXcgPSBmYWxzZTtcbi8qKioqKiovIFx0XHR9IGZpbmFsbHkge1xuLyoqKioqKi8gXHRcdFx0aWYodGhyZXcpIGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0XG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfXztcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGV4ZWN1dGlvbiBpbnRlcmNlcHRvclxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBbXTtcbi8qKioqKiovIFx0XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0dmFyIGRlZmVycmVkID0gW107XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuLyoqKioqKi8gXHRcdFx0aWYoY2h1bmtJZHMpIHtcbi8qKioqKiovIFx0XHRcdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuLyoqKioqKi8gXHRcdFx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuLyoqKioqKi8gXHRcdFx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcbi8qKioqKiovIFx0XHRcdFx0cmV0dXJuO1xuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuLyoqKioqKi8gXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuLyoqKioqKi8gXHRcdFx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG4vKioqKioqLyBcdFx0XHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuLyoqKioqKi8gXHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG4vKioqKioqLyBcdFx0XHRcdFx0fSBlbHNlIHtcbi8qKioqKiovIFx0XHRcdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuLyoqKioqKi8gXHRcdFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0XHRpZihmdWxmaWxsZWQpIHtcbi8qKioqKiovIFx0XHRcdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuLyoqKioqKi8gXHRcdFx0XHRcdHZhciByID0gZm4oKTtcbi8qKioqKiovIFx0XHRcdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuLyoqKioqKi8gXHRcdFx0XHR9XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0XHRyZXR1cm4gcmVzdWx0O1xuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvY3JlYXRlIGZha2UgbmFtZXNwYWNlIG9iamVjdCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiA/IChvYmopID0+IChPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSkgOiAob2JqKSA9PiAob2JqLl9fcHJvdG9fXyk7XG4vKioqKioqLyBcdFx0dmFyIGxlYWZQcm90b3R5cGVzO1xuLyoqKioqKi8gXHRcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuLyoqKioqKi8gXHRcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuLyoqKioqKi8gXHRcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuLyoqKioqKi8gXHRcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuLyoqKioqKi8gXHRcdC8vIG1vZGUgJiAxNjogcmV0dXJuIHZhbHVlIHdoZW4gaXQncyBQcm9taXNlLWxpa2Vcbi8qKioqKiovIFx0XHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbi8qKioqKiovIFx0XHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IHRoaXModmFsdWUpO1xuLyoqKioqKi8gXHRcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbi8qKioqKiovIFx0XHRcdGlmKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUpIHtcbi8qKioqKiovIFx0XHRcdFx0aWYoKG1vZGUgJiA0KSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4vKioqKioqLyBcdFx0XHRcdGlmKChtb2RlICYgMTYpICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nKSByZXR1cm4gdmFsdWU7XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuLyoqKioqKi8gXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbi8qKioqKiovIFx0XHRcdHZhciBkZWYgPSB7fTtcbi8qKioqKiovIFx0XHRcdGxlYWZQcm90b3R5cGVzID0gbGVhZlByb3RvdHlwZXMgfHwgW251bGwsIGdldFByb3RvKHt9KSwgZ2V0UHJvdG8oW10pLCBnZXRQcm90byhnZXRQcm90byldO1xuLyoqKioqKi8gXHRcdFx0Zm9yKHZhciBjdXJyZW50ID0gbW9kZSAmIDIgJiYgdmFsdWU7IHR5cGVvZiBjdXJyZW50ID09ICdvYmplY3QnICYmICF+bGVhZlByb3RvdHlwZXMuaW5kZXhPZihjdXJyZW50KTsgY3VycmVudCA9IGdldFByb3RvKGN1cnJlbnQpKSB7XG4vKioqKioqLyBcdFx0XHRcdE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGN1cnJlbnQpLmZvckVhY2goKGtleSkgPT4gKGRlZltrZXldID0gKCkgPT4gKHZhbHVlW2tleV0pKSk7XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0XHRkZWZbJ2RlZmF1bHQnXSA9ICgpID0+ICh2YWx1ZSk7XG4vKioqKioqLyBcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGRlZik7XG4vKioqKioqLyBcdFx0XHRyZXR1cm4gbnM7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuLyoqKioqKi8gXHRcdFx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuLyoqKioqKi8gXHRcdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcbi8qKioqKiovIFx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuLyoqKioqKi8gXHRcdFx0XHR9XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9lbnN1cmUgY2h1bmsgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmYgPSB7fTtcbi8qKioqKiovIFx0XHQvLyBUaGlzIGZpbGUgY29udGFpbnMgb25seSB0aGUgZW50cnkgY2h1bmsuXG4vKioqKioqLyBcdFx0Ly8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5lID0gKGNodW5rSWQpID0+IHtcbi8qKioqKiovIFx0XHRcdHJldHVybiBQcm9taXNlLmFsbChPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLmYpLnJlZHVjZSgocHJvbWlzZXMsIGtleSkgPT4ge1xuLyoqKioqKi8gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmZba2V5XShjaHVua0lkLCBwcm9taXNlcyk7XG4vKioqKioqLyBcdFx0XHRcdHJldHVybiBwcm9taXNlcztcbi8qKioqKiovIFx0XHRcdH0sIFtdKSk7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9nZXQgamF2YXNjcmlwdCBjaHVuayBmaWxlbmFtZSAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdC8vIFRoaXMgZnVuY3Rpb24gYWxsb3cgdG8gcmVmZXJlbmNlIGFzeW5jIGNodW5rc1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18udSA9IChjaHVua0lkKSA9PiB7XG4vKioqKioqLyBcdFx0XHQvLyByZXR1cm4gdXJsIGZvciBmaWxlbmFtZXMgYmFzZWQgb24gdGVtcGxhdGVcbi8qKioqKiovIFx0XHRcdHJldHVybiBcInN0YXRpYy9jaHVua3MvZmFsbGJhY2svXCIgKyBjaHVua0lkICsgXCIuanNcIjtcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2dldCBqYXZhc2NyaXB0IHVwZGF0ZSBjaHVuayBmaWxlbmFtZSAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdC8vIFRoaXMgZnVuY3Rpb24gYWxsb3cgdG8gcmVmZXJlbmNlIGFsbCBjaHVua3Ncbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmh1ID0gKGNodW5rSWQpID0+IHtcbi8qKioqKiovIFx0XHRcdC8vIHJldHVybiB1cmwgZm9yIGZpbGVuYW1lcyBiYXNlZCBvbiB0ZW1wbGF0ZVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIFwic3RhdGljL3dlYnBhY2svXCIgKyBjaHVua0lkICsgXCIuXCIgKyBfX3dlYnBhY2tfcmVxdWlyZV9fLmgoKSArIFwiLmhvdC11cGRhdGUuanNcIjtcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2dldCBtaW5pLWNzcyBjaHVuayBmaWxlbmFtZSAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdC8vIFRoaXMgZnVuY3Rpb24gYWxsb3cgdG8gcmVmZXJlbmNlIGFzeW5jIGNodW5rc1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18ubWluaUNzc0YgPSAoY2h1bmtJZCkgPT4ge1xuLyoqKioqKi8gXHRcdFx0Ly8gcmV0dXJuIHVybCBmb3IgZmlsZW5hbWVzIGJhc2VkIG9uIHRlbXBsYXRlXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvZ2V0IHVwZGF0ZSBtYW5pZmVzdCBmaWxlbmFtZSAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uaG1yRiA9ICgpID0+IChcInN0YXRpYy93ZWJwYWNrL1wiICsgX193ZWJwYWNrX3JlcXVpcmVfXy5oKCkgKyBcIi53ZWJwYWNrLmhvdC11cGRhdGUuanNvblwiKTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9nZXRGdWxsSGFzaCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IChcImQxNmIxZTRjZmE2YWZmN2FcIilcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9nbG9iYWwgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG4vKioqKioqLyBcdFx0XHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcbi8qKioqKiovIFx0XHRcdHRyeSB7XG4vKioqKioqLyBcdFx0XHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuLyoqKioqKi8gXHRcdFx0fSBjYXRjaCAoZSkge1xuLyoqKioqKi8gXHRcdFx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0fSkoKTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpXG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvbG9hZCBzY3JpcHQgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHR2YXIgaW5Qcm9ncmVzcyA9IHt9O1xuLyoqKioqKi8gXHRcdHZhciBkYXRhV2VicGFja1ByZWZpeCA9IFwiX05fRTpcIjtcbi8qKioqKiovIFx0XHQvLyBsb2FkU2NyaXB0IGZ1bmN0aW9uIHRvIGxvYWQgYSBzY3JpcHQgdmlhIHNjcmlwdCB0YWdcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmwgPSAodXJsLCBkb25lLCBrZXksIGNodW5rSWQpID0+IHtcbi8qKioqKiovIFx0XHRcdGlmKGluUHJvZ3Jlc3NbdXJsXSkgeyBpblByb2dyZXNzW3VybF0ucHVzaChkb25lKTsgcmV0dXJuOyB9XG4vKioqKioqLyBcdFx0XHR2YXIgc2NyaXB0LCBuZWVkQXR0YWNoO1xuLyoqKioqKi8gXHRcdFx0aWYoa2V5ICE9PSB1bmRlZmluZWQpIHtcbi8qKioqKiovIFx0XHRcdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcbi8qKioqKiovIFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IHNjcmlwdHMubGVuZ3RoOyBpKyspIHtcbi8qKioqKiovIFx0XHRcdFx0XHR2YXIgcyA9IHNjcmlwdHNbaV07XG4vKioqKioqLyBcdFx0XHRcdFx0aWYocy5nZXRBdHRyaWJ1dGUoXCJzcmNcIikgPT0gdXJsIHx8IHMuZ2V0QXR0cmlidXRlKFwiZGF0YS13ZWJwYWNrXCIpID09IGRhdGFXZWJwYWNrUHJlZml4ICsga2V5KSB7IHNjcmlwdCA9IHM7IGJyZWFrOyB9XG4vKioqKioqLyBcdFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdGlmKCFzY3JpcHQpIHtcbi8qKioqKiovIFx0XHRcdFx0bmVlZEF0dGFjaCA9IHRydWU7XG4vKioqKioqLyBcdFx0XHRcdHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuLyoqKioqKi8gXHRcdFxuLyoqKioqKi8gXHRcdFx0XHRzY3JpcHQuY2hhcnNldCA9ICd1dGYtOCc7XG4vKioqKioqLyBcdFx0XHRcdHNjcmlwdC50aW1lb3V0ID0gMTIwO1xuLyoqKioqKi8gXHRcdFx0XHRpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5uYykge1xuLyoqKioqKi8gXHRcdFx0XHRcdHNjcmlwdC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBfX3dlYnBhY2tfcmVxdWlyZV9fLm5jKTtcbi8qKioqKiovIFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0XHRzY3JpcHQuc2V0QXR0cmlidXRlKFwiZGF0YS13ZWJwYWNrXCIsIGRhdGFXZWJwYWNrUHJlZml4ICsga2V5KTtcbi8qKioqKiovIFx0XHRcbi8qKioqKiovIFx0XHRcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18udHUodXJsKTtcbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdGluUHJvZ3Jlc3NbdXJsXSA9IFtkb25lXTtcbi8qKioqKiovIFx0XHRcdHZhciBvblNjcmlwdENvbXBsZXRlID0gKHByZXYsIGV2ZW50KSA9PiB7XG4vKioqKioqLyBcdFx0XHRcdC8vIGF2b2lkIG1lbSBsZWFrcyBpbiBJRS5cbi8qKioqKiovIFx0XHRcdFx0c2NyaXB0Lm9uZXJyb3IgPSBzY3JpcHQub25sb2FkID0gbnVsbDtcbi8qKioqKiovIFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuLyoqKioqKi8gXHRcdFx0XHR2YXIgZG9uZUZucyA9IGluUHJvZ3Jlc3NbdXJsXTtcbi8qKioqKiovIFx0XHRcdFx0ZGVsZXRlIGluUHJvZ3Jlc3NbdXJsXTtcbi8qKioqKiovIFx0XHRcdFx0c2NyaXB0LnBhcmVudE5vZGUgJiYgc2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbi8qKioqKiovIFx0XHRcdFx0ZG9uZUZucyAmJiBkb25lRm5zLmZvckVhY2goKGZuKSA9PiAoZm4oZXZlbnQpKSk7XG4vKioqKioqLyBcdFx0XHRcdGlmKHByZXYpIHJldHVybiBwcmV2KGV2ZW50KTtcbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChvblNjcmlwdENvbXBsZXRlLmJpbmQobnVsbCwgdW5kZWZpbmVkLCB7IHR5cGU6ICd0aW1lb3V0JywgdGFyZ2V0OiBzY3JpcHQgfSksIDEyMDAwMCk7XG4vKioqKioqLyBcdFx0XHRzY3JpcHQub25lcnJvciA9IG9uU2NyaXB0Q29tcGxldGUuYmluZChudWxsLCBzY3JpcHQub25lcnJvcik7XG4vKioqKioqLyBcdFx0XHRzY3JpcHQub25sb2FkID0gb25TY3JpcHRDb21wbGV0ZS5iaW5kKG51bGwsIHNjcmlwdC5vbmxvYWQpO1xuLyoqKioqKi8gXHRcdFx0bmVlZEF0dGFjaCAmJiBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcbi8qKioqKiovIFx0XHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuLyoqKioqKi8gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9ub2RlIG1vZHVsZSBkZWNvcmF0b3IgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm5tZCA9IChtb2R1bGUpID0+IHtcbi8qKioqKiovIFx0XHRcdG1vZHVsZS5wYXRocyA9IFtdO1xuLyoqKioqKi8gXHRcdFx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuLyoqKioqKi8gXHRcdFx0cmV0dXJuIG1vZHVsZTtcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL3J1bnRpbWVJZCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uaiA9IFwid2VicGFja1wiO1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL3RydXN0ZWQgdHlwZXMgcG9saWN5ICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0dmFyIHBvbGljeTtcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnR0ID0gKCkgPT4ge1xuLyoqKioqKi8gXHRcdFx0Ly8gQ3JlYXRlIFRydXN0ZWQgVHlwZSBwb2xpY3kgaWYgVHJ1c3RlZCBUeXBlcyBhcmUgYXZhaWxhYmxlIGFuZCB0aGUgcG9saWN5IGRvZXNuJ3QgZXhpc3QgeWV0LlxuLyoqKioqKi8gXHRcdFx0aWYgKHBvbGljeSA9PT0gdW5kZWZpbmVkKSB7XG4vKioqKioqLyBcdFx0XHRcdHBvbGljeSA9IHtcbi8qKioqKiovIFx0XHRcdFx0XHRjcmVhdGVTY3JpcHQ6IChzY3JpcHQpID0+IChzY3JpcHQpLFxuLyoqKioqKi8gXHRcdFx0XHRcdGNyZWF0ZVNjcmlwdFVSTDogKHVybCkgPT4gKHVybClcbi8qKioqKiovIFx0XHRcdFx0fTtcbi8qKioqKiovIFx0XHRcdFx0aWYgKHR5cGVvZiB0cnVzdGVkVHlwZXMgIT09IFwidW5kZWZpbmVkXCIgJiYgdHJ1c3RlZFR5cGVzLmNyZWF0ZVBvbGljeSkge1xuLyoqKioqKi8gXHRcdFx0XHRcdHBvbGljeSA9IHRydXN0ZWRUeXBlcy5jcmVhdGVQb2xpY3koXCJuZXh0anMjYnVuZGxlclwiLCBwb2xpY3kpO1xuLyoqKioqKi8gXHRcdFx0XHR9XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0XHRyZXR1cm4gcG9saWN5O1xuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvdHJ1c3RlZCB0eXBlcyBzY3JpcHQgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnRzID0gKHNjcmlwdCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18udHQoKS5jcmVhdGVTY3JpcHQoc2NyaXB0KSk7XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvdHJ1c3RlZCB0eXBlcyBzY3JpcHQgdXJsICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy50dSA9ICh1cmwpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLnR0KCkuY3JlYXRlU2NyaXB0VVJMKHVybCkpO1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2hvdCBtb2R1bGUgcmVwbGFjZW1lbnQgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQgICAgdmFyIGN1cnJlbnRNb2R1bGVEYXRhID0ge30sIGluc3RhbGxlZE1vZHVsZXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmMsIGN1cnJlbnRDaGlsZE1vZHVsZSwgY3VycmVudFBhcmVudHMgPSBbXSwgcmVnaXN0ZXJlZFN0YXR1c0hhbmRsZXJzID0gW10sIGN1cnJlbnRTdGF0dXMgPSBcImlkbGVcIiwgYmxvY2tpbmdQcm9taXNlcyA9IDAsIGJsb2NraW5nUHJvbWlzZXNXYWl0aW5nID0gW10sIGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzLCBxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXM7XG4vKioqKioqLyBcdFx0ICAgIF9fd2VicGFja19yZXF1aXJlX18uaG1yRCA9IGN1cnJlbnRNb2R1bGVEYXRhO1xuLyoqKioqKi8gXHRcdCAgICBfX3dlYnBhY2tfcmVxdWlyZV9fLmkucHVzaChmdW5jdGlvbihvcHRpb25zKSB7XG4vKioqKioqLyBcdFx0ICAgICAgdmFyIG1vZHVsZSA9IG9wdGlvbnMubW9kdWxlLCByZXF1aXJlID0gY3JlYXRlUmVxdWlyZShvcHRpb25zLnJlcXVpcmUsIG9wdGlvbnMuaWQpO1xuLyoqKioqKi8gXHRcdCAgICAgIG1vZHVsZS5ob3QgPSBjcmVhdGVNb2R1bGVIb3RPYmplY3Qob3B0aW9ucy5pZCwgbW9kdWxlKTtcbi8qKioqKiovIFx0XHQgICAgICBtb2R1bGUucGFyZW50cyA9IGN1cnJlbnRQYXJlbnRzO1xuLyoqKioqKi8gXHRcdCAgICAgIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuLyoqKioqKi8gXHRcdCAgICAgIGN1cnJlbnRQYXJlbnRzID0gW107XG4vKioqKioqLyBcdFx0ICAgICAgb3B0aW9ucy5yZXF1aXJlID0gcmVxdWlyZTtcbi8qKioqKiovIFx0XHQgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgIF9fd2VicGFja19yZXF1aXJlX18uaG1yQyA9IHt9O1xuLyoqKioqKi8gXHRcdCAgICBfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckkgPSB7fTtcbi8qKioqKiovIFx0XHQgICAgZnVuY3Rpb24gY3JlYXRlUmVxdWlyZShyZXF1aXJlLCBtb2R1bGVJZCkge1xuLyoqKioqKi8gXHRcdCAgICAgIHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuLyoqKioqKi8gXHRcdCAgICAgIGlmICghbWUpXG4vKioqKioqLyBcdFx0ICAgICAgICByZXR1cm4gcmVxdWlyZTtcbi8qKioqKiovIFx0XHQgICAgICB2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XG4vKioqKioqLyBcdFx0ICAgICAgICBpZiAobWUuaG90LmFjdGl2ZSkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBpZiAoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIHZhciBwYXJlbnRzID0gaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGlmIChwYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpID09PSAtMSlcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIHBhcmVudHMucHVzaChtb2R1bGVJZCk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH0gZWxzZSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgY3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgaWYgKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPT09IC0xKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XG4vKioqKioqLyBcdFx0ICAgICAgICB9IGVsc2Uge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXF1ZXN0ICsgXCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICsgbW9kdWxlSWQpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBjdXJyZW50UGFyZW50cyA9IFtdO1xuLyoqKioqKi8gXHRcdCAgICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgICAgcmV0dXJuIHJlcXVpcmUocmVxdWVzdCk7XG4vKioqKioqLyBcdFx0ICAgICAgfSwgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24obmFtZSkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgcmV0dXJuIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgY29uZmlndXJhYmxlOiAhMCxcbi8qKioqKiovIFx0XHQgICAgICAgICAgZW51bWVyYWJsZTogITAsXG4vKioqKioqLyBcdFx0ICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgcmV0dXJuIHJlcXVpcmVbbmFtZV07XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH0sXG4vKioqKioqLyBcdFx0ICAgICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICByZXF1aXJlW25hbWVdID0gdmFsdWU7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgIH07XG4vKioqKioqLyBcdFx0ICAgICAgfTtcbi8qKioqKiovIFx0XHQgICAgICBmb3IgKHZhciBuYW1lIGluIHJlcXVpcmUpXG4vKioqKioqLyBcdFx0ICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlcXVpcmUsIG5hbWUpICYmIG5hbWUgIT09IFwiZVwiKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcihuYW1lKSk7XG4vKioqKioqLyBcdFx0ICAgICAgZm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQsIGZldGNoUHJpb3JpdHkpIHtcbi8qKioqKiovIFx0XHQgICAgICAgIHJldHVybiB0cmFja0Jsb2NraW5nUHJvbWlzZShyZXF1aXJlLmUoY2h1bmtJZCwgZmV0Y2hQcmlvcml0eSkpO1xuLyoqKioqKi8gXHRcdCAgICAgIH07XG4vKioqKioqLyBcdFx0ICAgICAgcmV0dXJuIGZuO1xuLyoqKioqKi8gXHRcdCAgICB9XG4vKioqKioqLyBcdFx0ICAgIGZ1bmN0aW9uIGNyZWF0ZU1vZHVsZUhvdE9iamVjdChtb2R1bGVJZCwgbWUpIHtcbi8qKioqKiovIFx0XHQgICAgICB2YXIgX21haW4gPSBjdXJyZW50Q2hpbGRNb2R1bGUgIT09IG1vZHVsZUlkLCBob3QgPSB7XG4vKioqKioqLyBcdFx0ICAgICAgICBfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxuLyoqKioqKi8gXHRcdCAgICAgICAgX2FjY2VwdGVkRXJyb3JIYW5kbGVyczoge30sXG4vKioqKioqLyBcdFx0ICAgICAgICBfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxuLyoqKioqKi8gXHRcdCAgICAgICAgX3NlbGZBY2NlcHRlZDogITEsXG4vKioqKioqLyBcdFx0ICAgICAgICBfc2VsZkRlY2xpbmVkOiAhMSxcbi8qKioqKiovIFx0XHQgICAgICAgIF9zZWxmSW52YWxpZGF0ZWQ6ICExLFxuLyoqKioqKi8gXHRcdCAgICAgICAgX2Rpc3Bvc2VIYW5kbGVyczogW10sXG4vKioqKioqLyBcdFx0ICAgICAgICBfbWFpbixcbi8qKioqKiovIFx0XHQgICAgICAgIF9yZXF1aXJlU2VsZjogZnVuY3Rpb24oKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGN1cnJlbnRQYXJlbnRzID0gbWUucGFyZW50cy5zbGljZSgpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBjdXJyZW50Q2hpbGRNb2R1bGUgPSBfbWFpbiA/IHZvaWQgMCA6IG1vZHVsZUlkO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcbi8qKioqKiovIFx0XHQgICAgICAgIH0sXG4vKioqKioqLyBcdFx0ICAgICAgICBhY3RpdmU6ICEwLFxuLyoqKioqKi8gXHRcdCAgICAgICAgYWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrLCBlcnJvckhhbmRsZXIpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgaWYgKGRlcCA9PT0gdm9pZCAwKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGhvdC5fc2VsZkFjY2VwdGVkID0gITA7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIilcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcbi8qKioqKiovIFx0XHQgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIiAmJiBkZXAgIT09IG51bGwpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7aSA8IGRlcC5sZW5ndGg7IGkrKykge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGhvdC5fYWNjZXB0ZWRFcnJvckhhbmRsZXJzW2RlcFtpXV0gPSBlcnJvckhhbmRsZXI7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgICAgICBlbHNlIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGhvdC5fYWNjZXB0ZWRFcnJvckhhbmRsZXJzW2RlcF0gPSBlcnJvckhhbmRsZXI7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgIH0sXG4vKioqKioqLyBcdFx0ICAgICAgICBkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgaWYgKGRlcCA9PT0gdm9pZCAwKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGhvdC5fc2VsZkRlY2xpbmVkID0gITA7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIgJiYgZGVwICE9PSBudWxsKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwO2kgPCBkZXAubGVuZ3RoOyBpKyspXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSAhMDtcbi8qKioqKiovIFx0XHQgICAgICAgICAgZWxzZVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9ICEwO1xuLyoqKioqKi8gXHRcdCAgICAgICAgfSxcbi8qKioqKiovIFx0XHQgICAgICAgIGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuLyoqKioqKi8gXHRcdCAgICAgICAgfSxcbi8qKioqKiovIFx0XHQgICAgICAgIGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbi8qKioqKiovIFx0XHQgICAgICAgIH0sXG4vKioqKioqLyBcdFx0ICAgICAgICByZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgdmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBpZiAoaWR4ID49IDApXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG4vKioqKioqLyBcdFx0ICAgICAgICB9LFxuLyoqKioqKi8gXHRcdCAgICAgICAgaW52YWxpZGF0ZTogZnVuY3Rpb24oKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIHRoaXMuX3NlbGZJbnZhbGlkYXRlZCA9ICEwO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBzd2l0Y2ggKGN1cnJlbnRTdGF0dXMpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBjYXNlIFwiaWRsZVwiOlxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgY3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMgPSBbXTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uaG1ySSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgX193ZWJwYWNrX3JlcXVpcmVfXy5obXJJW2tleV0obW9kdWxlSWQsIGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgc2V0U3RhdHVzKFwicmVhZHlcIik7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBicmVhaztcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBjYXNlIFwicmVhZHlcIjpcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uaG1ySSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgX193ZWJwYWNrX3JlcXVpcmVfXy5obXJJW2tleV0obW9kdWxlSWQsIGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgYnJlYWs7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgY2FzZSBcInByZXBhcmVcIjpcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBjYXNlIFwiY2hlY2tcIjpcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBjYXNlIFwiZGlzcG9zZVwiOlxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGNhc2UgXCJhcHBseVwiOlxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgKHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcyA9IHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcyB8fCBbXSkucHVzaChtb2R1bGVJZCk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBicmVhaztcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBkZWZhdWx0OlxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgYnJlYWs7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgIH0sXG4vKioqKioqLyBcdFx0ICAgICAgICBjaGVjazogaG90Q2hlY2ssXG4vKioqKioqLyBcdFx0ICAgICAgICBhcHBseTogaG90QXBwbHksXG4vKioqKioqLyBcdFx0ICAgICAgICBzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgaWYgKCFsKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIHJldHVybiBjdXJyZW50U3RhdHVzO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICByZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbi8qKioqKiovIFx0XHQgICAgICAgIH0sXG4vKioqKioqLyBcdFx0ICAgICAgICBhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgfSxcbi8qKioqKiovIFx0XHQgICAgICAgIHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgdmFyIGlkeCA9IHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBpZiAoaWR4ID49IDApXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgcmVnaXN0ZXJlZFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgfSxcbi8qKioqKiovIFx0XHQgICAgICAgIGRhdGE6IGN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxuLyoqKioqKi8gXHRcdCAgICAgIH07XG4vKioqKioqLyBcdFx0ICAgICAgY3VycmVudENoaWxkTW9kdWxlID0gdm9pZCAwO1xuLyoqKioqKi8gXHRcdCAgICAgIHJldHVybiBob3Q7XG4vKioqKioqLyBcdFx0ICAgIH1cbi8qKioqKiovIFx0XHQgICAgZnVuY3Rpb24gc2V0U3RhdHVzKG5ld1N0YXR1cykge1xuLyoqKioqKi8gXHRcdCAgICAgIGN1cnJlbnRTdGF0dXMgPSBuZXdTdGF0dXM7XG4vKioqKioqLyBcdFx0ICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbi8qKioqKiovIFx0XHQgICAgICBmb3IgKHZhciBpID0gMDtpIDwgcmVnaXN0ZXJlZFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxuLyoqKioqKi8gXHRcdCAgICAgICAgcmVzdWx0c1tpXSA9IHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XG4vKioqKioqLyBcdFx0ICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHJlc3VsdHMpLnRoZW4oZnVuY3Rpb24oKSB7fSk7XG4vKioqKioqLyBcdFx0ICAgIH1cbi8qKioqKiovIFx0XHQgICAgZnVuY3Rpb24gdW5ibG9jaygpIHtcbi8qKioqKiovIFx0XHQgICAgICBpZiAoLS1ibG9ja2luZ1Byb21pc2VzID09PSAwKVxuLyoqKioqKi8gXHRcdCAgICAgICAgc2V0U3RhdHVzKFwicmVhZHlcIikudGhlbihmdW5jdGlvbigpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgaWYgKGJsb2NraW5nUHJvbWlzZXMgPT09IDApIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICB2YXIgbGlzdCA9IGJsb2NraW5nUHJvbWlzZXNXYWl0aW5nO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGJsb2NraW5nUHJvbWlzZXNXYWl0aW5nID0gW107XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7aSA8IGxpc3QubGVuZ3RoOyBpKyspXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBsaXN0W2ldKCk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICB9XG4vKioqKioqLyBcdFx0ICAgIGZ1bmN0aW9uIHRyYWNrQmxvY2tpbmdQcm9taXNlKHByb21pc2UpIHtcbi8qKioqKiovIFx0XHQgICAgICBzd2l0Y2ggKGN1cnJlbnRTdGF0dXMpIHtcbi8qKioqKiovIFx0XHQgICAgICAgIGNhc2UgXCJyZWFkeVwiOlxuLyoqKioqKi8gXHRcdCAgICAgICAgICBzZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgY2FzZSBcInByZXBhcmVcIjpcbi8qKioqKiovIFx0XHQgICAgICAgICAgYmxvY2tpbmdQcm9taXNlcysrO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBwcm9taXNlLnRoZW4odW5ibG9jaywgdW5ibG9jayk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuLyoqKioqKi8gXHRcdCAgICAgICAgZGVmYXVsdDpcbi8qKioqKiovIFx0XHQgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4vKioqKioqLyBcdFx0ICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICB9XG4vKioqKioqLyBcdFx0ICAgIGZ1bmN0aW9uIHdhaXRGb3JCbG9ja2luZ1Byb21pc2VzKGZuKSB7XG4vKioqKioqLyBcdFx0ICAgICAgaWYgKGJsb2NraW5nUHJvbWlzZXMgPT09IDApXG4vKioqKioqLyBcdFx0ICAgICAgICByZXR1cm4gZm4oKTtcbi8qKioqKiovIFx0XHQgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgYmxvY2tpbmdQcm9taXNlc1dhaXRpbmcucHVzaChmdW5jdGlvbigpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgcmVzb2x2ZShmbigpKTtcbi8qKioqKiovIFx0XHQgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICB9XG4vKioqKioqLyBcdFx0ICAgIGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5T25VcGRhdGUpIHtcbi8qKioqKiovIFx0XHQgICAgICBpZiAoY3VycmVudFN0YXR1cyAhPT0gXCJpZGxlXCIpXG4vKioqKioqLyBcdFx0ICAgICAgICB0aHJvdyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xuLyoqKioqKi8gXHRcdCAgICAgIHJldHVybiBzZXRTdGF0dXMoXCJjaGVja1wiKS50aGVuKF9fd2VicGFja19yZXF1aXJlX18uaG1yTSkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcbi8qKioqKiovIFx0XHQgICAgICAgIGlmICghdXBkYXRlKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICByZXR1cm4gc2V0U3RhdHVzKGFwcGx5SW52YWxpZGF0ZWRNb2R1bGVzKCkgPyBcInJlYWR5XCIgOiBcImlkbGVcIikudGhlbihmdW5jdGlvbigpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICByZXR1cm4gbnVsbDtcbi8qKioqKiovIFx0XHQgICAgICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgICAgICByZXR1cm4gc2V0U3RhdHVzKFwicHJlcGFyZVwiKS50aGVuKGZ1bmN0aW9uKCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB2YXIgdXBkYXRlZE1vZHVsZXMgPSBbXTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgY3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMgPSBbXTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uaG1yQykucmVkdWNlKGZ1bmN0aW9uKHByb21pc2VzLCBrZXkpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckNba2V5XSh1cGRhdGUuYywgdXBkYXRlLnIsIHVwZGF0ZS5tLCBwcm9taXNlcywgY3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMsIHVwZGF0ZWRNb2R1bGVzKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICByZXR1cm4gcHJvbWlzZXM7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH0sIFtdKSkudGhlbihmdW5jdGlvbigpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICByZXR1cm4gd2FpdEZvckJsb2NraW5nUHJvbWlzZXMoZnVuY3Rpb24oKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBpZiAoYXBwbHlPblVwZGF0ZSlcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgcmV0dXJuIGludGVybmFsQXBwbHkoYXBwbHlPblVwZGF0ZSk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICByZXR1cm4gc2V0U3RhdHVzKFwicmVhZHlcIikudGhlbihmdW5jdGlvbigpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZWRNb2R1bGVzO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgIH1cbi8qKioqKiovIFx0XHQgICAgZnVuY3Rpb24gaG90QXBwbHkob3B0aW9ucykge1xuLyoqKioqKi8gXHRcdCAgICAgIGlmIChjdXJyZW50U3RhdHVzICE9PSBcInJlYWR5XCIpXG4vKioqKioqLyBcdFx0ICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgdGhyb3cgRXJyb3IoXCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXMgKHN0YXRlOiBcIiArIGN1cnJlbnRTdGF0dXMgKyBcIilcIik7XG4vKioqKioqLyBcdFx0ICAgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICByZXR1cm4gaW50ZXJuYWxBcHBseShvcHRpb25zKTtcbi8qKioqKiovIFx0XHQgICAgfVxuLyoqKioqKi8gXHRcdCAgICBmdW5jdGlvbiBpbnRlcm5hbEFwcGx5KG9wdGlvbnMpIHtcbi8qKioqKiovIFx0XHQgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbi8qKioqKiovIFx0XHQgICAgICBhcHBseUludmFsaWRhdGVkTW9kdWxlcygpO1xuLyoqKioqKi8gXHRcdCAgICAgIHZhciByZXN1bHRzID0gY3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMubWFwKGZ1bmN0aW9uKGhhbmRsZXIpIHtcbi8qKioqKiovIFx0XHQgICAgICAgIHJldHVybiBoYW5kbGVyKG9wdGlvbnMpO1xuLyoqKioqKi8gXHRcdCAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgIGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzID0gdm9pZCAwO1xuLyoqKioqKi8gXHRcdCAgICAgIHZhciBlcnJvcnMgPSByZXN1bHRzLm1hcChmdW5jdGlvbihyKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICByZXR1cm4gci5lcnJvcjtcbi8qKioqKiovIFx0XHQgICAgICB9KS5maWx0ZXIoQm9vbGVhbik7XG4vKioqKioqLyBcdFx0ICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKVxuLyoqKioqKi8gXHRcdCAgICAgICAgcmV0dXJuIHNldFN0YXR1cyhcImFib3J0XCIpLnRoZW4oZnVuY3Rpb24oKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIHRocm93IGVycm9yc1swXTtcbi8qKioqKiovIFx0XHQgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgIHZhciBkaXNwb3NlUHJvbWlzZSA9IHNldFN0YXR1cyhcImRpc3Bvc2VcIik7XG4vKioqKioqLyBcdFx0ICAgICAgcmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uKHJlc3VsdCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgaWYgKHJlc3VsdC5kaXNwb3NlKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICByZXN1bHQuZGlzcG9zZSgpO1xuLyoqKioqKi8gXHRcdCAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgIHZhciBhcHBseVByb21pc2UgPSBzZXRTdGF0dXMoXCJhcHBseVwiKSwgZXJyb3IsIHJlcG9ydEVycm9yID0gZnVuY3Rpb24oZXJyKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICBpZiAoIWVycm9yKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICBlcnJvciA9IGVycjtcbi8qKioqKiovIFx0XHQgICAgICB9LCBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcbi8qKioqKiovIFx0XHQgICAgICByZXN1bHRzLmZvckVhY2goZnVuY3Rpb24ocmVzdWx0KSB7XG4vKioqKioqLyBcdFx0ICAgICAgICBpZiAocmVzdWx0LmFwcGx5KSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIHZhciBtb2R1bGVzID0gcmVzdWx0LmFwcGx5KHJlcG9ydEVycm9yKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgaWYgKG1vZHVsZXMpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7aSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBvdXRkYXRlZE1vZHVsZXMucHVzaChtb2R1bGVzW2ldKTtcbi8qKioqKiovIFx0XHQgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW2Rpc3Bvc2VQcm9taXNlLCBhcHBseVByb21pc2VdKS50aGVuKGZ1bmN0aW9uKCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgaWYgKGVycm9yKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICByZXR1cm4gc2V0U3RhdHVzKFwiZmFpbFwiKS50aGVuKGZ1bmN0aW9uKCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIHRocm93IGVycm9yO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICAgIGlmIChxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXMpXG4vKioqKioqLyBcdFx0ICAgICAgICAgIHJldHVybiBpbnRlcm5hbEFwcGx5KG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24obGlzdCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIG91dGRhdGVkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBpZiAobGlzdC5pbmRleE9mKG1vZHVsZUlkKSA8IDApXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIGxpc3QucHVzaChtb2R1bGVJZCk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgcmV0dXJuIGxpc3Q7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgcmV0dXJuIHNldFN0YXR1cyhcImlkbGVcIikudGhlbihmdW5jdGlvbigpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgcmV0dXJuIG91dGRhdGVkTW9kdWxlcztcbi8qKioqKiovIFx0XHQgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICB9XG4vKioqKioqLyBcdFx0ICAgIGZ1bmN0aW9uIGFwcGx5SW52YWxpZGF0ZWRNb2R1bGVzKCkge1xuLyoqKioqKi8gXHRcdCAgICAgIGlmIChxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXMpIHtcbi8qKioqKiovIFx0XHQgICAgICAgIGlmICghY3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMpXG4vKioqKioqLyBcdFx0ICAgICAgICAgIGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzID0gW107XG4vKioqKioqLyBcdFx0ICAgICAgICBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckkpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgX193ZWJwYWNrX3JlcXVpcmVfXy5obXJJW2tleV0obW9kdWxlSWQsIGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICAgIHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcyA9IHZvaWQgMDtcbi8qKioqKiovIFx0XHQgICAgICAgIHJldHVybiAhMDtcbi8qKioqKiovIFx0XHQgICAgICB9XG4vKioqKioqLyBcdFx0ICAgIH1cbi8qKioqKiovIFx0XHQgIFxuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGggKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9fbmV4dC9cIjtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9yZWFjdCByZWZyZXNoICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0aWYgKF9fd2VicGFja19yZXF1aXJlX18uaSkge1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uaS5wdXNoKChvcHRpb25zKSA9PiB7XG4vKioqKioqLyBcdFx0XHRjb25zdCBvcmlnaW5hbEZhY3RvcnkgPSBvcHRpb25zLmZhY3Rvcnk7XG4vKioqKioqLyBcdFx0XHRvcHRpb25zLmZhY3RvcnkgPSAobW9kdWxlT2JqZWN0LCBtb2R1bGVFeHBvcnRzLCB3ZWJwYWNrUmVxdWlyZSkgPT4ge1xuLyoqKioqKi8gXHRcdFx0XHRjb25zdCBoYXNSZWZyZXNoID0gdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgJiYgISFzZWxmLiRSZWZyZXNoSW50ZXJjZXB0TW9kdWxlRXhlY3V0aW9uJDtcbi8qKioqKiovIFx0XHRcdFx0Y29uc3QgY2xlYW51cCA9IGhhc1JlZnJlc2ggPyBzZWxmLiRSZWZyZXNoSW50ZXJjZXB0TW9kdWxlRXhlY3V0aW9uJChtb2R1bGVPYmplY3QuaWQpIDogKCkgPT4ge307XG4vKioqKioqLyBcdFx0XHRcdHRyeSB7XG4vKioqKioqLyBcdFx0XHRcdFx0b3JpZ2luYWxGYWN0b3J5LmNhbGwodGhpcywgbW9kdWxlT2JqZWN0LCBtb2R1bGVFeHBvcnRzLCB3ZWJwYWNrUmVxdWlyZSk7XG4vKioqKioqLyBcdFx0XHRcdH0gZmluYWxseSB7XG4vKioqKioqLyBcdFx0XHRcdFx0Y2xlYW51cCgpO1xuLyoqKioqKi8gXHRcdFx0XHR9XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0fSlcbi8qKioqKiovIFx0XHR9XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvY29tcGF0ICovXG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Ly8gbm9vcCBmbnMgdG8gcHJldmVudCBydW50aW1lIGVycm9ycyBkdXJpbmcgaW5pdGlhbGl6YXRpb25cbi8qKioqKiovIFx0aWYgKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiKSB7XG4vKioqKioqLyBcdFx0c2VsZi4kUmVmcmVzaFJlZyQgPSBmdW5jdGlvbiAoKSB7fTtcbi8qKioqKiovIFx0XHRzZWxmLiRSZWZyZXNoU2lnJCA9IGZ1bmN0aW9uICgpIHtcbi8qKioqKiovIFx0XHRcdHJldHVybiBmdW5jdGlvbiAodHlwZSkge1xuLyoqKioqKi8gXHRcdFx0XHRyZXR1cm4gdHlwZTtcbi8qKioqKiovIFx0XHRcdH07XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fVxuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2NzcyBsb2FkaW5nICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0dmFyIGNyZWF0ZVN0eWxlc2hlZXQgPSAoY2h1bmtJZCwgZnVsbGhyZWYsIHJlc29sdmUsIHJlamVjdCkgPT4ge1xuLyoqKioqKi8gXHRcdFx0dmFyIGxpbmtUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcbi8qKioqKiovIFx0XHRcbi8qKioqKiovIFx0XHRcdGxpbmtUYWcucmVsID0gXCJzdHlsZXNoZWV0XCI7XG4vKioqKioqLyBcdFx0XHRsaW5rVGFnLnR5cGUgPSBcInRleHQvY3NzXCI7XG4vKioqKioqLyBcdFx0XHR2YXIgb25MaW5rQ29tcGxldGUgPSAoZXZlbnQpID0+IHtcbi8qKioqKiovIFx0XHRcdFx0Ly8gYXZvaWQgbWVtIGxlYWtzLlxuLyoqKioqKi8gXHRcdFx0XHRsaW5rVGFnLm9uZXJyb3IgPSBsaW5rVGFnLm9ubG9hZCA9IG51bGw7XG4vKioqKioqLyBcdFx0XHRcdGlmIChldmVudC50eXBlID09PSAnbG9hZCcpIHtcbi8qKioqKiovIFx0XHRcdFx0XHRyZXNvbHZlKCk7XG4vKioqKioqLyBcdFx0XHRcdH0gZWxzZSB7XG4vKioqKioqLyBcdFx0XHRcdFx0dmFyIGVycm9yVHlwZSA9IGV2ZW50ICYmIChldmVudC50eXBlID09PSAnbG9hZCcgPyAnbWlzc2luZycgOiBldmVudC50eXBlKTtcbi8qKioqKiovIFx0XHRcdFx0XHR2YXIgcmVhbEhyZWYgPSBldmVudCAmJiBldmVudC50YXJnZXQgJiYgZXZlbnQudGFyZ2V0LmhyZWYgfHwgZnVsbGhyZWY7XG4vKioqKioqLyBcdFx0XHRcdFx0dmFyIGVyciA9IG5ldyBFcnJvcihcIkxvYWRpbmcgQ1NTIGNodW5rIFwiICsgY2h1bmtJZCArIFwiIGZhaWxlZC5cXG4oXCIgKyByZWFsSHJlZiArIFwiKVwiKTtcbi8qKioqKiovIFx0XHRcdFx0XHRlcnIuY29kZSA9IFwiQ1NTX0NIVU5LX0xPQURfRkFJTEVEXCI7XG4vKioqKioqLyBcdFx0XHRcdFx0ZXJyLnR5cGUgPSBlcnJvclR5cGU7XG4vKioqKioqLyBcdFx0XHRcdFx0ZXJyLnJlcXVlc3QgPSByZWFsSHJlZjtcbi8qKioqKiovIFx0XHRcdFx0XHRsaW5rVGFnLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobGlua1RhZylcbi8qKioqKiovIFx0XHRcdFx0XHRyZWplY3QoZXJyKTtcbi8qKioqKiovIFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0bGlua1RhZy5vbmVycm9yID0gbGlua1RhZy5vbmxvYWQgPSBvbkxpbmtDb21wbGV0ZTtcbi8qKioqKiovIFx0XHRcdGxpbmtUYWcuaHJlZiA9IGZ1bGxocmVmO1xuLyoqKioqKi8gXHRcdFxuLyoqKioqKi8gXHRcdFx0KGZ1bmN0aW9uKGxpbmtUYWcpIHtcbi8qKioqKiovIFx0XHRcdCAgICAgICAgICBpZiAodHlwZW9mIF9OX0VfU1RZTEVfTE9BRCA9PT0gXCJmdW5jdGlvblwiKSB7XG4vKioqKioqLyBcdFx0XHQgICAgICAgICAgICBjb25zdCB7IGhyZWYsIG9ubG9hZCwgb25lcnJvciB9ID0gbGlua1RhZztcbi8qKioqKiovIFx0XHRcdCAgICAgICAgICAgIF9OX0VfU1RZTEVfTE9BRChocmVmLmluZGV4T2Yod2luZG93LmxvY2F0aW9uLm9yaWdpbikgPT09IDAgPyBuZXcgVVJMKGhyZWYpLnBhdGhuYW1lIDogaHJlZikudGhlbigoKSA9PiBvbmxvYWQgPT0gbnVsbCA/IHZvaWQgMCA6IG9ubG9hZC5jYWxsKGxpbmtUYWcsIHtcbi8qKioqKiovIFx0XHRcdCAgICAgICAgICAgICAgdHlwZTogXCJsb2FkXCJcbi8qKioqKiovIFx0XHRcdCAgICAgICAgICAgIH0pLCAoKSA9PiBvbmVycm9yID09IG51bGwgPyB2b2lkIDAgOiBvbmVycm9yLmNhbGwobGlua1RhZywge30pKTtcbi8qKioqKiovIFx0XHRcdCAgICAgICAgICB9IGVsc2Vcbi8qKioqKiovIFx0XHRcdCAgICAgICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobGlua1RhZyk7XG4vKioqKioqLyBcdFx0XHQgICAgICAgIH0pKGxpbmtUYWcpXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gbGlua1RhZztcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHRcdHZhciBmaW5kU3R5bGVzaGVldCA9IChocmVmLCBmdWxsaHJlZikgPT4ge1xuLyoqKioqKi8gXHRcdFx0dmFyIGV4aXN0aW5nTGlua1RhZ3MgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImxpbmtcIik7XG4vKioqKioqLyBcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZXhpc3RpbmdMaW5rVGFncy5sZW5ndGg7IGkrKykge1xuLyoqKioqKi8gXHRcdFx0XHR2YXIgdGFnID0gZXhpc3RpbmdMaW5rVGFnc1tpXTtcbi8qKioqKiovIFx0XHRcdFx0dmFyIGRhdGFIcmVmID0gdGFnLmdldEF0dHJpYnV0ZShcImRhdGEtaHJlZlwiKSB8fCB0YWcuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKTtcbi8qKioqKiovIFx0XHRcdFx0aWYodGFnLnJlbCA9PT0gXCJzdHlsZXNoZWV0XCIgJiYgKGRhdGFIcmVmID09PSBocmVmIHx8IGRhdGFIcmVmID09PSBmdWxsaHJlZikpIHJldHVybiB0YWc7XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0XHR2YXIgZXhpc3RpbmdTdHlsZVRhZ3MgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInN0eWxlXCIpO1xuLyoqKioqKi8gXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGV4aXN0aW5nU3R5bGVUYWdzLmxlbmd0aDsgaSsrKSB7XG4vKioqKioqLyBcdFx0XHRcdHZhciB0YWcgPSBleGlzdGluZ1N0eWxlVGFnc1tpXTtcbi8qKioqKiovIFx0XHRcdFx0dmFyIGRhdGFIcmVmID0gdGFnLmdldEF0dHJpYnV0ZShcImRhdGEtaHJlZlwiKTtcbi8qKioqKiovIFx0XHRcdFx0aWYoZGF0YUhyZWYgPT09IGhyZWYgfHwgZGF0YUhyZWYgPT09IGZ1bGxocmVmKSByZXR1cm4gdGFnO1xuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdFx0dmFyIGxvYWRTdHlsZXNoZWV0ID0gKGNodW5rSWQpID0+IHtcbi8qKioqKiovIFx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4vKioqKioqLyBcdFx0XHRcdHZhciBocmVmID0gX193ZWJwYWNrX3JlcXVpcmVfXy5taW5pQ3NzRihjaHVua0lkKTtcbi8qKioqKiovIFx0XHRcdFx0dmFyIGZ1bGxocmVmID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgaHJlZjtcbi8qKioqKiovIFx0XHRcdFx0aWYoZmluZFN0eWxlc2hlZXQoaHJlZiwgZnVsbGhyZWYpKSByZXR1cm4gcmVzb2x2ZSgpO1xuLyoqKioqKi8gXHRcdFx0XHRjcmVhdGVTdHlsZXNoZWV0KGNodW5rSWQsIGZ1bGxocmVmLCByZXNvbHZlLCByZWplY3QpO1xuLyoqKioqKi8gXHRcdFx0fSk7XG4vKioqKioqLyBcdFx0fVxuLyoqKioqKi8gXHRcdC8vIG5vIGNodW5rIGxvYWRpbmdcbi8qKioqKiovIFx0XHRcbi8qKioqKiovIFx0XHR2YXIgb2xkVGFncyA9IFtdO1xuLyoqKioqKi8gXHRcdHZhciBuZXdUYWdzID0gW107XG4vKioqKioqLyBcdFx0dmFyIGFwcGx5SGFuZGxlciA9IChvcHRpb25zKSA9PiB7XG4vKioqKioqLyBcdFx0XHRyZXR1cm4geyBkaXNwb3NlOiAoKSA9PiB7XG4vKioqKioqLyBcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBvbGRUYWdzLmxlbmd0aDsgaSsrKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0dmFyIG9sZFRhZyA9IG9sZFRhZ3NbaV07XG4vKioqKioqLyBcdFx0XHRcdFx0aWYob2xkVGFnLnBhcmVudE5vZGUpIG9sZFRhZy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9sZFRhZyk7XG4vKioqKioqLyBcdFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdFx0b2xkVGFncy5sZW5ndGggPSAwO1xuLyoqKioqKi8gXHRcdFx0fSwgYXBwbHk6ICgpID0+IHtcbi8qKioqKiovIFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IG5ld1RhZ3MubGVuZ3RoOyBpKyspIG5ld1RhZ3NbaV0ucmVsID0gXCJzdHlsZXNoZWV0XCI7XG4vKioqKioqLyBcdFx0XHRcdG5ld1RhZ3MubGVuZ3RoID0gMDtcbi8qKioqKiovIFx0XHRcdH0gfTtcbi8qKioqKiovIFx0XHR9XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5obXJDLm1pbmlDc3MgPSAoY2h1bmtJZHMsIHJlbW92ZWRDaHVua3MsIHJlbW92ZWRNb2R1bGVzLCBwcm9taXNlcywgYXBwbHlIYW5kbGVycywgdXBkYXRlZE1vZHVsZXNMaXN0KSA9PiB7XG4vKioqKioqLyBcdFx0XHRhcHBseUhhbmRsZXJzLnB1c2goYXBwbHlIYW5kbGVyKTtcbi8qKioqKiovIFx0XHRcdGNodW5rSWRzLmZvckVhY2goKGNodW5rSWQpID0+IHtcbi8qKioqKiovIFx0XHRcdFx0dmFyIGhyZWYgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLm1pbmlDc3NGKGNodW5rSWQpO1xuLyoqKioqKi8gXHRcdFx0XHR2YXIgZnVsbGhyZWYgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBocmVmO1xuLyoqKioqKi8gXHRcdFx0XHR2YXIgb2xkVGFnID0gZmluZFN0eWxlc2hlZXQoaHJlZiwgZnVsbGhyZWYpO1xuLyoqKioqKi8gXHRcdFx0XHRpZighb2xkVGFnKSByZXR1cm47XG4vKioqKioqLyBcdFx0XHRcdHByb21pc2VzLnB1c2gobmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuLyoqKioqKi8gXHRcdFx0XHRcdHZhciB0YWcgPSBjcmVhdGVTdHlsZXNoZWV0KGNodW5rSWQsIGZ1bGxocmVmLCAoKSA9PiB7XG4vKioqKioqLyBcdFx0XHRcdFx0XHR0YWcuYXMgPSBcInN0eWxlXCI7XG4vKioqKioqLyBcdFx0XHRcdFx0XHR0YWcucmVsID0gXCJwcmVsb2FkXCI7XG4vKioqKioqLyBcdFx0XHRcdFx0XHRyZXNvbHZlKCk7XG4vKioqKioqLyBcdFx0XHRcdFx0fSwgcmVqZWN0KTtcbi8qKioqKiovIFx0XHRcdFx0XHRvbGRUYWdzLnB1c2gob2xkVGFnKTtcbi8qKioqKiovIFx0XHRcdFx0XHRuZXdUYWdzLnB1c2godGFnKTtcbi8qKioqKiovIFx0XHRcdFx0fSkpO1xuLyoqKioqKi8gXHRcdFx0fSk7XG4vKioqKioqLyBcdFx0fVxuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmcgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBubyBiYXNlVVJJXG4vKioqKioqLyBcdFx0XG4vKioqKioqLyBcdFx0Ly8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8qKioqKiovIFx0XHQvLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8qKioqKiovIFx0XHQvLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbi8qKioqKiovIFx0XHR2YXIgaW5zdGFsbGVkQ2h1bmtzID0gX193ZWJwYWNrX3JlcXVpcmVfXy5obXJTX2pzb25wID0gX193ZWJwYWNrX3JlcXVpcmVfXy5obXJTX2pzb25wIHx8IHtcbi8qKioqKiovIFx0XHRcdFwid2VicGFja1wiOiAwXG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0XHRcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmYuaiA9IChjaHVua0lkLCBwcm9taXNlcykgPT4ge1xuLyoqKioqKi8gXHRcdFx0XHQvLyBKU09OUCBjaHVuayBsb2FkaW5nIGZvciBqYXZhc2NyaXB0XG4vKioqKioqLyBcdFx0XHRcdHZhciBpbnN0YWxsZWRDaHVua0RhdGEgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSA/IGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA6IHVuZGVmaW5lZDtcbi8qKioqKiovIFx0XHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtEYXRhICE9PSAwKSB7IC8vIDAgbWVhbnMgXCJhbHJlYWR5IGluc3RhbGxlZFwiLlxuLyoqKioqKi8gXHRcdFxuLyoqKioqKi8gXHRcdFx0XHRcdC8vIGEgUHJvbWlzZSBtZWFucyBcImN1cnJlbnRseSBsb2FkaW5nXCIuXG4vKioqKioqLyBcdFx0XHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtEYXRhKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0XHRwcm9taXNlcy5wdXNoKGluc3RhbGxlZENodW5rRGF0YVsyXSk7XG4vKioqKioqLyBcdFx0XHRcdFx0fSBlbHNlIHtcbi8qKioqKiovIFx0XHRcdFx0XHRcdGlmKFwid2VicGFja1wiICE9IGNodW5rSWQpIHtcbi8qKioqKiovIFx0XHRcdFx0XHRcdFx0Ly8gc2V0dXAgUHJvbWlzZSBpbiBjaHVuayBjYWNoZVxuLyoqKioqKi8gXHRcdFx0XHRcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IChpbnN0YWxsZWRDaHVua0RhdGEgPSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSBbcmVzb2x2ZSwgcmVqZWN0XSkpO1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0XHRwcm9taXNlcy5wdXNoKGluc3RhbGxlZENodW5rRGF0YVsyXSA9IHByb21pc2UpO1xuLyoqKioqKi8gXHRcdFxuLyoqKioqKi8gXHRcdFx0XHRcdFx0XHQvLyBzdGFydCBjaHVuayBsb2FkaW5nXG4vKioqKioqLyBcdFx0XHRcdFx0XHRcdHZhciB1cmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBfX3dlYnBhY2tfcmVxdWlyZV9fLnUoY2h1bmtJZCk7XG4vKioqKioqLyBcdFx0XHRcdFx0XHRcdC8vIGNyZWF0ZSBlcnJvciBiZWZvcmUgc3RhY2sgdW53b3VuZCB0byBnZXQgdXNlZnVsIHN0YWNrdHJhY2UgbGF0ZXJcbi8qKioqKiovIFx0XHRcdFx0XHRcdFx0dmFyIGVycm9yID0gbmV3IEVycm9yKCk7XG4vKioqKioqLyBcdFx0XHRcdFx0XHRcdHZhciBsb2FkaW5nRW5kZWQgPSAoZXZlbnQpID0+IHtcbi8qKioqKiovIFx0XHRcdFx0XHRcdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSkge1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0XHRcdFx0aW5zdGFsbGVkQ2h1bmtEYXRhID0gaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0XHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtEYXRhICE9PSAwKSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSB1bmRlZmluZWQ7XG4vKioqKioqLyBcdFx0XHRcdFx0XHRcdFx0XHRpZihpbnN0YWxsZWRDaHVua0RhdGEpIHtcbi8qKioqKiovIFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGVycm9yVHlwZSA9IGV2ZW50ICYmIChldmVudC50eXBlID09PSAnbG9hZCcgPyAnbWlzc2luZycgOiBldmVudC50eXBlKTtcbi8qKioqKiovIFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIHJlYWxTcmMgPSBldmVudCAmJiBldmVudC50YXJnZXQgJiYgZXZlbnQudGFyZ2V0LnNyYztcbi8qKioqKiovIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3IubWVzc2FnZSA9ICdMb2FkaW5nIGNodW5rICcgKyBjaHVua0lkICsgJyBmYWlsZWQuXFxuKCcgKyBlcnJvclR5cGUgKyAnOiAnICsgcmVhbFNyYyArICcpJztcbi8qKioqKiovIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3IubmFtZSA9ICdDaHVua0xvYWRFcnJvcic7XG4vKioqKioqLyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yLnR5cGUgPSBlcnJvclR5cGU7XG4vKioqKioqLyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yLnJlcXVlc3QgPSByZWFsU3JjO1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0XHRcdFx0XHRpbnN0YWxsZWRDaHVua0RhdGFbMV0oZXJyb3IpO1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0XHRcdFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdFx0XHRcdFx0fTtcbi8qKioqKiovIFx0XHRcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5sKHVybCwgbG9hZGluZ0VuZGVkLCBcImNodW5rLVwiICsgY2h1bmtJZCwgY2h1bmtJZCk7XG4vKioqKioqLyBcdFx0XHRcdFx0XHR9IGVsc2UgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbi8qKioqKiovIFx0XHRcdFx0XHR9XG4vKioqKioqLyBcdFx0XHRcdH1cbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHRcdFxuLyoqKioqKi8gXHRcdC8vIG5vIHByZWZldGNoaW5nXG4vKioqKioqLyBcdFx0XG4vKioqKioqLyBcdFx0Ly8gbm8gcHJlbG9hZGVkXG4vKioqKioqLyBcdFx0XG4vKioqKioqLyBcdFx0dmFyIGN1cnJlbnRVcGRhdGVkTW9kdWxlc0xpc3Q7XG4vKioqKioqLyBcdFx0dmFyIHdhaXRpbmdVcGRhdGVSZXNvbHZlcyA9IHt9O1xuLyoqKioqKi8gXHRcdGZ1bmN0aW9uIGxvYWRVcGRhdGVDaHVuayhjaHVua0lkLCB1cGRhdGVkTW9kdWxlc0xpc3QpIHtcbi8qKioqKiovIFx0XHRcdGN1cnJlbnRVcGRhdGVkTW9kdWxlc0xpc3QgPSB1cGRhdGVkTW9kdWxlc0xpc3Q7XG4vKioqKioqLyBcdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuLyoqKioqKi8gXHRcdFx0XHR3YWl0aW5nVXBkYXRlUmVzb2x2ZXNbY2h1bmtJZF0gPSByZXNvbHZlO1xuLyoqKioqKi8gXHRcdFx0XHQvLyBzdGFydCB1cGRhdGUgY2h1bmsgbG9hZGluZ1xuLyoqKioqKi8gXHRcdFx0XHR2YXIgdXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgX193ZWJwYWNrX3JlcXVpcmVfXy5odShjaHVua0lkKTtcbi8qKioqKiovIFx0XHRcdFx0Ly8gY3JlYXRlIGVycm9yIGJlZm9yZSBzdGFjayB1bndvdW5kIHRvIGdldCB1c2VmdWwgc3RhY2t0cmFjZSBsYXRlclxuLyoqKioqKi8gXHRcdFx0XHR2YXIgZXJyb3IgPSBuZXcgRXJyb3IoKTtcbi8qKioqKiovIFx0XHRcdFx0dmFyIGxvYWRpbmdFbmRlZCA9IChldmVudCkgPT4ge1xuLyoqKioqKi8gXHRcdFx0XHRcdGlmKHdhaXRpbmdVcGRhdGVSZXNvbHZlc1tjaHVua0lkXSkge1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0d2FpdGluZ1VwZGF0ZVJlc29sdmVzW2NodW5rSWRdID0gdW5kZWZpbmVkXG4vKioqKioqLyBcdFx0XHRcdFx0XHR2YXIgZXJyb3JUeXBlID0gZXZlbnQgJiYgKGV2ZW50LnR5cGUgPT09ICdsb2FkJyA/ICdtaXNzaW5nJyA6IGV2ZW50LnR5cGUpO1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0dmFyIHJlYWxTcmMgPSBldmVudCAmJiBldmVudC50YXJnZXQgJiYgZXZlbnQudGFyZ2V0LnNyYztcbi8qKioqKiovIFx0XHRcdFx0XHRcdGVycm9yLm1lc3NhZ2UgPSAnTG9hZGluZyBob3QgdXBkYXRlIGNodW5rICcgKyBjaHVua0lkICsgJyBmYWlsZWQuXFxuKCcgKyBlcnJvclR5cGUgKyAnOiAnICsgcmVhbFNyYyArICcpJztcbi8qKioqKiovIFx0XHRcdFx0XHRcdGVycm9yLm5hbWUgPSAnQ2h1bmtMb2FkRXJyb3InO1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0ZXJyb3IudHlwZSA9IGVycm9yVHlwZTtcbi8qKioqKiovIFx0XHRcdFx0XHRcdGVycm9yLnJlcXVlc3QgPSByZWFsU3JjO1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0cmVqZWN0KGVycm9yKTtcbi8qKioqKiovIFx0XHRcdFx0XHR9XG4vKioqKioqLyBcdFx0XHRcdH07XG4vKioqKioqLyBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubCh1cmwsIGxvYWRpbmdFbmRlZCk7XG4vKioqKioqLyBcdFx0XHR9KTtcbi8qKioqKiovIFx0XHR9XG4vKioqKioqLyBcdFx0XG4vKioqKioqLyBcdFx0c2VsZltcIndlYnBhY2tIb3RVcGRhdGVfTl9FXCJdID0gKGNodW5rSWQsIG1vcmVNb2R1bGVzLCBydW50aW1lKSA9PiB7XG4vKioqKioqLyBcdFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4vKioqKioqLyBcdFx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0Y3VycmVudFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4vKioqKioqLyBcdFx0XHRcdFx0aWYoY3VycmVudFVwZGF0ZWRNb2R1bGVzTGlzdCkgY3VycmVudFVwZGF0ZWRNb2R1bGVzTGlzdC5wdXNoKG1vZHVsZUlkKTtcbi8qKioqKiovIFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0aWYocnVudGltZSkgY3VycmVudFVwZGF0ZVJ1bnRpbWUucHVzaChydW50aW1lKTtcbi8qKioqKiovIFx0XHRcdGlmKHdhaXRpbmdVcGRhdGVSZXNvbHZlc1tjaHVua0lkXSkge1xuLyoqKioqKi8gXHRcdFx0XHR3YWl0aW5nVXBkYXRlUmVzb2x2ZXNbY2h1bmtJZF0oKTtcbi8qKioqKiovIFx0XHRcdFx0d2FpdGluZ1VwZGF0ZVJlc29sdmVzW2NodW5rSWRdID0gdW5kZWZpbmVkO1xuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdFx0XG4vKioqKioqLyBcdFx0ICAgIHZhciBjdXJyZW50VXBkYXRlQ2h1bmtzLCBjdXJyZW50VXBkYXRlLCBjdXJyZW50VXBkYXRlUmVtb3ZlZENodW5rcywgY3VycmVudFVwZGF0ZVJ1bnRpbWU7XG4vKioqKioqLyBcdFx0ICAgIGZ1bmN0aW9uIGFwcGx5SGFuZGxlcihvcHRpb25zKSB7XG4vKioqKioqLyBcdFx0ICAgICAgaWYgKF9fd2VicGFja19yZXF1aXJlX18uZilcbi8qKioqKiovIFx0XHQgICAgICAgIGRlbGV0ZSBfX3dlYnBhY2tfcmVxdWlyZV9fLmYuanNvbnBIbXI7XG4vKioqKioqLyBcdFx0ICAgICAgY3VycmVudFVwZGF0ZUNodW5rcyA9IHZvaWQgMDtcbi8qKioqKiovIFx0XHQgICAgICBmdW5jdGlvbiBnZXRBZmZlY3RlZE1vZHVsZUVmZmVjdHModXBkYXRlTW9kdWxlSWQpIHtcbi8qKioqKiovIFx0XHQgICAgICAgIHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdLCBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9LCBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5tYXAoZnVuY3Rpb24oaWQpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgcmV0dXJuIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBjaGFpbjogW2lkXSxcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBpZFxuLyoqKioqKi8gXHRcdCAgICAgICAgICB9O1xuLyoqKioqKi8gXHRcdCAgICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgICAgICB3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB2YXIgcXVldWVJdGVtID0gcXVldWUucG9wKCksIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkLCBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbiwgbW9kdWxlID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jW21vZHVsZUlkXTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgaWYgKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkICYmICFtb2R1bGUuaG90Ll9zZWxmSW52YWxpZGF0ZWQpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgY29udGludWU7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGlmIChtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgcmV0dXJuIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgY2hhaW4sXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBtb2R1bGVJZFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIH07XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGlmIChtb2R1bGUuaG90Ll9tYWluKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIHJldHVybiB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICB0eXBlOiBcInVuYWNjZXB0ZWRcIixcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGNoYWluLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgbW9kdWxlSWRcbi8qKioqKiovIFx0XHQgICAgICAgICAgICB9O1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBmb3IgKHZhciBpID0gMDtpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICB2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXSwgcGFyZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jW3BhcmVudElkXTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBpZiAoIXBhcmVudClcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGNvbnRpbnVlO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGlmIChwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICByZXR1cm4ge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICB0eXBlOiBcImRlY2xpbmVkXCIsXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBwYXJlbnRJZFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgfTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBpZiAob3V0ZGF0ZWRNb2R1bGVzLmluZGV4T2YocGFyZW50SWQpICE9PSAtMSlcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGNvbnRpbnVlO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGlmIChwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBjb250aW51ZTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgcXVldWUucHVzaCh7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgaWQ6IHBhcmVudElkXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgIHJldHVybiB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIHR5cGU6IFwiYWNjZXB0ZWRcIixcbi8qKioqKiovIFx0XHQgICAgICAgICAgbW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICBvdXRkYXRlZE1vZHVsZXMsXG4vKioqKioqLyBcdFx0ICAgICAgICAgIG91dGRhdGVkRGVwZW5kZW5jaWVzXG4vKioqKioqLyBcdFx0ICAgICAgICB9O1xuLyoqKioqKi8gXHRcdCAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICBmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICBmb3IgKHZhciBpID0gMDtpIDwgYi5sZW5ndGg7IGkrKykge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB2YXIgaXRlbSA9IGJbaV07XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGlmIChhLmluZGV4T2YoaXRlbSkgPT09IC0xKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGEucHVzaChpdGVtKTtcbi8qKioqKiovIFx0XHQgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgdmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge30sIG91dGRhdGVkTW9kdWxlcyA9IFtdLCBhcHBsaWVkVXBkYXRlID0ge30sIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZShtb2R1bGUpIHtcbi8qKioqKiovIFx0XHQgICAgICAgIGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIG1vZHVsZS5pZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIik7XG4vKioqKioqLyBcdFx0ICAgICAgfTtcbi8qKioqKiovIFx0XHQgICAgICBmb3IgKHZhciBtb2R1bGVJZCBpbiBjdXJyZW50VXBkYXRlKVxuLyoqKioqKi8gXHRcdCAgICAgICAgaWYgKF9fd2VicGFja19yZXF1aXJlX18ubyhjdXJyZW50VXBkYXRlLCBtb2R1bGVJZCkpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgdmFyIG5ld01vZHVsZUZhY3RvcnkgPSBjdXJyZW50VXBkYXRlW21vZHVsZUlkXSwgcmVzdWx0ID0gbmV3TW9kdWxlRmFjdG9yeSA/IGdldEFmZmVjdGVkTW9kdWxlRWZmZWN0cyhtb2R1bGVJZCkgOiB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgdHlwZTogXCJkaXNwb3NlZFwiLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIG1vZHVsZUlkXG4vKioqKioqLyBcdFx0ICAgICAgICAgIH0sIGFib3J0RXJyb3IgPSAhMSwgZG9BcHBseSA9ICExLCBkb0Rpc3Bvc2UgPSAhMSwgY2hhaW5JbmZvID0gXCJcIjtcbi8qKioqKiovIFx0XHQgICAgICAgICAgaWYgKHJlc3VsdC5jaGFpbilcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBjaGFpbkluZm8gPSBgXG4vKioqKioqLyBcdFx0VXBkYXRlIHByb3BhZ2F0aW9uOiBgICsgcmVzdWx0LmNoYWluLmpvaW4oXCIgLT4gXCIpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBzd2l0Y2ggKHJlc3VsdC50eXBlKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgY2FzZSBcInNlbGYtZGVjbGluZWRcIjpcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGlmIChvcHRpb25zLm9uRGVjbGluZWQpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBhYm9ydEVycm9yID0gRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArIHJlc3VsdC5tb2R1bGVJZCArIGNoYWluSW5mbyk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBicmVhaztcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBjYXNlIFwiZGVjbGluZWRcIjpcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGlmIChvcHRpb25zLm9uRGVjbGluZWQpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBhYm9ydEVycm9yID0gRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIiBpbiBcIiArIHJlc3VsdC5wYXJlbnRJZCArIGNoYWluSW5mbyk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBicmVhaztcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBjYXNlIFwidW5hY2NlcHRlZFwiOlxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgaWYgKG9wdGlvbnMub25VbmFjY2VwdGVkKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIGFib3J0RXJyb3IgPSBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm8pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgYnJlYWs7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgY2FzZSBcImFjY2VwdGVkXCI6XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBpZiAob3B0aW9ucy5vbkFjY2VwdGVkKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBvcHRpb25zLm9uQWNjZXB0ZWQocmVzdWx0KTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGRvQXBwbHkgPSAhMDtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGJyZWFrO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGNhc2UgXCJkaXNwb3NlZFwiOlxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgaWYgKG9wdGlvbnMub25EaXNwb3NlZClcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgb3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBkb0Rpc3Bvc2UgPSAhMDtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGJyZWFrO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGRlZmF1bHQ6XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgaWYgKGFib3J0RXJyb3IpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgcmV0dXJuIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGVycm9yOiBhYm9ydEVycm9yXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgfTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgaWYgKGRvQXBwbHkpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IG5ld01vZHVsZUZhY3Rvcnk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgYWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBmb3IgKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcylcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLm8ocmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgaWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSwgcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgaWYgKGRvRGlzcG9zZSkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgY3VycmVudFVwZGF0ZSA9IHZvaWQgMDtcbi8qKioqKiovIFx0XHQgICAgICB2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XG4vKioqKioqLyBcdFx0ICAgICAgZm9yICh2YXIgaiA9IDA7aiA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGorKykge1xuLyoqKioqKi8gXHRcdCAgICAgICAgdmFyIG91dGRhdGVkTW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbal0sIG1vZHVsZSA9IF9fd2VicGFja19yZXF1aXJlX18uY1tvdXRkYXRlZE1vZHVsZUlkXTtcbi8qKioqKiovIFx0XHQgICAgICAgIGlmIChtb2R1bGUgJiYgKG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZCB8fCBtb2R1bGUuaG90Ll9tYWluKSAmJiBhcHBsaWVkVXBkYXRlW291dGRhdGVkTW9kdWxlSWRdICE9PSB3YXJuVW5leHBlY3RlZFJlcXVpcmUgJiYgIW1vZHVsZS5ob3QuX3NlbGZJbnZhbGlkYXRlZClcbi8qKioqKiovIFx0XHQgICAgICAgICAgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIG1vZHVsZTogb3V0ZGF0ZWRNb2R1bGVJZCxcbi8qKioqKiovIFx0XHQgICAgICAgICAgICByZXF1aXJlOiBtb2R1bGUuaG90Ll9yZXF1aXJlU2VsZixcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBlcnJvckhhbmRsZXI6IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZFxuLyoqKioqKi8gXHRcdCAgICAgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgdmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xuLyoqKioqKi8gXHRcdCAgICAgIHJldHVybiB7XG4vKioqKioqLyBcdFx0ICAgICAgICBkaXNwb3NlOiBmdW5jdGlvbigpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgY3VycmVudFVwZGF0ZVJlbW92ZWRDaHVua3MuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGN1cnJlbnRVcGRhdGVSZW1vdmVkQ2h1bmtzID0gdm9pZCAwO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB2YXIgaWR4LCBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIHZhciBtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpLCBtb2R1bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbbW9kdWxlSWRdO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGlmICghbW9kdWxlKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgY29udGludWU7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgdmFyIGRhdGEgPSB7fSwgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGZvciAoaiA9IDA7aiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKylcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGRpc3Bvc2VIYW5kbGVyc1tqXS5jYWxsKG51bGwsIGRhdGEpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIF9fd2VicGFja19yZXF1aXJlX18uaG1yRFttb2R1bGVJZF0gPSBkYXRhO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIG1vZHVsZS5ob3QuYWN0aXZlID0gITE7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgZGVsZXRlIF9fd2VicGFja19yZXF1aXJlX18uY1ttb2R1bGVJZF07XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBmb3IgKGogPSAwO2ogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIHZhciBjaGlsZCA9IF9fd2VicGFja19yZXF1aXJlX18uY1ttb2R1bGUuY2hpbGRyZW5bal1dO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgaWYgKCFjaGlsZClcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgY29udGludWU7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgaWYgKGlkeCA+PSAwKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgICAgICB2YXIgZGVwZW5kZW5jeTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgZm9yICh2YXIgb3V0ZGF0ZWRNb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcylcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBvdXRkYXRlZE1vZHVsZUlkKSkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgbW9kdWxlID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jW291dGRhdGVkTW9kdWxlSWRdO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgaWYgKG1vZHVsZSkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW291dGRhdGVkTW9kdWxlSWRdO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBmb3IgKGogPSAwO2ogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgIGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICBpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICBpZiAoaWR4ID49IDApXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICB9LFxuLyoqKioqKi8gXHRcdCAgICAgICAgYXBwbHk6IGZ1bmN0aW9uKHJlcG9ydEVycm9yKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGZvciAodmFyIHVwZGF0ZU1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgaWYgKF9fd2VicGFja19yZXF1aXJlX18ubyhhcHBsaWVkVXBkYXRlLCB1cGRhdGVNb2R1bGVJZCkpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBfX3dlYnBhY2tfcmVxdWlyZV9fLm1bdXBkYXRlTW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVt1cGRhdGVNb2R1bGVJZF07XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGZvciAodmFyIGkgPSAwO2kgPCBjdXJyZW50VXBkYXRlUnVudGltZS5sZW5ndGg7IGkrKylcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBjdXJyZW50VXBkYXRlUnVudGltZVtpXShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgZm9yICh2YXIgb3V0ZGF0ZWRNb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcylcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBvdXRkYXRlZE1vZHVsZUlkKSkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgdmFyIG1vZHVsZSA9IF9fd2VicGFja19yZXF1aXJlX18uY1tvdXRkYXRlZE1vZHVsZUlkXTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGlmIChtb2R1bGUpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1tvdXRkYXRlZE1vZHVsZUlkXTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrcyA9IFtdLCBlcnJvckhhbmRsZXJzID0gW10sIGRlcGVuZGVuY2llc0ZvckNhbGxiYWNrcyA9IFtdO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDtqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICB2YXIgZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdLCBhY2NlcHRDYWxsYmFjayA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldLCBlcnJvckhhbmRsZXIgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZEVycm9ySGFuZGxlcnNbZGVwZW5kZW5jeV07XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgaWYgKGFjY2VwdENhbGxiYWNrKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tzLmluZGV4T2YoYWNjZXB0Q2FsbGJhY2spICE9PSAtMSlcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3MucHVzaChhY2NlcHRDYWxsYmFjayk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICBlcnJvckhhbmRsZXJzLnB1c2goZXJyb3JIYW5kbGVyKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llc0ZvckNhbGxiYWNrcy5wdXNoKGRlcGVuZGVuY3kpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDtrIDwgY2FsbGJhY2tzLmxlbmd0aDsgaysrKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgIHRyeSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3Nba10uY2FsbChudWxsLCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGVycm9ySGFuZGxlcnNba10gPT09IFwiZnVuY3Rpb25cIilcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgICBlcnJvckhhbmRsZXJzW2tdKGVyciwge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlSWQ6IG91dGRhdGVkTW9kdWxlSWQsXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICBkZXBlbmRlbmN5SWQ6IGRlcGVuZGVuY2llc0ZvckNhbGxiYWNrc1trXVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIyKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMub25FcnJvcmVkKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5vbkVycm9yZWQoe1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlSWQ6IG91dGRhdGVkTW9kdWxlSWQsXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlcGVuZGVuY3lJZDogZGVwZW5kZW5jaWVzRm9yQ2FsbGJhY2tzW2tdLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyMixcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxFcnJvcjogZXJyXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwb3J0RXJyb3IoZXJyMik7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICByZXBvcnRFcnJvcihlcnIpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLm9uRXJyb3JlZClcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm9uRXJyb3JlZCh7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVJZDogb3V0ZGF0ZWRNb2R1bGVJZCxcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgIGRlcGVuZGVuY3lJZDogZGVwZW5kZW5jaWVzRm9yQ2FsbGJhY2tzW2tdLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVyclxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZClcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgICByZXBvcnRFcnJvcihlcnIpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGZvciAodmFyIG8gPSAwO28gPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBvKyspIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICB2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tvXSwgbW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICB0cnkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgaXRlbS5yZXF1aXJlKG1vZHVsZUlkKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGlmICh0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIilcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgdHJ5IHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICBpdGVtLmVycm9ySGFuZGxlcihlcnIsIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgIG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgbW9kdWxlOiBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbbW9kdWxlSWRdXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycjEpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5vbkVycm9yZWQpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm9uRXJyb3JlZCh7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyMSxcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxFcnJvcjogZXJyXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgcmVwb3J0RXJyb3IoZXJyMSk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICByZXBvcnRFcnJvcihlcnIpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgZWxzZSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLm9uRXJyb3JlZClcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICBvcHRpb25zLm9uRXJyb3JlZCh7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgIG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVyclxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZClcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICByZXBvcnRFcnJvcihlcnIpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgICAgICByZXR1cm4gb3V0ZGF0ZWRNb2R1bGVzO1xuLyoqKioqKi8gXHRcdCAgICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgIH07XG4vKioqKioqLyBcdFx0ICAgIH1cbi8qKioqKiovIFx0XHQgICAgX193ZWJwYWNrX3JlcXVpcmVfXy5obXJJLmpzb25wID0gZnVuY3Rpb24obW9kdWxlSWQsIGFwcGx5SGFuZGxlcnMpIHtcbi8qKioqKiovIFx0XHQgICAgICBpZiAoIWN1cnJlbnRVcGRhdGUpIHtcbi8qKioqKiovIFx0XHQgICAgICAgIGN1cnJlbnRVcGRhdGUgPSB7fTtcbi8qKioqKiovIFx0XHQgICAgICAgIGN1cnJlbnRVcGRhdGVSdW50aW1lID0gW107XG4vKioqKioqLyBcdFx0ICAgICAgICBjdXJyZW50VXBkYXRlUmVtb3ZlZENodW5rcyA9IFtdO1xuLyoqKioqKi8gXHRcdCAgICAgICAgYXBwbHlIYW5kbGVycy5wdXNoKGFwcGx5SGFuZGxlcik7XG4vKioqKioqLyBcdFx0ICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgIGlmICghX193ZWJwYWNrX3JlcXVpcmVfXy5vKGN1cnJlbnRVcGRhdGUsIG1vZHVsZUlkKSlcbi8qKioqKiovIFx0XHQgICAgICAgIGN1cnJlbnRVcGRhdGVbbW9kdWxlSWRdID0gX193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXTtcbi8qKioqKiovIFx0XHQgICAgfTtcbi8qKioqKiovIFx0XHQgICAgX193ZWJwYWNrX3JlcXVpcmVfXy5obXJDLmpzb25wID0gZnVuY3Rpb24oY2h1bmtJZHMsIHJlbW92ZWRDaHVua3MsIHJlbW92ZWRNb2R1bGVzLCBwcm9taXNlcywgYXBwbHlIYW5kbGVycywgdXBkYXRlZE1vZHVsZXNMaXN0KSB7XG4vKioqKioqLyBcdFx0ICAgICAgYXBwbHlIYW5kbGVycy5wdXNoKGFwcGx5SGFuZGxlcik7XG4vKioqKioqLyBcdFx0ICAgICAgY3VycmVudFVwZGF0ZUNodW5rcyA9IHt9O1xuLyoqKioqKi8gXHRcdCAgICAgIGN1cnJlbnRVcGRhdGVSZW1vdmVkQ2h1bmtzID0gcmVtb3ZlZENodW5rcztcbi8qKioqKiovIFx0XHQgICAgICBjdXJyZW50VXBkYXRlID0gcmVtb3ZlZE1vZHVsZXMucmVkdWNlKGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4vKioqKioqLyBcdFx0ICAgICAgICBvYmpba2V5XSA9ICExO1xuLyoqKioqKi8gXHRcdCAgICAgICAgcmV0dXJuIG9iajtcbi8qKioqKiovIFx0XHQgICAgICB9LCB7fSk7XG4vKioqKioqLyBcdFx0ICAgICAgY3VycmVudFVwZGF0ZVJ1bnRpbWUgPSBbXTtcbi8qKioqKiovIFx0XHQgICAgICBjaHVua0lkcy5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rSWQpIHtcbi8qKioqKiovIFx0XHQgICAgICAgIGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gIT09IHZvaWQgMCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBwcm9taXNlcy5wdXNoKGxvYWRVcGRhdGVDaHVuayhjaHVua0lkLCB1cGRhdGVkTW9kdWxlc0xpc3QpKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgY3VycmVudFVwZGF0ZUNodW5rc1tjaHVua0lkXSA9ICEwO1xuLyoqKioqKi8gXHRcdCAgICAgICAgfSBlbHNlXG4vKioqKioqLyBcdFx0ICAgICAgICAgIGN1cnJlbnRVcGRhdGVDaHVua3NbY2h1bmtJZF0gPSAhMTtcbi8qKioqKiovIFx0XHQgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICBpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5mKVxuLyoqKioqKi8gXHRcdCAgICAgICAgX193ZWJwYWNrX3JlcXVpcmVfXy5mLmpzb25wSG1yID0gZnVuY3Rpb24oY2h1bmtJZCwgcHJvbWlzZXMpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgaWYgKGN1cnJlbnRVcGRhdGVDaHVua3MgJiYgX193ZWJwYWNrX3JlcXVpcmVfXy5vKGN1cnJlbnRVcGRhdGVDaHVua3MsIGNodW5rSWQpICYmICFjdXJyZW50VXBkYXRlQ2h1bmtzW2NodW5rSWRdKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgcHJvbWlzZXMucHVzaChsb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGN1cnJlbnRVcGRhdGVDaHVua3NbY2h1bmtJZF0gPSAhMDtcbi8qKioqKiovIFx0XHQgICAgICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgICAgfTtcbi8qKioqKiovIFx0XHQgICAgfTtcbi8qKioqKiovIFx0XHQgIFxuLyoqKioqKi8gXHRcdFxuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uaG1yTSA9ICgpID0+IHtcbi8qKioqKiovIFx0XHRcdGlmICh0eXBlb2YgZmV0Y2ggPT09IFwidW5kZWZpbmVkXCIpIHRocm93IG5ldyBFcnJvcihcIk5vIGJyb3dzZXIgc3VwcG9ydDogbmVlZCBmZXRjaCBBUElcIik7XG4vKioqKioqLyBcdFx0XHRyZXR1cm4gZmV0Y2goX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgX193ZWJwYWNrX3JlcXVpcmVfXy5obXJGKCkpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4vKioqKioqLyBcdFx0XHRcdGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDA0KSByZXR1cm47IC8vIG5vIHVwZGF0ZSBhdmFpbGFibGVcbi8qKioqKiovIFx0XHRcdFx0aWYoIXJlc3BvbnNlLm9rKSB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gZmV0Y2ggdXBkYXRlIG1hbmlmZXN0IFwiICsgcmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4vKioqKioqLyBcdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG4vKioqKioqLyBcdFx0XHR9KTtcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHRcdFxuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuLyoqKioqKi8gXHRcdFxuLyoqKioqKi8gXHRcdC8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xuLyoqKioqKi8gXHRcdHZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuLyoqKioqKi8gXHRcdFx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcbi8qKioqKiovIFx0XHRcdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuLyoqKioqKi8gXHRcdFx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG4vKioqKioqLyBcdFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuLyoqKioqKi8gXHRcdFx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcbi8qKioqKiovIFx0XHRcdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbi8qKioqKiovIFx0XHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4vKioqKioqLyBcdFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0XHR9XG4vKioqKioqLyBcdFx0XHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuLyoqKioqKi8gXHRcdFx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcbi8qKioqKiovIFx0XHRcdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuLyoqKioqKi8gXHRcdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcbi8qKioqKiovIFx0XHRcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcbi8qKioqKiovIFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0XHRcbi8qKioqKiovIFx0XHR2YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua19OX0VcIl0gPSBzZWxmW1wid2VicGFja0NodW5rX05fRVwiXSB8fCBbXTtcbi8qKioqKiovIFx0XHRjaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbi8qKioqKiovIFx0XHRjaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Ly8gbW9kdWxlIGNhY2hlIGFyZSB1c2VkIHNvIGVudHJ5IGlubGluaW5nIGlzIGRpc2FibGVkXG4vKioqKioqLyBcdFxuLyoqKioqKi8gfSkoKVxuIl19
;