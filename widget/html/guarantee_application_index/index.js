var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

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

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

var arrayWithHoles = _arrayWithHoles;

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

var iterableToArrayLimit = _iterableToArrayLimit;

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

var arrayLikeToArray = _arrayLikeToArray;

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

var unsupportedIterableToArray = _unsupportedIterableToArray;

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var nonIterableRest = _nonIterableRest;

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

var slicedToArray = _slicedToArray;

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

var setPrototypeOf = createCommonjsModule(function (module) {
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
});

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

var inherits = _inherits;

var _typeof_1 = createCommonjsModule(function (module) {
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
});

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var assertThisInitialized = _assertThisInitialized;

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof_1(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

var possibleConstructorReturn = _possibleConstructorReturn;

var getPrototypeOf = createCommonjsModule(function (module) {
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
});

// 系统顶部导航配置
var navigationBarProfile = {
  background: '#fff',
  color: '#303133',
  fontSize: 18,
  fontWeight: 500
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
      bgActive: '#ccc',
      color: '#888',
      colorActive: '#fff'
    },
    ok: {
      text: '确定',
      size: 15,
      w: 90,
      h: 35,
      bg: 'rgba(102,187,106,1)',
      bgActive: '#ccc',
      color: '#fff',
      colorActive: '#fff'
    },
    title: {
      text: '请选择',
      size: 15,
      h: 50,
      bg: '#eee',
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
    row: 4,
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

// api.lockSlidPane();


function openRegLogin() {
  api.openWin({
    name: 'html/reglogin/win',
    url: 'widget://html/reglogin/win.html',
    bgColor: '#fff',
    reload: true,
    slidBackEnabled: false
  });
} // 个人登录

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var dev = 'http://crptdev.liuheco.com';
var baseUrl =  dev ;
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
    api.ajax({
      url: baseUrl + url,
      method: method === 'upload' ? 'post' : method,
      data: data,
      tag: tag,
      timeout: timeout,
      headers: _objectSpread({}, Authorization, {}, contentType, {}, headers)
    }, function (ret, error) {
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
                name: 'html/register/win'
              });
              api.closeWin({
                name: 'html/gerenlogin/win'
              });
              api.closeWin({
                name: 'html/qiyelogin/win'
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

      {
        if (ret) {
          console.log('/************* SUCCESS. **********/');
        } else {
          console.log('/************* ERROR. ************/');
        }

        console.log('__URL ==> ' + '[' + method + '] ' + baseUrl + url);
        console.log('__TOKEN ==> ' + token);
        console.log('__BODY ==> ' + JSON.stringify(data));
        console.log('__DATA ==> ' + JSON.stringify(ret || error));
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
      var _IdcardVerify = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(params) {
        var res;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return BaiduSDK.getToken();

              case 2:
                res = _context2.sent;

                if (!(res.code === 200)) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return", http.post(BaiduSDK.URL_IDCARD_INFO, obj2FormData({
                  certFile: params.file,
                  accessToken: res.data.accessToken
                }), // formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                }));

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function IdcardVerify(_x2) {
        return _IdcardVerify.apply(this, arguments);
      }

      return IdcardVerify;
    }()
  }, {
    key: "BankVerify",
    value: function () {
      var _BankVerify = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(params) {
        var res;
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return BaiduSDK.getToken();

              case 2:
                res = _context3.sent;

                if (!(res.code === 200)) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt("return", http.post(BaiduSDK.URL_BANK_INFO, obj2FormData({
                  bankcardFile: params.file,
                  accessToken: res.data.accessToken
                }), // formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                }));

              case 5:
                return _context3.abrupt("return", Promise.reject(res));

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function BankVerify(_x3) {
        return _BankVerify.apply(this, arguments);
      }

      return BankVerify;
    }()
  }]);

  return BaiduSDK;
}();
var obj2FormData = function obj2FormData(info) {
  var formData = new FormData();
  Object.keys(info).forEach(function (k, i) {
    formData.append(k, info[k]);
  });
  return formData;
};

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

var Service = /*#__PURE__*/function () {
  function Service() {
    classCallCheck(this, Service);

    this.ajaxUrls = {
      queryGuaranteeMainUrl: '/crpt-guarantee/gt/apply/query',
      queryOperateUrl: '/crpt-guarantee/gt/operate/query',
      insertOperateUrl: '/crpt-guarantee/gt/operate/save',
      updateOperateUrl: '/crpt-guarantee/gt/operate/update'
    };
  }

  createClass(Service, [{
    key: "getQueryGuaranteeMain",
    value: function getQueryGuaranteeMain() {
      return http.get(this.ajaxUrls.queryGuaranteeMainUrl, null, {
        // headers: {
        //     token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
        // },
        timeout: 3000
      });
    }
  }, {
    key: "getQueryOperate",
    value: function getQueryOperate(params) {
      return http.get(this.ajaxUrls.queryOperateUrl, {
        values: params
      }, {
        // headers: {
        //     token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
        // },
        timeout: 3000
      });
    }
  }, {
    key: "postInsertOperate",
    value: function postInsertOperate(params, files) {
      return http.upload(this.ajaxUrls.insertOperateUrl, {
        values: params,
        files: files
      }, {
        // headers: {
        //     token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
        // },
        timeout: 3000
      });
    }
  }, {
    key: "postUpdateOperate",
    value: function postUpdateOperate(params, files) {
      return http.upload(this.ajaxUrls.updateOperateUrl, {
        values: params,
        files: files
      }, {
        // headers: {
        //     token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
        // },
        timeout: 3000
      });
    }
  }]);

  return Service;
}();

var rolldate_min = createCommonjsModule(function (module, exports) {
  /**
   * Rolldate 3.1.3
   * Copyright 2018-2020
   * weijhfly https://github.com/weijhfly/rolldate
   * Licensed under MIT
   * Released on: aug 4, 2018
   */
  !function (t, i) {
     module.exports = i() ;
  }(commonjsGlobal, function () {

    !function (t, i) {
      void 0 === i && (i = {});
      var e = i.insertAt;

      if (t && "undefined" != typeof document) {
        var o = document.head || document.getElementsByTagName("head")[0],
            s = document.createElement("style");
        s.type = "text/css", "top" === e && o.firstChild ? o.insertBefore(s, o.firstChild) : o.appendChild(s), s.styleSheet ? s.styleSheet.cssText = t : s.appendChild(document.createTextNode(t));
      }
    }(".rolldate-container{font-size:20px;color:#333;text-align:center}.rolldate-container ul{margin:0;padding:0}.rolldate-container li{list-style-type:none}.rolldate-container header{position:relative;line-height:60px;font-size:18px;border-bottom:1px solid #e0e0e0}.rolldate-container .rolldate-mask{position:fixed;width:100%;height:100%;top:0;left:0;z-index:999;background-color:rgba(37,38,45,.4)}.rolldate-container .rolldate-panel{position:fixed;bottom:0;left:0;width:100%;height:273px;z-index:1000;background:#fff;-webkit-transition:all .3s ease-in-out;-o-transition:all .3s ease-in-out;transition:all .3s ease-in-out;-webkit-transform:translate3d(0,273px,0);transform:translate3d(0,273px,0)}.rolldate-container .rolldate-btn{position:absolute;left:0;top:0;height:100%;padding:0 15px;color:#666;font-size:16px;cursor:pointer;-webkit-tap-highlight-color:transparent}.rolldate-container .rolldate-confirm{left:auto;right:0;color:#007bff}.rolldate-container .rolldate-content{position:relative;top:20px}.rolldate-container .rolldate-wrapper{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.rolldate-container .rolldate-wrapper>div{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;height:173px;line-height:36px;overflow:hidden;-webkit-flex-basis:-8e;-ms-flex-preferred-size:-8e;flex-basis:-8e;width:1%}.rolldate-container .rolldate-wrapper ul{margin-top:68px}.rolldate-container .rolldate-wrapper li{height:36px}.rolldate-container .rolldate-dim{position:absolute;left:0;top:0;width:100%;height:68px;background:-o-linear-gradient(bottom,hsla(0,0%,100%,.4),hsla(0,0%,100%,.8));background:-webkit-gradient(linear, left bottom, left top, from(hsla(0, 0%, 100%, 0.4)), to(hsla(0, 0%, 100%, 0.8)));background:-o-linear-gradient(bottom, hsla(0, 0%, 100%, 0.4), hsla(0, 0%, 100%, 0.8));background:linear-gradient(0deg,hsla(0,0%,100%,.4),hsla(0,0%,100%,.8));pointer-events:none;-webkit-transform:translateZ(0);transform:translateZ(0);z-index:10}.rolldate-container .mask-top{border-bottom:1px solid #ebebeb}.rolldate-container .mask-bottom{top:auto;bottom:1px;border-top:1px solid #ebebeb}.rolldate-container .fadeIn{-webkit-transform:translateZ(0);transform:translateZ(0)}.rolldate-container .fadeOut{-webkit-transform:translate3d(0,273px,0);transform:translate3d(0,273px,0)}@media screen and (max-width:414px){.rolldate-container{font-size:18px}}@media screen and (max-width:320px){.rolldate-container{font-size:15px}}");

    function S(t, i) {
      return "string" != typeof t && t.nodeType ? t : i ? document.querySelectorAll(t) : document.querySelector(t);
    }

    var t,
        Y = (function (t, i) {
      t.exports = function () {
        function s(t, i) {
          for (; i + 1 < t.length; i++) t[i] = t[i + 1];

          t.pop();
        }

        var h = function (t, i) {
          if (Array.isArray(t)) return t;
          if (Symbol.iterator in Object(t)) return function (t, i) {
            var e = [],
                o = !0,
                s = !1,
                n = void 0;

            try {
              for (var r, a = t[Symbol.iterator](); !(o = (r = a.next()).done) && (e.push(r.value), !i || e.length !== i); o = !0);
            } catch (t) {
              s = !0, n = t;
            } finally {
              try {
                !o && a.return && a.return();
              } finally {
                if (s) throw n;
              }
            }

            return e;
          }(t, i);
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        },
            e = "undefined" != typeof window,
            t = e && navigator.userAgent.toLowerCase(),
            i = t && /wechatdevtools/.test(t),
            o = t && 0 < t.indexOf("android");

        function b() {
          return window.performance && window.performance.now ? window.performance.now() + window.performance.timing.navigationStart : +new Date();
        }

        function l(t) {
          for (var i = arguments.length, e = Array(1 < i ? i - 1 : 0), o = 1; o < i; o++) e[o - 1] = arguments[o];

          for (var s = 0; s < e.length; s++) {
            var n = e[s];

            for (var r in n) t[r] = n[r];
          }

          return t;
        }

        function c(t) {
          return null == t;
        }

        var n = e && document.createElement("div").style,
            r = function () {
          if (!e) return !1;
          var t = {
            webkit: "webkitTransform",
            Moz: "MozTransform",
            O: "OTransform",
            ms: "msTransform",
            standard: "transform"
          };

          for (var i in t) if (void 0 !== n[t[i]]) return i;

          return !1;
        }();

        function a(t) {
          return !1 !== r && ("standard" === r ? "transitionEnd" === t ? "transitionend" : t : r + t.charAt(0).toUpperCase() + t.substr(1));
        }

        function d(t, i, e, o) {
          t.addEventListener(i, e, {
            passive: !1,
            capture: !!o
          });
        }

        function p(t, i, e, o) {
          t.removeEventListener(i, e, {
            passive: !1,
            capture: !!o
          });
        }

        function u(t) {
          for (var i = 0, e = 0; t;) i -= t.offsetLeft, e -= t.offsetTop, t = t.offsetParent;

          return {
            left: i,
            top: e
          };
        }

        r && "standard" !== r && r.toLowerCase();
        var m = a("transform"),
            f = a("transition"),
            v = e && a("perspective") in n,
            g = e && ("ontouchstart" in window || i),
            w = !1 !== m,
            y = e && f in n,
            x = {
          transform: m,
          transition: f,
          transitionTimingFunction: a("transitionTimingFunction"),
          transitionDuration: a("transitionDuration"),
          transitionDelay: a("transitionDelay"),
          transformOrigin: a("transformOrigin"),
          transitionEnd: a("transitionEnd")
        },
            T = {
          touchstart: 1,
          touchmove: 1,
          touchend: 1,
          mousedown: 2,
          mousemove: 2,
          mouseup: 2
        };

        function S(t) {
          if (t instanceof window.SVGElement) {
            var i = t.getBoundingClientRect();
            return {
              top: i.top,
              left: i.left,
              width: i.width,
              height: i.height
            };
          }

          return {
            top: t.offsetTop,
            left: t.offsetLeft,
            width: t.offsetWidth,
            height: t.offsetHeight
          };
        }

        function Y(t, i) {
          for (var e in i) if (i[e].test(t[e])) return !0;

          return !1;
        }

        function D(t) {
          var i = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "click",
              e = void 0;
          "mouseup" === t.type || "mousecancel" === t.type ? e = t : "touchend" !== t.type && "touchcancel" !== t.type || (e = t.changedTouches[0]);
          var o = {};
          e && (o.screenX = e.screenX || 0, o.screenY = e.screenY || 0, o.clientX = e.clientX || 0, o.clientY = e.clientY || 0);
          var s = void 0,
              n = !0,
              r = !0;
          if ("undefined" != typeof MouseEvent) try {
            s = new MouseEvent(i, l({
              bubbles: n,
              cancelable: r
            }, o));
          } catch (t) {
            a();
          } else a();

          function a() {
            (s = document.createEvent("Event")).initEvent(i, n, r), l(s, o);
          }

          s.forwardedTouchEvent = !0, s._constructed = !0, t.target.dispatchEvent(s);
        }

        var M = {
          startX: 0,
          startY: 0,
          scrollX: !1,
          scrollY: !0,
          freeScroll: !1,
          directionLockThreshold: 5,
          eventPassthrough: "",
          click: !1,
          tap: !1,
          bounce: !0,
          bounceTime: 800,
          momentum: !0,
          momentumLimitTime: 300,
          momentumLimitDistance: 15,
          swipeTime: 2500,
          swipeBounceTime: 500,
          deceleration: .0015,
          flickLimitTime: 200,
          flickLimitDistance: 100,
          resizePolling: 60,
          probeType: 0,
          preventDefault: !0,
          preventDefaultException: {
            tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/
          },
          HWCompositing: !0,
          useTransition: !0,
          useTransform: !0,
          bindToWrapper: !1,
          disableMouse: g,
          disableTouch: !g,
          observeDOM: !0,
          autoBlur: !0,
          wheel: !1,
          snap: !1,
          scrollbar: !1,
          pullDownRefresh: !1,
          pullUpLoad: !1,
          mouseWheel: !1,
          stopPropagation: !1,
          zoom: !1,
          infinity: !1,
          dblclick: !1
        },
            X = {
          swipe: {
            style: "cubic-bezier(0.23, 1, 0.32, 1)",
            fn: function (t) {
              return 1 + --t * t * t * t * t;
            }
          },
          swipeBounce: {
            style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            fn: function (t) {
              return t * (2 - t);
            }
          },
          bounce: {
            style: "cubic-bezier(0.165, 0.84, 0.44, 1)",
            fn: function (t) {
              return 1 - --t * t * t * t;
            }
          }
        };

        function _(t, i, e, o, s, n, r) {
          var a = t - i,
              l = Math.abs(a) / e,
              h = r.deceleration,
              c = r.itemHeight,
              d = r.swipeBounceTime,
              p = r.wheel,
              u = r.swipeTime,
              m = p ? 4 : 15,
              f = t + l / h * (a < 0 ? -1 : 1);
          return p && c && (f = Math.round(f / c) * c), f < o ? (f = n ? Math.max(o - n / 4, o - n / m * l) : o, u = d) : s < f && (f = n ? Math.min(s + n / 4, s + n / m * l) : s, u = d), {
            destination: Math.round(f),
            duration: u
          };
        }

        function E() {}

        var k,
            L,
            O,
            P,
            H,
            I = e ? window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || function (t) {
          return window.setTimeout(t, (t.interval || 100 / 60) / 2);
        } : E,
            z = e ? window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || function (t) {
          window.clearTimeout(t);
        } : E;

        function W(t) {
          console.error("[BScroll warn]: " + t);
        }

        function C(t, i) {
          this.wrapper = "string" == typeof t ? document.querySelector(t) : t, this.wrapper || W("Can not resolve the wrapper DOM."), this.scroller = this.wrapper.children[0], this.scroller || W("The wrapper need at least one child element to be scroller."), this.scrollerStyle = this.scroller.style, this._init(i);
        }

        return (k = C).prototype._init = function (t) {
          this._handleOptions(t), this._events = {}, this.x = 0, this.y = 0, this.directionX = 0, this.directionY = 0, this.setScale(1), this._addDOMEvents(), this._initExtFeatures(), this._watchTransition(), this.options.observeDOM && this._initDOMObserver(), this.options.autoBlur && this._handleAutoBlur(), this.refresh(), this.options.snap || this.scrollTo(this.options.startX, this.options.startY), this.enable();
        }, k.prototype.setScale = function (t) {
          this.lastScale = c(this.scale) ? t : this.scale, this.scale = t;
        }, k.prototype._handleOptions = function (t) {
          this.options = l({}, M, t), this.translateZ = this.options.HWCompositing && v ? " translateZ(0)" : "", this.options.useTransition = this.options.useTransition && y, this.options.useTransform = this.options.useTransform && w, this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault, this.options.scrollX = "horizontal" !== this.options.eventPassthrough && this.options.scrollX, this.options.scrollY = "vertical" !== this.options.eventPassthrough && this.options.scrollY, this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough, this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold, !0 === this.options.tap && (this.options.tap = "tap");
        }, k.prototype._addDOMEvents = function () {
          var t = d;

          this._handleDOMEvents(t);
        }, k.prototype._removeDOMEvents = function () {
          var t = p;

          this._handleDOMEvents(t);
        }, k.prototype._handleDOMEvents = function (t) {
          var i = this.options.bindToWrapper ? this.wrapper : window;
          t(window, "orientationchange", this), t(window, "resize", this), this.options.click && t(this.wrapper, "click", this, !0), this.options.disableMouse || (t(this.wrapper, "mousedown", this), t(i, "mousemove", this), t(i, "mousecancel", this), t(i, "mouseup", this)), g && !this.options.disableTouch && (t(this.wrapper, "touchstart", this), t(i, "touchmove", this), t(i, "touchcancel", this), t(i, "touchend", this)), t(this.scroller, x.transitionEnd, this);
        }, k.prototype._initExtFeatures = function () {
          this.options.snap && this._initSnap(), this.options.scrollbar && this._initScrollbar(), this.options.pullUpLoad && this._initPullUp(), this.options.pullDownRefresh && this._initPullDown(), this.options.wheel && this._initWheel(), this.options.mouseWheel && this._initMouseWheel(), this.options.zoom && this._initZoom(), this.options.infinity && this._initInfinite();
        }, k.prototype._watchTransition = function () {
          if ("function" == typeof Object.defineProperty) {
            var s = this,
                n = !1,
                t = this.options.useTransition ? "isInTransition" : "isAnimating";
            Object.defineProperty(this, t, {
              get: function () {
                return n;
              },
              set: function (t) {
                n = t;

                for (var i = s.scroller.children.length ? s.scroller.children : [s.scroller], e = n && !s.pulling ? "none" : "auto", o = 0; o < i.length; o++) i[o].style.pointerEvents = e;
              }
            });
          }
        }, k.prototype._handleAutoBlur = function () {
          this.on("scrollStart", function () {
            var t = document.activeElement;
            !t || "INPUT" !== t.tagName && "TEXTAREA" !== t.tagName || t.blur();
          });
        }, k.prototype._initDOMObserver = function () {
          var n = this;

          if ("undefined" != typeof MutationObserver) {
            var r = void 0,
                t = new MutationObserver(function (t) {
              if (!n._shouldNotRefresh()) {
                for (var i = !1, e = !1, o = 0; o < t.length; o++) {
                  var s = t[o];

                  if ("attributes" !== s.type) {
                    i = !0;
                    break;
                  }

                  if (s.target !== n.scroller) {
                    e = !0;
                    break;
                  }
                }

                i ? n.refresh() : e && (clearTimeout(r), r = setTimeout(function () {
                  n._shouldNotRefresh() || n.refresh();
                }, 60));
              }
            });
            t.observe(this.scroller, {
              attributes: !0,
              childList: !0,
              subtree: !0
            }), this.on("destroy", function () {
              t.disconnect();
            });
          } else this._checkDOMUpdate();
        }, k.prototype._shouldNotRefresh = function () {
          var t = this.x > this.minScrollX || this.x < this.maxScrollX || this.y > this.minScrollY || this.y < this.maxScrollY;
          return this.isInTransition || this.stopFromTransition || t;
        }, k.prototype._checkDOMUpdate = function () {
          var o = S(this.scroller),
              s = o.width,
              n = o.height;
          (function e() {
            var t = this;
            setTimeout(function () {
              (function () {
                if (!this.destroyed) {
                  var t = (o = S(this.scroller)).width,
                      i = o.height;
                  s === t && n === i || this.refresh(), s = t, n = i, e.call(this);
                }
              }).call(t);
            }, 1e3);
          }).call(this);
        }, k.prototype.handleEvent = function (t) {
          switch (t.type) {
            case "touchstart":
            case "mousedown":
              this._start(t), this.options.zoom && t.touches && 1 < t.touches.length && this._zoomStart(t);
              break;

            case "touchmove":
            case "mousemove":
              this.options.zoom && t.touches && 1 < t.touches.length ? this._zoom(t) : this._move(t);
              break;

            case "touchend":
            case "mouseup":
            case "touchcancel":
            case "mousecancel":
              this.scaled ? this._zoomEnd(t) : this._end(t);
              break;

            case "orientationchange":
            case "resize":
              this._resize();

              break;

            case "transitionend":
            case "webkitTransitionEnd":
            case "oTransitionEnd":
            case "MSTransitionEnd":
              this._transitionEnd(t);

              break;

            case "click":
              this.enabled && !t._constructed && (Y(t.target, this.options.preventDefaultException) || (t.preventDefault(), t.stopPropagation()));
              break;

            case "wheel":
            case "DOMMouseScroll":
            case "mousewheel":
              this._onMouseWheel(t);

          }
        }, k.prototype.refresh = function () {
          var t = "static" === window.getComputedStyle(this.wrapper, null).position,
              i = S(this.wrapper);
          this.wrapperWidth = i.width, this.wrapperHeight = i.height;
          var e = S(this.scroller);
          this.scrollerWidth = Math.round(e.width * this.scale), this.scrollerHeight = Math.round(e.height * this.scale), this.relativeX = e.left, this.relativeY = e.top, t && (this.relativeX -= i.left, this.relativeY -= i.top), this.minScrollX = 0, this.minScrollY = 0;
          var o = this.options.wheel;
          o ? (this.items = this.scroller.children, this.options.itemHeight = this.itemHeight = this.items.length ? this.scrollerHeight / this.items.length : 0, void 0 === this.selectedIndex && (this.selectedIndex = o.selectedIndex || 0), this.options.startY = -this.selectedIndex * this.itemHeight, this.maxScrollX = 0, this.maxScrollY = -this.itemHeight * (this.items.length - 1)) : (this.maxScrollX = this.wrapperWidth - this.scrollerWidth, this.options.infinity || (this.maxScrollY = this.wrapperHeight - this.scrollerHeight), this.maxScrollX < 0 ? (this.maxScrollX -= this.relativeX, this.minScrollX = -this.relativeX) : 1 < this.scale && (this.maxScrollX = this.maxScrollX / 2 - this.relativeX, this.minScrollX = this.maxScrollX), this.maxScrollY < 0 ? (this.maxScrollY -= this.relativeY, this.minScrollY = -this.relativeY) : 1 < this.scale && (this.maxScrollY = this.maxScrollY / 2 - this.relativeY, this.minScrollY = this.maxScrollY)), this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < this.minScrollX, this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < this.minScrollY, this.hasHorizontalScroll || (this.maxScrollX = this.minScrollX, this.scrollerWidth = this.wrapperWidth), this.hasVerticalScroll || (this.maxScrollY = this.minScrollY, this.scrollerHeight = this.wrapperHeight), this.endTime = 0, this.directionX = 0, this.directionY = 0, this.wrapperOffset = u(this.wrapper), this.trigger("refresh"), this.scaled || this.resetPosition();
        }, k.prototype.enable = function () {
          this.enabled = !0;
        }, k.prototype.disable = function () {
          this.enabled = !1;
        }, (L = C).prototype._start = function (t) {
          var i = T[t.type];

          if ((1 === i || 0 === t.button) && !(!this.enabled || this.destroyed || this.initiated && this.initiated !== i)) {
            this.initiated = i, this.options.preventDefault && !Y(t.target, this.options.preventDefaultException) && t.preventDefault(), this.options.stopPropagation && t.stopPropagation(), this.moved = !1, this.distX = 0, this.distY = 0, this.directionX = 0, this.directionY = 0, this.movingDirectionX = 0, this.movingDirectionY = 0, this.directionLocked = 0, this._transitionTime(), this.startTime = b(), this.options.wheel && (this.target = t.target), this.stop();
            var e = t.touches ? t.touches[0] : t;
            this.startX = this.x, this.startY = this.y, this.absStartX = this.x, this.absStartY = this.y, this.pointX = e.pageX, this.pointY = e.pageY, this.trigger("beforeScrollStart");
          }
        }, L.prototype._move = function (t) {
          if (this.enabled && !this.destroyed && T[t.type] === this.initiated) {
            this.options.preventDefault && t.preventDefault(), this.options.stopPropagation && t.stopPropagation();
            var i = t.touches ? t.touches[0] : t,
                e = i.pageX - this.pointX,
                o = i.pageY - this.pointY;
            this.pointX = i.pageX, this.pointY = i.pageY, this.distX += e, this.distY += o;
            var s = Math.abs(this.distX),
                n = Math.abs(this.distY),
                r = b();

            if (!(r - this.endTime > this.options.momentumLimitTime && n < this.options.momentumLimitDistance && s < this.options.momentumLimitDistance)) {
              if (this.directionLocked || this.options.freeScroll || (s > n + this.options.directionLockThreshold ? this.directionLocked = "h" : n >= s + this.options.directionLockThreshold ? this.directionLocked = "v" : this.directionLocked = "n"), "h" === this.directionLocked) {
                if ("vertical" === this.options.eventPassthrough) t.preventDefault();else if ("horizontal" === this.options.eventPassthrough) return void (this.initiated = !1);
                o = 0;
              } else if ("v" === this.directionLocked) {
                if ("horizontal" === this.options.eventPassthrough) t.preventDefault();else if ("vertical" === this.options.eventPassthrough) return void (this.initiated = !1);
                e = 0;
              }

              e = this.hasHorizontalScroll ? e : 0, o = this.hasVerticalScroll ? o : 0, this.movingDirectionX = 0 < e ? -1 : e < 0 ? 1 : 0, this.movingDirectionY = 0 < o ? -1 : o < 0 ? 1 : 0;
              var a = this.x + e,
                  l = this.y + o,
                  h = !1,
                  c = !1,
                  d = !1,
                  p = !1,
                  u = this.options.bounce;
              !1 !== u && (h = void 0 === u.top || u.top, c = void 0 === u.bottom || u.bottom, d = void 0 === u.left || u.left, p = void 0 === u.right || u.right), (a > this.minScrollX || a < this.maxScrollX) && (a = a > this.minScrollX && d || a < this.maxScrollX && p ? this.x + e / 3 : a > this.minScrollX ? this.minScrollX : this.maxScrollX), (l > this.minScrollY || l < this.maxScrollY) && (l = l > this.minScrollY && h || l < this.maxScrollY && c ? this.y + o / 3 : l > this.minScrollY ? this.minScrollY : this.maxScrollY), this.moved || (this.moved = !0, this.trigger("scrollStart")), this._translate(a, l), r - this.startTime > this.options.momentumLimitTime && (this.startTime = r, this.startX = this.x, this.startY = this.y, 1 === this.options.probeType && this.trigger("scroll", {
                x: this.x,
                y: this.y
              })), 1 < this.options.probeType && this.trigger("scroll", {
                x: this.x,
                y: this.y
              });
              var m = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft,
                  f = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop,
                  v = this.pointX - m,
                  g = this.pointY - f;
              (v > document.documentElement.clientWidth - this.options.momentumLimitDistance || v < this.options.momentumLimitDistance || g < this.options.momentumLimitDistance || g > document.documentElement.clientHeight - this.options.momentumLimitDistance) && this._end(t);
            }
          }
        }, L.prototype._end = function (t) {
          if (this.enabled && !this.destroyed && T[t.type] === this.initiated) {
            this.initiated = !1, this.options.preventDefault && !Y(t.target, this.options.preventDefaultException) && t.preventDefault(), this.options.stopPropagation && t.stopPropagation(), this.trigger("touchEnd", {
              x: this.x,
              y: this.y
            }), this.isInTransition = !1;
            var i = Math.round(this.x),
                e = Math.round(this.y),
                o = i - this.absStartX,
                s = e - this.absStartY;
            if (this.directionX = 0 < o ? -1 : o < 0 ? 1 : 0, this.directionY = 0 < s ? -1 : s < 0 ? 1 : 0, !this.options.pullDownRefresh || !this._checkPullDown()) if (this._checkClick(t)) this.trigger("scrollCancel");else if (!this.resetPosition(this.options.bounceTime, X.bounce)) {
              this._translate(i, e), this.endTime = b();
              var n = this.endTime - this.startTime,
                  r = Math.abs(i - this.startX),
                  a = Math.abs(e - this.startY);
              if (this._events.flick && n < this.options.flickLimitTime && r < this.options.flickLimitDistance && a < this.options.flickLimitDistance) this.trigger("flick");else {
                var l = 0;

                if (this.options.momentum && n < this.options.momentumLimitTime && (a > this.options.momentumLimitDistance || r > this.options.momentumLimitDistance)) {
                  var h = !1,
                      c = !1,
                      d = !1,
                      p = !1,
                      u = this.options.bounce;
                  !1 !== u && (h = void 0 === u.top || u.top, c = void 0 === u.bottom || u.bottom, d = void 0 === u.left || u.left, p = void 0 === u.right || u.right);
                  var m = -1 === this.directionX && d || 1 === this.directionX && p ? this.wrapperWidth : 0,
                      f = -1 === this.directionY && h || 1 === this.directionY && c ? this.wrapperHeight : 0,
                      v = this.hasHorizontalScroll ? _(this.x, this.startX, n, this.maxScrollX, this.minScrollX, m, this.options) : {
                    destination: i,
                    duration: 0
                  },
                      g = this.hasVerticalScroll ? _(this.y, this.startY, n, this.maxScrollY, this.minScrollY, f, this.options) : {
                    destination: e,
                    duration: 0
                  };
                  i = v.destination, e = g.destination, l = Math.max(v.duration, g.duration), this.isInTransition = !0;
                } else this.options.wheel && (e = Math.round(e / this.itemHeight) * this.itemHeight, l = this.options.wheel.adjustTime || 400);

                var w = X.swipe;

                if (this.options.snap) {
                  var y = this._nearestSnap(i, e);

                  this.currentPage = y, l = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(i - y.x), 1e3), Math.min(Math.abs(e - y.y), 1e3)), 300), i = y.x, e = y.y, this.directionX = 0, this.directionY = 0, w = this.options.snap.easing || X.bounce;
                }

                if (i !== this.x || e !== this.y) return (i > this.minScrollX || i < this.maxScrollX || e > this.minScrollY || e < this.maxScrollY) && (w = X.swipeBounce), void this.scrollTo(i, e, l, w);
                this.options.wheel && (this.selectedIndex = Math.round(Math.abs(this.y / this.itemHeight))), this.trigger("scrollEnd", {
                  x: this.x,
                  y: this.y
                });
              }
            }
          }
        }, L.prototype._checkClick = function (t) {
          var i,
              e,
              o,
              s,
              n,
              r = this.stopFromTransition && !this.pulling;
          if (this.stopFromTransition = !1, this.moved) return !1;

          if (this.options.wheel) {
            if (this.target && this.target.classList.contains(this.options.wheel.wheelWrapperClass)) {
              var a = Math.abs(Math.round(this.y / this.itemHeight)),
                  l = Math.round((this.pointY + (s = this.wrapper, {
                left: -((n = s.getBoundingClientRect()).left + window.pageXOffset),
                top: -(n.top + window.pageYOffset)
              }).top - this.wrapperHeight / 2) / this.itemHeight);
              this.target = this.items[a + l];
            }

            return this.scrollToElement(this.target, this.options.wheel.adjustTime || 400, !0, !0, X.swipe), !0;
          }

          if (r) return !1;
          var h = this.options.dblclick,
              c = !1;

          if (h && this.lastClickTime) {
            var d = h.delay,
                p = void 0 === d ? 300 : d;
            b() - this.lastClickTime < p && (c = !0, D(t, "dblclick"));
          }

          return this.options.tap && (i = t, e = this.options.tap, (o = document.createEvent("Event")).initEvent(e, !0, !0), o.pageX = i.pageX, o.pageY = i.pageY, i.target.dispatchEvent(o)), this.options.click && !Y(t.target, this.options.preventDefaultException) && D(t), this.lastClickTime = c ? null : b(), !0;
        }, L.prototype._resize = function () {
          var t = this;
          this.enabled && (o && (this.wrapper.scrollTop = 0), clearTimeout(this.resizeTimeout), this.resizeTimeout = setTimeout(function () {
            t.refresh();
          }, this.options.resizePolling));
        }, L.prototype._startProbe = function () {
          z(this.probeTimer), this.probeTimer = I(function t() {
            var i = e.getComputedPosition();
            e.trigger("scroll", i), e.isInTransition ? e.probeTimer = I(t) : e.trigger("scrollEnd", i);
          });
          var e = this;
        }, L.prototype._transitionTime = function () {
          var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0;
          if (this.scrollerStyle[x.transitionDuration] = t + "ms", this.options.wheel) for (var i = 0; i < this.items.length; i++) this.items[i].style[x.transitionDuration] = t + "ms";
          if (this.indicators) for (var e = 0; e < this.indicators.length; e++) this.indicators[e].transitionTime(t);
        }, L.prototype._transitionTimingFunction = function (t) {
          if (this.scrollerStyle[x.transitionTimingFunction] = t, this.options.wheel) for (var i = 0; i < this.items.length; i++) this.items[i].style[x.transitionTimingFunction] = t;
          if (this.indicators) for (var e = 0; e < this.indicators.length; e++) this.indicators[e].transitionTimingFunction(t);
        }, L.prototype._transitionEnd = function (t) {
          t.target === this.scroller && this.isInTransition && (this._transitionTime(), this.pulling && 1 !== this.movingDirectionY || this.resetPosition(this.options.bounceTime, X.bounce) || (this.isInTransition = !1, 3 !== this.options.probeType && this.trigger("scrollEnd", {
            x: this.x,
            y: this.y
          })));
        }, L.prototype._translate = function (t, i, e) {
          if (function (t) {
            if (!t) throw new Error("[BScroll] Translate x or y is null or undefined.");
          }(!c(t) && !c(i)), c(e) && (e = this.scale), this.options.useTransform ? this.scrollerStyle[x.transform] = "translate(" + t + "px," + i + "px) scale(" + e + ")" + this.translateZ : (t = Math.round(t), i = Math.round(i), this.scrollerStyle.left = t + "px", this.scrollerStyle.top = i + "px"), this.options.wheel) for (var o = this.options.wheel.rotate, s = void 0 === o ? 25 : o, n = 0; n < this.items.length; n++) {
            var r = s * (i / this.itemHeight + n);
            this.items[n].style[x.transform] = "rotateX(" + r + "deg)";
          }
          if (this.x = t, this.y = i, this.setScale(e), this.indicators) for (var a = 0; a < this.indicators.length; a++) this.indicators[a].updatePosition();
        }, L.prototype._animate = function (r, a, l, h) {
          var c = this,
              d = this.x,
              p = this.y,
              u = this.lastScale,
              m = this.scale,
              f = b(),
              v = f + l;
          this.isAnimating = !0, z(this.animateTimer), function t() {
            var i = b();
            if (v <= i) return c.isAnimating = !1, c._translate(r, a, m), c.trigger("scroll", {
              x: c.x,
              y: c.y
            }), void (c.pulling || c.resetPosition(c.options.bounceTime) || c.trigger("scrollEnd", {
              x: c.x,
              y: c.y
            }));
            var e = h(i = (i - f) / l),
                o = (r - d) * e + d,
                s = (a - p) * e + p,
                n = (m - u) * e + u;
            c._translate(o, s, n), c.isAnimating && (c.animateTimer = I(t)), 3 === c.options.probeType && c.trigger("scroll", {
              x: c.x,
              y: c.y
            });
          }();
        }, L.prototype.scrollBy = function (t, i) {
          var e = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0,
              o = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : X.bounce;
          t = this.x + t, i = this.y + i, this.scrollTo(t, i, e, o);
        }, L.prototype.scrollTo = function (t, i) {
          var e = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0,
              o = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : X.bounce;
          this.x === t && this.y === i || (this.isInTransition = this.options.useTransition && 0 < e && (t !== this.x || i !== this.y), !e || this.options.useTransition ? (this._transitionTimingFunction(o.style), this._transitionTime(e), this._translate(t, i), e && 3 === this.options.probeType && this._startProbe(), e || (this.trigger("scroll", {
            x: t,
            y: i
          }), this._reflow = document.body.offsetHeight, this.resetPosition(this.options.bounceTime, X.bounce) || this.trigger("scrollEnd", {
            x: t,
            y: i
          })), this.options.wheel && (i > this.minScrollY ? this.selectedIndex = 0 : i < this.maxScrollY ? this.selectedIndex = this.items.length - 1 : this.selectedIndex = Math.round(Math.abs(i / this.itemHeight)))) : this._animate(t, i, e, o.fn));
        }, L.prototype.scrollToElement = function (t, i, e, o, s) {
          if (t && (t = t.nodeType ? t : this.scroller.querySelector(t), !this.options.wheel || t.classList.contains(this.options.wheel.wheelItemClass))) {
            var n = u(t);
            n.left -= this.wrapperOffset.left, n.top -= this.wrapperOffset.top, !0 === e && (e = Math.round(t.offsetWidth / 2 - this.wrapper.offsetWidth / 2)), !0 === o && (o = Math.round(t.offsetHeight / 2 - this.wrapper.offsetHeight / 2)), n.left -= e || 0, n.top -= o || 0, n.left = n.left > this.minScrollX ? this.minScrollX : n.left < this.maxScrollX ? this.maxScrollX : n.left, n.top = n.top > this.minScrollY ? this.minScrollY : n.top < this.maxScrollY ? this.maxScrollY : n.top, this.options.wheel && (n.top = Math.round(n.top / this.itemHeight) * this.itemHeight), this.scrollTo(n.left, n.top, i, s);
          }
        }, L.prototype.resetPosition = function () {
          var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0,
              i = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : X.bounce,
              e = this.x,
              o = Math.round(e);
          !this.hasHorizontalScroll || o > this.minScrollX ? e = this.minScrollX : o < this.maxScrollX && (e = this.maxScrollX);
          var s = this.y,
              n = Math.round(s);
          return !this.hasVerticalScroll || n > this.minScrollY ? s = this.minScrollY : n < this.maxScrollY && (s = this.maxScrollY), (e !== this.x || s !== this.y) && (this.scrollTo(e, s, t, i), !0);
        }, L.prototype.getComputedPosition = function () {
          var t = window.getComputedStyle(this.scroller, null),
              i = void 0,
              e = void 0;
          return e = this.options.useTransform ? (i = +((t = t[x.transform].split(")")[0].split(", "))[12] || t[4]), +(t[13] || t[5])) : (i = +t.left.replace(/[^-\d.]/g, ""), +t.top.replace(/[^-\d.]/g, "")), {
            x: i,
            y: e
          };
        }, L.prototype.stop = function () {
          if (this.options.useTransition && this.isInTransition) {
            this.isInTransition = !1, z(this.probeTimer);
            var t = this.getComputedPosition();
            this._translate(t.x, t.y), this.options.wheel ? this.target = this.items[Math.round(-t.y / this.itemHeight)] : this.trigger("scrollEnd", {
              x: this.x,
              y: this.y
            }), this.stopFromTransition = !0;
          } else !this.options.useTransition && this.isAnimating && (this.isAnimating = !1, z(this.animateTimer), this.trigger("scrollEnd", {
            x: this.x,
            y: this.y
          }), this.stopFromTransition = !0);
        }, L.prototype.destroy = function () {
          this.destroyed = !0, this.trigger("destroy"), this.options.useTransition ? z(this.probeTimer) : z(this.animateTimer), this._removeDOMEvents(), this._events = {};
        }, (O = C).prototype.on = function (t, i) {
          var e = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : this;
          this._events[t] || (this._events[t] = []), this._events[t].push([i, e]);
        }, O.prototype.once = function (t, i) {
          var e = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : this;

          function o() {
            this.off(t, o), i.apply(e, arguments);
          }

          o.fn = i, this.on(t, o);
        }, O.prototype.off = function (t, i) {
          var e = this._events[t];
          if (e) for (var o = e.length; o--;) (e[o][0] === i || e[o][0] && e[o][0].fn === i) && s(e, o);
        }, O.prototype.trigger = function (t) {
          var i = this._events[t];
          if (i) for (var e = i.length, o = [].concat(function (t) {
            if (Array.isArray(t)) {
              for (var i = 0, e = Array(t.length); i < t.length; i++) e[i] = t[i];

              return e;
            }

            return Array.from(t);
          }(i)), s = 0; s < e; s++) {
            var n = o[s],
                r = h(n, 2),
                a = r[0],
                l = r[1];
            a && a.apply(l, [].slice.call(arguments, 1));
          }
        }, (P = C).prototype.wheelTo = function () {
          var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0;

          if (this.options.wheel) {
            var i = -t * this.itemHeight;
            this.scrollTo(0, i);
          }
        }, P.prototype.getSelectedIndex = function () {
          return this.options.wheel && this.selectedIndex;
        }, P.prototype._initWheel = function () {
          var t = this.options.wheel;
          t.wheelWrapperClass || (t.wheelWrapperClass = "wheel-scroll"), t.wheelItemClass || (t.wheelItemClass = "wheel-item"), void 0 === t.selectedIndex && (t.selectedIndex = 0, W("wheel option selectedIndex is required!"));
        }, (H = C).prototype._initMouseWheel = function () {
          var t = this;
          this._handleMouseWheelEvent(d), this.on("destroy", function () {
            clearTimeout(t.mouseWheelTimer), clearTimeout(t.mouseWheelEndTimer), t._handleMouseWheelEvent(p);
          }), this.firstWheelOpreation = !0;
        }, H.prototype._handleMouseWheelEvent = function (t) {
          t(this.wrapper, "wheel", this), t(this.wrapper, "mousewheel", this), t(this.wrapper, "DOMMouseScroll", this);
        }, H.prototype._onMouseWheel = function (t) {
          var i = this;

          if (this.enabled) {
            t.preventDefault(), this.options.stopPropagation && t.stopPropagation(), this.firstWheelOpreation && this.trigger("scrollStart"), this.firstWheelOpreation = !1;
            var e = this.options.mouseWheel,
                o = e.speed,
                s = void 0 === o ? 20 : o,
                n = e.invert,
                r = void 0 !== n && n,
                a = e.easeTime,
                l = void 0 === a ? 300 : a;
            clearTimeout(this.mouseWheelTimer), this.mouseWheelTimer = setTimeout(function () {
              i.options.snap || l || i.trigger("scrollEnd", {
                x: i.x,
                y: i.y
              }), i.firstWheelOpreation = !0;
            }, 400);
            var h = void 0,
                c = void 0;

            switch (!0) {
              case "deltaX" in t:
                c = 1 === t.deltaMode ? (h = -t.deltaX * s, -t.deltaY * s) : (h = -t.deltaX, -t.deltaY);
                break;

              case "wheelDeltaX" in t:
                h = t.wheelDeltaX / 120 * s, c = t.wheelDeltaY / 120 * s;
                break;

              case "wheelDelta" in t:
                h = c = t.wheelDelta / 120 * s;
                break;

              case "detail" in t:
                h = c = -t.detail / 3 * s;
                break;

              default:
                return;
            }

            var d = r ? -1 : 1;
            h *= d, c *= d, this.hasVerticalScroll || (h = c, c = 0);
            var p = void 0,
                u = void 0;
            if (this.options.snap) return p = this.currentPage.pageX, u = this.currentPage.pageY, 0 < h ? p-- : h < 0 && p++, 0 < c ? u-- : c < 0 && u++, void this._goToPage(p, u);
            p = this.x + Math.round(this.hasHorizontalScroll ? h : 0), u = this.y + Math.round(this.hasVerticalScroll ? c : 0), this.movingDirectionX = this.directionX = 0 < h ? -1 : h < 0 ? 1 : 0, this.movingDirectionY = this.directionY = 0 < c ? -1 : c < 0 ? 1 : 0, p > this.minScrollX ? p = this.minScrollX : p < this.maxScrollX && (p = this.maxScrollX), u > this.minScrollY ? u = this.minScrollY : u < this.maxScrollY && (u = this.maxScrollY);
            var m = this.y === u;
            this.scrollTo(p, u, l, X.swipe), this.trigger("scroll", {
              x: this.x,
              y: this.y
            }), clearTimeout(this.mouseWheelEndTimer), m && (this.mouseWheelEndTimer = setTimeout(function () {
              i.trigger("scrollEnd", {
                x: i.x,
                y: i.y
              });
            }, l));
          }
        }, C.Version = "1.14.1", C;
      }();
    }(t = {
      exports: {}
    }, t.exports), t.exports);

    function i() {
      var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {},
          i = this,
          e = void 0;

      if (i.extend(t), t.el) {
        if (!(e = S(t.el)) || e.bindRolldate) return;
        e.bindRolldate = 1, i.tap(e, function () {
          i.show();
        });
      }

      if (t.value) {
        t.el && ("input" == e.nodeName.toLowerCase() ? e.value = t.value : e.innerText = t.value);
        var o = t.value.replace(/-/g, "/").replace(/[^\d/:\s]/g, ""),
            s = new Date(o);
        s && "Invalid Date" != s ? t.el ? e.bindDate = s : i.bindDate = s : console.error("Invalid Date：" + o);
      }
    }

    return i.prototype = {
      constructor: i,
      baseData: function () {
        return {
          domId: {
            YYYY: "rolldate-year",
            MM: "rolldate-month",
            DD: "rolldate-day",
            hh: "rolldate-hour",
            mm: "rolldate-min",
            ss: "rolldate-sec"
          },
          opts: {
            el: "",
            format: "YYYY-MM-DD",
            beginYear: 2e3,
            endYear: 2100,
            init: null,
            moveEnd: null,
            confirm: null,
            cancel: null,
            minStep: 1,
            trigger: "tap",
            lang: {
              title: "选择日期",
              cancel: "取消",
              confirm: "确认",
              year: "年",
              month: "月",
              day: "日",
              hour: "时",
              min: "分",
              sec: "秒"
            }
          }
        };
      },
      extend: function (t) {
        var i = this.baseData().opts;

        for (var e in i) if (i[e] && "[object Object]" == Object.prototype.toString.call(i[e])) for (var o in t[e]) i[e][o] = null == t[e][o] ? i[e][o] : t[e][o];else i[e] = t[e] || i[e];

        this.config = i;
      },
      createUI: function () {
        for (var n = this, t = n.baseData(), r = n.config, a = t.domId, l = r.format.split(/-|\/|\s|:/g), i = l.length, e = "", h = r.el ? S(r.el).bindDate || new Date() : n.bindDate || new Date(), c = r.lang, o = 0; o < i; o++) {
          var s = l[o],
              d = 0;
          if (e += '<div id="' + a[s] + '"><ul class="wheel-scroll">', "YYYY" == s) for (var p = r.beginYear; p <= r.endYear; p++) e += '<li class="wheel-item ' + (p == h.getFullYear() ? "active" : "") + '" data-index="' + d + '">' + p + c.year + "</li>", d++;else if ("MM" == s) for (var u = 1; u <= 12; u++) e += '<li class="wheel-item ' + (u == h.getMonth() + 1 ? "active" : "") + '" data-index="' + d + '">' + (u < 10 ? "0" + u : u) + c.month + "</li>", d++;else if ("DD" == s) for (var m = n.getMonthlyDay(h.getFullYear(), h.getMonth() + 1), f = 1; f <= m; f++) e += '<li class="wheel-item ' + (f == h.getDate() ? "active" : "") + '" data-index="' + d + '">' + (f < 10 ? "0" + f : f) + c.day + "</li>", d++;else if ("hh" == s) for (var v = 0; v <= 23; v++) e += '<li class="wheel-item ' + (v == h.getHours() ? "active" : "") + '" data-index="' + d + '">' + (v < 10 ? "0" + v : v) + c.hour + "</li>", d++;else if ("mm" == s) for (var g = 0; g <= 59; g += r.minStep) e += '<li class="wheel-item ' + (g == h.getMinutes() ? "active" : "") + '" data-index="' + d + '">' + (g < 10 ? "0" + g : g) + c.min + "</li>", d++;else if ("ss" == s) for (var w = 0; w <= 59; w++) e += '<li class="wheel-item ' + (w == h.getSeconds() ? "active" : "") + '" data-index="' + d + '">' + (w < 10 ? "0" + w : w) + c.sec + "</li>", d++;
          e += "</ul></div>";
        }

        var y = '<div class="rolldate-mask"></div>\n            <div class="rolldate-panel">\n                <header>\n                    <span class="rolldate-btn rolldate-cancel">' + c.cancel + "</span>\n                    " + c.title + '\n                    <span class="rolldate-btn rolldate-confirm">' + c.confirm + '</span>\n                </header>\n                <section class="rolldate-content">\n                    <div class="rolldate-dim mask-top"></div>\n                    <div class="rolldate-dim mask-bottom"></div>\n                    <div class="rolldate-wrapper">\n                        ' + e + "\n                    </div>\n                </section>\n            </div>",
            b = document.createElement("div");
        b.className = "rolldate-container", b.innerHTML = y, document.body.appendChild(b), n.scroll = {};

        for (var x = function (t) {
          var i = a[l[t]];
          n.scroll[l[t]] = new Y("#" + i, {
            wheel: {
              selectedIndex: 0
            }
          });
          var o = n.scroll[l[t]],
              e = S("#" + i + " .active"),
              s = e ? e.getAttribute("data-index") : Math.round(h.getMinutes() / r.minStep);
          o.wheelTo(s), o.on("scrollEnd", function () {
            if (r.moveEnd && r.moveEnd.call(n, o), -1 != [a.YYYY, a.MM].indexOf(o.wrapper.id) && n.scroll.YYYY && n.scroll.MM && n.scroll.DD) {
              var t = n.getMonthlyDay(n.getSelected(n.scroll.YYYY), n.getSelected(n.scroll.MM)),
                  i = "";

              if (t != S("#" + a.DD + " li", 1).length) {
                for (var e = 1; e <= t; e++) i += '<li class="wheel-item">' + (e < 10 ? "0" + e : e) + c.day + "</li>";

                S("#" + a.DD + " ul").innerHTML = i, n.scroll.DD.refresh();
              }
            }
          });
        }, T = 0; T < i; T++) x(T);

        S(".rolldate-panel").className = "rolldate-panel fadeIn";
      },
      tap: function (t, e) {
        if ("ontouchstart" in window && "tap" == this.config.trigger) {
          var o = {},
              i = function (t) {
            var i = t.touches[0];
            o.startX = i.pageX, o.startY = i.pageY, o.sTime = +new Date();
          },
              s = function (t) {
            var i = t.changedTouches[0];
            o.endX = i.pageX, o.endY = i.pageY, +new Date() - o.sTime < 300 && Math.abs(o.endX - o.startX) + Math.abs(o.endY - o.startY) < 20 && (t.preventDefault(), e.call(this, t)), o = {};
          };

          "function" == typeof e ? (t.addEventListener("touchstart", i), t.addEventListener("touchend", s)) : (t.removeEventListener("touchstart", i), t.removeEventListener("touchend", s));
        } else {
          var n = function (t) {
            e.call(this, t);
          };

          "function" == typeof e ? t.addEventListener("click", n) : t.removeEventListener("click", n);
        }
      },
      show: function () {
        var t = this.config,
            i = void 0;

        if (t.el) {
          if (!(i = S(t.el)).bindRolldate) return;
          "input" == i.nodeName.toLowerCase() && i.blur();
        }

        S(".rolldate-container") || t.init && !1 === t.init.call(this) || (this.createUI(), this.event());
      },
      hide: function (t) {
        var i = S(".rolldate-panel.fadeIn");
        i && (i.className = "rolldate-panel fadeOut", this.destroy(t));
      },
      event: function () {
        var a = this,
            t = S(".rolldate-mask"),
            i = S(".rolldate-cancel"),
            e = S(".rolldate-confirm");
        a.tap(t, function () {
          a.hide(1);
        }), a.tap(i, function () {
          a.hide(1);
        }), a.tap(e, function () {
          var t = a.config,
              i = void 0,
              e = t.format,
              o = new Date();

          for (var s in a.scroll) {
            var n = a.getSelected(a.scroll[s]);
            e = e.replace(s, n), "YYYY" == s ? o.setFullYear(n) : "MM" == s ? o.setMonth(n - 1) : "DD" == s ? o.setDate(n) : "hh" == s ? o.setHours(n) : "mm" == s ? o.setMinutes(n) : "ss" == s && o.setSeconds(n);
          }

          if (t.confirm) {
            var r = t.confirm.call(a, e);
            if (!1 === r) return !1;
            r && (e = r);
          }

          t.el ? ("input" == (i = S(t.el)).nodeName.toLowerCase() ? i.value = e : i.innerText = e, i.bindDate = o) : a.bindDate = o, a.hide();
        });
      },
      getMonthlyDay: function (t, i) {
        var e = void 0;
        return 1 == i || 3 == i || 5 == i || 7 == i || 8 == i || 10 == i || 12 == i ? e = 31 : 4 == i || 6 == i || 11 == i || 9 == i ? e = 30 : 2 == i && (e = t % 4 != 0 || t % 100 == 0 && t % 400 != 0 ? 28 : 29), e;
      },
      destroy: function (t) {
        var i = this,
            e = i.config;

        for (var o in i.scroll) i.scroll[o].destroy();

        t && e.cancel && e.cancel.call(i), i.tap(S(".rolldate-mask"), 0), i.tap(S(".rolldate-cancel"), 0), i.tap(S(".rolldate-confirm"), 0), setTimeout(function () {
          var t = S(".rolldate-container");
          t && document.body.removeChild(t), t = null;
        }, 300);
      },
      getSelected: function (t) {
        return S("#" + t.wrapper.id + " li", 1)[t.getSelectedIndex()].innerText.replace(/\D/g, "");
      }
    }, i.version = "3.1.3", i;
  });
});

