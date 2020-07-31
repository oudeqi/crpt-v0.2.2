var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}
});

var regenerator = runtime_1;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var asyncToGenerator = _asyncToGenerator;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck = _classCallCheck;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var createClass = _createClass;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var defineProperty = _defineProperty;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// api.lockSlidPane();
// api.unlockSlidPane
var navigationBarWhite = {
  hideBackButton: false,
  background: '#fff',
  color: 'rgba(48,49,51,1)',
  fontSize: 18,
  fontWeight: 'bold',
  leftButtons: [{
    text: '',
    color: 'rgba(102,187,106,1)',
    iconPath: 'widget://image/back_green_big.png'
  }]
};


function openTabLayout(index) {
  api.openTabLayout({
    name: 'tabLayout',
    bgColor: '#fff',
    reload: true,
    delay: 300,
    slidBackEnabled: false,
    animation: {
      type: 'none'
    },
    navigationBar: {
      hideBackButton: true,
      background: 'rgba(102,187,106,1)',
      color: '#fff',
      fontSize: 18,
      shadow: 'transparent',
      fontWeight: 'normal' // leftButtons: [{
      //   // text: '设置',
      //   // color: '#fff',
      //   // fontSize: 16,
      //   iconPath: 'widget://image/avatar.png',
      // }],
      // rightButtons: [{
      //   text: '设置',
      //   color: '#fff',
      //   fontSize: 16,
      //   // iconPath: 'widget://image/settings@2x.png'
      // }]

    },
    tabBar: {
      animated: false,
      scrollEnabled: true,
      selectedColor: '#66BB6A',
      color: '#606266',
      index: index || 0,
      fontSize: 12,
      // preload: 4,
      list: [{
        text: "首页",
        iconPath: "widget://image/tablayout/shouye.png",
        selectedIconPath: "widget://image/tablayout/shouye_active.png"
      }, {
        text: "贷款",
        iconPath: "widget://image/tablayout/loan.png",
        selectedIconPath: "widget://image/tablayout/loan_active.png"
      }, {
        text: "还款",
        iconPath: "widget://image/tablayout/huankuan.png",
        selectedIconPath: "widget://image/tablayout/huankuan_active.png"
      }, {
        text: "我的",
        iconPath: "widget://image/tablayout/wode.png",
        selectedIconPath: "widget://image/tablayout/wode_active.png"
      }],
      frames: [{
        title: "首页",
        //tab切换时对应的标题
        name: "tablayout/index",
        url: "widget://html/index/frm.html",
        bounces: true,
        reload: true,
        scrollToTop: true //其他继承自openFrame的参数

      }, {
        title: "贷款申请",
        name: "tablayout/loan",
        url: "widget://html/loan/index.html",
        bounces: true,
        reload: true,
        scrollToTop: true //其他继承自openFrame的参数

      }, {
        title: "还款",
        name: "tablayout/repay",
        url: "widget://html/repay/index.html",
        bounces: true,
        reload: true,
        scrollToTop: true //其他继承自openFrame的参数

      }, {
        title: "我的",
        name: "tablayout/my",
        url: "widget://html/my/frm.html",
        bounces: true,
        reload: true,
        scrollToTop: true //其他继承自openFrame的参数

      }]
    }
  });
} // 注册


function openRegLogin() {
  api.openTabLayout({
    name: 'html/reglogin/index',
    url: 'widget://html/reglogin/index.html',
    bgColor: '#fff',
    reload: true,
    slidBackEnabled: false
  });
} // 个人登录


function openTodoAuthGeren() {
  api.openTabLayout({
    name: 'html/todoauthgeren/win',
    title: '待完成',
    url: 'widget://html/todoauthgeren/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: false,
    animation: {
      type: 'none'
    },
    navigationBar: _objectSpread({}, navigationBarWhite, {
      hideBackButton: true,
      leftButtons: []
    })
  });
}

function openTodoAuthQiye() {
  api.openTabLayout({
    name: 'html/todoauthqiye/win',
    title: '待完成',
    url: 'widget://html/todoauthqiye/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: false,
    animation: {
      type: 'none'
    },
    navigationBar: _objectSpread({}, navigationBarWhite, {
      hideBackButton: true,
      leftButtons: []
    })
  });
} // 企业信息确认

var _extends_1 = createCommonjsModule(function (module) {
function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

module.exports = _extends;
});

// 系统顶部导航配置
var navigationBarProfile = {
  background: '#fff',
  color: '#303133',
  fontSize: 18,
  fontWeight: 500,
  leftButtons: [{
    text: '',
    color: 'rgba(102,187,106,1)',
    iconPath: 'widget://image/back_green_big.png'
  }]
};

/**
 * 打开授信资料录入页面
 */

function openPageCreditInformation() {
  api.openTabLayout({
    title: '授信资料录入',
    name: 'html/credit_information/index',
    url: 'widget://html/credit_information/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    navigationBar: navigationBarProfile
  });
}
/**
 * 1. 打开担保业务申请表页面
 */

function openGuaranteeApplicationIndex(_ref) {
  var pageParam = _ref.pageParam;
  api.openTabLayout({
    title: '担保业务申请表',
    name: 'html/guarantee_application_index/index',
    url: 'widget://html/guarantee_application_index/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    pageParam: pageParam,
    navigationBar: navigationBarProfile
  });
}
/**
 * 2. 打开反担保人列表页面
 */

/**
 * 3. 文件送达地址列表页面
 */

/**
 * 4. 其他附件上传页面
 */

function openAttachmentInfo(_ref2) {
  var pageParam = _ref2.pageParam;
  api.openTabLayout({
    title: '附件上传',
    name: 'html/attachment_info/index',
    url: 'widget://html/attachment_info/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    pageParam: pageParam,
    navigationBar: navigationBarProfile
  });
}
/**
 * 1.1 打开房产信息录入页面
 */

function openGuaranteeApplicationHouse(_ref3) {
  var pageParam = _ref3.pageParam;
  api.openTabLayout({
    title: '房产信息',
    name: 'html/guarantee_application_house/index',
    url: 'widget://html/guarantee_application_house/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    pageParam: pageParam,
    navigationBar: navigationBarProfile
  });
}
/**
 * 1.2 打开车辆信息录入页面
 */

