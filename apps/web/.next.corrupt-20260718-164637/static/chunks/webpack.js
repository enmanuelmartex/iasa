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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
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
/******/ 			return "static/chunks/" + chunkId + ".js";
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
/******/ 		__webpack_require__.h = () => ("2adc4b677848e37d")
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
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	
/******/ })()

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJpZ25vcmVMaXN0IjpbMF0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZXMiOlsid2VicGFjay1pbnRlcm5hbDovL25leHRqcy93ZWJwYWNrLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoaXMgc291cmNlIHdhcyBnZW5lcmF0ZWQgYnkgTmV4dC5qcyBiYXNlZCBvZmYgb2YgdGhlIGdlbmVyYXRlZCBXZWJwYWNrIHJ1bnRpbWUuXG4vLyBUaGUgbWFwcGluZ3MgYXJlIGluY29ycmVjdC5cbi8vIFRvIGdldCB0aGUgY29ycmVjdCBsaW5lL2NvbHVtbiBtYXBwaW5ncywgdHVybiBvZmYgc291cmNlbWFwcyBpbiB5b3VyIGRlYnVnZ2VyLlxuXG4vKioqKioqLyAoKCkgPT4geyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdFwidXNlIHN0cmljdFwiO1xuLyoqKioqKi8gXHR2YXIgX193ZWJwYWNrX21vZHVsZXNfXyA9ICh7fSk7XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcbi8qKioqKiovIFx0XHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcbi8qKioqKiovIFx0XHRcdGlmIChjYWNoZWRNb2R1bGUuZXJyb3IgIT09IHVuZGVmaW5lZCkgdGhyb3cgY2FjaGVkTW9kdWxlLmVycm9yO1xuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bG9hZGVkOiBmYWxzZSxcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0dmFyIHRocmV3ID0gdHJ1ZTtcbi8qKioqKiovIFx0XHR0cnkge1xuLyoqKioqKi8gXHRcdFx0dmFyIGV4ZWNPcHRpb25zID0geyBpZDogbW9kdWxlSWQsIG1vZHVsZTogbW9kdWxlLCBmYWN0b3J5OiBfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXSwgcmVxdWlyZTogX193ZWJwYWNrX3JlcXVpcmVfXyB9O1xuLyoqKioqKi8gXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlcikgeyBoYW5kbGVyKGV4ZWNPcHRpb25zKTsgfSk7XG4vKioqKioqLyBcdFx0XHRtb2R1bGUgPSBleGVjT3B0aW9ucy5tb2R1bGU7XG4vKioqKioqLyBcdFx0XHRleGVjT3B0aW9ucy5mYWN0b3J5LmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGV4ZWNPcHRpb25zLnJlcXVpcmUpO1xuLyoqKioqKi8gXHRcdFx0dGhyZXcgPSBmYWxzZTtcbi8qKioqKiovIFx0XHR9IGZpbmFsbHkge1xuLyoqKioqKi8gXHRcdFx0aWYodGhyZXcpIGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0XG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfXztcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGV4ZWN1dGlvbiBpbnRlcmNlcHRvclxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBbXTtcbi8qKioqKiovIFx0XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0dmFyIGRlZmVycmVkID0gW107XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuLyoqKioqKi8gXHRcdFx0aWYoY2h1bmtJZHMpIHtcbi8qKioqKiovIFx0XHRcdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuLyoqKioqKi8gXHRcdFx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuLyoqKioqKi8gXHRcdFx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcbi8qKioqKiovIFx0XHRcdFx0cmV0dXJuO1xuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuLyoqKioqKi8gXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuLyoqKioqKi8gXHRcdFx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG4vKioqKioqLyBcdFx0XHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuLyoqKioqKi8gXHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG4vKioqKioqLyBcdFx0XHRcdFx0fSBlbHNlIHtcbi8qKioqKiovIFx0XHRcdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuLyoqKioqKi8gXHRcdFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0XHRpZihmdWxmaWxsZWQpIHtcbi8qKioqKiovIFx0XHRcdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuLyoqKioqKi8gXHRcdFx0XHRcdHZhciByID0gZm4oKTtcbi8qKioqKiovIFx0XHRcdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuLyoqKioqKi8gXHRcdFx0XHR9XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0XHRyZXR1cm4gcmVzdWx0O1xuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuLyoqKioqKi8gXHRcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4vKioqKioqLyBcdFx0XHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuLyoqKioqKi8gXHRcdFx0XHQoKSA9PiAobW9kdWxlKTtcbi8qKioqKiovIFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGdldHRlcjtcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2NyZWF0ZSBmYWtlIG5hbWVzcGFjZSBvYmplY3QgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHR2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgPyAob2JqKSA9PiAoT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaikpIDogKG9iaikgPT4gKG9iai5fX3Byb3RvX18pO1xuLyoqKioqKi8gXHRcdHZhciBsZWFmUHJvdG90eXBlcztcbi8qKioqKiovIFx0XHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3Rcbi8qKioqKiovIFx0XHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbi8qKioqKiovIFx0XHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbi8qKioqKiovIFx0XHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3Rcbi8qKioqKiovIFx0XHQvLyBtb2RlICYgMTY6IHJldHVybiB2YWx1ZSB3aGVuIGl0J3MgUHJvbWlzZS1saWtlXG4vKioqKioqLyBcdFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4vKioqKioqLyBcdFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSB0aGlzKHZhbHVlKTtcbi8qKioqKiovIFx0XHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4vKioqKioqLyBcdFx0XHRpZih0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlKSB7XG4vKioqKioqLyBcdFx0XHRcdGlmKChtb2RlICYgNCkgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuLyoqKioqKi8gXHRcdFx0XHRpZigobW9kZSAmIDE2KSAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHZhbHVlO1xuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbi8qKioqKiovIFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4vKioqKioqLyBcdFx0XHR2YXIgZGVmID0ge307XG4vKioqKioqLyBcdFx0XHRsZWFmUHJvdG90eXBlcyA9IGxlYWZQcm90b3R5cGVzIHx8IFtudWxsLCBnZXRQcm90byh7fSksIGdldFByb3RvKFtdKSwgZ2V0UHJvdG8oZ2V0UHJvdG8pXTtcbi8qKioqKiovIFx0XHRcdGZvcih2YXIgY3VycmVudCA9IG1vZGUgJiAyICYmIHZhbHVlOyB0eXBlb2YgY3VycmVudCA9PSAnb2JqZWN0JyAmJiAhfmxlYWZQcm90b3R5cGVzLmluZGV4T2YoY3VycmVudCk7IGN1cnJlbnQgPSBnZXRQcm90byhjdXJyZW50KSkge1xuLyoqKioqKi8gXHRcdFx0XHRPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhjdXJyZW50KS5mb3JFYWNoKChrZXkpID0+IChkZWZba2V5XSA9ICgpID0+ICh2YWx1ZVtrZXldKSkpO1xuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0ZGVmWydkZWZhdWx0J10gPSAoKSA9PiAodmFsdWUpO1xuLyoqKioqKi8gXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBkZWYpO1xuLyoqKioqKi8gXHRcdFx0cmV0dXJuIG5zO1xuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcbi8qKioqKiovIFx0XHRcdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcbi8qKioqKiovIFx0XHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcbi8qKioqKiovIFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvZW5zdXJlIGNodW5rICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5mID0ge307XG4vKioqKioqLyBcdFx0Ly8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuLyoqKioqKi8gXHRcdC8vIFRoZSBjaHVuayBsb2FkaW5nIGZ1bmN0aW9uIGZvciBhZGRpdGlvbmFsIGNodW5rc1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZSA9IChjaHVua0lkKSA9PiB7XG4vKioqKioqLyBcdFx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5mKS5yZWR1Y2UoKHByb21pc2VzLCBrZXkpID0+IHtcbi8qKioqKiovIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5mW2tleV0oY2h1bmtJZCwgcHJvbWlzZXMpO1xuLyoqKioqKi8gXHRcdFx0XHRyZXR1cm4gcHJvbWlzZXM7XG4vKioqKioqLyBcdFx0XHR9LCBbXSkpO1xuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvZ2V0IGphdmFzY3JpcHQgY2h1bmsgZmlsZW5hbWUgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBUaGlzIGZ1bmN0aW9uIGFsbG93IHRvIHJlZmVyZW5jZSBhc3luYyBjaHVua3Ncbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnUgPSAoY2h1bmtJZCkgPT4ge1xuLyoqKioqKi8gXHRcdFx0Ly8gcmV0dXJuIHVybCBmb3IgZmlsZW5hbWVzIGJhc2VkIG9uIHRlbXBsYXRlXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gXCJzdGF0aWMvY2h1bmtzL1wiICsgY2h1bmtJZCArIFwiLmpzXCI7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9nZXQgamF2YXNjcmlwdCB1cGRhdGUgY2h1bmsgZmlsZW5hbWUgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBUaGlzIGZ1bmN0aW9uIGFsbG93IHRvIHJlZmVyZW5jZSBhbGwgY2h1bmtzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5odSA9IChjaHVua0lkKSA9PiB7XG4vKioqKioqLyBcdFx0XHQvLyByZXR1cm4gdXJsIGZvciBmaWxlbmFtZXMgYmFzZWQgb24gdGVtcGxhdGVcbi8qKioqKiovIFx0XHRcdHJldHVybiBcInN0YXRpYy93ZWJwYWNrL1wiICsgY2h1bmtJZCArIFwiLlwiICsgX193ZWJwYWNrX3JlcXVpcmVfXy5oKCkgKyBcIi5ob3QtdXBkYXRlLmpzXCI7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9nZXQgbWluaS1jc3MgY2h1bmsgZmlsZW5hbWUgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBUaGlzIGZ1bmN0aW9uIGFsbG93IHRvIHJlZmVyZW5jZSBhc3luYyBjaHVua3Ncbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1pbmlDc3NGID0gKGNodW5rSWQpID0+IHtcbi8qKioqKiovIFx0XHRcdC8vIHJldHVybiB1cmwgZm9yIGZpbGVuYW1lcyBiYXNlZCBvbiB0ZW1wbGF0ZVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2dldCB1cGRhdGUgbWFuaWZlc3QgZmlsZW5hbWUgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckYgPSAoKSA9PiAoXCJzdGF0aWMvd2VicGFjay9cIiArIF9fd2VicGFja19yZXF1aXJlX18uaCgpICsgXCIud2VicGFjay5ob3QtdXBkYXRlLmpzb25cIik7XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2ggKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiAoXCIyYWRjNGI2Nzc4NDhlMzdkXCIpXG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuLyoqKioqKi8gXHRcdFx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG4vKioqKioqLyBcdFx0XHR0cnkge1xuLyoqKioqKi8gXHRcdFx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbi8qKioqKiovIFx0XHRcdH0gY2F0Y2ggKGUpIHtcbi8qKioqKiovIFx0XHRcdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdH0pKCk7XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKVxuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2xvYWQgc2NyaXB0ICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0dmFyIGluUHJvZ3Jlc3MgPSB7fTtcbi8qKioqKiovIFx0XHR2YXIgZGF0YVdlYnBhY2tQcmVmaXggPSBcIl9OX0U6XCI7XG4vKioqKioqLyBcdFx0Ly8gbG9hZFNjcmlwdCBmdW5jdGlvbiB0byBsb2FkIGEgc2NyaXB0IHZpYSBzY3JpcHQgdGFnXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5sID0gKHVybCwgZG9uZSwga2V5LCBjaHVua0lkKSA9PiB7XG4vKioqKioqLyBcdFx0XHRpZihpblByb2dyZXNzW3VybF0pIHsgaW5Qcm9ncmVzc1t1cmxdLnB1c2goZG9uZSk7IHJldHVybjsgfVxuLyoqKioqKi8gXHRcdFx0dmFyIHNjcmlwdCwgbmVlZEF0dGFjaDtcbi8qKioqKiovIFx0XHRcdGlmKGtleSAhPT0gdW5kZWZpbmVkKSB7XG4vKioqKioqLyBcdFx0XHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG4vKioqKioqLyBcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBzY3JpcHRzLmxlbmd0aDsgaSsrKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0dmFyIHMgPSBzY3JpcHRzW2ldO1xuLyoqKioqKi8gXHRcdFx0XHRcdGlmKHMuZ2V0QXR0cmlidXRlKFwic3JjXCIpID09IHVybCB8fCBzLmdldEF0dHJpYnV0ZShcImRhdGEtd2VicGFja1wiKSA9PSBkYXRhV2VicGFja1ByZWZpeCArIGtleSkgeyBzY3JpcHQgPSBzOyBicmVhazsgfVxuLyoqKioqKi8gXHRcdFx0XHR9XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0XHRpZighc2NyaXB0KSB7XG4vKioqKioqLyBcdFx0XHRcdG5lZWRBdHRhY2ggPSB0cnVlO1xuLyoqKioqKi8gXHRcdFx0XHRzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbi8qKioqKiovIFx0XHRcbi8qKioqKiovIFx0XHRcdFx0c2NyaXB0LmNoYXJzZXQgPSAndXRmLTgnO1xuLyoqKioqKi8gXHRcdFx0XHRzY3JpcHQudGltZW91dCA9IDEyMDtcbi8qKioqKiovIFx0XHRcdFx0aWYgKF9fd2VicGFja19yZXF1aXJlX18ubmMpIHtcbi8qKioqKiovIFx0XHRcdFx0XHRzY3JpcHQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgX193ZWJwYWNrX3JlcXVpcmVfXy5uYyk7XG4vKioqKioqLyBcdFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdFx0c2NyaXB0LnNldEF0dHJpYnV0ZShcImRhdGEtd2VicGFja1wiLCBkYXRhV2VicGFja1ByZWZpeCArIGtleSk7XG4vKioqKioqLyBcdFx0XG4vKioqKioqLyBcdFx0XHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnR1KHVybCk7XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0XHRpblByb2dyZXNzW3VybF0gPSBbZG9uZV07XG4vKioqKioqLyBcdFx0XHR2YXIgb25TY3JpcHRDb21wbGV0ZSA9IChwcmV2LCBldmVudCkgPT4ge1xuLyoqKioqKi8gXHRcdFx0XHQvLyBhdm9pZCBtZW0gbGVha3MgaW4gSUUuXG4vKioqKioqLyBcdFx0XHRcdHNjcmlwdC5vbmVycm9yID0gc2NyaXB0Lm9ubG9hZCA9IG51bGw7XG4vKioqKioqLyBcdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbi8qKioqKiovIFx0XHRcdFx0dmFyIGRvbmVGbnMgPSBpblByb2dyZXNzW3VybF07XG4vKioqKioqLyBcdFx0XHRcdGRlbGV0ZSBpblByb2dyZXNzW3VybF07XG4vKioqKioqLyBcdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlICYmIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4vKioqKioqLyBcdFx0XHRcdGRvbmVGbnMgJiYgZG9uZUZucy5mb3JFYWNoKChmbikgPT4gKGZuKGV2ZW50KSkpO1xuLyoqKioqKi8gXHRcdFx0XHRpZihwcmV2KSByZXR1cm4gcHJldihldmVudCk7XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0XHR2YXIgdGltZW91dCA9IHNldFRpbWVvdXQob25TY3JpcHRDb21wbGV0ZS5iaW5kKG51bGwsIHVuZGVmaW5lZCwgeyB0eXBlOiAndGltZW91dCcsIHRhcmdldDogc2NyaXB0IH0pLCAxMjAwMDApO1xuLyoqKioqKi8gXHRcdFx0c2NyaXB0Lm9uZXJyb3IgPSBvblNjcmlwdENvbXBsZXRlLmJpbmQobnVsbCwgc2NyaXB0Lm9uZXJyb3IpO1xuLyoqKioqKi8gXHRcdFx0c2NyaXB0Lm9ubG9hZCA9IG9uU2NyaXB0Q29tcGxldGUuYmluZChudWxsLCBzY3JpcHQub25sb2FkKTtcbi8qKioqKiovIFx0XHRcdG5lZWRBdHRhY2ggJiYgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0ICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG4vKioqKioqLyBcdFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbi8qKioqKiovIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG4vKioqKioqLyBcdFx0XHRtb2R1bGUucGF0aHMgPSBbXTtcbi8qKioqKiovIFx0XHRcdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcbi8qKioqKiovIFx0XHRcdHJldHVybiBtb2R1bGU7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS90cnVzdGVkIHR5cGVzIHBvbGljeSAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdHZhciBwb2xpY3k7XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy50dCA9ICgpID0+IHtcbi8qKioqKiovIFx0XHRcdC8vIENyZWF0ZSBUcnVzdGVkIFR5cGUgcG9saWN5IGlmIFRydXN0ZWQgVHlwZXMgYXJlIGF2YWlsYWJsZSBhbmQgdGhlIHBvbGljeSBkb2Vzbid0IGV4aXN0IHlldC5cbi8qKioqKiovIFx0XHRcdGlmIChwb2xpY3kgPT09IHVuZGVmaW5lZCkge1xuLyoqKioqKi8gXHRcdFx0XHRwb2xpY3kgPSB7XG4vKioqKioqLyBcdFx0XHRcdFx0Y3JlYXRlU2NyaXB0OiAoc2NyaXB0KSA9PiAoc2NyaXB0KSxcbi8qKioqKiovIFx0XHRcdFx0XHRjcmVhdGVTY3JpcHRVUkw6ICh1cmwpID0+ICh1cmwpXG4vKioqKioqLyBcdFx0XHRcdH07XG4vKioqKioqLyBcdFx0XHRcdGlmICh0eXBlb2YgdHJ1c3RlZFR5cGVzICE9PSBcInVuZGVmaW5lZFwiICYmIHRydXN0ZWRUeXBlcy5jcmVhdGVQb2xpY3kpIHtcbi8qKioqKiovIFx0XHRcdFx0XHRwb2xpY3kgPSB0cnVzdGVkVHlwZXMuY3JlYXRlUG9saWN5KFwibmV4dGpzI2J1bmRsZXJcIiwgcG9saWN5KTtcbi8qKioqKiovIFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIHBvbGljeTtcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL3RydXN0ZWQgdHlwZXMgc2NyaXB0ICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy50cyA9IChzY3JpcHQpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLnR0KCkuY3JlYXRlU2NyaXB0KHNjcmlwdCkpO1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL3RydXN0ZWQgdHlwZXMgc2NyaXB0IHVybCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18udHUgPSAodXJsKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy50dCgpLmNyZWF0ZVNjcmlwdFVSTCh1cmwpKTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9ob3QgbW9kdWxlIHJlcGxhY2VtZW50ICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0ICAgIHZhciBjdXJyZW50TW9kdWxlRGF0YSA9IHt9LCBpbnN0YWxsZWRNb2R1bGVzID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jLCBjdXJyZW50Q2hpbGRNb2R1bGUsIGN1cnJlbnRQYXJlbnRzID0gW10sIHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVycyA9IFtdLCBjdXJyZW50U3RhdHVzID0gXCJpZGxlXCIsIGJsb2NraW5nUHJvbWlzZXMgPSAwLCBibG9ja2luZ1Byb21pc2VzV2FpdGluZyA9IFtdLCBjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycywgcXVldWVkSW52YWxpZGF0ZWRNb2R1bGVzO1xuLyoqKioqKi8gXHRcdCAgICBfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckQgPSBjdXJyZW50TW9kdWxlRGF0YTtcbi8qKioqKiovIFx0XHQgICAgX193ZWJwYWNrX3JlcXVpcmVfXy5pLnB1c2goZnVuY3Rpb24ob3B0aW9ucykge1xuLyoqKioqKi8gXHRcdCAgICAgIHZhciBtb2R1bGUgPSBvcHRpb25zLm1vZHVsZSwgcmVxdWlyZSA9IGNyZWF0ZVJlcXVpcmUob3B0aW9ucy5yZXF1aXJlLCBvcHRpb25zLmlkKTtcbi8qKioqKiovIFx0XHQgICAgICBtb2R1bGUuaG90ID0gY3JlYXRlTW9kdWxlSG90T2JqZWN0KG9wdGlvbnMuaWQsIG1vZHVsZSk7XG4vKioqKioqLyBcdFx0ICAgICAgbW9kdWxlLnBhcmVudHMgPSBjdXJyZW50UGFyZW50cztcbi8qKioqKiovIFx0XHQgICAgICBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcbi8qKioqKiovIFx0XHQgICAgICBjdXJyZW50UGFyZW50cyA9IFtdO1xuLyoqKioqKi8gXHRcdCAgICAgIG9wdGlvbnMucmVxdWlyZSA9IHJlcXVpcmU7XG4vKioqKioqLyBcdFx0ICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICBfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckMgPSB7fTtcbi8qKioqKiovIFx0XHQgICAgX193ZWJwYWNrX3JlcXVpcmVfXy5obXJJID0ge307XG4vKioqKioqLyBcdFx0ICAgIGZ1bmN0aW9uIGNyZWF0ZVJlcXVpcmUocmVxdWlyZSwgbW9kdWxlSWQpIHtcbi8qKioqKiovIFx0XHQgICAgICB2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbi8qKioqKiovIFx0XHQgICAgICBpZiAoIW1lKVxuLyoqKioqKi8gXHRcdCAgICAgICAgcmV0dXJuIHJlcXVpcmU7XG4vKioqKioqLyBcdFx0ICAgICAgdmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgaWYgKG1lLmhvdC5hY3RpdmUpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgaWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICB2YXIgcGFyZW50cyA9IGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cztcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBpZiAocGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA9PT0gLTEpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBwYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB9IGVsc2Uge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBjdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGlmIChtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpID09PSAtMSlcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgfSBlbHNlIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgY29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVxdWVzdCArIFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArIG1vZHVsZUlkKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgY3VycmVudFBhcmVudHMgPSBbXTtcbi8qKioqKiovIFx0XHQgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgIHJldHVybiByZXF1aXJlKHJlcXVlc3QpO1xuLyoqKioqKi8gXHRcdCAgICAgIH0sIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uKG5hbWUpIHtcbi8qKioqKiovIFx0XHQgICAgICAgIHJldHVybiB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGNvbmZpZ3VyYWJsZTogITAsXG4vKioqKioqLyBcdFx0ICAgICAgICAgIGVudW1lcmFibGU6ICEwLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIHJldHVybiByZXF1aXJlW25hbWVdO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB9LFxuLyoqKioqKi8gXHRcdCAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgcmVxdWlyZVtuYW1lXSA9IHZhbHVlO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICB9O1xuLyoqKioqKi8gXHRcdCAgICAgIH07XG4vKioqKioqLyBcdFx0ICAgICAgZm9yICh2YXIgbmFtZSBpbiByZXF1aXJlKVxuLyoqKioqKi8gXHRcdCAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChyZXF1aXJlLCBuYW1lKSAmJiBuYW1lICE9PSBcImVcIilcbi8qKioqKiovIFx0XHQgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IobmFtZSkpO1xuLyoqKioqKi8gXHRcdCAgICAgIGZuLmUgPSBmdW5jdGlvbihjaHVua0lkLCBmZXRjaFByaW9yaXR5KSB7XG4vKioqKioqLyBcdFx0ICAgICAgICByZXR1cm4gdHJhY2tCbG9ja2luZ1Byb21pc2UocmVxdWlyZS5lKGNodW5rSWQsIGZldGNoUHJpb3JpdHkpKTtcbi8qKioqKiovIFx0XHQgICAgICB9O1xuLyoqKioqKi8gXHRcdCAgICAgIHJldHVybiBmbjtcbi8qKioqKiovIFx0XHQgICAgfVxuLyoqKioqKi8gXHRcdCAgICBmdW5jdGlvbiBjcmVhdGVNb2R1bGVIb3RPYmplY3QobW9kdWxlSWQsIG1lKSB7XG4vKioqKioqLyBcdFx0ICAgICAgdmFyIF9tYWluID0gY3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCwgaG90ID0ge1xuLyoqKioqKi8gXHRcdCAgICAgICAgX2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcbi8qKioqKiovIFx0XHQgICAgICAgIF9hY2NlcHRlZEVycm9ySGFuZGxlcnM6IHt9LFxuLyoqKioqKi8gXHRcdCAgICAgICAgX2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcbi8qKioqKiovIFx0XHQgICAgICAgIF9zZWxmQWNjZXB0ZWQ6ICExLFxuLyoqKioqKi8gXHRcdCAgICAgICAgX3NlbGZEZWNsaW5lZDogITEsXG4vKioqKioqLyBcdFx0ICAgICAgICBfc2VsZkludmFsaWRhdGVkOiAhMSxcbi8qKioqKiovIFx0XHQgICAgICAgIF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxuLyoqKioqKi8gXHRcdCAgICAgICAgX21haW4sXG4vKioqKioqLyBcdFx0ICAgICAgICBfcmVxdWlyZVNlbGY6IGZ1bmN0aW9uKCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBjdXJyZW50UGFyZW50cyA9IG1lLnBhcmVudHMuc2xpY2UoKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgY3VycmVudENoaWxkTW9kdWxlID0gX21haW4gPyB2b2lkIDAgOiBtb2R1bGVJZDtcbi8qKioqKiovIFx0XHQgICAgICAgICAgX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XG4vKioqKioqLyBcdFx0ICAgICAgICB9LFxuLyoqKioqKi8gXHRcdCAgICAgICAgYWN0aXZlOiAhMCxcbi8qKioqKiovIFx0XHQgICAgICAgIGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaywgZXJyb3JIYW5kbGVyKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGlmIChkZXAgPT09IHZvaWQgMClcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBob3QuX3NlbGZBY2NlcHRlZCA9ICEwO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgaG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIgJiYgZGVwICE9PSBudWxsKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwO2kgPCBkZXAubGVuZ3RoOyBpKyspIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBob3QuX2FjY2VwdGVkRXJyb3JIYW5kbGVyc1tkZXBbaV1dID0gZXJyb3JIYW5kbGVyO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgZWxzZSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBob3QuX2FjY2VwdGVkRXJyb3JIYW5kbGVyc1tkZXBdID0gZXJyb3JIYW5kbGVyO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICB9LFxuLyoqKioqKi8gXHRcdCAgICAgICAgZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGlmIChkZXAgPT09IHZvaWQgMClcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBob3QuX3NlbGZEZWNsaW5lZCA9ICEwO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiICYmIGRlcCAhPT0gbnVsbClcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMDtpIDwgZGVwLmxlbmd0aDsgaSsrKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gITA7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGVsc2Vcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSAhMDtcbi8qKioqKiovIFx0XHQgICAgICAgIH0sXG4vKioqKioqLyBcdFx0ICAgICAgICBkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbi8qKioqKiovIFx0XHQgICAgICAgIH0sXG4vKioqKioqLyBcdFx0ICAgICAgICBhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgaG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4vKioqKioqLyBcdFx0ICAgICAgICB9LFxuLyoqKioqKi8gXHRcdCAgICAgICAgcmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgaWYgKGlkeCA+PSAwKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgfSxcbi8qKioqKiovIFx0XHQgICAgICAgIGludmFsaWRhdGU6IGZ1bmN0aW9uKCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB0aGlzLl9zZWxmSW52YWxpZGF0ZWQgPSAhMDtcbi8qKioqKiovIFx0XHQgICAgICAgICAgc3dpdGNoIChjdXJyZW50U3RhdHVzKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgY2FzZSBcImlkbGVcIjpcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzID0gW107XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckkpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIF9fd2VicGFja19yZXF1aXJlX18uaG1ySVtrZXldKG1vZHVsZUlkLCBjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycyk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIHNldFN0YXR1cyhcInJlYWR5XCIpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgYnJlYWs7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgY2FzZSBcInJlYWR5XCI6XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckkpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIF9fd2VicGFja19yZXF1aXJlX18uaG1ySVtrZXldKG1vZHVsZUlkLCBjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycyk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGJyZWFrO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGNhc2UgXCJwcmVwYXJlXCI6XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgY2FzZSBcImNoZWNrXCI6XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgY2FzZSBcImRpc3Bvc2VcIjpcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBjYXNlIFwiYXBwbHlcIjpcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIChxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXMgPSBxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXMgfHwgW10pLnB1c2gobW9kdWxlSWQpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgYnJlYWs7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgZGVmYXVsdDpcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGJyZWFrO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICB9LFxuLyoqKioqKi8gXHRcdCAgICAgICAgY2hlY2s6IGhvdENoZWNrLFxuLyoqKioqKi8gXHRcdCAgICAgICAgYXBwbHk6IGhvdEFwcGx5LFxuLyoqKioqKi8gXHRcdCAgICAgICAgc3RhdHVzOiBmdW5jdGlvbihsKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGlmICghbClcbi8qKioqKiovIFx0XHQgICAgICAgICAgICByZXR1cm4gY3VycmVudFN0YXR1cztcbi8qKioqKiovIFx0XHQgICAgICAgICAgcmVnaXN0ZXJlZFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG4vKioqKioqLyBcdFx0ICAgICAgICB9LFxuLyoqKioqKi8gXHRcdCAgICAgICAgYWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICByZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbi8qKioqKiovIFx0XHQgICAgICAgIH0sXG4vKioqKioqLyBcdFx0ICAgICAgICByZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIHZhciBpZHggPSByZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgaWYgKGlkeCA+PSAwKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbi8qKioqKiovIFx0XHQgICAgICAgIH0sXG4vKioqKioqLyBcdFx0ICAgICAgICBkYXRhOiBjdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cbi8qKioqKiovIFx0XHQgICAgICB9O1xuLyoqKioqKi8gXHRcdCAgICAgIGN1cnJlbnRDaGlsZE1vZHVsZSA9IHZvaWQgMDtcbi8qKioqKiovIFx0XHQgICAgICByZXR1cm4gaG90O1xuLyoqKioqKi8gXHRcdCAgICB9XG4vKioqKioqLyBcdFx0ICAgIGZ1bmN0aW9uIHNldFN0YXR1cyhuZXdTdGF0dXMpIHtcbi8qKioqKiovIFx0XHQgICAgICBjdXJyZW50U3RhdHVzID0gbmV3U3RhdHVzO1xuLyoqKioqKi8gXHRcdCAgICAgIHZhciByZXN1bHRzID0gW107XG4vKioqKioqLyBcdFx0ICAgICAgZm9yICh2YXIgaSA9IDA7aSA8IHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcbi8qKioqKiovIFx0XHQgICAgICAgIHJlc3VsdHNbaV0gPSByZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xuLyoqKioqKi8gXHRcdCAgICAgIHJldHVybiBQcm9taXNlLmFsbChyZXN1bHRzKS50aGVuKGZ1bmN0aW9uKCkge30pO1xuLyoqKioqKi8gXHRcdCAgICB9XG4vKioqKioqLyBcdFx0ICAgIGZ1bmN0aW9uIHVuYmxvY2soKSB7XG4vKioqKioqLyBcdFx0ICAgICAgaWYgKC0tYmxvY2tpbmdQcm9taXNlcyA9PT0gMClcbi8qKioqKiovIFx0XHQgICAgICAgIHNldFN0YXR1cyhcInJlYWR5XCIpLnRoZW4oZnVuY3Rpb24oKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGlmIChibG9ja2luZ1Byb21pc2VzID09PSAwKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgdmFyIGxpc3QgPSBibG9ja2luZ1Byb21pc2VzV2FpdGluZztcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBibG9ja2luZ1Byb21pc2VzV2FpdGluZyA9IFtdO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwO2kgPCBsaXN0Lmxlbmd0aDsgaSsrKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgbGlzdFtpXSgpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgfVxuLyoqKioqKi8gXHRcdCAgICBmdW5jdGlvbiB0cmFja0Jsb2NraW5nUHJvbWlzZShwcm9taXNlKSB7XG4vKioqKioqLyBcdFx0ICAgICAgc3dpdGNoIChjdXJyZW50U3RhdHVzKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICBjYXNlIFwicmVhZHlcIjpcbi8qKioqKiovIFx0XHQgICAgICAgICAgc2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbi8qKioqKiovIFx0XHQgICAgICAgIGNhc2UgXCJwcmVwYXJlXCI6XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGJsb2NraW5nUHJvbWlzZXMrKztcbi8qKioqKiovIFx0XHQgICAgICAgICAgcHJvbWlzZS50aGVuKHVuYmxvY2ssIHVuYmxvY2spO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbi8qKioqKiovIFx0XHQgICAgICAgIGRlZmF1bHQ6XG4vKioqKioqLyBcdFx0ICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuLyoqKioqKi8gXHRcdCAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgfVxuLyoqKioqKi8gXHRcdCAgICBmdW5jdGlvbiB3YWl0Rm9yQmxvY2tpbmdQcm9taXNlcyhmbikge1xuLyoqKioqKi8gXHRcdCAgICAgIGlmIChibG9ja2luZ1Byb21pc2VzID09PSAwKVxuLyoqKioqKi8gXHRcdCAgICAgICAgcmV0dXJuIGZuKCk7XG4vKioqKioqLyBcdFx0ICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbi8qKioqKiovIFx0XHQgICAgICAgIGJsb2NraW5nUHJvbWlzZXNXYWl0aW5nLnB1c2goZnVuY3Rpb24oKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIHJlc29sdmUoZm4oKSk7XG4vKioqKioqLyBcdFx0ICAgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgfVxuLyoqKioqKi8gXHRcdCAgICBmdW5jdGlvbiBob3RDaGVjayhhcHBseU9uVXBkYXRlKSB7XG4vKioqKioqLyBcdFx0ICAgICAgaWYgKGN1cnJlbnRTdGF0dXMgIT09IFwiaWRsZVwiKVxuLyoqKioqKi8gXHRcdCAgICAgICAgdGhyb3cgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcbi8qKioqKiovIFx0XHQgICAgICByZXR1cm4gc2V0U3RhdHVzKFwiY2hlY2tcIikudGhlbihfX3dlYnBhY2tfcmVxdWlyZV9fLmhtck0pLnRoZW4oZnVuY3Rpb24odXBkYXRlKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICBpZiAoIXVwZGF0ZSlcbi8qKioqKiovIFx0XHQgICAgICAgICAgcmV0dXJuIHNldFN0YXR1cyhhcHBseUludmFsaWRhdGVkTW9kdWxlcygpID8gXCJyZWFkeVwiIDogXCJpZGxlXCIpLnRoZW4oZnVuY3Rpb24oKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgcmV0dXJuIHNldFN0YXR1cyhcInByZXBhcmVcIikudGhlbihmdW5jdGlvbigpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgdmFyIHVwZGF0ZWRNb2R1bGVzID0gW107XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzID0gW107XG4vKioqKioqLyBcdFx0ICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckMpLnJlZHVjZShmdW5jdGlvbihwcm9taXNlcywga2V5KSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgX193ZWJwYWNrX3JlcXVpcmVfXy5obXJDW2tleV0odXBkYXRlLmMsIHVwZGF0ZS5yLCB1cGRhdGUubSwgcHJvbWlzZXMsIGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzLCB1cGRhdGVkTW9kdWxlcyk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgcmV0dXJuIHByb21pc2VzO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB9LCBbXSkpLnRoZW4oZnVuY3Rpb24oKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgcmV0dXJuIHdhaXRGb3JCbG9ja2luZ1Byb21pc2VzKGZ1bmN0aW9uKCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgaWYgKGFwcGx5T25VcGRhdGUpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIHJldHVybiBpbnRlcm5hbEFwcGx5KGFwcGx5T25VcGRhdGUpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgcmV0dXJuIHNldFN0YXR1cyhcInJlYWR5XCIpLnRoZW4oZnVuY3Rpb24oKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGVkTW9kdWxlcztcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICB9XG4vKioqKioqLyBcdFx0ICAgIGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcbi8qKioqKiovIFx0XHQgICAgICBpZiAoY3VycmVudFN0YXR1cyAhPT0gXCJyZWFkeVwiKVxuLyoqKioqKi8gXHRcdCAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIHRocm93IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzIChzdGF0ZTogXCIgKyBjdXJyZW50U3RhdHVzICsgXCIpXCIpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgICAgcmV0dXJuIGludGVybmFsQXBwbHkob3B0aW9ucyk7XG4vKioqKioqLyBcdFx0ICAgIH1cbi8qKioqKiovIFx0XHQgICAgZnVuY3Rpb24gaW50ZXJuYWxBcHBseShvcHRpb25zKSB7XG4vKioqKioqLyBcdFx0ICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4vKioqKioqLyBcdFx0ICAgICAgYXBwbHlJbnZhbGlkYXRlZE1vZHVsZXMoKTtcbi8qKioqKiovIFx0XHQgICAgICB2YXIgcmVzdWx0cyA9IGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzLm1hcChmdW5jdGlvbihoYW5kbGVyKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICByZXR1cm4gaGFuZGxlcihvcHRpb25zKTtcbi8qKioqKiovIFx0XHQgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICBjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycyA9IHZvaWQgMDtcbi8qKioqKiovIFx0XHQgICAgICB2YXIgZXJyb3JzID0gcmVzdWx0cy5tYXAoZnVuY3Rpb24ocikge1xuLyoqKioqKi8gXHRcdCAgICAgICAgcmV0dXJuIHIuZXJyb3I7XG4vKioqKioqLyBcdFx0ICAgICAgfSkuZmlsdGVyKEJvb2xlYW4pO1xuLyoqKioqKi8gXHRcdCAgICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMClcbi8qKioqKiovIFx0XHQgICAgICAgIHJldHVybiBzZXRTdGF0dXMoXCJhYm9ydFwiKS50aGVuKGZ1bmN0aW9uKCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB0aHJvdyBlcnJvcnNbMF07XG4vKioqKioqLyBcdFx0ICAgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICB2YXIgZGlzcG9zZVByb21pc2UgPSBzZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xuLyoqKioqKi8gXHRcdCAgICAgIHJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbihyZXN1bHQpIHtcbi8qKioqKiovIFx0XHQgICAgICAgIGlmIChyZXN1bHQuZGlzcG9zZSlcbi8qKioqKiovIFx0XHQgICAgICAgICAgcmVzdWx0LmRpc3Bvc2UoKTtcbi8qKioqKiovIFx0XHQgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICB2YXIgYXBwbHlQcm9taXNlID0gc2V0U3RhdHVzKFwiYXBwbHlcIiksIGVycm9yLCByZXBvcnRFcnJvciA9IGZ1bmN0aW9uKGVycikge1xuLyoqKioqKi8gXHRcdCAgICAgICAgaWYgKCFlcnJvcilcbi8qKioqKiovIFx0XHQgICAgICAgICAgZXJyb3IgPSBlcnI7XG4vKioqKioqLyBcdFx0ICAgICAgfSwgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4vKioqKioqLyBcdFx0ICAgICAgcmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uKHJlc3VsdCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgaWYgKHJlc3VsdC5hcHBseSkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB2YXIgbW9kdWxlcyA9IHJlc3VsdC5hcHBseShyZXBvcnRFcnJvcik7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGlmIChtb2R1bGVzKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwO2kgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgb3V0ZGF0ZWRNb2R1bGVzLnB1c2gobW9kdWxlc1tpXSk7XG4vKioqKioqLyBcdFx0ICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtkaXNwb3NlUHJvbWlzZSwgYXBwbHlQcm9taXNlXSkudGhlbihmdW5jdGlvbigpIHtcbi8qKioqKiovIFx0XHQgICAgICAgIGlmIChlcnJvcilcbi8qKioqKiovIFx0XHQgICAgICAgICAgcmV0dXJuIHNldFN0YXR1cyhcImZhaWxcIikudGhlbihmdW5jdGlvbigpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbi8qKioqKiovIFx0XHQgICAgICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgICAgICBpZiAocXVldWVkSW52YWxpZGF0ZWRNb2R1bGVzKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICByZXR1cm4gaW50ZXJuYWxBcHBseShvcHRpb25zKS50aGVuKGZ1bmN0aW9uKGxpc3QpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBvdXRkYXRlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihtb2R1bGVJZCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgaWYgKGxpc3QuaW5kZXhPZihtb2R1bGVJZCkgPCAwKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBsaXN0LnB1c2gobW9kdWxlSWQpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIHJldHVybiBsaXN0O1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICAgIHJldHVybiBzZXRTdGF0dXMoXCJpZGxlXCIpLnRoZW4oZnVuY3Rpb24oKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIHJldHVybiBvdXRkYXRlZE1vZHVsZXM7XG4vKioqKioqLyBcdFx0ICAgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgfVxuLyoqKioqKi8gXHRcdCAgICBmdW5jdGlvbiBhcHBseUludmFsaWRhdGVkTW9kdWxlcygpIHtcbi8qKioqKiovIFx0XHQgICAgICBpZiAocXVldWVkSW52YWxpZGF0ZWRNb2R1bGVzKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICBpZiAoIWN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICBjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycyA9IFtdO1xuLyoqKioqKi8gXHRcdCAgICAgICAgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5obXJJKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihtb2R1bGVJZCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIF9fd2VicGFja19yZXF1aXJlX18uaG1ySVtrZXldKG1vZHVsZUlkLCBjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycyk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgICAgICBxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXMgPSB2b2lkIDA7XG4vKioqKioqLyBcdFx0ICAgICAgICByZXR1cm4gITA7XG4vKioqKioqLyBcdFx0ICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICB9XG4vKioqKioqLyBcdFx0ICBcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvX25leHQvXCI7XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvcmVhY3QgcmVmcmVzaCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmkpIHtcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkucHVzaCgob3B0aW9ucykgPT4ge1xuLyoqKioqKi8gXHRcdFx0Y29uc3Qgb3JpZ2luYWxGYWN0b3J5ID0gb3B0aW9ucy5mYWN0b3J5O1xuLyoqKioqKi8gXHRcdFx0b3B0aW9ucy5mYWN0b3J5ID0gKG1vZHVsZU9iamVjdCwgbW9kdWxlRXhwb3J0cywgd2VicGFja1JlcXVpcmUpID0+IHtcbi8qKioqKiovIFx0XHRcdFx0Y29uc3QgaGFzUmVmcmVzaCA9IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmICEhc2VsZi4kUmVmcmVzaEludGVyY2VwdE1vZHVsZUV4ZWN1dGlvbiQ7XG4vKioqKioqLyBcdFx0XHRcdGNvbnN0IGNsZWFudXAgPSBoYXNSZWZyZXNoID8gc2VsZi4kUmVmcmVzaEludGVyY2VwdE1vZHVsZUV4ZWN1dGlvbiQobW9kdWxlT2JqZWN0LmlkKSA6ICgpID0+IHt9O1xuLyoqKioqKi8gXHRcdFx0XHR0cnkge1xuLyoqKioqKi8gXHRcdFx0XHRcdG9yaWdpbmFsRmFjdG9yeS5jYWxsKHRoaXMsIG1vZHVsZU9iamVjdCwgbW9kdWxlRXhwb3J0cywgd2VicGFja1JlcXVpcmUpO1xuLyoqKioqKi8gXHRcdFx0XHR9IGZpbmFsbHkge1xuLyoqKioqKi8gXHRcdFx0XHRcdGNsZWFudXAoKTtcbi8qKioqKiovIFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdH0pXG4vKioqKioqLyBcdFx0fVxuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2NvbXBhdCAqL1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8vIG5vb3AgZm5zIHRvIHByZXZlbnQgcnVudGltZSBlcnJvcnMgZHVyaW5nIGluaXRpYWxpemF0aW9uXG4vKioqKioqLyBcdGlmICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIikge1xuLyoqKioqKi8gXHRcdHNlbGYuJFJlZnJlc2hSZWckID0gZnVuY3Rpb24gKCkge307XG4vKioqKioqLyBcdFx0c2VsZi4kUmVmcmVzaFNpZyQgPSBmdW5jdGlvbiAoKSB7XG4vKioqKioqLyBcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHR5cGUpIHtcbi8qKioqKiovIFx0XHRcdFx0cmV0dXJuIHR5cGU7XG4vKioqKioqLyBcdFx0XHR9O1xuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH1cbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9jc3MgbG9hZGluZyAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdHZhciBjcmVhdGVTdHlsZXNoZWV0ID0gKGNodW5rSWQsIGZ1bGxocmVmLCByZXNvbHZlLCByZWplY3QpID0+IHtcbi8qKioqKiovIFx0XHRcdHZhciBsaW5rVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG4vKioqKioqLyBcdFx0XG4vKioqKioqLyBcdFx0XHRsaW5rVGFnLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuLyoqKioqKi8gXHRcdFx0bGlua1RhZy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuLyoqKioqKi8gXHRcdFx0dmFyIG9uTGlua0NvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4vKioqKioqLyBcdFx0XHRcdC8vIGF2b2lkIG1lbSBsZWFrcy5cbi8qKioqKiovIFx0XHRcdFx0bGlua1RhZy5vbmVycm9yID0gbGlua1RhZy5vbmxvYWQgPSBudWxsO1xuLyoqKioqKi8gXHRcdFx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ2xvYWQnKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0cmVzb2x2ZSgpO1xuLyoqKioqKi8gXHRcdFx0XHR9IGVsc2Uge1xuLyoqKioqKi8gXHRcdFx0XHRcdHZhciBlcnJvclR5cGUgPSBldmVudCAmJiAoZXZlbnQudHlwZSA9PT0gJ2xvYWQnID8gJ21pc3NpbmcnIDogZXZlbnQudHlwZSk7XG4vKioqKioqLyBcdFx0XHRcdFx0dmFyIHJlYWxIcmVmID0gZXZlbnQgJiYgZXZlbnQudGFyZ2V0ICYmIGV2ZW50LnRhcmdldC5ocmVmIHx8IGZ1bGxocmVmO1xuLyoqKioqKi8gXHRcdFx0XHRcdHZhciBlcnIgPSBuZXcgRXJyb3IoXCJMb2FkaW5nIENTUyBjaHVuayBcIiArIGNodW5rSWQgKyBcIiBmYWlsZWQuXFxuKFwiICsgcmVhbEhyZWYgKyBcIilcIik7XG4vKioqKioqLyBcdFx0XHRcdFx0ZXJyLmNvZGUgPSBcIkNTU19DSFVOS19MT0FEX0ZBSUxFRFwiO1xuLyoqKioqKi8gXHRcdFx0XHRcdGVyci50eXBlID0gZXJyb3JUeXBlO1xuLyoqKioqKi8gXHRcdFx0XHRcdGVyci5yZXF1ZXN0ID0gcmVhbEhyZWY7XG4vKioqKioqLyBcdFx0XHRcdFx0bGlua1RhZy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGxpbmtUYWcpXG4vKioqKioqLyBcdFx0XHRcdFx0cmVqZWN0KGVycik7XG4vKioqKioqLyBcdFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdGxpbmtUYWcub25lcnJvciA9IGxpbmtUYWcub25sb2FkID0gb25MaW5rQ29tcGxldGU7XG4vKioqKioqLyBcdFx0XHRsaW5rVGFnLmhyZWYgPSBmdWxsaHJlZjtcbi8qKioqKiovIFx0XHRcbi8qKioqKiovIFx0XHRcdChmdW5jdGlvbihsaW5rVGFnKSB7XG4vKioqKioqLyBcdFx0XHQgICAgICAgICAgaWYgKHR5cGVvZiBfTl9FX1NUWUxFX0xPQUQgPT09IFwiZnVuY3Rpb25cIikge1xuLyoqKioqKi8gXHRcdFx0ICAgICAgICAgICAgY29uc3QgeyBocmVmLCBvbmxvYWQsIG9uZXJyb3IgfSA9IGxpbmtUYWc7XG4vKioqKioqLyBcdFx0XHQgICAgICAgICAgICBfTl9FX1NUWUxFX0xPQUQoaHJlZi5pbmRleE9mKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pID09PSAwID8gbmV3IFVSTChocmVmKS5wYXRobmFtZSA6IGhyZWYpLnRoZW4oKCkgPT4gb25sb2FkID09IG51bGwgPyB2b2lkIDAgOiBvbmxvYWQuY2FsbChsaW5rVGFnLCB7XG4vKioqKioqLyBcdFx0XHQgICAgICAgICAgICAgIHR5cGU6IFwibG9hZFwiXG4vKioqKioqLyBcdFx0XHQgICAgICAgICAgICB9KSwgKCkgPT4gb25lcnJvciA9PSBudWxsID8gdm9pZCAwIDogb25lcnJvci5jYWxsKGxpbmtUYWcsIHt9KSk7XG4vKioqKioqLyBcdFx0XHQgICAgICAgICAgfSBlbHNlXG4vKioqKioqLyBcdFx0XHQgICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGxpbmtUYWcpO1xuLyoqKioqKi8gXHRcdFx0ICAgICAgICB9KShsaW5rVGFnKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGxpbmtUYWc7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0XHR2YXIgZmluZFN0eWxlc2hlZXQgPSAoaHJlZiwgZnVsbGhyZWYpID0+IHtcbi8qKioqKiovIFx0XHRcdHZhciBleGlzdGluZ0xpbmtUYWdzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsaW5rXCIpO1xuLyoqKioqKi8gXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGV4aXN0aW5nTGlua1RhZ3MubGVuZ3RoOyBpKyspIHtcbi8qKioqKiovIFx0XHRcdFx0dmFyIHRhZyA9IGV4aXN0aW5nTGlua1RhZ3NbaV07XG4vKioqKioqLyBcdFx0XHRcdHZhciBkYXRhSHJlZiA9IHRhZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWhyZWZcIikgfHwgdGFnLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XG4vKioqKioqLyBcdFx0XHRcdGlmKHRhZy5yZWwgPT09IFwic3R5bGVzaGVldFwiICYmIChkYXRhSHJlZiA9PT0gaHJlZiB8fCBkYXRhSHJlZiA9PT0gZnVsbGhyZWYpKSByZXR1cm4gdGFnO1xuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0dmFyIGV4aXN0aW5nU3R5bGVUYWdzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzdHlsZVwiKTtcbi8qKioqKiovIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBleGlzdGluZ1N0eWxlVGFncy5sZW5ndGg7IGkrKykge1xuLyoqKioqKi8gXHRcdFx0XHR2YXIgdGFnID0gZXhpc3RpbmdTdHlsZVRhZ3NbaV07XG4vKioqKioqLyBcdFx0XHRcdHZhciBkYXRhSHJlZiA9IHRhZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWhyZWZcIik7XG4vKioqKioqLyBcdFx0XHRcdGlmKGRhdGFIcmVmID09PSBocmVmIHx8IGRhdGFIcmVmID09PSBmdWxsaHJlZikgcmV0dXJuIHRhZztcbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHRcdHZhciBsb2FkU3R5bGVzaGVldCA9IChjaHVua0lkKSA9PiB7XG4vKioqKioqLyBcdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuLyoqKioqKi8gXHRcdFx0XHR2YXIgaHJlZiA9IF9fd2VicGFja19yZXF1aXJlX18ubWluaUNzc0YoY2h1bmtJZCk7XG4vKioqKioqLyBcdFx0XHRcdHZhciBmdWxsaHJlZiA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIGhyZWY7XG4vKioqKioqLyBcdFx0XHRcdGlmKGZpbmRTdHlsZXNoZWV0KGhyZWYsIGZ1bGxocmVmKSkgcmV0dXJuIHJlc29sdmUoKTtcbi8qKioqKiovIFx0XHRcdFx0Y3JlYXRlU3R5bGVzaGVldChjaHVua0lkLCBmdWxsaHJlZiwgcmVzb2x2ZSwgcmVqZWN0KTtcbi8qKioqKiovIFx0XHRcdH0pO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0XHQvLyBubyBjaHVuayBsb2FkaW5nXG4vKioqKioqLyBcdFx0XG4vKioqKioqLyBcdFx0dmFyIG9sZFRhZ3MgPSBbXTtcbi8qKioqKiovIFx0XHR2YXIgbmV3VGFncyA9IFtdO1xuLyoqKioqKi8gXHRcdHZhciBhcHBseUhhbmRsZXIgPSAob3B0aW9ucykgPT4ge1xuLyoqKioqKi8gXHRcdFx0cmV0dXJuIHsgZGlzcG9zZTogKCkgPT4ge1xuLyoqKioqKi8gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgb2xkVGFncy5sZW5ndGg7IGkrKykge1xuLyoqKioqKi8gXHRcdFx0XHRcdHZhciBvbGRUYWcgPSBvbGRUYWdzW2ldO1xuLyoqKioqKi8gXHRcdFx0XHRcdGlmKG9sZFRhZy5wYXJlbnROb2RlKSBvbGRUYWcucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGRUYWcpO1xuLyoqKioqKi8gXHRcdFx0XHR9XG4vKioqKioqLyBcdFx0XHRcdG9sZFRhZ3MubGVuZ3RoID0gMDtcbi8qKioqKiovIFx0XHRcdH0sIGFwcGx5OiAoKSA9PiB7XG4vKioqKioqLyBcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBuZXdUYWdzLmxlbmd0aDsgaSsrKSBuZXdUYWdzW2ldLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuLyoqKioqKi8gXHRcdFx0XHRuZXdUYWdzLmxlbmd0aCA9IDA7XG4vKioqKioqLyBcdFx0XHR9IH07XG4vKioqKioqLyBcdFx0fVxuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uaG1yQy5taW5pQ3NzID0gKGNodW5rSWRzLCByZW1vdmVkQ2h1bmtzLCByZW1vdmVkTW9kdWxlcywgcHJvbWlzZXMsIGFwcGx5SGFuZGxlcnMsIHVwZGF0ZWRNb2R1bGVzTGlzdCkgPT4ge1xuLyoqKioqKi8gXHRcdFx0YXBwbHlIYW5kbGVycy5wdXNoKGFwcGx5SGFuZGxlcik7XG4vKioqKioqLyBcdFx0XHRjaHVua0lkcy5mb3JFYWNoKChjaHVua0lkKSA9PiB7XG4vKioqKioqLyBcdFx0XHRcdHZhciBocmVmID0gX193ZWJwYWNrX3JlcXVpcmVfXy5taW5pQ3NzRihjaHVua0lkKTtcbi8qKioqKiovIFx0XHRcdFx0dmFyIGZ1bGxocmVmID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgaHJlZjtcbi8qKioqKiovIFx0XHRcdFx0dmFyIG9sZFRhZyA9IGZpbmRTdHlsZXNoZWV0KGhyZWYsIGZ1bGxocmVmKTtcbi8qKioqKiovIFx0XHRcdFx0aWYoIW9sZFRhZykgcmV0dXJuO1xuLyoqKioqKi8gXHRcdFx0XHRwcm9taXNlcy5wdXNoKG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbi8qKioqKiovIFx0XHRcdFx0XHR2YXIgdGFnID0gY3JlYXRlU3R5bGVzaGVldChjaHVua0lkLCBmdWxsaHJlZiwgKCkgPT4ge1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0dGFnLmFzID0gXCJzdHlsZVwiO1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0dGFnLnJlbCA9IFwicHJlbG9hZFwiO1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0cmVzb2x2ZSgpO1xuLyoqKioqKi8gXHRcdFx0XHRcdH0sIHJlamVjdCk7XG4vKioqKioqLyBcdFx0XHRcdFx0b2xkVGFncy5wdXNoKG9sZFRhZyk7XG4vKioqKioqLyBcdFx0XHRcdFx0bmV3VGFncy5wdXNoKHRhZyk7XG4vKioqKioqLyBcdFx0XHRcdH0pKTtcbi8qKioqKiovIFx0XHRcdH0pO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0Ly8gbm8gYmFzZVVSSVxuLyoqKioqKi8gXHRcdFxuLyoqKioqKi8gXHRcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vKioqKioqLyBcdFx0Ly8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vKioqKioqLyBcdFx0Ly8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG4vKioqKioqLyBcdFx0dmFyIGluc3RhbGxlZENodW5rcyA9IF9fd2VicGFja19yZXF1aXJlX18uaG1yU19qc29ucCA9IF9fd2VicGFja19yZXF1aXJlX18uaG1yU19qc29ucCB8fCB7XG4vKioqKioqLyBcdFx0XHRcIndlYnBhY2tcIjogMFxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdFx0XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5mLmogPSAoY2h1bmtJZCwgcHJvbWlzZXMpID0+IHtcbi8qKioqKiovIFx0XHRcdFx0Ly8gSlNPTlAgY2h1bmsgbG9hZGluZyBmb3IgamF2YXNjcmlwdFxuLyoqKioqKi8gXHRcdFx0XHR2YXIgaW5zdGFsbGVkQ2h1bmtEYXRhID0gX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgPyBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gOiB1bmRlZmluZWQ7XG4vKioqKioqLyBcdFx0XHRcdGlmKGluc3RhbGxlZENodW5rRGF0YSAhPT0gMCkgeyAvLyAwIG1lYW5zIFwiYWxyZWFkeSBpbnN0YWxsZWRcIi5cbi8qKioqKiovIFx0XHRcbi8qKioqKiovIFx0XHRcdFx0XHQvLyBhIFByb21pc2UgbWVhbnMgXCJjdXJyZW50bHkgbG9hZGluZ1wiLlxuLyoqKioqKi8gXHRcdFx0XHRcdGlmKGluc3RhbGxlZENodW5rRGF0YSkge1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0cHJvbWlzZXMucHVzaChpbnN0YWxsZWRDaHVua0RhdGFbMl0pO1xuLyoqKioqKi8gXHRcdFx0XHRcdH0gZWxzZSB7XG4vKioqKioqLyBcdFx0XHRcdFx0XHRpZihcIndlYnBhY2tcIiAhPSBjaHVua0lkKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0XHRcdC8vIHNldHVwIFByb21pc2UgaW4gY2h1bmsgY2FjaGVcbi8qKioqKiovIFx0XHRcdFx0XHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiAoaW5zdGFsbGVkQ2h1bmtEYXRhID0gaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gW3Jlc29sdmUsIHJlamVjdF0pKTtcbi8qKioqKiovIFx0XHRcdFx0XHRcdFx0cHJvbWlzZXMucHVzaChpbnN0YWxsZWRDaHVua0RhdGFbMl0gPSBwcm9taXNlKTtcbi8qKioqKiovIFx0XHRcbi8qKioqKiovIFx0XHRcdFx0XHRcdFx0Ly8gc3RhcnQgY2h1bmsgbG9hZGluZ1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0XHR2YXIgdXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgX193ZWJwYWNrX3JlcXVpcmVfXy51KGNodW5rSWQpO1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0XHQvLyBjcmVhdGUgZXJyb3IgYmVmb3JlIHN0YWNrIHVud291bmQgdG8gZ2V0IHVzZWZ1bCBzdGFja3RyYWNlIGxhdGVyXG4vKioqKioqLyBcdFx0XHRcdFx0XHRcdHZhciBlcnJvciA9IG5ldyBFcnJvcigpO1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0XHR2YXIgbG9hZGluZ0VuZGVkID0gKGV2ZW50KSA9PiB7XG4vKioqKioqLyBcdFx0XHRcdFx0XHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkpIHtcbi8qKioqKiovIFx0XHRcdFx0XHRcdFx0XHRcdGluc3RhbGxlZENodW5rRGF0YSA9IGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbi8qKioqKiovIFx0XHRcdFx0XHRcdFx0XHRcdGlmKGluc3RhbGxlZENodW5rRGF0YSAhPT0gMCkgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gdW5kZWZpbmVkO1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0XHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtEYXRhKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBlcnJvclR5cGUgPSBldmVudCAmJiAoZXZlbnQudHlwZSA9PT0gJ2xvYWQnID8gJ21pc3NpbmcnIDogZXZlbnQudHlwZSk7XG4vKioqKioqLyBcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciByZWFsU3JjID0gZXZlbnQgJiYgZXZlbnQudGFyZ2V0ICYmIGV2ZW50LnRhcmdldC5zcmM7XG4vKioqKioqLyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yLm1lc3NhZ2UgPSAnTG9hZGluZyBjaHVuayAnICsgY2h1bmtJZCArICcgZmFpbGVkLlxcbignICsgZXJyb3JUeXBlICsgJzogJyArIHJlYWxTcmMgKyAnKSc7XG4vKioqKioqLyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yLm5hbWUgPSAnQ2h1bmtMb2FkRXJyb3InO1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvci50eXBlID0gZXJyb3JUeXBlO1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvci5yZXF1ZXN0ID0gcmVhbFNyYztcbi8qKioqKiovIFx0XHRcdFx0XHRcdFx0XHRcdFx0aW5zdGFsbGVkQ2h1bmtEYXRhWzFdKGVycm9yKTtcbi8qKioqKiovIFx0XHRcdFx0XHRcdFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdFx0XHRcdFx0XHR9XG4vKioqKioqLyBcdFx0XHRcdFx0XHRcdH07XG4vKioqKioqLyBcdFx0XHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubCh1cmwsIGxvYWRpbmdFbmRlZCwgXCJjaHVuay1cIiArIGNodW5rSWQsIGNodW5rSWQpO1xuLyoqKioqKi8gXHRcdFx0XHRcdFx0fSBlbHNlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG4vKioqKioqLyBcdFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0XHR9XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0XHRcbi8qKioqKiovIFx0XHQvLyBubyBwcmVmZXRjaGluZ1xuLyoqKioqKi8gXHRcdFxuLyoqKioqKi8gXHRcdC8vIG5vIHByZWxvYWRlZFxuLyoqKioqKi8gXHRcdFxuLyoqKioqKi8gXHRcdHZhciBjdXJyZW50VXBkYXRlZE1vZHVsZXNMaXN0O1xuLyoqKioqKi8gXHRcdHZhciB3YWl0aW5nVXBkYXRlUmVzb2x2ZXMgPSB7fTtcbi8qKioqKiovIFx0XHRmdW5jdGlvbiBsb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgdXBkYXRlZE1vZHVsZXNMaXN0KSB7XG4vKioqKioqLyBcdFx0XHRjdXJyZW50VXBkYXRlZE1vZHVsZXNMaXN0ID0gdXBkYXRlZE1vZHVsZXNMaXN0O1xuLyoqKioqKi8gXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbi8qKioqKiovIFx0XHRcdFx0d2FpdGluZ1VwZGF0ZVJlc29sdmVzW2NodW5rSWRdID0gcmVzb2x2ZTtcbi8qKioqKiovIFx0XHRcdFx0Ly8gc3RhcnQgdXBkYXRlIGNodW5rIGxvYWRpbmdcbi8qKioqKiovIFx0XHRcdFx0dmFyIHVybCA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIF9fd2VicGFja19yZXF1aXJlX18uaHUoY2h1bmtJZCk7XG4vKioqKioqLyBcdFx0XHRcdC8vIGNyZWF0ZSBlcnJvciBiZWZvcmUgc3RhY2sgdW53b3VuZCB0byBnZXQgdXNlZnVsIHN0YWNrdHJhY2UgbGF0ZXJcbi8qKioqKiovIFx0XHRcdFx0dmFyIGVycm9yID0gbmV3IEVycm9yKCk7XG4vKioqKioqLyBcdFx0XHRcdHZhciBsb2FkaW5nRW5kZWQgPSAoZXZlbnQpID0+IHtcbi8qKioqKiovIFx0XHRcdFx0XHRpZih3YWl0aW5nVXBkYXRlUmVzb2x2ZXNbY2h1bmtJZF0pIHtcbi8qKioqKiovIFx0XHRcdFx0XHRcdHdhaXRpbmdVcGRhdGVSZXNvbHZlc1tjaHVua0lkXSA9IHVuZGVmaW5lZFxuLyoqKioqKi8gXHRcdFx0XHRcdFx0dmFyIGVycm9yVHlwZSA9IGV2ZW50ICYmIChldmVudC50eXBlID09PSAnbG9hZCcgPyAnbWlzc2luZycgOiBldmVudC50eXBlKTtcbi8qKioqKiovIFx0XHRcdFx0XHRcdHZhciByZWFsU3JjID0gZXZlbnQgJiYgZXZlbnQudGFyZ2V0ICYmIGV2ZW50LnRhcmdldC5zcmM7XG4vKioqKioqLyBcdFx0XHRcdFx0XHRlcnJvci5tZXNzYWdlID0gJ0xvYWRpbmcgaG90IHVwZGF0ZSBjaHVuayAnICsgY2h1bmtJZCArICcgZmFpbGVkLlxcbignICsgZXJyb3JUeXBlICsgJzogJyArIHJlYWxTcmMgKyAnKSc7XG4vKioqKioqLyBcdFx0XHRcdFx0XHRlcnJvci5uYW1lID0gJ0NodW5rTG9hZEVycm9yJztcbi8qKioqKiovIFx0XHRcdFx0XHRcdGVycm9yLnR5cGUgPSBlcnJvclR5cGU7XG4vKioqKioqLyBcdFx0XHRcdFx0XHRlcnJvci5yZXF1ZXN0ID0gcmVhbFNyYztcbi8qKioqKiovIFx0XHRcdFx0XHRcdHJlamVjdChlcnJvcik7XG4vKioqKioqLyBcdFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0XHR9O1xuLyoqKioqKi8gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmwodXJsLCBsb2FkaW5nRW5kZWQpO1xuLyoqKioqKi8gXHRcdFx0fSk7XG4vKioqKioqLyBcdFx0fVxuLyoqKioqKi8gXHRcdFxuLyoqKioqKi8gXHRcdHNlbGZbXCJ3ZWJwYWNrSG90VXBkYXRlX05fRVwiXSA9IChjaHVua0lkLCBtb3JlTW9kdWxlcywgcnVudGltZSkgPT4ge1xuLyoqKioqKi8gXHRcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuLyoqKioqKi8gXHRcdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuLyoqKioqKi8gXHRcdFx0XHRcdGN1cnJlbnRVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuLyoqKioqKi8gXHRcdFx0XHRcdGlmKGN1cnJlbnRVcGRhdGVkTW9kdWxlc0xpc3QpIGN1cnJlbnRVcGRhdGVkTW9kdWxlc0xpc3QucHVzaChtb2R1bGVJZCk7XG4vKioqKioqLyBcdFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdGlmKHJ1bnRpbWUpIGN1cnJlbnRVcGRhdGVSdW50aW1lLnB1c2gocnVudGltZSk7XG4vKioqKioqLyBcdFx0XHRpZih3YWl0aW5nVXBkYXRlUmVzb2x2ZXNbY2h1bmtJZF0pIHtcbi8qKioqKiovIFx0XHRcdFx0d2FpdGluZ1VwZGF0ZVJlc29sdmVzW2NodW5rSWRdKCk7XG4vKioqKioqLyBcdFx0XHRcdHdhaXRpbmdVcGRhdGVSZXNvbHZlc1tjaHVua0lkXSA9IHVuZGVmaW5lZDtcbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHRcdFxuLyoqKioqKi8gXHRcdCAgICB2YXIgY3VycmVudFVwZGF0ZUNodW5rcywgY3VycmVudFVwZGF0ZSwgY3VycmVudFVwZGF0ZVJlbW92ZWRDaHVua3MsIGN1cnJlbnRVcGRhdGVSdW50aW1lO1xuLyoqKioqKi8gXHRcdCAgICBmdW5jdGlvbiBhcHBseUhhbmRsZXIob3B0aW9ucykge1xuLyoqKioqKi8gXHRcdCAgICAgIGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmYpXG4vKioqKioqLyBcdFx0ICAgICAgICBkZWxldGUgX193ZWJwYWNrX3JlcXVpcmVfXy5mLmpzb25wSG1yO1xuLyoqKioqKi8gXHRcdCAgICAgIGN1cnJlbnRVcGRhdGVDaHVua3MgPSB2b2lkIDA7XG4vKioqKioqLyBcdFx0ICAgICAgZnVuY3Rpb24gZ2V0QWZmZWN0ZWRNb2R1bGVFZmZlY3RzKHVwZGF0ZU1vZHVsZUlkKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICB2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXSwgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fSwgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMubWFwKGZ1bmN0aW9uKGlkKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIHJldHVybiB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgY2hhaW46IFtpZF0sXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgaWRcbi8qKioqKiovIFx0XHQgICAgICAgICAgfTtcbi8qKioqKiovIFx0XHQgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgd2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgdmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpLCBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZCwgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW4sIG1vZHVsZSA9IF9fd2VicGFja19yZXF1aXJlX18uY1ttb2R1bGVJZF07XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGlmICghbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZCAmJiAhbW9kdWxlLmhvdC5fc2VsZkludmFsaWRhdGVkKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGNvbnRpbnVlO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBpZiAobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIHJldHVybiB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICB0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGNoYWluLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgbW9kdWxlSWRcbi8qKioqKiovIFx0XHQgICAgICAgICAgICB9O1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBpZiAobW9kdWxlLmhvdC5fbWFpbilcbi8qKioqKiovIFx0XHQgICAgICAgICAgICByZXR1cm4ge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgdHlwZTogXCJ1bmFjY2VwdGVkXCIsXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBjaGFpbixcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIG1vZHVsZUlkXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgfTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgZm9yICh2YXIgaSA9IDA7aSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgdmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV0sIHBhcmVudCA9IF9fd2VicGFja19yZXF1aXJlX18uY1twYXJlbnRJZF07XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgaWYgKCFwYXJlbnQpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBjb250aW51ZTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBpZiAocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgcmV0dXJuIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgdHlwZTogXCJkZWNsaW5lZFwiLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgcGFyZW50SWRcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIH07XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgaWYgKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSAhPT0gLTEpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBjb250aW51ZTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBpZiAocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSlcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0sIFttb2R1bGVJZF0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgY29udGludWU7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF07XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgb3V0ZGF0ZWRNb2R1bGVzLnB1c2gocGFyZW50SWQpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIHF1ZXVlLnB1c2goe1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgY2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGlkOiBwYXJlbnRJZFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICByZXR1cm4ge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB0eXBlOiBcImFjY2VwdGVkXCIsXG4vKioqKioqLyBcdFx0ICAgICAgICAgIG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcbi8qKioqKiovIFx0XHQgICAgICAgICAgb3V0ZGF0ZWRNb2R1bGVzLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICBvdXRkYXRlZERlcGVuZGVuY2llc1xuLyoqKioqKi8gXHRcdCAgICAgICAgfTtcbi8qKioqKiovIFx0XHQgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xuLyoqKioqKi8gXHRcdCAgICAgICAgZm9yICh2YXIgaSA9IDA7aSA8IGIubGVuZ3RoOyBpKyspIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgdmFyIGl0ZW0gPSBiW2ldO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBpZiAoYS5pbmRleE9mKGl0ZW0pID09PSAtMSlcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBhLnB1c2goaXRlbSk7XG4vKioqKioqLyBcdFx0ICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgIHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9LCBvdXRkYXRlZE1vZHVsZXMgPSBbXSwgYXBwbGllZFVwZGF0ZSA9IHt9LCB3YXJuVW5leHBlY3RlZFJlcXVpcmUgPSBmdW5jdGlvbiB3YXJuVW5leHBlY3RlZFJlcXVpcmUobW9kdWxlKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICBjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyBtb2R1bGUuaWQgKyBcIikgdG8gZGlzcG9zZWQgbW9kdWxlXCIpO1xuLyoqKioqKi8gXHRcdCAgICAgIH07XG4vKioqKioqLyBcdFx0ICAgICAgZm9yICh2YXIgbW9kdWxlSWQgaW4gY3VycmVudFVwZGF0ZSlcbi8qKioqKiovIFx0XHQgICAgICAgIGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLm8oY3VycmVudFVwZGF0ZSwgbW9kdWxlSWQpKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIHZhciBuZXdNb2R1bGVGYWN0b3J5ID0gY3VycmVudFVwZGF0ZVttb2R1bGVJZF0sIHJlc3VsdCA9IG5ld01vZHVsZUZhY3RvcnkgPyBnZXRBZmZlY3RlZE1vZHVsZUVmZmVjdHMobW9kdWxlSWQpIDoge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIHR5cGU6IFwiZGlzcG9zZWRcIixcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBtb2R1bGVJZFxuLyoqKioqKi8gXHRcdCAgICAgICAgICB9LCBhYm9ydEVycm9yID0gITEsIGRvQXBwbHkgPSAhMSwgZG9EaXNwb3NlID0gITEsIGNoYWluSW5mbyA9IFwiXCI7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGlmIChyZXN1bHQuY2hhaW4pXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgY2hhaW5JbmZvID0gYFxuLyoqKioqKi8gXHRcdFVwZGF0ZSBwcm9wYWdhdGlvbjogYCArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgc3dpdGNoIChyZXN1bHQudHlwZSkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBpZiAob3B0aW9ucy5vbkRlY2xpbmVkKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgYWJvcnRFcnJvciA9IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBjaGFpbkluZm8pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgYnJlYWs7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgY2FzZSBcImRlY2xpbmVkXCI6XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBpZiAob3B0aW9ucy5vbkRlY2xpbmVkKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgYWJvcnRFcnJvciA9IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIgaW4gXCIgKyByZXN1bHQucGFyZW50SWQgKyBjaGFpbkluZm8pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgYnJlYWs7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgY2FzZSBcInVuYWNjZXB0ZWRcIjpcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGlmIChvcHRpb25zLm9uVW5hY2NlcHRlZClcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgb3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGlmICghb3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBhYm9ydEVycm9yID0gRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2UgXCIgKyBtb2R1bGVJZCArIFwiIGlzIG5vdCBhY2NlcHRlZFwiICsgY2hhaW5JbmZvKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGJyZWFrO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGNhc2UgXCJhY2NlcHRlZFwiOlxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgaWYgKG9wdGlvbnMub25BY2NlcHRlZClcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgb3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBkb0FwcGx5ID0gITA7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBicmVhaztcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBjYXNlIFwiZGlzcG9zZWRcIjpcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGlmIChvcHRpb25zLm9uRGlzcG9zZWQpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgZG9EaXNwb3NlID0gITA7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBicmVhaztcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBkZWZhdWx0OlxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJVbmV4Y2VwdGlvbiB0eXBlIFwiICsgcmVzdWx0LnR5cGUpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGlmIChhYm9ydEVycm9yKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIHJldHVybiB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBlcnJvcjogYWJvcnRFcnJvclxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIH07XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGlmIChkb0FwcGx5KSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgYXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBuZXdNb2R1bGVGYWN0b3J5O1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgZm9yIChtb2R1bGVJZCBpbiByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5vKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0sIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGlmIChkb0Rpc3Bvc2UpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IHdhcm5VbmV4cGVjdGVkUmVxdWlyZTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgIGN1cnJlbnRVcGRhdGUgPSB2b2lkIDA7XG4vKioqKioqLyBcdFx0ICAgICAgdmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xuLyoqKioqKi8gXHRcdCAgICAgIGZvciAodmFyIGogPSAwO2ogPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBqKyspIHtcbi8qKioqKiovIFx0XHQgICAgICAgIHZhciBvdXRkYXRlZE1vZHVsZUlkID0gb3V0ZGF0ZWRNb2R1bGVzW2pdLCBtb2R1bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbb3V0ZGF0ZWRNb2R1bGVJZF07XG4vKioqKioqLyBcdFx0ICAgICAgICBpZiAobW9kdWxlICYmIChtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQgfHwgbW9kdWxlLmhvdC5fbWFpbikgJiYgYXBwbGllZFVwZGF0ZVtvdXRkYXRlZE1vZHVsZUlkXSAhPT0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlICYmICFtb2R1bGUuaG90Ll9zZWxmSW52YWxpZGF0ZWQpXG4vKioqKioqLyBcdFx0ICAgICAgICAgIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBtb2R1bGU6IG91dGRhdGVkTW9kdWxlSWQsXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgcmVxdWlyZTogbW9kdWxlLmhvdC5fcmVxdWlyZVNlbGYsXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgZXJyb3JIYW5kbGVyOiBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWRcbi8qKioqKiovIFx0XHQgICAgICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgIHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcbi8qKioqKiovIFx0XHQgICAgICByZXR1cm4ge1xuLyoqKioqKi8gXHRcdCAgICAgICAgZGlzcG9zZTogZnVuY3Rpb24oKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGN1cnJlbnRVcGRhdGVSZW1vdmVkQ2h1bmtzLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBjdXJyZW50VXBkYXRlUmVtb3ZlZENodW5rcyA9IHZvaWQgMDtcbi8qKioqKiovIFx0XHQgICAgICAgICAgdmFyIGlkeCwgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgd2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICB2YXIgbW9kdWxlSWQgPSBxdWV1ZS5wb3AoKSwgbW9kdWxlID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jW21vZHVsZUlkXTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBpZiAoIW1vZHVsZSlcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGNvbnRpbnVlO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIHZhciBkYXRhID0ge30sIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBmb3IgKGogPSAwO2ogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBkaXNwb3NlSGFuZGxlcnNbal0uY2FsbChudWxsLCBkYXRhKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckRbbW9kdWxlSWRdID0gZGF0YTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBtb2R1bGUuaG90LmFjdGl2ZSA9ICExO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGRlbGV0ZSBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbbW9kdWxlSWRdO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgZm9yIChqID0gMDtqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGlmICghY2hpbGQpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgaWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGlmIChpZHggPj0gMClcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgY2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgdmFyIGRlcGVuZGVuY3k7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGZvciAodmFyIG91dGRhdGVkTW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgaWYgKF9fd2VicGFja19yZXF1aXJlX18ubyhvdXRkYXRlZERlcGVuZGVuY2llcywgb3V0ZGF0ZWRNb2R1bGVJZCkpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIG1vZHVsZSA9IF9fd2VicGFja19yZXF1aXJlX18uY1tvdXRkYXRlZE1vZHVsZUlkXTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGlmIChtb2R1bGUpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1tvdXRkYXRlZE1vZHVsZUlkXTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgZm9yIChqID0gMDtqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICBkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgaWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgaWYgKGlkeCA+PSAwKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgICAgfSxcbi8qKioqKiovIFx0XHQgICAgICAgIGFwcGx5OiBmdW5jdGlvbihyZXBvcnRFcnJvcikge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBmb3IgKHZhciB1cGRhdGVNb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLm8oYXBwbGllZFVwZGF0ZSwgdXBkYXRlTW9kdWxlSWQpKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgX193ZWJwYWNrX3JlcXVpcmVfXy5tW3VwZGF0ZU1vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbdXBkYXRlTW9kdWxlSWRdO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICBmb3IgKHZhciBpID0gMDtpIDwgY3VycmVudFVwZGF0ZVJ1bnRpbWUubGVuZ3RoOyBpKyspXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgY3VycmVudFVwZGF0ZVJ1bnRpbWVbaV0oX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGZvciAodmFyIG91dGRhdGVkTW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgaWYgKF9fd2VicGFja19yZXF1aXJlX18ubyhvdXRkYXRlZERlcGVuZGVuY2llcywgb3V0ZGF0ZWRNb2R1bGVJZCkpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbb3V0ZGF0ZWRNb2R1bGVJZF07XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBpZiAobW9kdWxlKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbb3V0ZGF0ZWRNb2R1bGVJZF07XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIHZhciBjYWxsYmFja3MgPSBbXSwgZXJyb3JIYW5kbGVycyA9IFtdLCBkZXBlbmRlbmNpZXNGb3JDYWxsYmFja3MgPSBbXTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7aiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgdmFyIGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXSwgYWNjZXB0Q2FsbGJhY2sgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XSwgZXJyb3JIYW5kbGVyID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWRFcnJvckhhbmRsZXJzW2RlcGVuZGVuY3ldO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgIGlmIChhY2NlcHRDYWxsYmFjaykge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrcy5pbmRleE9mKGFjY2VwdENhbGxiYWNrKSAhPT0gLTEpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzLnB1c2goYWNjZXB0Q2FsbGJhY2spO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgZXJyb3JIYW5kbGVycy5wdXNoKGVycm9ySGFuZGxlcik7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXNGb3JDYWxsYmFja3MucHVzaChkZXBlbmRlbmN5KTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7ayA8IGNhbGxiYWNrcy5sZW5ndGg7IGsrKylcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICB0cnkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzW2tdLmNhbGwobnVsbCwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlcnJvckhhbmRsZXJzW2tdID09PSBcImZ1bmN0aW9uXCIpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JIYW5kbGVyc1trXShlcnIsIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZUlkOiBvdXRkYXRlZE1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwZW5kZW5jeUlkOiBkZXBlbmRlbmNpZXNGb3JDYWxsYmFja3Nba11cbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyMikge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLm9uRXJyb3JlZClcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMub25FcnJvcmVkKHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJhY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZUlkOiBvdXRkYXRlZE1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXBlbmRlbmN5SWQ6IGRlcGVuZGVuY2llc0ZvckNhbGxiYWNrc1trXSxcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycjIsXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsRXJyb3I6IGVyclxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcG9ydEVycm9yKGVycjIpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwb3J0RXJyb3IoZXJyKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5vbkVycm9yZWQpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5vbkVycm9yZWQoe1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJhY2NlcHQtZXJyb3JlZFwiLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlSWQ6IG91dGRhdGVkTW9kdWxlSWQsXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICBkZXBlbmRlbmN5SWQ6IGRlcGVuZGVuY2llc0ZvckNhbGxiYWNrc1trXSxcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgcmVwb3J0RXJyb3IoZXJyKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgfVxuLyoqKioqKi8gXHRcdCAgICAgICAgICBmb3IgKHZhciBvID0gMDtvIDwgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLmxlbmd0aDsgbysrKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgdmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbb10sIG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgdHJ5IHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGl0ZW0ucmVxdWlyZShtb2R1bGVJZCk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIHRyeSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgaXRlbS5lcnJvckhhbmRsZXIoZXJyLCB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgIG1vZHVsZTogX193ZWJwYWNrX3JlcXVpcmVfXy5jW21vZHVsZUlkXVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgIH0pO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIxKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMub25FcnJvcmVkKVxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5vbkVycm9yZWQoe1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycjEsXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsRXJyb3I6IGVyclxuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgIHJlcG9ydEVycm9yKGVycjEpO1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgcmVwb3J0RXJyb3IoZXJyKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIGVsc2Uge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5vbkVycm9yZWQpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgb3B0aW9ucy5vbkVycm9yZWQoe1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgICBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgICB9KTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpXG4vKioqKioqLyBcdFx0ICAgICAgICAgICAgICAgICAgcmVwb3J0RXJyb3IoZXJyKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgICB9XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgICAgcmV0dXJuIG91dGRhdGVkTW9kdWxlcztcbi8qKioqKiovIFx0XHQgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICB9O1xuLyoqKioqKi8gXHRcdCAgICB9XG4vKioqKioqLyBcdFx0ICAgIF9fd2VicGFja19yZXF1aXJlX18uaG1ySS5qc29ucCA9IGZ1bmN0aW9uKG1vZHVsZUlkLCBhcHBseUhhbmRsZXJzKSB7XG4vKioqKioqLyBcdFx0ICAgICAgaWYgKCFjdXJyZW50VXBkYXRlKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICBjdXJyZW50VXBkYXRlID0ge307XG4vKioqKioqLyBcdFx0ICAgICAgICBjdXJyZW50VXBkYXRlUnVudGltZSA9IFtdO1xuLyoqKioqKi8gXHRcdCAgICAgICAgY3VycmVudFVwZGF0ZVJlbW92ZWRDaHVua3MgPSBbXTtcbi8qKioqKiovIFx0XHQgICAgICAgIGFwcGx5SGFuZGxlcnMucHVzaChhcHBseUhhbmRsZXIpO1xuLyoqKioqKi8gXHRcdCAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICBpZiAoIV9fd2VicGFja19yZXF1aXJlX18ubyhjdXJyZW50VXBkYXRlLCBtb2R1bGVJZCkpXG4vKioqKioqLyBcdFx0ICAgICAgICBjdXJyZW50VXBkYXRlW21vZHVsZUlkXSA9IF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF07XG4vKioqKioqLyBcdFx0ICAgIH07XG4vKioqKioqLyBcdFx0ICAgIF9fd2VicGFja19yZXF1aXJlX18uaG1yQy5qc29ucCA9IGZ1bmN0aW9uKGNodW5rSWRzLCByZW1vdmVkQ2h1bmtzLCByZW1vdmVkTW9kdWxlcywgcHJvbWlzZXMsIGFwcGx5SGFuZGxlcnMsIHVwZGF0ZWRNb2R1bGVzTGlzdCkge1xuLyoqKioqKi8gXHRcdCAgICAgIGFwcGx5SGFuZGxlcnMucHVzaChhcHBseUhhbmRsZXIpO1xuLyoqKioqKi8gXHRcdCAgICAgIGN1cnJlbnRVcGRhdGVDaHVua3MgPSB7fTtcbi8qKioqKiovIFx0XHQgICAgICBjdXJyZW50VXBkYXRlUmVtb3ZlZENodW5rcyA9IHJlbW92ZWRDaHVua3M7XG4vKioqKioqLyBcdFx0ICAgICAgY3VycmVudFVwZGF0ZSA9IHJlbW92ZWRNb2R1bGVzLnJlZHVjZShmdW5jdGlvbihvYmosIGtleSkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgb2JqW2tleV0gPSAhMTtcbi8qKioqKiovIFx0XHQgICAgICAgIHJldHVybiBvYmo7XG4vKioqKioqLyBcdFx0ICAgICAgfSwge30pO1xuLyoqKioqKi8gXHRcdCAgICAgIGN1cnJlbnRVcGRhdGVSdW50aW1lID0gW107XG4vKioqKioqLyBcdFx0ICAgICAgY2h1bmtJZHMuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICBpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdICE9PSB2b2lkIDApIHtcbi8qKioqKiovIFx0XHQgICAgICAgICAgcHJvbWlzZXMucHVzaChsb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgdXBkYXRlZE1vZHVsZXNMaXN0KSk7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGN1cnJlbnRVcGRhdGVDaHVua3NbY2h1bmtJZF0gPSAhMDtcbi8qKioqKiovIFx0XHQgICAgICAgIH0gZWxzZVxuLyoqKioqKi8gXHRcdCAgICAgICAgICBjdXJyZW50VXBkYXRlQ2h1bmtzW2NodW5rSWRdID0gITE7XG4vKioqKioqLyBcdFx0ICAgICAgfSk7XG4vKioqKioqLyBcdFx0ICAgICAgaWYgKF9fd2VicGFja19yZXF1aXJlX18uZilcbi8qKioqKiovIFx0XHQgICAgICAgIF9fd2VicGFja19yZXF1aXJlX18uZi5qc29ucEhtciA9IGZ1bmN0aW9uKGNodW5rSWQsIHByb21pc2VzKSB7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIGlmIChjdXJyZW50VXBkYXRlQ2h1bmtzICYmIF9fd2VicGFja19yZXF1aXJlX18ubyhjdXJyZW50VXBkYXRlQ2h1bmtzLCBjaHVua0lkKSAmJiAhY3VycmVudFVwZGF0ZUNodW5rc1tjaHVua0lkXSkge1xuLyoqKioqKi8gXHRcdCAgICAgICAgICAgIHByb21pc2VzLnB1c2gobG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpKTtcbi8qKioqKiovIFx0XHQgICAgICAgICAgICBjdXJyZW50VXBkYXRlQ2h1bmtzW2NodW5rSWRdID0gITA7XG4vKioqKioqLyBcdFx0ICAgICAgICAgIH1cbi8qKioqKiovIFx0XHQgICAgICAgIH07XG4vKioqKioqLyBcdFx0ICAgIH07XG4vKioqKioqLyBcdFx0ICBcbi8qKioqKiovIFx0XHRcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmhtck0gPSAoKSA9PiB7XG4vKioqKioqLyBcdFx0XHRpZiAodHlwZW9mIGZldGNoID09PSBcInVuZGVmaW5lZFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJObyBicm93c2VyIHN1cHBvcnQ6IG5lZWQgZmV0Y2ggQVBJXCIpO1xuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGZldGNoKF9fd2VicGFja19yZXF1aXJlX18ucCArIF9fd2VicGFja19yZXF1aXJlX18uaG1yRigpKS50aGVuKChyZXNwb25zZSkgPT4ge1xuLyoqKioqKi8gXHRcdFx0XHRpZihyZXNwb25zZS5zdGF0dXMgPT09IDQwNCkgcmV0dXJuOyAvLyBubyB1cGRhdGUgYXZhaWxhYmxlXG4vKioqKioqLyBcdFx0XHRcdGlmKCFyZXNwb25zZS5vaykgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGZldGNoIHVwZGF0ZSBtYW5pZmVzdCBcIiArIHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuLyoqKioqKi8gXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuLyoqKioqKi8gXHRcdFx0fSk7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0XHRcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcbi8qKioqKiovIFx0XHRcbi8qKioqKiovIFx0XHQvLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbi8qKioqKiovIFx0XHR2YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcbi8qKioqKiovIFx0XHRcdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG4vKioqKioqLyBcdFx0XHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcbi8qKioqKiovIFx0XHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuLyoqKioqKi8gXHRcdFx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcbi8qKioqKiovIFx0XHRcdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG4vKioqKioqLyBcdFx0XHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuLyoqKioqKi8gXHRcdFx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuLyoqKioqKi8gXHRcdFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcbi8qKioqKiovIFx0XHRcdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG4vKioqKioqLyBcdFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbi8qKioqKiovIFx0XHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG4vKioqKioqLyBcdFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbi8qKioqKiovIFx0XHR9XG4vKioqKioqLyBcdFx0XG4vKioqKioqLyBcdFx0dmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtfTl9FXCJdID0gc2VsZltcIndlYnBhY2tDaHVua19OX0VcIl0gfHwgW107XG4vKioqKioqLyBcdFx0Y2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG4vKioqKioqLyBcdFx0Y2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvbm9uY2UgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkO1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvLyBtb2R1bGUgY2FjaGUgYXJlIHVzZWQgc28gZW50cnkgaW5saW5pbmcgaXMgZGlzYWJsZWRcbi8qKioqKiovIFx0XG4vKioqKioqLyB9KSgpXG4iXX0=
;