function _createSuper(Derived) { return function () { var Super = getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
/**
 * @authro liyang
 * @desc 担保业务申请表录入页Page 类
 */

var PageController = /*#__PURE__*/function (_Service) {
  inherits(PageController, _Service);

  var _super = _createSuper(PageController);

  /**
   * @param props { pageParam: { gtId, flowStatus } }
   */
  function PageController(props) {
    var _this;

    classCallCheck(this, PageController);

    _this = _super.call(this); //  所有表单域预置信息

    _this.profile = {
      //  picker类组件json
      pickers: {
        landType: [{
          "name": "一般耕地",
          "id": 1
        }, {
          "name": "基本农田",
          "id": 2
        }, {
          "name": "山地",
          "id": 3
        }, {
          "name": "林地",
          "id": 4
        }, {
          "name": "草地",
          "id": 5
        }],
        farmType: [{
          "name": "鸡",
          "id": 1
        }, {
          "name": "鸭",
          "id": 2
        }, {
          "name": "猪",
          "id": 3
        }]
      },
      //  select类组件json
      selects: {
        envReport: [{
          "name": "无环评",
          "id": 1
        }, {
          "name": "环评备案",
          "id": 2
        }, {
          "name": "环评报告",
          "id": 3
        }],
        livestockType: [{
          "name": "自有",
          "id": 1
        }, {
          "name": "租赁",
          "id": 2
        }],
        shedStructure: [{
          "name": "墙体结构",
          "id": 1
        }, {
          "name": "立柱式",
          "id": 2
        }]
      },
      // upload参数
      uploadImgType: {
        0: 'camera',
        1: 'album'
      }
    }; //  统一管理数据model data

    _this.data = {
      gtId: props.pageParam.gtId,
      flowStatus: props.flowStatus,
      gtCreditId: props.gtCreditId,
      isInsert: true,
      farmType: 1,
      landType: 1,
      envReport: 1,
      shedStructure: 1,
      livestockType: 1,
      maturityYear: '',
      pcd: {
        province: {},
        city: {},
        district: {}
      }
    };
    return _this;
  } //  执行函数


  createClass(PageController, [{
    key: "main",
    value: function main() {
      Utils$1.UI.showLoading('加载中...');
      this.initData({
        callback: function callback() {
          Utils$1.UI.hideLoading();
        }
      });
      this.bindEvents();
    } //  事件绑定入口

  }, {
    key: "bindEvents",
    value: function bindEvents() {

      this.bindPickerEvents(); //  绑定所有select选择框

      this.bindSelectEvents(); //  绑定cityPicker

      this.bindCityPickerEvents(); //  绑定环评材料上传

      this.bindUploadReportFileEvents(); //  绑定土地信息与养殖信息折叠面板事件

      this.bindCollapseEvents(); // 路由跳转

      this.bindEventsPageRouter(); //  提交表单

      this.bindSubmitEvents();
      this.bindDateEvents();
    }
  }, {
    key: "initData",
    value: function () {
      var _initData = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(_ref) {
        var callback, self, guaranteeRes, _guaranteeRes$data, houseFillStatus, carFillStatus, socialFillStatus, gtId, gtCreditId, operateRes, landTypeProfile, envReportProfile, imgDom, livestockTypeProfile, dom, farmTypeProfile, scale, sheds, shedArea, _operateRes$data, workshopProvince, workshopProvinceCode, workshopCity, workshopCityCode, workshopCounty, workshopCountyCode, shedAddressDetail, shedStructureProfile;

        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                callback = _ref.callback;
                self = this; //  1. 刷房产信息、车辆信息、家庭成员信息子表状态

                _context.prev = 2;
                _context.next = 5;
                return this.getQueryGuaranteeMain();

              case 5:
                guaranteeRes = _context.sent;

                if (guaranteeRes.data) {
                  _guaranteeRes$data = guaranteeRes.data, houseFillStatus = _guaranteeRes$data.houseFillStatus, carFillStatus = _guaranteeRes$data.carFillStatus, socialFillStatus = _guaranteeRes$data.socialFillStatus;
                  houseFillStatus === 3 && document.querySelector('#houseInfoStatus').classList.add('done');
                  carFillStatus === 3 && document.querySelector('#carInfoStatus').classList.add('done');
                  socialFillStatus === 3 && document.querySelector('#familyInfoStatus').classList.add('done');
                }

                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](2);
                Utils$1.UI.toast('服务超时');

              case 12:
                //  2. 查经营信息中土地信息和养殖信息子表以及接口类型
                gtId = this.data.gtId;
                gtCreditId = this.data.gtCreditId;
                _context.prev = 14;
                _context.next = 17;
                return this.getQueryOperate({
                  gtId: gtId
                });

              case 17:
                operateRes = _context.sent;
                // 3. 刷主表土地信息和养殖信息填写状态和字段
                this.data.isInsert = false;
                this.data.operateId = operateRes.data.operateId;
                document.querySelector('#landInfoStatus').classList.add('done');
                document.querySelector('#farmInfoStatus').classList.add('done'); // key: 土地性质

                landTypeProfile = this.profile.pickers.landType.find(function (item, i) {
                  return operateRes.data.landNature === item.id;
                });

                if (landTypeProfile) {
                  document.querySelector('#landType').innerHTML = landTypeProfile.name;
                  this.data.landType = landTypeProfile.id;
                } //  key: 环评材料


                envReportProfile = this.profile.selects.envReport.find(function (item, i) {
                  return operateRes.data.envDataType === item.id;
                });

                if (envReportProfile) {
                  Array.from(document.querySelector('#envReport').querySelectorAll('.fc_c_option')).forEach(function (item, i) {
                    if (Number(item.getAttribute('data-id')) === envReportProfile.id) {
                      self.data.envReport = envReportProfile.id;
                      item.classList.add('active');
                    } else {
                      item.classList.remove('active');
                    }
                  });
                } // key: 环评附件


                if (envReportProfile && envReportProfile.id !== 1) {
                  imgDom = document.querySelector('#envReportFile-img');
                  this.data.envDataFileId = operateRes.data.envDataFileId;
                  imgDom.src = "".concat(baseUrl, "/crpt-file/file/download/").concat(operateRes.data.envDataFileId);
                  imgDom.classList.remove('hidden');
                  document.querySelector('#envEnclosure').classList.remove('hidden');
                } //  key: 养殖场性质


                livestockTypeProfile = this.profile.selects.livestockType.find(function (item, i) {
                  return operateRes.data.farmsNature === item.id;
                });

                if (livestockTypeProfile) {
                  Array.from(document.querySelector('#livestockType').querySelectorAll('.fc_c_option')).forEach(function (item, i) {
                    if (Number(item.getAttribute('data-id')) === livestockTypeProfile.id) {
                      self.data.livestockType = livestockTypeProfile.id;
                      item.classList.add('active');
                    } else {
                      item.classList.remove('active');
                    }
                  });
                } //  租赁到期时间


                if (operateRes.data.maturityYear) {
                  self.data.maturityYear = operateRes.data.maturityYear;
                  dom = document.querySelector('#maturityYear');

                  if (operateRes.data.farmsNature === 2) {
                    dom.classList.remove('hidden');
                    document.querySelector('#maturityYearDateString').innerHTML = operateRes.data.maturityYear;
                  }
                } // key: 养殖品种


                farmTypeProfile = this.profile.pickers.farmType.find(function (item, i) {
                  return operateRes.data.farmsCategory === item.id;
                });

                if (farmTypeProfile) {
                  document.querySelector('#farmType').innerHTML = farmTypeProfile.name;
                  this.data.farmType = farmTypeProfile.id;
                } // key: 养殖规模


                scale = operateRes.data.farmsSize;
                this.data.scale = scale;
                document.querySelector('#scale').value = scale;
                document.querySelector('#scaleUnit').innerHTML = this.data.farmType === 3 ? '头' : '万只'; // key: 棚舍数量

                sheds = operateRes.data.workshopCount;
                this.data.sheds = sheds;
                document.querySelector('#sheds').value = sheds; // key: 棚舍面积

                shedArea = operateRes.data.workshopArea;
                this.data.shedArea = shedArea;
                document.querySelector('#shedArea').value = shedArea; // key: 棚舍地址

                _operateRes$data = operateRes.data, workshopProvince = _operateRes$data.workshopProvince, workshopProvinceCode = _operateRes$data.workshopProvinceCode, workshopCity = _operateRes$data.workshopCity, workshopCityCode = _operateRes$data.workshopCityCode, workshopCounty = _operateRes$data.workshopCounty, workshopCountyCode = _operateRes$data.workshopCountyCode;
                this.data.pcd = {
                  province: {
                    name: workshopProvince,
                    code: workshopProvinceCode
                  },
                  city: {
                    name: workshopCity,
                    code: workshopCityCode
                  },
                  district: {
                    name: workshopCounty,
                    code: workshopCountyCode
                  }
                };
                document.querySelector("#shedAddress").innerHTML = "<span class=\"fc_c_city_label selected\">".concat(workshopProvince, " ").concat(workshopCity, " ").concat(workshopCounty, "</span>"); // key: 棚舍面积

                shedAddressDetail = operateRes.data.workshopAddr;
                this.data.shedArea = shedAddressDetail;
                document.querySelector('#shedAddressDetail').value = shedAddressDetail; // key: 棚设结构

                shedStructureProfile = this.profile.selects.shedStructure.find(function (item, i) {
                  return operateRes.data.workshopStruct === item.id;
                });

                if (shedStructureProfile) {
                  Array.from(document.querySelector('#shedStructure').querySelectorAll('.fc_c_option')).forEach(function (item, i) {
                    if (Number(item.getAttribute('data-id')) === shedStructureProfile.id) {
                      self.data.shedStructure = shedStructureProfile.id;
                      item.classList.add('active');
                    } else {
                      item.classList.remove('active');
                    }
                  });
                }

                _context.next = 55;
                break;

              case 52:
                _context.prev = 52;
                _context.t1 = _context["catch"](14);

                //  3005 担保运营数据不存在，则提交按钮应为insert接口，同时土地信息和养殖信息置灰
                if (_context.t1.code === 3005) {
                  this.data.isInsert = true;
                } else {
                  Utils$1.UI.toast(_context.t1.msg);
                }

              case 55:
                callback && callback();

              case 56:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 9], [14, 52]]);
      }));

      function initData(_x) {
        return _initData.apply(this, arguments);
      }

      return initData;
    }() // 初始化所有picker组件

  }, {
    key: "initPicker",
    value: function initPicker(name, dom) {
      var self = this;
      Utils$1.UI.setPicker({
        success: function success(selected) {
          var value = selected[0];
          self.data[name] = value.id;
          dom.innerHTML = value.name; // 副作用effects
          // 1. picker为farmType时，需要将养殖规模的单位进行调整

          if (name === 'farmType') {
            var _dom = document.querySelector('#scaleUnit');

            if (value.name === '猪') {
              _dom.innerHTML = '头';
            } else {
              _dom.innerHTML = '万只';
            }
          }
        },
        data: self.profile.pickers[name]
      });
    } // 绑定所有picker组件的事件

  }, {
    key: "bindPickerEvents",
    value: function bindPickerEvents() {
      var self = this;
      var pickerKeys = Object.keys(this.profile.pickers);
      pickerKeys.forEach(function (item, i) {
        document.querySelector("#".concat(item)).onclick = function () {
          self.initPicker(item, this);
        };
      });
    } // 绑定city picker组件

  }, {
    key: "bindCityPickerEvents",
    value: function bindCityPickerEvents() {
      var self = this;
      var dom = document.querySelector("#shedAddress");

      dom.onclick = function () {
        Utils$1.UI.setCityPicker({
          success: function success(selected) {
            var _selected = slicedToArray(selected, 3),
                province = _selected[0],
                city = _selected[1],
                district = _selected[2];

            self.data.pcd = {
              province: {
                name: province.name,
                code: province.id
              },
              city: {
                name: city.name,
                code: city.id
              },
              district: {
                name: district.name,
                code: district.id
              }
            };
            dom.innerHTML = "<span class=\"fc_c_city_label selected\">".concat(province.name, " ").concat(city.name, " ").concat(district.name, "</span>");
          },
          data: 'widget://res/city.json'
        });
      };
    } // 绑定所有select组件事件

  }, {
    key: "bindSelectEvents",
    value: function bindSelectEvents() {
      var self = this;
      var selectKeys = Object.keys(this.profile.selects);
      var defaultClassName = 'fc_c_option';
      var activeClassName = 'active';
      selectKeys.forEach(function (item, i) {
        //  由组件级代理
        var parant = document.querySelector("#".concat(item));

        parant.onclick = function (e) {
          var list = parant.querySelectorAll(".".concat(defaultClassName));
          var ev = window.event || e;

          if (ev.target.nodeName === 'SPAN') {
            for (var _i = 0; _i < list.length; _i++) {
              list[_i].classList.remove(activeClassName);
            }

            ev.target.classList.add(activeClassName);
            self.data[item] = ev.target.getAttribute('data-id'); // 副作用effects
            // 1. 环评材料选择为无环保时，需要将环保附件上传栏隐藏

            if (item === 'envReport') {
              var _dom = document.querySelector('#envEnclosure');

              if (parseInt(ev.target.getAttribute('data-id')) === 1) {
                _dom.classList.add('hidden');
              } else {
                _dom.classList.remove('hidden');
              }
            }

            maturityYear; // 2. 养殖场性质为租赁时，展示租赁日期

            if (item === 'livestockType') {
              var _dom2 = document.querySelector('#maturityYear');

              if (parseInt(ev.target.getAttribute('data-id')) === 1) {
                _dom2.classList.add('hidden');
              } else {
                _dom2.classList.remove('hidden');
              }
            }
          }
        };
      });
    } //  绑定上传环评附件事件

  }, {
    key: "bindUploadReportFileEvents",
    value: function bindUploadReportFileEvents() {
      var self = this;
      var dom = document.querySelector('#envReportFile');
      var box = document.querySelector('#envReportFile-img-box');
      var img = document.querySelector('#envReportFile-img');

      dom.onclick = function () {
        Utils$1.File.actionSheet('请选择', ['相机', '相册'], function (index) {
          Utils$1.File.getPicture(self.profile.uploadImgType[index], function (res, err) {
            if (res) {
              self.data.envReportFile = res.data;

              if (res.data) {
                img.src = res.data;
                box.classList.remove('hidden');
                Utils$1.UI.toast('上传成功');
              } else {
                Utils$1.UI.toast('未上传成功');
              }
            }
          });
        });
      };
    } //  绑定土地信息与养殖信息折叠面板事件

  }, {
    key: "bindCollapseEvents",
    value: function bindCollapseEvents() {
      var landInfoBox = document.querySelector('#landInfoBox');
      var landInfoCollapse = document.querySelector('#landInfo');
      var farmInfoBox = document.querySelector('#farmInfoBox');
      var farmInfoCollapse = document.querySelector('#farmInfo');

      farmInfoBox.onclick = function () {
        if (farmInfoCollapse.classList.contains('folder')) {
          farmInfoCollapse.classList.remove('folder');
          farmInfoBox.querySelector('.cl-cell_arrow').classList.add('rotate');
        } else {
          farmInfoCollapse.classList.add('folder');
          farmInfoBox.querySelector('.cl-cell_arrow').classList.remove('rotate');
        }
      };

      landInfoBox.onclick = function () {
        if (landInfoCollapse.classList.contains('folder')) {
          landInfoCollapse.classList.remove('folder');
          landInfoBox.querySelector('.cl-cell_arrow').classList.add('rotate');
        } else {
          landInfoCollapse.classList.add('folder');
          landInfoBox.querySelector('.cl-cell_arrow').classList.remove('rotate');
        }
      };
    } //  跳转至房产、车辆、家庭成员录入页

  }, {
    key: "bindEventsPageRouter",
    value: function bindEventsPageRouter() {
      document.querySelector('#familyInfo').onclick = function () {
        Utils$1.Router.openGuaranteeApplicationFamily({
          pageParam: api.pageParam
        });
      };

      document.querySelector('#houseInfo').onclick = function () {
        Utils$1.Router.openGuaranteeApplicationHouse({
          pageParam: api.pageParam
        });
      };

      document.querySelector('#carInfo').onclick = function () {
        Utils$1.Router.openGuaranteeApplicationCar({
          pageParam: api.pageParam
        });
      };
    } // 提交表单

  }, {
    key: "bindSubmitEvents",
    value: function bindSubmitEvents() {
      var self = this;
      var btn = document.querySelector('.cl_c_submit_btn');

      btn.onclick = function () {
        self.submitFormData();
      };
    } //  绑定租赁日期选择

  }, {
    key: "bindDateEvents",
    value: function bindDateEvents() {
      var self = this;
      var rd = new rolldate_min({
        el: '#maturityYearDateString',
        format: 'YYYY',
        beginYear: 2020,
        endYear: 2070,
        minStep: 1,
        lang: {
          title: '选择租赁到期时间'
        },
        trigger: 'tap',
        init: function init() {
          console.log('插件开始触发');
        },
        moveEnd: function moveEnd(scroll) {
          console.log('滚动结束');
        },
        confirm: function confirm(date) {
          self.data.maturityYear = date;
          console.log('确定按钮触发');
        },
        cancel: function cancel() {
          console.log('插件运行取消');
        }
      }); // rd.show();
      // rd.hide();
    } //  format 土地信息和养殖信息数据

  }, {
    key: "submitFormData",
    value: function () {
      var _submitFormData = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
        var self, _this$data, landType, farmType, envReport, livestockType, shedStructure, gtId, envReportFile, pcd, maturityYear, farmsSize, workshopCount, workshopArea, workshopAddr, formJSON, isValidate, res;

        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                self = this;
                _this$data = this.data, landType = _this$data.landType, farmType = _this$data.farmType, envReport = _this$data.envReport, livestockType = _this$data.livestockType, shedStructure = _this$data.shedStructure, gtId = _this$data.gtId, envReportFile = _this$data.envReportFile, pcd = _this$data.pcd, maturityYear = _this$data.maturityYear;
                farmsSize = document.querySelector('#scale').value;
                workshopCount = document.querySelector('#sheds').value;
                workshopArea = document.querySelector('#shedArea').value;
                workshopAddr = document.querySelector('#shedAddressDetail').value;
                formJSON = {
                  gtId: gtId,
                  landNature: landType,
                  envDataType: envReport,
                  farmsNature: livestockType,
                  farmsCategory: farmType,
                  farmsSize: farmsSize,
                  workshopCount: workshopCount,
                  workshopArea: workshopArea,
                  workshopProvince: pcd.province.name,
                  workshopProvinceCode: pcd.province.code,
                  workshopCity: pcd.city.name,
                  workshopCityCode: pcd.city.code,
                  workshopCounty: pcd.district.name,
                  workshopCountyCode: pcd.district.code,
                  workshopAddr: workshopAddr,
                  workshopStruct: shedStructure
                };
                console.log(JSON.stringify(formJSON));
                isValidate = !Object.values(formJSON).some(function (item, i) {
                  return !item;
                }); // 挂载租赁时间不校验

                formJSON.maturityYear = maturityYear || '2020'; // validator，后期再抽象

                if (!(formJSON.farmsSize >= 60000000)) {
                  _context2.next = 13;
                  break;
                }

                Utils$1.UI.toast('养殖规模数量超出限制哦');
                return _context2.abrupt("return");

              case 13:
                if (!(formJSON.farmsSize >= 10000000)) {
                  _context2.next = 16;
                  break;
                }

                Utils$1.UI.toast('棚舍数量超出限制哦');
                return _context2.abrupt("return");

              case 16:
                if (!(formJSON.farmsSize >= 10000000)) {
                  _context2.next = 19;
                  break;
                }

                Utils$1.UI.toast('棚舍面积超出限制哦');
                return _context2.abrupt("return");

              case 19:
                if (!isValidate) {
                  _context2.next = 45;
                  break;
                }

                Utils$1.UI.showLoading('保存中...');
                res = null;
                _context2.prev = 22;

                if (!self.data.isInsert) {
                  _context2.next = 31;
                  break;
                }

                _context2.next = 26;
                return this.postInsertOperate(formJSON, {
                  envDataFileStream: envReportFile
                });

              case 26:
                res = _context2.sent;
                //  第一次插入经营新后，存储返回的operateId
                self.data.operateId = res.data;
                self.data.isInsert = false;
                _context2.next = 35;
                break;

              case 31:
                _extends_1(formJSON, {
                  operateId: self.data.operateId
                });

                _context2.next = 34;
                return this.postUpdateOperate(formJSON, {
                  envDataFileStream: envReportFile
                });

              case 34:
                res = _context2.sent;

              case 35:
                if (res.code === 200) {
                  Utils$1.UI.toast('提交成功');
                  Utils$1.Router.closeCurrentWinAndRefresh({
                    winName: 'html/danbaostep2/index',
                    script: 'window.location.reload();'
                  });
                }

                _context2.next = 42;
                break;

              case 38:
                _context2.prev = 38;
                _context2.t0 = _context2["catch"](22);
                Utils$1.UI.hideLoading();
                Utils$1.UI.toast(_context2.t0.msg);

              case 42:
                Utils$1.UI.hideLoading();
                _context2.next = 46;
                break;

              case 45:
                Utils$1.UI.toast('还有信息未填入');

              case 46:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[22, 38]]);
      }));

      function submitFormData() {
        return _submitFormData.apply(this, arguments);
      }

      return submitFormData;
    }()
  }]);

  return PageController;
}(Service);

apiready = function apiready() {
  var pageParam = api.pageParam || {};
  api.setStatusBarStyle({
    style: 'dark'
  });
  new PageController({
    pageParam: pageParam
  }).main();
};