function openGuaranteeApplicationCar(_ref4) {
  var pageParam = _ref4.pageParam;
  api.openTabLayout({
    title: '车辆信息',
    name: 'html/guarantee_application_car/index',
    url: 'widget://html/guarantee_application_car/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    pageParam: pageParam,
    navigationBar: navigationBarProfile
  });
}
/**
 * 1.3 打开家庭成员信息录入页面
 */

function openGuaranteeApplicationFamily(_ref5) {
  var pageParam = _ref5.pageParam;
  api.openTabLayout({
    title: '家庭成员信息',
    name: 'html/guarantee_application_family/index',
    url: 'widget://html/guarantee_application_family/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    pageParam: pageParam,
    navigationBar: navigationBarProfile
  });
}
function closeCurrentWinAndRefresh(_ref6) {
  var winName = _ref6.winName,
      frameName = _ref6.frameName,
      script = _ref6.script;
  //  关闭当前win并刷新指定页面
  api.execScript({
    name: winName,
    frameName: frameName,
    script: script
  });
  setTimeout(function () {
    api.closeWin();
  }, 300);
}

var rmap = /*#__PURE__*/Object.freeze({
	__proto__: null,
	openPageCreditInformation: openPageCreditInformation,
	openGuaranteeApplicationIndex: openGuaranteeApplicationIndex,
	openAttachmentInfo: openAttachmentInfo,
	openGuaranteeApplicationHouse: openGuaranteeApplicationHouse,
	openGuaranteeApplicationCar: openGuaranteeApplicationCar,
	openGuaranteeApplicationFamily: openGuaranteeApplicationFamily,
	closeCurrentWinAndRefresh: closeCurrentWinAndRefresh
});

/**
 * Router class
 * @author liyang
 * @desc 路由类
 */

var Router = function Router() {
  classCallCheck(this, Router);

  _extends_1(this, rmap);
};

var openPicker = function openPicker(params, options) {
  var UIActionSelector = api.require('UIActionSelector');

  UIActionSelector.open({
    datas: params.data,
    layout: {
      row: options.row,
      col: options.col,
      height: 40,
      size: 18,
      sizeActive: 18,
      rowSpacing: 5,
      colSpacing: 10,
      maskBg: 'rgba(0,0,0,0.2)',
      bg: '#fff',
      color: '#333',
      colorActive: '#f00',
      colorSelected: '#000'
    },
    animation: true,
    cancel: {
      text: '取消',
      size: 15,
      w: 90,
      h: 35,
      bg: '#fff',
      // bgActive: '#ccc',
      color: '#888',
      colorActive: '#ccc'
    },
    ok: {
      text: '确定',
      size: 15,
      w: 90,
      h: 35,
      bg: '#fff',
      // bgActive: '#ccc',
      color: 'rgba(102,187,106,1)',
      colorActive: '#ccc'
    },
    title: {
      text: '请选择',
      size: 15,
      h: 50,
      bg: '#fff',
      color: '#888'
    },
    fixedOn: api.frameName
  }, function (ret, err) {
    if (ret.eventType === 'ok') {
      params.success && params.success(ret.selectedInfo);
    }
  });
  return UIActionSelector;
};
/**
 * @authro liyang
 * @desc 表单单选框picker
 * @params params: { data, success }
 */


var setPicker = function setPicker(params) {
  return openPicker(params, {
    row: 5,
    col: 1
  });
};
/**
 * @authro liyang
 * @desc 城市选择框picker
 * @params params: { data, success }
 */

var setCityPicker = function setCityPicker(params) {
  return openPicker(params, {
    row: 5,
    col: 3
  });
};

var showLoading = function showLoading() {
  var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '正在加载...';
  api.showProgress({
    title: title,
    text: '',
    modal: true
  });
};
var hideLoading = function hideLoading() {
  api.hideProgress();
};

var toast = function toast(msg) {
  api.toast({
    msg: msg,
    location: 'middle'
  });
};

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function setRefreshHeaderInfo(_ref) {
  var success = _ref.success,
      fail = _ref.fail,
      _ref$options = _ref.options,
      options = _ref$options === void 0 ? {} : _ref$options;
  api.setRefreshHeaderInfo(_objectSpread$1({
    // loadingImg: 'widget://image/refresh.png',
    bgColor: 'rgba(0,0,0,0)',
    textColor: '#bfbfbf',
    textDown: '下拉刷新',
    textUp: '松开刷新',
    textLoading: '加载中...',
    showTime: false
  }, options), function (ret, error) {
    if (error) {
      fail && fail(error);
    } else {
      success && success(ret);
    }
  });
}

function dialog(_ref) {
  var title = _ref.title,
      callback = _ref.callback;

  var dialogBox = api.require('dialogBox');

  dialogBox.alert({
    texts: {
      // title: '确认',
      content: title,
      leftBtnTitle: '取消',
      rightBtnTitle: '确认提交'
    },
    styles: {
      bg: '#fff',
      w: 300,
      corner: 6,
      content: {
        color: '#606266',
        size: 16,
        marginT: 30
      },
      left: {
        marginB: 7,
        marginL: 20,
        w: 130,
        h: 35,
        corner: 2,
        bg: '#fff',
        size: 16,
        color: '#606266'
      },
      right: {
        marginB: 7,
        marginL: 10,
        w: 130,
        h: 35,
        corner: 2,
        bg: '#fff',
        size: 16,
        color: '#66BB6A'
      }
    }
  }, function (ret) {
    if (ret.eventType == 'left') {
      dialogBox.close({
        dialogName: 'alert'
      });
    } else {
      dialogBox.close({
        dialogName: 'alert'
      });
      setTimeout(function () {
        callback && callback();
      }, 100);
    }
  });
}

/**
 * UI class
 * @author liyang
 * @desc UI类
 */

var UI = /*#__PURE__*/function () {
  function UI() {
    classCallCheck(this, UI);
  }

  createClass(UI, [{
    key: "setPicker",
    value: function setPicker$1(params) {
      return setPicker(params);
    }
  }, {
    key: "setCityPicker",
    value: function setCityPicker$1(params) {
      return setCityPicker(params);
    }
  }, {
    key: "showLoading",
    value: function showLoading$1(params) {
      return showLoading(params);
    }
  }, {
    key: "hideLoading",
    value: function hideLoading$1(params) {
      return hideLoading();
    }
  }, {
    key: "toast",
    value: function toast$1(params) {
      return toast(params);
    }
  }, {
    key: "setRefreshHeaderInfo",
    value: function setRefreshHeaderInfo$1(params) {
      return setRefreshHeaderInfo(params);
    }
  }, {
    key: "dialog",
    value: function dialog$1(params) {
      return dialog(params);
    }
  }]);

  return UI;
}();

/**
 * File class
 * @author liyang
 * @desc File类
 */
var File = /*#__PURE__*/function () {
  function File() {
    classCallCheck(this, File);
  }

  createClass(File, [{
    key: "actionSheet",
    value: function actionSheet(title, buttons, cb) {
      api.actionSheet({
        title: title,
        cancelTitle: '取消',
        buttons: buttons
      }, function (ret, err) {
        var index = ret.buttonIndex; // index 从1开始

        if (index !== buttons.length + 1) {
          cb(index - 1);
        }
      });
    }
  }, {
    key: "getPicture",
    value: function getPicture(sourceType, cb) {
      // library         //图片库
      // camera          //相机
      // album           //相册
      api.getPicture({
        sourceType: sourceType,
        encodingType: 'png',
        mediaValue: 'pic',
        destinationType: 'file',
        allowEdit: false,
        quality: 20,
        targetWidth: 1000,
        // targetHeight: 300,
        saveToPhotoAlbum: false
      }, cb);
    }
  }]);

  return File;
}();

var codeMapFilter = function codeMapFilter(list) {
  var codeMap = {};
  list.filter(function (item, i) {
    return !!item.valid;
  }).forEach(function (el, k) {
    codeMap[el.code] = el.name;
  });
  return codeMap;
};

var base64 = createCommonjsModule(function (module, exports) {
(function (global, factory) {
     module.exports = factory(global)
        ;
}((
    typeof self !== 'undefined' ? self
        : typeof window !== 'undefined' ? window
        : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal
: commonjsGlobal
), function(global) {
    // existing version for noConflict()
    global = global || {};
    var _Base64 = global.Base64;
    var version = "2.5.2";
    // if node.js and NOT React Native, we use Buffer
    var buffer;
    if ( module.exports) {
        try {
            buffer = eval("require('buffer').Buffer");
        } catch (err) {
            buffer = undefined;
        }
    }
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                + fromCharCode(0x80 | (cc & 0x3f)))
                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
        return chars.join('');
    };
    var btoa = global.btoa ? function(b) {
        return global.btoa(b);
    } : function(b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = function(u) {
        var isUint8Array = Object.prototype.toString.call(u) === '[object Uint8Array]';
        return isUint8Array ? u.toString('base64')
            : btoa(utob(String(u)));
    };
    var encode = function(u, urisafe) {
        return !urisafe
            ? _encode(u)
            : _encode(String(u)).replace(/[+\/]/g, function(m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function(u) { return encode(u, true) };
    // decoder stuff
    var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
    var cb_btou = function(cccc) {
        switch(cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                |    ((0x3f & cccc.charCodeAt(1)) << 12)
                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                |     (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
            return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return fromCharCode(
                ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
            );
        default:
            return  fromCharCode(
                ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
            );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>>  8) & 0xff),
            fromCharCode( n         & 0xff)
        ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var _atob = global.atob ? function(a) {
        return global.atob(a);
    } : function(a){
        return a.replace(/\S{1,4}/g, cb_decode);
    };
    var atob = function(a) {
        return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ''));
    };
    var _decode = buffer ?
        buffer.from && Uint8Array && buffer.from !== Uint8Array.from
        ? function(a) {
            return (a.constructor === buffer.constructor
                    ? a : buffer.from(a, 'base64')).toString();
        }
        : function(a) {
            return (a.constructor === buffer.constructor
                    ? a : new buffer(a, 'base64')).toString();
        }
        : function(a) { return btou(_atob(a)) };
    var decode = function(a){
        return _decode(
            String(a).replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        );
    };
    var noConflict = function() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict,
        __buffer__: buffer
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function(v){
            return {value:v,enumerable:false,writable:true,configurable:true};
        };
        global.Base64.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    //
    // export Base64 to the namespace
    //
    if (global['Meteor']) { // Meteor.js
        Base64 = global.Base64;
    }
    // module.exports and AMD are mutually exclusive.
    // module.exports has precedence.
    if ( module.exports) {
        module.exports.Base64 = global.Base64;
    }
    // that's it!
    return {Base64: global.Base64}
}));
});
var base64_1 = base64.Base64;

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var prod = 'https://crpt-cloud.oak.net.cn';
var baseUrl =   prod;
var whiteList = [// 白名单里不带token，否则后端会报错
'/sms/smsverificationcode', '/identification/gainenterprisephone', '/identification/personregister', '/identification/enterpriseregister', '/identification/enterpriseregister', '/identification/getbackpassword', '/auth/oauth/token', '/auth/token/' // 退出登录
];
var hasAlert = false;

function ajax(method, url) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$headers = _ref.headers,
      headers = _ref$headers === void 0 ? {} : _ref$headers,
      _ref$tag = _ref.tag,
      tag = _ref$tag === void 0 ? null : _ref$tag,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? 30 : _ref$timeout;

  return new Promise(function (resolve, reject) {
    var token = '';

    if (headers.token) {
      token = headers.token;
    } else {
      var userinfo = $api.getStorage('userinfo');
      token = userinfo ? userinfo.token_type + ' ' + userinfo.access_token : '';
    }

    var contentType = {
      'Content-Type': 'application/json;charset=utf-8'
    };
    var Authorization = {
      Authorization: token
    };
    method === 'upload' ? contentType = {} : null;
    var include = whiteList.find(function (value) {
      return url.includes(value);
    });
    include ? Authorization = {} : null;
    var start = new Date().getTime();
    api.ajax({
      url: baseUrl + url,
      method: method === 'upload' ? 'post' : method,
      data: data,
      tag: tag,
      timeout: timeout,
      headers: _objectSpread$2({}, Authorization, {}, contentType, {}, headers),
      certificate:  {
        path:  'widget://widget/cert/oak.net.cn.cert' // password: key

      }
    }, function (ret, error) {
      var end = new Date().getTime();
      var dis = (end - start) / 1000;
      console.log('/************* ' + dis + 's **********/');

      if (ret) {
        if (ret.code === 200) {
          resolve(ret);
        } else {
          // 表单校验未过专属code
          if (ret.code === 202) {
            var _data = ret.data;
            Utils$1.UI.toast(_data[0].msg);
            resolve(ret);
          } else {
            reject(ret);
          }
        }
      } else {
        if (error.statusCode === 500 && error.body.code === 216) {
          if (!hasAlert) {
            hasAlert = true;
            api.alert({
              title: '提示',
              msg: '登录状态已经过期，请重新登录！'
            }, function (ret, err) {
              hasAlert = false;
              api.closeWin({
                name: 'html/register/index'
              });
              api.closeWin({
                name: 'html/gerenlogin/index'
              });
              api.closeWin({
                name: 'html/qiyelogin/index'
              });
              setTimeout(function () {
                $api.clearStorage();
                openRegLogin();
              }, 150);
            });
          }

          reject(error);
        }

        reject(error);
      }
    });
  });
}

var http = {
  cancel: function cancel(tag) {
    return api.cancelAjax({
      tag: tag
    });
  },
  get: function get(url, data) {
    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref2.headers,
        tag = _ref2.tag,
        timeout = _ref2.timeout;

    return ajax('get', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    });
  },
  post: function post(url, data) {
    var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref3.headers,
        tag = _ref3.tag,
        timeout = _ref3.timeout;

    return ajax('post', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    });
  },
  put: function put(url, data) {
    var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref4.headers,
        tag = _ref4.tag,
        timeout = _ref4.timeout;

    return ajax('put', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    });
  },
  "delete": function _delete(url, data) {
    var _ref5 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref5.headers,
        tag = _ref5.tag,
        timeout = _ref5.timeout;

    return ajax('delete', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    });
  },
  upload: function upload(url, data) {
    var _ref6 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref6.headers,
        tag = _ref6.tag,
        timeout = _ref6.timeout;

    return ajax('upload', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    });
  }
}; // 统一ios和android的输入框，下标都从0开始
//   "access_token": "6ca22146-008e-4c12-9772-8d72229b731b",
//   "token_type":"bearer",
//   "refresh_token":"6509c5e3-b3d5-4725-9f1b-89b5f548d444",
//   "expires_in":599757,
//   "scope":"app",
//   "msg":"6ca22146-008e-4c12-9772-8d72229b731b",
//   "code":200,
//   "data":"6ca22146-008e-4c12-9772-8d72229b731b",
//   "name":"欧威",
//   "userType":"1",
//   "makeBy":"nh-cloud",
//   "userId":"20"
// }


function loginSuccessCallback(userinfo) {
  $api.setStorage('userinfo', userinfo); // 用户信息

  getAndStorageAuthStatus(function (status) {
    // 认证状态 int
    // 1：正常
    // 2：待实名认证
    // 3：待人脸审核
    // 4：人脸认证失败，待人工审核
    // 5：待补充基本信息
    // 6：人工审核不通过
    if (status === 1) {
      openTabLayout();
    } else {
      var _ref7 = userinfo || {},
          userType = _ref7.userType;

      if (userType === '1') {
        // 1个人用户登录 2企业用户登录
        openTodoAuthGeren();
      } else if (userType === '2') {
        openTodoAuthQiye();
      }
    }
  });
}

function getAndStorageAuthStatus(successCallback, errorCallback) {
  // 认证状态 int
  // 1：正常
  // 2：待实名认证
  // 3：待人脸审核
  // 4：人脸认证失败，待人工审核
  // 5：待补充基本信息
  // 6：人工审核不通过
  http.get("/crpt-cust/customer/query/authstatus").then(function (res) {
    $api.setStorage('authStatus', {
      status: res.data
    });
    successCallback && successCallback(res.data);
  })["catch"](function (error) {
    api.toast({
      msg: error.msg || '获取认证状态失败'
    });
    errorCallback && errorCallback(error);
  });
}

function appLogin(options, successCallback, errorCallback) {
  var pwd = '';

  if (options.verification) {
    // 在验证码登录的时候，密码必须设置为手机号码
    pwd = options.username;
  } else {
    pwd = base64_1.encode(options.password || '');
  }

  http.post('/auth/oauth/token', {
    values: _objectSpread$2({
      loginDevice: api.deviceId,
      // 客户手机设备号(android-imei,IOS-??)
      ipAddress: '',
      latitude: '',
      longitude: '',
      terminal_version: api.systemVersion,
      // 系统终端版本
      location: '',
      // 最近登录地点
      grant_type: 'password',
      // 固定传password
      scope: 'app',
      // 固定传app
      client_id: 'client',
      // client
      client_secret: 'secret'
    }, options, {
      password: pwd
    })
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function (userinfo) {
    api.toast({
      msg: '登录成功',
      location: 'middle',
      global: true
    });
    successCallback && successCallback(userinfo);
  })["catch"](function (error) {
    api.toast({
      msg: error.msg || '登录失败',
      location: 'middle'
    });
    errorCallback && errorCallback(error);
  });
}

function saveProtocolToStorage() {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var map = {};
  arr.forEach(function (item) {
    if (map[item.useNode]) {
      map[item.useNode].push(item);
    } else {
      map[item.useNode] = [];
      map[item.useNode].push(item);
    }
  });
  $api.setStorage('protocol', map);
}

function getNodeProtocolFromStorage(useNode) {
  // useNode 1-用户注册，2-实名认证，3-产品开户，4-产品开通，5-产品绑卡
  var protocol = $api.getStorage('protocol') || {};

  if (protocol[useNode] && protocol[useNode].length > 0) {
    return protocol[useNode];
  } else {
    return [];
  }
}

function getProtocolFromNode(nodeArr, protocolType) {
  // protocolType 1-个人，2-企业，3-通用
  var map = {};
  nodeArr.forEach(function (item) {
    if (map[item.protocolType]) {
      map[item.protocolType].push(item);
    } else {
      map[item.protocolType] = [];
      map[item.protocolType].push(item);
    }
  });

  if (map[protocolType] && map[protocolType].length > 0) {
    return map[protocolType];
  } else {
    return [];
  }
}

var BaiduSDK = /*#__PURE__*/function () {
  function BaiduSDK() {
    classCallCheck(this, BaiduSDK);

    this.ajaxUrls = {
      URL_TOKEN: "/crpt-biz/saas/query/accesstoken",
      URL_BANK_INFO: "/crpt-biz/saas/query/bankcardinfo",
      URL_IDCARD_INFO: "/crpt-biz/saas/query/certinfo",
      URL_CAR_INFO: "/crpt-biz/saas/query/carinfo"
    };
  }

  createClass(BaiduSDK, [{
    key: "getToken",
    value: function getToken() {
      return http.get(this.ajaxUrls.URL_TOKEN, null, {
        headers: {}
      });
    }
  }, {
    key: "CarVerify",
    value: function () {
      var _CarVerify = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(files) {
        var self, res;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                self = this;
                _context.next = 3;
                return this.getToken();

              case 3:
                res = _context.sent;

                if (!(res.code === 200)) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt("return", http.upload("".concat(self.ajaxUrls.URL_CAR_INFO, "?accessToken=").concat(res.data.accessToken), {
                  files: files
                }, {
                  headers: {},
                  timeout: 3000
                }));

              case 6:
                return _context.abrupt("return", Promise.reject(res));

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function CarVerify(_x) {
        return _CarVerify.apply(this, arguments);
      }

      return CarVerify;
    }()
  }, {
    key: "IdcardVerify",
    value: function () {
      var _IdcardVerify = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(files) {
        var res;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.getToken();

              case 2:
                res = _context2.sent;

                if (!(res.code === 200)) {
                  _context2.next = 7;
                  break;
                }

                _context2.next = 6;
                return http.upload("".concat(this.ajaxUrls.URL_IDCARD_INFO, "?accessToken=").concat(res.data.accessToken), {
                  files: files
                }, {
                  headers: {},
                  timeout: 3000
                });

              case 6:
                return _context2.abrupt("return", _context2.sent);

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function IdcardVerify(_x2) {
        return _IdcardVerify.apply(this, arguments);
      }

      return IdcardVerify;
    }()
  }, {
    key: "BankVerify",
    value: function () {
      var _BankVerify = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(files) {
        var res;
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.getToken();

              case 2:
                res = _context3.sent;

                if (!(res.code === 200)) {
                  _context3.next = 7;
                  break;
                }

                _context3.next = 6;
                return http.upload("".concat(this.ajaxUrls.URL_BANK_INFO, "?accessToken=").concat(res.data.accessToken), {
                  files: files
                }, {
                  headers: {},
                  timeout: 3000
                });

              case 6:
                return _context3.abrupt("return", _context3.sent);

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function BankVerify(_x3) {
        return _BankVerify.apply(this, arguments);
      }

      return BankVerify;
    }()
  }]);

  return BaiduSDK;
}();

var OCR = {
  Baidu: new BaiduSDK()
};

/**
 * Utils class
 * @authro liyang
 * @desc 工具类暴露的顶层api类，注入各class
 */

var Utils = function Utils() {
  classCallCheck(this, Utils);

  this.Router = new Router();
  this.UI = new UI();
  this.File = new File();
  this.DictFilter = codeMapFilter;
  this.OCR = OCR;
};

var Utils$1 = new Utils();

var ENV_URLS = {
  development: 'http://crptdev.liuheco.com',
  testing: 'https://gateway.crpt-cloud.liuheco.com',
  production: 'https://crpt-cloud.oak.net.cn'
};
var baseUrl$1 = ENV_URLS["production"];

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var whiteList$1 = [// 白名单里不带token，否则后端会报错
'/sms/smsverificationcode', '/identification/gainenterprisephone', '/identification/personregister', '/identification/enterpriseregister', '/identification/enterpriseregister', '/identification/getbackpassword', '/auth/oauth/token', '/auth/token/' // 退出登录
];
var hasAlert$1 = false;

function ajax$1(method, url) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$headers = _ref.headers,
      headers = _ref$headers === void 0 ? {} : _ref$headers,
      _ref$tag = _ref.tag,
      tag = _ref$tag === void 0 ? null : _ref$tag,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? 30 : _ref$timeout;

  return new Promise(function (resolve, reject) {
    var token = '';

    if (headers.token) {
      token = headers.token;
    } else {
      var userinfo = $api.getStorage('userinfo');
      token = userinfo ? userinfo.token_type + ' ' + userinfo.access_token : '';
    }

    var contentType = {
      'Content-Type': 'application/json;charset=utf-8'
    };
    var Authorization = {
      Authorization: token
    };
    method === 'upload' ? contentType = {} : null;
    var include = whiteList$1.find(function (value) {
      return url.includes(value);
    });
    include ? Authorization = {} : null;
    var start = new Date().getTime();
    api.ajax({
      url: baseUrl$1 + url,
      method: method === 'upload' ? 'post' : method,
      data: data,
      tag: tag,
      timeout: timeout,
      headers: _objectSpread$3({}, Authorization, {}, contentType, {}, headers),
      certificate:  {
        path:  'widget://widget/cert/oak.net.cn.cert' // password: key

      }
    }, function (ret, error) {
      var end = new Date().getTime();
      var dis = (end - start) / 1000;
      console.log('/************* ' + dis + 's **********/');

      if (ret) {
        if (ret.code === 200) {
          resolve(ret);
        } else {
          // 表单校验未过专属code
          if (ret.code === 202) {
            var _data = ret.data;
            _data && Utils$1.UI.toast(_data[0].msg);
            ret.msg && Utils$1.UI.toast(ret.msg);
            resolve(ret);
          } else {
            reject(ret);
          }
        }
      } else {
        if (error.statusCode === 500 && error.body.code === 216) {
          if (!hasAlert$1) {
            hasAlert$1 = true;
            api.alert({
              title: '提示',
              msg: '登录状态已经过期，请重新登录！'
            }, function (ret, err) {
              hasAlert$1 = false;
              api.closeWin({
                name: 'html/register/index'
              });
              api.closeWin({
                name: 'html/gerenlogin/index'
              });
              api.closeWin({
                name: 'html/qiyelogin/index'
              });
              setTimeout(function () {
                $api.clearStorage();
                openRegLogin();
              }, 150);
            });
          }

          reject(error);
        }

        reject(error);
      }
    });
  });
}

var http$1 = {
  cancel: function cancel(tag) {
    return api.cancelAjax({
      tag: tag
    });
  },
  get: function get(url, data) {
    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref2.headers,
        tag = _ref2.tag,
        timeout = _ref2.timeout;

    return ajax$1('get', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    });
  },
  post: function post(url, data) {
    var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref3.headers,
        tag = _ref3.tag,
        timeout = _ref3.timeout;

    return ajax$1('post', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    });
  },
  put: function put(url, data) {
    var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref4.headers,
        tag = _ref4.tag,
        timeout = _ref4.timeout;

    return ajax$1('put', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    });
  },
  "delete": function _delete(url, data) {
    var _ref5 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref5.headers,
        tag = _ref5.tag,
        timeout = _ref5.timeout;

    return ajax$1('delete', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    });
  },
  upload: function upload(url, data) {
    var _ref6 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref6.headers,
        tag = _ref6.tag,
        timeout = _ref6.timeout;

    return ajax$1('upload', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    });
  }
};

// 主题色
var themeMainColor = 'rgba(102,187,106,1)'; // 导航文字黑色

var textColor = 'rgba(48,49,51,1)'; // 浅色底导航

var navigationBarWhite$1 = {
  hideBackButton: false,
  background: '#fff',
  color: textColor,
  shadow: 'transparent',
  fontSize: 18,
  fontWeight: 'bold',
  leftButtons: [{
    text: '',
    color: themeMainColor,
    iconPath: 'widget://image/back_green_big.png'
  }]
}; // 绿色底导航

var navigationBarGreen = {
  hideBackButton: false,
  background: themeMainColor,
  color: '#fff',
  shadow: 'transparent',
  fontSize: 18,
  fontWeight: 'bold',
  leftButtons: [{
    text: '',
    color: '#fff',
    iconPath: 'widget://image/back_white_big.png'
  }]
};

/**
 * themeMainColor 主题色
 * textColor 导航文字黑色
 * navigationBarWhite 浅色底导航
 * navigationBarGreen 绿色底导航
 */

var routerMap = {
  yjd_select_contract: {
    name: 'yjd_select_contract',
    title: '选择代养合同',
    url: 'widget://html/yjd_select_contract/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  yjd_apply_confirm: {
    name: 'yjd_apply_confirm',
    title: '申请贷款',
    url: 'widget://html/yjd_apply_confirm/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  yjd_face_auth: {
    name: 'yjd_face_auth',
    title: '人脸识别',
    url: 'widget://html/yjd_face_auth/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  yjd_send_msgcode: {
    name: 'yjd_send_msgcode',
    title: '短信验证',
    url: 'widget://html/yjd_send_msgcode/index.html',
    bgColor: '#fff',
    reload: true,
    softInputMode: 'pan',
    navigationBar: navigationBarWhite$1
  },
  yjd_hukouben_upload: {
    name: 'yjd_hukouben_upload',
    title: '上传户口本',
    url: 'widget://html/yjd_hukouben_upload/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  yjd_apply_status: {
    name: 'yjd_apply_status',
    title: '贷款申请',
    url: 'widget://html/yjd_apply_status/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  yjd_apply_result: {
    name: 'yjd_apply_result',
    title: '贷款申请',
    url: 'widget://html/yjd_apply_result/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  yjd_loan_signing: {
    name: 'yjd_loan_signing',
    title: '贷款签约',
    url: 'widget://html/yjd_loan_signing/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  yjd_signing_result: {
    name: 'yjd_signing_result',
    title: '签约结果',
    url: 'widget://html/yjd_signing_result/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  yjd_account_open: {
    name: 'yjd_account_open',
    title: '开通新网账户',
    url: 'widget://html/yjd_account_open/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  yjd_account_open_xinwang: {
    name: 'yjd_account_open_xinwang',
    title: '开通新网账户',
    url: 'widget://html/yjd_account_open_xinwang/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 押金贷产品详情
  yjd_product_detail: {
    name: 'yjd_product_detail',
    title: '产品详情',
    url: 'widget://html/yjd_product_detail/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 贷款申请
  loan_application: {
    name: 'loan_application',
    title: '待申请',
    url: 'widget://html/loan_application/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarGreen
  },
  // 贷款确认
  loan_confirm: {
    name: 'loan_confirm',
    title: '贷款确认',
    url: 'widget://html/loan_confirm/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarGreen
  },
  // 押金贷贷款详情
  yjd_loan_details: {
    name: 'yjd_loan_details',
    title: '贷款详情',
    url: 'widget://html/yjd_loan_details/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 公用的贷款详情
  loan_details: {
    name: 'loan_details',
    title: '贷款详情',
    url: 'widget://html/loan_details/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 还款计划
  repay_plan: {
    name: 'repay_plan',
    title: '还款计划',
    url: 'widget://html/repay_plan/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 还款记录
  repay_record: {
    name: 'repay_record',
    title: '还款记录',
    url: 'widget://html/repay_record/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 押金贷代养合同
  yjd_contract_daiyang: {
    name: 'yjd_contract_daiyang',
    title: '代养合同',
    url: 'widget://html/yjd_contract_daiyang/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 押金贷贷款合同
  yjd_contract_loan: {
    name: 'yjd_contract_loan',
    title: '贷款合同',
    url: 'widget://html/yjd_contract_loan/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  }
};

var routerHXDConfig = {
  // 好销宝授信申请
  hxd_apply: {
    name: 'hxd_apply',
    title: '产品介绍',
    url: 'widget://html/hxd_apply/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 好销宝授信申请补充企业信息
  hxd_a_supply: {
    name: 'hxd_a_supply',
    title: '补充企业信息',
    url: 'widget://html/hxd_a_supply/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 好销宝授信申请成功/失败
  hxd_a_success: {
    name: 'hxd_a_success',
    title: '产品开通',
    url: 'widget://html/hxd_a_success/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarGreen
  },
  // 好销宝产品详情
  hxd_product_detail: {
    name: 'hxd_product_detail',
    title: '产品详情',
    url: 'widget://html/hxd_product_detail/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 好销宝额度变化详情
  hxd_quota: {
    name: 'hxd_quota',
    title: '额度变化详情',
    url: 'widget://html/hxd_quota/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 好销宝用款申请
  hxd_u_apply: {
    name: 'hxd_u_apply',
    title: '申请用款',
    url: 'widget://html/hxd_u_apply/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 好销宝用款确认
  hxd_u_confirm: {
    name: 'hxd_u_confirm',
    title: '用款确认',
    url: 'widget://html/hxd_u_confirm/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 好销宝用款确认
  hxd_u_try_detail: {
    name: 'hxd_u_try_detail',
    title: '用款试算',
    url: 'widget://html/hxd_u_try_detail/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 好销宝用款校验
  hxd_u_smscode: {
    name: 'hxd_u_smscode',
    title: '用款校验',
    url: 'widget://html/hxd_u_smscode/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 好销宝用款结果
  hxd_u_result: {
    name: 'hxd_u_result',
    title: '审核结果',
    url: 'widget://html/hxd_u_result/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 好销宝还款试算
  hxd_r_try: {
    name: 'hxd_r_try',
    title: '还款试算',
    url: 'widget://html/hxd_r_try/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 好销宝还款试算详情页
  hxd_r_try_detail: {
    name: 'hxd_r_try_detail',
    title: '还款试算详情',
    url: 'widget://html/hxd_r_try_detail/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 好销宝还款校验页
  hxd_r_smscode: {
    name: 'hxd_r_smscode',
    title: '还款校验',
    url: 'widget://html/hxd_r_smscode/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 好销宝还款校验页
  hxd_r_result: {
    name: 'hxd_r_result',
    title: '还款结果',
    url: 'widget://html/hxd_r_result/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 好销宝金服开户申请
  hxd_jf_apply: {
    name: 'hxd_jf_apply',
    title: '转账还款通道',
    url: 'widget://html/hxd_jf_apply/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 好销宝金服开户成功页
  hxd_jf_account: {
    name: 'hxd_jf_account',
    title: '转账还款通道',
    url: 'widget://html/hxd_jf_account/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 好销宝金服开户企业补充信息
  hxd_jf_enterprise: {
    name: 'hxd_jf_enterprise',
    title: '开通信息补充',
    url: 'widget://html/hxd_jf_enterprise/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 好销宝金服开户结果
  hxd_jf_result: {
    name: 'hxd_jf_result',
    title: '开户结果',
    url: 'widget://html/hxd_jf_result/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 好销宝金服开户状态查看
  hxd_jf_status: {
    name: 'hxd_jf_status',
    title: '转账还款通道',
    url: 'widget://html/hxd_jf_status/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 好销宝贷款详情
  hxd_loan_details: {
    name: 'hxd_loan_details',
    title: '贷款详情',
    url: 'widget://html/hxd_loan_details/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  }
};

var routerConfig = {
  // 消息中心
  msgcenter: {
    name: 'html/msgcenter/win',
    title: '消息中心',
    url: 'widget://html/msgcenter/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarWhite$1
  },
  // 我的账单
  billlist: {
    name: 'html/billlist/win',
    title: '我的账单',
    url: 'widget://html/billlist/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarGreen
  },
  // 账单详情
  billdetails: {
    name: 'html/billdetails/win',
    title: '账单详情',
    url: 'widget://html/billdetails/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarGreen
  },
  // 我的贷款
  my_loan: {
    name: 'html/my_loan/win',
    title: '我的贷款',
    url: 'widget://html/my_loan/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: false,
    slidBackEnabled: true,
    navigationBar: navigationBarWhite$1
  },
  // 我的额度
  my_quota: {
    name: 'html/my_quota/index',
    title: '我的额度',
    url: 'widget://html/my_quota/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarGreen
  },
  // 已开通的产品
  my_product: {
    name: 'my_product',
    title: '我开通的产品',
    url: 'widget://html/my_product/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarWhite$1
  },
  // 联系我们
  contactus: {
    name: 'html/contactus/win',
    title: '联系我们',
    url: 'widget://html/contactus/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarGreen
  },
  // 设置
  settings: {
    name: 'html/settings/win',
    title: '设置',
    url: 'widget://html/settings/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarWhite$1
  },
  // 我的钱包详情
  wallet: {
    name: 'wallet',
    title: '希望钱包',
    url: 'widget://html/wallet/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 通用产品列表
  com_product_list: {
    name: 'com_product_list',
    title: '产品列表',
    url: 'widget://html/com_product_list/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 合同页
  agreement: {
    name: 'agreement',
    title: '查看合同',
    url: 'widget://html/agreement/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 还款试算页面
  com_repay_trial: {
    name: 'com_repay_trial',
    title: '还款试算',
    url: 'widget://html/com_repay_trial/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 还款结果页面
  com_repay_result: {
    name: 'com_repay_result',
    title: '还款结果',
    url: 'widget://html/com_repay_result/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // pdf webview
  pdf_agreement: {
    name: 'pdf_agreement',
    title: '查看合同',
    url: 'widget://html/pdf_agreement/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  },
  // 活体识别
  face: {
    name: 'face',
    title: '活体识别调试',
    url: 'widget://html/face/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite$1
  }
};

function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var profile = _objectSpread$4({}, routerHXDConfig, {}, routerMap, {}, routerConfig);

function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Router$1 = /*#__PURE__*/function () {
  function Router() {
    classCallCheck(this, Router);
  }

  createClass(Router, [{
    key: "openPage",
    // 打开window级别页面
    value: function openPage(_ref) {
      var key = _ref.key,
          params = _ref.params;
      api.openTabLayout(_objectSpread$5({}, profile[key], {}, params));
    }
  }]);

  return Router;
}();

var Router$2 = new Router$1();

var Service = /*#__PURE__*/function () {
  function Service() {
    classCallCheck(this, Service);
  }

  createClass(Service, null, [{
    key: "queryArgument",
    value: function queryArgument() {
      return http$1.get('/crpt-biz/biz/platform/protocol/app/query');
    }
  }, {
    key: "getPDFId",
    value: function getPDFId(id) {
      return http$1.post("/crpt-file/file/wordRelaceBookmark", {
        body: {
          wordFileId: id,
          businessKey: 'registrationAgreement'
        }
      });
    }
  }]);

  return Service;
}();

apiready = function apiready() {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  var type = 'geren'; // qiye

  var sendStatus = 'notsend'; // notsend:未发送,sending:发送中,countdown:倒计时中

  var submitStatus = 'notsubmit'; // notsubmit:未提交,submitting:正在提交

  function radioOnChange() {
    if (this.dataset.type === 'geren') {
      showProtocol(1);
      $api.byId('companyName').style.display = 'none';
      type = 'geren';
    } else {
      showProtocol(2);
      $api.byId('companyName').style.display = 'block';
      type = 'qiye';
    }
  }

  document.querySelector('#geren').onclick = radioOnChange;
  document.querySelector('#qiye').onclick = radioOnChange;

  function getAndSaveProtocol() {
    return _getAndSaveProtocol.apply(this, arguments);
  }

  function _getAndSaveProtocol() {
    _getAndSaveProtocol = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
      var res;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              api.showProgress({
                title: '协议加载中...',
                text: '',
                modal: true
              });
              _context.prev = 1;
              _context.next = 4;
              return Service.queryArgument();

            case 4:
              res = _context.sent;

              if (res.code === 200) {
                if (res.data.count > 0) {
                  saveProtocolToStorage(res.data.list);
                } else {
                  saveProtocolToStorage([]);
                }
              }

              _context.next = 12;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](1);
              api.toast({
                msg: _context.t0.msg || '获取协议失败',
                location: 'middle'
              });
              saveProtocolToStorage([]);

            case 12:
              api.hideProgress();

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 8]]);
    }));
    return _getAndSaveProtocol.apply(this, arguments);
  }

  function showProtocol(_x) {
    return _showProtocol.apply(this, arguments);
  }

  function _showProtocol() {
    _showProtocol = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(type) {
      var node, tyeeNode, tyeeNode3, nodes, tpl;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              node = getNodeProtocolFromStorage(1);

              if (!(node.length === 0)) {
                _context2.next = 5;
                break;
              }

              _context2.next = 4;
              return getAndSaveProtocol();

            case 4:
              node = getNodeProtocolFromStorage(1);

            case 5:
              tyeeNode = getProtocolFromNode(node, type);
              tyeeNode3 = getProtocolFromNode(node, 3);
              nodes = [];

              if (tyeeNode) {
                nodes = nodes.concat(tyeeNode);
              }

              if (tyeeNode3) {
                nodes = nodes.concat(tyeeNode3);
              }

              if (!(nodes.length === 0)) {
                _context2.next = 13;
                break;
              }

              api.toast({
                msg: '无当前节点协议',
                location: 'middle'
              });
              return _context2.abrupt("return");

            case 13:
              tpl = nodes.map(function (item) {
                return "<li tapmode=\"active\" data-name=\"".concat(item.protocolName, "\" data-id=\"").concat(item.protocolFileId, "\">\u300A").concat(item.protocolName, "\u300B</li>");
              });
              console.log(tpl);
              $api.byId('agreement').innerHTML = tpl.join('');

            case 16:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _showProtocol.apply(this, arguments);
  }

  showProtocol(1); // protocolType 1-个人，2-企业，3-通用

  document.querySelector('#agreement').onclick = function (e) {
    var strong = $api.closest(e.target, 'li');

    if (strong) {
      // showContract(strong.dataset.id)
      Router$2.openPage({
        key: 'pdf_agreement',
        params: {
          pageParam: {
            type: 'pdf',
            id: strong.dataset.id
          }
        }
      });
    }
  };

  function countDown() {
    var second = 60;
    $api.byId('sendcode').innerHTML = second + '秒后重试';
    var timer = setInterval(function () {
      if (second <= 0) {
        sendStatus = 'notsend';
        $api.byId('sendcode').innerHTML = '发送验证码';
        clearInterval(timer);
      } else {
        second--;
        $api.byId('sendcode').innerHTML = second + '秒后重试';
      }
    }, 1000);
  }

  document.querySelector('#sendcode').onclick = function () {
    if (sendStatus === 'notsend') {
      var tel = $api.byId('tel').value.trim();

      if (!tel) {
        return api.toast({
          msg: '请输入手机号码',
          location: 'middle'
        });
      }

      sendStatus = 'sending';
      $api.byId('sendcode').innerHTML = '正在发送中...';
      http$1.post('/crpt-cust/sms/smsverificationcode', {
        body: {
          phone: tel
        }
      }).then(function (ret) {
        sendStatus = 'countdown';
        countDown();
      })["catch"](function (error) {
        api.toast({
          msg: error.msg || '验证码发送失败',
          location: 'middle'
        });
        sendStatus = 'notsend';
        $api.byId('sendcode').innerHTML = '发送验证码';
      });
    }
  };

  document.querySelector('#submit').onclick = function () {
    var personRegister = '/crpt-cust/identification/personregister';
    var enterpriseRegister = '/crpt-cust/identification/enterpriseregister';
    var url = type === 'geren' ? personRegister : enterpriseRegister;

    if (submitStatus === 'notsubmit') {
      var companyName = $api.byId('name').value.trim();
      var tel = $api.byId('tel').value.trim();
      var code = $api.byId('code').value.trim();
      var pwd = $api.byId('pwd').value.trim();
      var repwd = $api.byId('repwd').value.trim();

      if (type === 'qiye' && !companyName) {
        return api.toast({
          msg: '请输入企业全称',
          location: 'middle'
        });
      }

      if (!tel) {
        return api.toast({
          msg: '请输入手机号码',
          location: 'middle'
        });
      }

      if (!code) {
        return api.toast({
          msg: '请输入验证码',
          location: 'middle'
        });
      }

      if (!pwd) {
        return api.toast({
          msg: '请输入密码',
          location: 'middle'
        });
      }

      if (pwd !== repwd) {
        return api.toast({
          msg: '两次密码输入不一致',
          location: 'middle'
        });
      }

      if (!$api.byId('checkbox').checked) {
        return api.toast({
          msg: '请仔细阅读，并同意协议',
          location: 'middle'
        });
      }

      submitStatus = 'submitting';
      var body = {
        phone: tel,
        password: Base64.encode(pwd),
        confirmPassword: Base64.encode(pwd),
        verification: code
      };

      if (type === 'qiye') {
        body.name = companyName;
      }

      $api.addCls($api.byId('submit'), 'loading');
      http$1.post(url, {
        body: body
      }).then(function (ret) {
        submitStatus = 'notsubmit';
        $api.removeCls($api.byId('submit'), 'loading');
        api.toast({
          msg: '注册成功',
          location: 'middle',
          global: true
        });
        var body = {
          userType: type === 'geren' ? 1 : 2,
          // 1个人用户登录，2企业用户登录
          username: tel,
          loginType: 1,
          // 登录方式,1-账密登录，2-验证码登录（企业只能是2）
          // verification: code,
          password: pwd
        };
        appLogin(body, function (userinfo) {
          loginSuccessCallback(userinfo);
        });
      })["catch"](function (error) {
        api.toast({
          msg: error.msg || '注册失败',
          location: 'middle'
        });
        submitStatus = 'notsubmit';
        $api.removeCls($api.byId('submit'), 'loading');
      });
    }
  };
};
