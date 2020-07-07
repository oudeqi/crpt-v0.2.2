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

function openRegLogin() {
  api.openTabLayout({
    name: 'html/reglogin/index',
    url: 'widget://html/reglogin/index.html',
    bgColor: '#fff',
    reload: true,
    slidBackEnabled: false
  });
} // 个人登录


function openFangchan(_ref11) {
  var gtId = _ref11.gtId,
      flowStatus = _ref11.flowStatus,
      gtCreditId = _ref11.gtCreditId,
      type = _ref11.type,
      gtCounterId = _ref11.gtCounterId,
      _cb = _ref11._cb;
  api.openTabLayout({
    title: '房产信息',
    name: 'html/guarantee_application_house/index',
    url: 'widget://html/guarantee_application_house/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    pageParam: {
      gtId: gtId,
      flowStatus: flowStatus,
      gtCreditId: gtCreditId,
      type: type,
      gtCounterId: gtCounterId,
      _cb: _cb
    },
    navigationBar: {
      background: '#fff',
      color: '#303133',
      fontSize: 18,
      fontWeight: 500,
      leftButtons: [{
        text: '',
        color: 'rgba(102,187,106,1)',
        iconPath: 'widget://image/back_green_big.png'
      }]
    }
  });
} // 车辆信息


function openCheliang(_ref12) {
  var gtId = _ref12.gtId,
      flowStatus = _ref12.flowStatus,
      gtCreditId = _ref12.gtCreditId,
      type = _ref12.type,
      gtCounterId = _ref12.gtCounterId,
      _cb = _ref12._cb;
  api.openTabLayout({
    title: '车辆信息',
    name: 'html/guarantee_application_car/index',
    url: 'widget://html/guarantee_application_car/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    pageParam: {
      gtId: gtId,
      flowStatus: flowStatus,
      gtCreditId: gtCreditId,
      type: type,
      gtCounterId: gtCounterId,
      _cb: _cb
    },
    navigationBar: {
      background: '#fff',
      color: '#303133',
      fontSize: 18,
      fontWeight: 500,
      leftButtons: [{
        text: '',
        color: 'rgba(102,187,106,1)',
        iconPath: 'widget://image/back_green_big.png'
      }]
    }
  });
} // 产品列表

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
    var version = "2.6.1";
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
    var btoa = global.btoa && typeof global.btoa == 'function'
        ? function(b){ return global.btoa(b) } : function(b) {
        if (b.match(/[^\x00-\xFF]/)) throw new RangeError(
            'The string contains invalid characters.'
        );
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = function(u) {
        return btoa(utob(String(u)));
    };
    var encode = function(u, urisafe) {
        return !urisafe
            ? _encode(String(u))
            : _encode(String(u)).replace(/[+\/]/g, function(m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function(u) { return encode(u, true) };
    var fromUint8Array = function(a) {
        return btoa(Array.from(a, function(c) {
            return String.fromCharCode(c)
        }).join(''));
    };
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
    var _atob = global.atob && typeof global.atob == 'function'
        ? function(a){ return global.atob(a) } : function(a){
        return a.replace(/\S{1,4}/g, cb_decode);
    };
    var atob = function(a) {
        return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ''));
    };
    var _decode = function(a) { return btou(_atob(a)) };
    var decode = function(a){
        return _decode(
            String(a).replace(/[-_]/g, function(m0) {
                return m0 == '-' ? '+' : '/'
            }).replace(/[^A-Za-z0-9\+\/]/g, '')
        );
    };
    var toUint8Array = function(a) {
        return Uint8Array.from(atob(a), function(c) {
            return c.charCodeAt(0);
        });
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
        fromUint8Array: fromUint8Array,
        toUint8Array: toUint8Array
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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function setRefreshHeaderInfo(_ref) {
  var success = _ref.success,
      fail = _ref.fail,
      _ref$options = _ref.options,
      options = _ref$options === void 0 ? {} : _ref$options;
  api.setRefreshHeaderInfo(_objectSpread({
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

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
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
      timeout = _ref$timeout === void 0 ? 20 : _ref$timeout;

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
      headers: _objectSpread$1(_objectSpread$1(_objectSpread$1({}, Authorization), contentType), headers)
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

function ActionSheet(title, buttons, cb) {
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

function CitySelector(cb) {
  var UIActionSelector = api.require('UIActionSelector');

  UIActionSelector.open({
    datas: 'widget://res/city.json',
    layout: {
      row: 5,
      col: 3,
      height: 40,
      size: 14,
      sizeActive: 16,
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
      bg: '#fff',
      bgActive: '#ccc',
      color: '#888',
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
      cb(ret.selectedInfo);
    }
  });
}

function getPicture(sourceType, cb) {
  // library         //图片库
  // camera          //相机
  // album           //相册
  api.getPicture({
    sourceType: sourceType,
    encodingType: 'png',
    mediaValue: 'pic',
    destinationType: 'file',
    allowEdit: false,
    quality: 80,
    targetWidth: 1000,
    // targetHeight: 300,
    saveToPhotoAlbum: false
  }, cb);
}

function setRefreshHeaderInfo$1(successCallback, errorCallback) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
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
      errorCallback && errorCallback(error);
    } else {
      successCallback && successCallback(ret);
    }
  });
}

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// 表单验证
var Validation = /*#__PURE__*/function () {
  function Validation(config) {
    var _this = this;

    classCallCheck(this, Validation);

    this.config = config;
    this.isValid = true; // 是否验证通过

    this.error = null; // 验证失败回调

    this.success = null; // 验证成功回调

    this.fnMap = {
      checked: function checked(config, v, error) {
        var value = v;
        var msg = config.checked;
        _this.isValid = value;

        if (!_this.isValid) {
          _this.error(msg);
        }
      },
      required: function required(config, v, error) {
        var value = String(v);
        var msg = config.required;
        _this.isValid = value;

        if (!_this.isValid) {
          _this.error(msg);
        }
      },
      pattern: function pattern(config, v, error) {
        var value = v || '';
        var pattern = config.pattern[0];
        var msg = config.pattern[1];
        _this.isValid = !value || pattern.test($api.trim(value));

        if (!_this.isValid) {
          _this.error(msg);
        }
      },
      max: function max(config, v, error) {
        var value = parseFloat(v);
        var max = config.max[0];
        var msg = config.max[1];
        _this.isValid = !value || value <= max;

        if (!_this.isValid) {
          _this.error(msg);
        }
      },
      min: function min(config, v, error) {
        var value = parseFloat(v);
        var min = config.min[0];
        var msg = config.min[1];
        _this.isValid = !value || value >= min;

        if (!_this.isValid) {
          _this.error(msg);
        }
      }
    };
  }

  createClass(Validation, [{
    key: "__commonValidate",
    value: function __commonValidate(currentConfig) {
      var currentValidConfig = currentConfig.valid || {};
      var currentValue = currentConfig.get();
      var condition = currentConfig.condition; // 决定是否校验

      for (var _i = 0, _Object$keys = Object.keys(currentValidConfig); _i < _Object$keys.length; _i++) {
        k = _Object$keys[_i];
        var fnMap = this.fnMap;

        if (!condition || typeof condition === 'function' && condition()) {
          fnMap[k](currentValidConfig, currentValue);

          if (!this.isValid) {
            break;
          }
        }
      }
    }
  }, {
    key: "__fnValidate",
    value: function __fnValidate(_ref) {
      var _this2 = this;

      var validator = _ref.validator,
          condition = _ref.condition;

      if (!condition || typeof condition === 'function' && condition()) {
        validator(function (msg) {
          if (msg) {
            _this2.error(msg.message || msg);

            _this2.isValid = false;
          }
        });
      }
    }
  }, {
    key: "__validate",
    value: function __validate() {
      var config = this.config;

      for (var _i2 = 0, _Object$keys2 = Object.keys(config); _i2 < _Object$keys2.length; _i2++) {
        key = _Object$keys2[_i2];
        var currentConfig = config[key] || {};

        if (currentConfig.shape) {
          this.__shapeValidate(currentConfig.shape || {}, currentConfig.get());
        } else if (currentConfig.validator && typeof currentConfig.validator === 'function') {
          this.__fnValidate(currentConfig);
        } else {
          this.__commonValidate(currentConfig);
        }

        if (!this.isValid) {
          break;
        }
      }
    }
  }, {
    key: "__shapeAttrValidate",
    value: function __shapeAttrValidate(currentConfig, value) {
      for (var _i3 = 0, _Object$keys3 = Object.keys(currentConfig); _i3 < _Object$keys3.length; _i3++) {
        k = _Object$keys3[_i3];
        var fnMap = this.fnMap;
        fnMap[k](currentConfig, value);

        if (!this.isValid) {
          break;
        }
      }
    }
  }, {
    key: "__shapeValidate",
    value: function __shapeValidate(shape, value) {
      var _iterator = _createForOfIteratorHelper(value),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var currentValue = _step.value;

          for (var _i4 = 0, _Object$keys4 = Object.keys(shape); _i4 < _Object$keys4.length; _i4++) {
            k = _Object$keys4[_i4];

            this.__shapeAttrValidate(shape[k], currentValue[k]);

            if (!this.isValid) {
              break;
            }
          }

          if (!this.isValid) {
            break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "__validResult",
    value: function __validResult() {
      var config = this.config;
      var res = {};

      for (var _i5 = 0, _Object$keys5 = Object.keys(config); _i5 < _Object$keys5.length; _i5++) {
        key = _Object$keys5[_i5];
        var revert = config[key].revert;

        if (typeof revert === 'boolean') {
          revert = revert;
        } else if (typeof revert === 'function') {
          revert = revert();
        } else if (!revert) {
          revert = true;
        }

        if (revert) {
          res[key] = config[key].get();
        }
      }

      return res;
    }
  }, {
    key: "validate",
    value: function validate(_ref2) {
      var error = _ref2.error,
          success = _ref2.success;
      this.error = error;
      this.success = success;

      this.__validate();

      if (this.isValid) {
        success && success(this.__validResult());
      }
    }
  }]);

  return Validation;
}(); // 输入框限制

var NumberLimit = function NumberLimit(el) {
  classCallCheck(this, NumberLimit);

  this.el = el;

  this.el.oninput = function (e) {
    var value = e.target.value;
    var max = parseFloat($api.attr(e.target, 'max'));

    if (max && parseFloat(value) >= max) {
      // 限定最大值
      return e.target.value = max;
    }

    var decimalKeeps = parseInt($api.attr(el, 'decimal-keeps'));

    if (decimalKeeps) {
      if (e.target.type === 'number') {
        // type="number" input事件，
        // e.target.value获取不到末尾的 ‘.’，但是可以获取到中间的点，
        // 如果.连出现两次，e.target.value只能娶到‘’
        // 如果.间隔出现两次，且最后一位是点，e.target.value可以取到 parseFloat后的值
        // 如果.间隔出现两次，且最后一位不是点，e.target.value只能娶到‘’
        // 如果.出现三次及三次以上，e.target.value只能娶到‘’
        // 如果-出现在非首位，value会被置为‘’，e.target.value也获取不到末尾的‘-’，
        if (!value) {
          e.target.value = '';
        }

        if (value.includes('.')) {
          var a = value.split('.')[0];
          var b = value.split('.')[1];
          e.target.value = a + '.' + b.substring(0, decimalKeeps);
        }
      } else {
        // type="text"
        if (isNaN(parseFloat(value))) {
          // 过滤负数和非数字
          e.target.value = '';
        } else {
          if (value.includes('.')) {
            // 处理符号点
            var _a = value.split('.')[0];

            var _b = value.split('.')[1].substring(0, decimalKeeps);

            if (isNaN(parseFloat(_b))) {
              // 处理最后一位是点
              e.target.value = parseInt(_a) + '.';
            } else {
              // 末尾不是点
              if (isNaN(_b)) {
                // 小数点后不是数字
                e.target.value = parseInt(_a) + '.' + parseFloat(_b);
              } else {
                e.target.value = parseInt(_a) + '.' + _b;
              }
            }
          } else {
            e.target.value = parseInt(value) === 0 ? 0 : parseInt(value) || ''; // 尽量化为整数
          }
        }
      }
    }
  };
};

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
var baidu = new BaiduSDK();

var Service = /*#__PURE__*/function () {
  function Service() {
    classCallCheck(this, Service);
  }

  createClass(Service, [{
    key: "saveIDCardPic",
    // 保存身份证图片
    value: function saveIDCardPic(gtId, files) {
      return http.upload('/crpt-guarantee/guarantor/attachment/save?gtId=' + gtId, {
        files: files
      }, {
        headers: {},
        timeout: 3000
      });
    } // 获取担保状态

  }, {
    key: "queryDanbaoStatus",
    value: function queryDanbaoStatus() {
      return http.get('/crpt-guarantee/gt/apply/query');
    } // 反担保人新增

  }, {
    key: "addDanbaoRen",
    value: function addDanbaoRen(params) {
      return http.post('/crpt-guarantee/guarantor/counter/insert', {
        body: params
      });
    } // 反担保人更新

  }, {
    key: "updateDanbaoRen",
    value: function updateDanbaoRen(params) {
      return http.post('/crpt-guarantee/guarantor/counter/update', {
        body: params
      });
    } // 反担保人信息查询

  }, {
    key: "queryDanbaoRenMsgById",
    value: function queryDanbaoRenMsgById(id) {
      return http.get('/crpt-guarantee/guarantor/counter/infoquery?id=' + id);
    }
  }]);

  return Service;
}();

var PageController = /*#__PURE__*/function (_Service) {
  inherits(PageController, _Service);

  var _super = _createSuper(PageController);

  function PageController() {
    var _this;

    classCallCheck(this, PageController);

    _this = _super.apply(this, arguments);

    var _ref = api.pageParam || {},
        gtCreditId = _ref.gtCreditId,
        gtCounterId = _ref.gtCounterId,
        type = _ref.type,
        status = _ref.status,
        flowStatus = _ref.flowStatus;

    var typeMap = {
      teacher: 1,
      // '教师',
      doctor: 2,
      // '医生',
      civilServant: 3,
      // '公务员',
      employeesSOE: 4,
      // '国企员工',
      individualBusiness: 5,
      // '个体经商',
      others: 6 // '其他',

    };
    _this.initData = {
      disabled: true,
      // 初始状态下，所有控件禁用
      // gtId	int	担保申请id
      // gtCreditId	int	担保授信id
      gtCreditId: gtCreditId,
      // 担保授信id
      gtCounterId: gtCounterId,
      // 担保人id
      type: typeMap[type],
      status: status,
      // status 反担保人状态
      // 0：未填写信息   1：待发送  2：确认中  3：已确认   4：已作废  5：已签约  6：已拒签  ，默认为：0。
      flowStatus: flowStatus // 资料录入状态
      // 0无填写
      // 1担保业务申请填写
      // 2反担保人列表
      // 3文书送达地址
      // 4其他附件上传

    }; // 1： 配偶、 2：父母、 3：同事、 4：朋友、 5：亲戚

    _this.relationship = ['配偶', '父母', '同事', '朋友', '亲戚']; // 婚姻状况 1：未婚  :2：已婚、  3：已婚有子女、  4：离异后未再婚

    _this.marriage = ['未婚', '已婚', '已婚有子女', '离异后未再婚']; // 【本科及以上、大专、中专或高中、初中或以下】

    _this.education = ['本科及以上', '大专', '中专或高中', '初中或以下'];
    return _this;
  }

  createClass(PageController, [{
    key: "__setDisabled",
    value: function __setDisabled() {
      // 不可编辑
      this.initData.disabled = true;
      $api.attr($api.byId('submit'), 'disabled', true);
      $api.attr($api.byId('name'), 'disabled', true);
      $api.attr($api.byId('name'), 'placeholder', '');
      $api.attr($api.byId('phone'), 'disabled', true);
      $api.attr($api.byId('phone'), 'placeholder', '');
      $api.attr($api.byId('certNo'), 'disabled', true);
      $api.attr($api.byId('certNo'), 'placeholder', '');
      var accountNature = Array.from(document.querySelectorAll('[name="accountNature"]'));
      accountNature.forEach(function (item) {
        $api.attr(item, 'disabled', true);
      });
      $api.attr($api.byId('addrDetail'), 'disabled', true);
      $api.attr($api.byId('addrDetail'), 'placeholder', '详细地址');
      $api.attr($api.byId('occupation'), 'disabled', true);
      $api.attr($api.byId('occupation'), 'placeholder', '');
      $api.attr($api.byId('workAddrDetail'), 'disabled', true);
      $api.attr($api.byId('workAddrDetail'), 'placeholder', '工作详细地址');
      $api.attr($api.byId('bankName'), 'disabled', true);
      $api.attr($api.byId('bankName'), 'placeholder', '');
      $api.attr($api.byId('bankCardNo'), 'disabled', true);
      $api.attr($api.byId('bankCardNo'), 'placeholder', '');
      $api.attr($api.byId('openBank'), 'disabled', true);
      $api.attr($api.byId('openBank'), 'placeholder', '');
      $api.attr($api.byId('spouseName'), 'disabled', true);
      $api.attr($api.byId('spouseName'), 'placeholder', '');
      $api.attr($api.byId('spousePhone'), 'disabled', true);
      $api.attr($api.byId('spousePhone'), 'placeholder', '');
      $api.attr($api.byId('spouseIncome'), 'disabled', true);
      $api.attr($api.byId('spouseIncome'), 'placeholder', '');
      $api.attr($api.byId('spouseOccupation'), 'disabled', true);
      $api.attr($api.byId('spouseOccupation'), 'placeholder', '');
      $api.attr($api.byId('spouseWorkCompany'), 'disabled', true);
      $api.attr($api.byId('spouseWorkCompany'), 'placeholder', '');
    }
  }, {
    key: "__removeDisabled",
    value: function __removeDisabled() {
      // 可编辑
      this.initData.disabled = false;
      $api.removeAttr($api.byId('submit'), 'disabled');
      $api.removeAttr($api.byId('name'), 'disabled');
      $api.attr($api.byId('name'), 'placeholder', '请输入');
      $api.removeAttr($api.byId('phone'), 'disabled');
      $api.attr($api.byId('phone'), 'placeholder', '请输入');
      $api.removeAttr($api.byId('certNo'), 'disabled');
      $api.attr($api.byId('certNo'), 'placeholder', '请输入');
      var accountNature = Array.from(document.querySelectorAll('[name="accountNature"]'));
      accountNature.forEach(function (item) {
        $api.removeAttr(item, 'disabled');
      });
      $api.removeAttr($api.byId('addrDetail'), 'disabled');
      $api.attr($api.byId('addrDetail'), 'placeholder', '详细地址');
      $api.removeAttr($api.byId('occupation'), 'disabled');
      $api.attr($api.byId('occupation'), 'placeholder', '请输入');
      $api.removeAttr($api.byId('workAddrDetail'), 'disabled');
      $api.attr($api.byId('workAddrDetail'), 'placeholder', '工作详细地址');
      $api.removeAttr($api.byId('bankName'), 'disabled');
      $api.attr($api.byId('bankName'), 'placeholder', '请输入');
      $api.removeAttr($api.byId('bankCardNo'), 'disabled');
      $api.attr($api.byId('bankCardNo'), 'placeholder', '请输入');
      $api.removeAttr($api.byId('openBank'), 'disabled');
      $api.attr($api.byId('openBank'), 'placeholder', '请输入');
      $api.removeAttr($api.byId('spouseName'), 'disabled');
      $api.attr($api.byId('spouseName'), 'placeholder', '请输入');
      $api.removeAttr($api.byId('spousePhone'), 'disabled');
      $api.attr($api.byId('spousePhone'), 'placeholder', '请输入');
      $api.removeAttr($api.byId('spouseIncome'), 'disabled');
      $api.attr($api.byId('spouseIncome'), 'placeholder', '请输入');
      $api.removeAttr($api.byId('spouseOccupation'), 'disabled');
      $api.attr($api.byId('spouseOccupation'), 'placeholder', '请输入');
      $api.removeAttr($api.byId('spouseWorkCompany'), 'disabled');
      $api.attr($api.byId('spouseWorkCompany'), 'placeholder', '请输入');
    }
  }, {
    key: "__pageDataFillBack",
    value: function __pageDataFillBack(data) {
      $api.byId('name').value = data.name || '';
      $api.byId('phone').value = data.phone || '';
      $api.byId('spousePhone').value = data.spousePhone || '';
      var certNo = $api.byId('certNo');
      certNo.value = data.certNo || '';
      certNo.dataset.picture = data.pictureId || ''; // 身份证图片地址

      var relationship = $api.byId('relationship');
      relationship.value = this.relationship[(parseInt(data.relationship) || 100) - 1] || '';
      relationship.dataset.value = data.relationship || ''; // 与借款人关系 1： 配偶、 2：父母、 3：同事、 4：朋友、 5：亲戚

      var marriage = $api.byId('marriage');
      marriage.value = this.marriage[(parseInt(data.marriage) || 100) - 1] || '';
      marriage.dataset.value = data.marriage || ''; // 婚姻状况 1：未婚  :2：已婚、  3：已婚有子女、  4：离异后未再婚

      var education = $api.byId('education');
      education.value = data.education || '';
      education.dataset.value = data.education || ''; // 学历

      var checkedAccountNature = document.querySelector("[name=\"accountNature\"][value=\"".concat(data.accountNature, "\"]"));

      if (checkedAccountNature) {
        checkedAccountNature.checked = true; // 户口性质 1：常住户、  2：临时户
      }

      var address = $api.byId('address');
      var workAddress = $api.byId('workAddress');
      address.value = data.addrProvince ? "".concat(data.addrProvince, "/").concat(data.addrCity, "/").concat(data.addrCounty) : '';
      address.dataset.province = data.addrProvince || ''; // 常住地址（省）

      address.dataset.provinceCode = data.addrProvinceCode || ''; // 常住地址编号（省）

      address.dataset.city = data.addrCity || ''; // 常住地址（市）

      address.dataset.cityCode = data.addrCityCode || ''; // 常住地址编号（市）

      address.dataset.county = data.addrCounty || ''; // 常住地址（区县）

      address.dataset.countyCode = data.addrCountyCode || ''; //  常住地址编号（区县）

      $api.byId('addrDetail').value = data.addrDetail || ''; // 常住地址详细

      workAddress.value = data.workAddrProvince ? "".concat(data.workAddrProvince, "/").concat(data.workAddrCity, "/").concat(data.workAddrCounty) : '';
      workAddress.dataset.province = data.workAddrProvince || ''; // 工作地址（省）

      workAddress.dataset.provinceCode = data.workAddrProvinceCode || ''; // 工作地址编号（省）

      workAddress.dataset.city = data.workAddrCity || ''; // 工作地址（市）

      workAddress.dataset.cityCode = data.workAddrCityCode || ''; // 工作地址编号（市）

      workAddress.dataset.county = data.workAddrCounty || ''; // 工作地址（区县）

      workAddress.dataset.countyCode = data.workAddrCountyCode || ''; // 工作地址编号（区县）

      $api.byId('workAddrDetail').value = data.workAddrDetail || ''; // 工作地址详细

      $api.byId('occupation').value = data.occupation || ''; //  职业

      $api.byId('bankName').value = data.bankName || ''; // 银行名称

      $api.byId('bankCardNo').value = data.bankCardNo || ''; // 银行卡号

      $api.byId('openBank').value = data.openBank || ''; // 开户行

      $api.byId('spouseName').value = data.spouseName || ''; // 配偶姓名

      $api.byId('spouseIncome').value = data.spouseIncome || ''; // 配偶年收入  单位为: 万元

      $api.byId('spouseOccupation').value = data.spouseOccupation || ''; // 配偶职业

      $api.byId('spouseWorkCompany').value = data.spouseWorkCompany || ''; // 配偶工作单位
    }
  }, {
    key: "__renderFillStatus",
    value: function __renderFillStatus(carFillStatus, houseFillStatus) {
      var cheliangEl = $api.byId('cheliang');
      var fangchanEl = $api.byId('fangchan');

      if (carFillStatus === 3 || carFillStatus === '3') {
        $api.addCls(cheliangEl, 'ok');
      } else {
        $api.removeCls(cheliangEl, 'ok');
      }

      if (houseFillStatus === 3 || houseFillStatus === '3') {
        $api.addCls(fangchanEl, 'ok');
      } else {
        $api.removeCls(fangchanEl, 'ok');
      }
    }
  }, {
    key: "__initValidation",
    value: function __initValidation() {
      var cfg = {
        name: {
          valid: {
            required: '请输入担保人姓名'
          },
          get: function get() {
            return $api.byId('name').value;
          }
        },
        phone: {
          valid: {
            required: '请输入担保人联系电话',
            pattern: [/^1[3456789]\d{9}$/, '手机号码格式不正确']
          },
          get: function get() {
            return $api.byId('phone').value;
          }
        },
        certNo: {
          valid: {
            pattern: [/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, '身份证号码格式不正确']
          },
          get: function get() {
            return $api.byId('certNo').value;
          }
        },
        spousePhone: {
          // 配偶电话
          valid: {
            pattern: [/^1[3456789]\d{9}$/, '配偶电话号码格式不正确']
          },
          get: function get() {
            return $api.byId('spousePhone').value;
          }
        }
      };
      return new Validation(cfg);
    }
  }, {
    key: "__bindCollapseEvent",
    value: function __bindCollapseEvent() {
      $api.byId('collapse').onclick = function (e) {
        var collapse = $api.closest(event.target, '.collapse');
        var visiable = $api.attr(collapse, 'collapse');

        if (visiable === 'show') {
          visiable = 'hide';
        } else {
          visiable = 'show';
        }

        $api.attr(collapse, 'collapse', visiable);
      };
    }
  }, {
    key: "__bindGoFangchanAndCheliang",
    value: function __bindGoFangchanAndCheliang() {
      var _this2 = this;

      $api.byId('fangchan').onclick = function () {
        _this2.queryDanbaoStatus().then(function (res) {
          if (res.code === 200) {
            // gtId	int	担保申请id
            // gtCreditId	int	担保授信id
            // flowStatus: props.pageParam.flowStatus, 资料录入状态
            // 0 无填写 1	int	担保业务申请填写 2	int	反担保人列表 3	int	文书送达地址 4	int	其他附件上传
            // type: props.pageParam.type, 反担保人传 2
            // gtCounterId: props.pageParam.gtCounterId, 担保人id
            // _cb: props.pageParam._cb, 字符串的回调函数
            var _ref2 = res.data || {},
                gtId = _ref2.gtId,
                flowStatus = _ref2.flowStatus,
                gtCreditId = _ref2.gtCreditId;

            var gtCounterId = _this2.initData.gtCounterId;
            openFangchan({
              gtId: gtId,
              flowStatus: flowStatus,
              gtCreditId: gtCreditId,
              gtCounterId: gtCounterId,
              type: 2,
              _cb: ';'
            });
          }
        })["catch"](function (error) {
          api.toast({
            msg: error.msg || '出错啦',
            location: 'middle'
          });
        });
      };

      $api.byId('cheliang').onclick = function () {
        _this2.queryDanbaoStatus().then(function (res) {
          if (res.code === 200) {
            var _ref3 = res.data || {},
                gtId = _ref3.gtId,
                flowStatus = _ref3.flowStatus,
                gtCreditId = _ref3.gtCreditId;

            var gtCounterId = _this2.initData.gtCounterId;
            openCheliang({
              gtId: gtId,
              flowStatus: flowStatus,
              gtCreditId: gtCreditId,
              gtCounterId: gtCounterId,
              type: 2,
              _cb: 'location.reload();'
            });
          }
        })["catch"](function (error) {
          api.toast({
            msg: error.msg || '出错啦',
            location: 'middle'
          });
        });
      };
    }
  }, {
    key: "__getOtherParams",
    value: function __getOtherParams() {
      var accountNature = document.querySelector('[name="accountNature"]:checked');
      var address = $api.byId('address');
      var workAddress = $api.byId('workAddress');
      var params = {
        pictureId: $api.byId('certNo').dataset.picture,
        // 身份证图片地址
        relationship: $api.byId('relationship').dataset.value,
        // 与借款人关系 1： 配偶、 2：父母、 3：同事、 4：朋友、 5：亲戚
        marriage: $api.byId('marriage').dataset.value,
        // 婚姻状况 1：未婚  :2：已婚、  3：已婚有子女、  4：离异后未再婚
        education: $api.byId('education').dataset.value,
        // 学历
        accountNature: accountNature ? accountNature.value : '',
        // 户口性质 1：常住户、  2：临时户
        addrProvince: address.dataset.province,
        // 常住地址（省）
        addrProvinceCode: address.dataset.provinceCode,
        // 常住地址编号（省）
        addrCity: address.dataset.city,
        // 常住地址（市）
        addrCityCode: address.dataset.cityCode,
        // 常住地址编号（市）
        addrCounty: address.dataset.county,
        // 常住地址（区县）
        addrCountyCode: address.dataset.countyCode,
        //  常住地址编号（区县）
        addrDetail: $api.byId('addrDetail').value,
        // 常住地址详细
        workAddrProvince: workAddress.dataset.province,
        // 工作地址（省）
        workAddrProvinceCode: workAddress.dataset.provinceCode,
        // 工作地址编号（省）
        workAddrCity: workAddress.dataset.city,
        // 工作地址（市）
        workAddrCityCode: workAddress.dataset.cityCode,
        // 工作地址编号（市）
        workAddrCounty: workAddress.dataset.county,
        // 工作地址（区县）
        workAddrCountyCode: workAddress.dataset.countyCode,
        // 工作地址编号（区县）
        workAddrDetail: $api.byId('workAddrDetail').value,
        // 工作地址详细
        occupation: $api.byId('occupation').value,
        //  职业
        bankName: $api.byId('bankName').value,
        // 银行名称
        bankCardNo: $api.byId('bankCardNo').value,
        // 银行卡号
        openBank: $api.byId('openBank').value,
        // 开户行
        spouseName: $api.byId('spouseName').value,
        // 配偶姓名
        spouseIncome: $api.byId('spouseIncome').value,
        // 配偶年收入  单位为: 万元
        spouseOccupation: $api.byId('spouseOccupation').value,
        // 配偶职业
        spouseWorkCompany: $api.byId('spouseWorkCompany').value // 配偶工作单位

      };
      return params;
    }
  }, {
    key: "__InitRelationship",
    value: function __InitRelationship() {
      var _this3 = this;

      $api.byId('relationship').onclick = function (e) {
        if (_this3.initData.disabled) {
          return;
        }

        ActionSheet('与借款人关系', _this3.relationship, function (index) {
          e.target.value = _this3.relationship[index];
          e.target.dataset.value = index + 1;
        });
      };
    }
  }, {
    key: "__InitMarriage",
    value: function __InitMarriage() {
      var _this4 = this;

      $api.byId('marriage').onclick = function (e) {
        if (_this4.initData.disabled) {
          return;
        }

        ActionSheet('婚姻状况', _this4.marriage, function (index) {
          e.target.value = _this4.marriage[index];
          e.target.dataset.value = index + 1;
        });
      };
    }
  }, {
    key: "__InitEducation",
    value: function __InitEducation() {
      var _this5 = this;

      $api.byId('education').onclick = function (e) {
        if (_this5.initData.disabled) {
          return;
        }

        ActionSheet('请选择学历', _this5.education, function (index) {
          e.target.value = _this5.education[index];
          e.target.dataset.value = _this5.education[index];
        });
      };
    }
  }, {
    key: "__initAddress",
    value: function __initAddress() {
      var _this6 = this;

      $api.byId('address').onclick = function (e) {
        if (_this6.initData.disabled) {
          return;
        }

        CitySelector(function (selected) {
          console.log(JSON.stringify(selected));
          var a = selected[0];
          var b = selected[1];
          var c = selected[2];
          e.target.value = "".concat(a.name, "/").concat(b.name, "/").concat(c.name);
          e.target.dataset.province = a.name;
          e.target.dataset.provinceCode = a.id;
          e.target.dataset.city = b.name;
          e.target.dataset.cityCode = b.id;
          e.target.dataset.county = c.name;
          e.target.dataset.countyCode = c.id;
        });
      };
    }
  }, {
    key: "__initWorkAddress",
    value: function __initWorkAddress() {
      var _this7 = this;

      $api.byId('workAddress').onclick = function (e) {
        if (_this7.initData.disabled) {
          return;
        }

        CitySelector(function (selected) {
          console.log(JSON.stringify(selected));
          var a = selected[0];
          var b = selected[1];
          var c = selected[2];
          e.target.value = "".concat(a.name, "/").concat(b.name, "/").concat(c.name);
          e.target.dataset.province = a.name;
          e.target.dataset.provinceCode = a.id;
          e.target.dataset.city = b.name;
          e.target.dataset.cityCode = b.id;
          e.target.dataset.county = c.name;
          e.target.dataset.countyCode = c.id;
        });
      };
    }
  }, {
    key: "__readIDCard",
    value: function () {
      var _readIDCard = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(pic) {
        var res, res2;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                api.showProgress({
                  title: '识别中...',
                  text: ''
                });
                _context.prev = 1;
                _context.next = 4;
                return baidu.IdcardVerify({
                  certFile: pic
                });

              case 4:
                res = _context.sent;
                _context.next = 7;
                return this.saveIDCardPic(this.initData.gtCreditId, {
                  pictureFile: pic
                });

              case 7:
                res2 = _context.sent;

                if (res.code === 200 && res2.code === 200) {
                  $api.byId('certNo').value = res.data.number || '';
                  $api.byId('certNo').dataset.picture = res2.data.pictureId || '';
                  api.toast({
                    msg: '识别成功',
                    location: 'middle'
                  });
                }

                _context.next = 16;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](1);
                $api.byId('certNo').value = '';
                $api.byId('certNo').dataset.picture = '';
                api.toast({
                  msg: _context.t0.msg || '出错啦',
                  location: 'middle'
                });

              case 16:
                api.hideProgress();

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 11]]);
      }));

      function __readIDCard(_x) {
        return _readIDCard.apply(this, arguments);
      }

      return __readIDCard;
    }()
  }, {
    key: "__bindIDCardOcr",
    value: function () {
      var _bindIDCardOcr = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
        var _this8 = this;

        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                $api.byId('idCardOcrBtn').onclick = function () {
                  if (_this8.initData.disabled) {
                    return;
                  }

                  var btns = ['相机', '相册'];
                  var sourceType = '';
                  ActionSheet('请选择', btns, function (index) {
                    if (index === 0) {
                      sourceType = 'camera';
                    } else {
                      sourceType = 'album';
                    }

                    getPicture(sourceType, /*#__PURE__*/function () {
                      var _ref4 = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(ret, err) {
                        return regenerator.wrap(function _callee2$(_context2) {
                          while (1) {
                            switch (_context2.prev = _context2.next) {
                              case 0:
                                if (ret) {
                                  _this8.__readIDCard(ret.data);
                                }

                              case 1:
                              case "end":
                                return _context2.stop();
                            }
                          }
                        }, _callee2);
                      }));

                      return function (_x2, _x3) {
                        return _ref4.apply(this, arguments);
                      };
                    }());
                  });
                };

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function __bindIDCardOcr() {
        return _bindIDCardOcr.apply(this, arguments);
      }

      return __bindIDCardOcr;
    }()
  }, {
    key: "__readBank",
    value: function () {
      var _readBank = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(pic) {
        var res;
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                api.showProgress({
                  title: '识别中...',
                  text: ''
                });
                _context4.prev = 1;
                _context4.next = 4;
                return baidu.BankVerify({
                  bankcardFile: pic
                });

              case 4:
                res = _context4.sent;

                if (res.code === 200) {
                  $api.byId('bankCardNo').value = res.data.bank_card_number || '';
                  $api.byId('bankName').value = res.data.bank_name || '';
                  api.toast({
                    msg: '识别成功',
                    location: 'middle'
                  });
                }

                _context4.next = 13;
                break;

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4["catch"](1);
                $api.byId('bankCardNo').value = '';
                $api.byId('bankName').value = '';
                api.toast({
                  msg: _context4.t0.message || '出错啦',
                  location: 'middle'
                });

              case 13:
                api.hideProgress();

              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[1, 8]]);
      }));

      function __readBank(_x4) {
        return _readBank.apply(this, arguments);
      }

      return __readBank;
    }()
  }, {
    key: "__bindBankOcr",
    value: function () {
      var _bindBankOcr = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5() {
        var _this9 = this;

        return regenerator.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                $api.byId('bankOcrBtn').onclick = function () {
                  if (_this9.initData.disabled) {
                    return;
                  }

                  var btns = ['相机', '相册'];
                  var sourceType = '';
                  ActionSheet('请选择', btns, function (index) {
                    if (index === 0) {
                      sourceType = 'camera';
                    } else {
                      sourceType = 'album';
                    }

                    getPicture(sourceType, function (ret, err) {
                      if (ret) {
                        _this9.__readBank(ret.data);
                      }
                    });
                  });
                };

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function __bindBankOcr() {
        return _bindBankOcr.apply(this, arguments);
      }

      return __bindBankOcr;
    }()
  }, {
    key: "initForm",
    value: function initForm() {
      this.__InitRelationship();

      this.__InitMarriage();

      this.__InitEducation();

      this.__initAddress();

      this.__initWorkAddress();
    }
  }, {
    key: "bindEvent",
    value: function bindEvent() {
      this.__bindCollapseEvent();

      this.__bindGoFangchanAndCheliang();

      this.__bindIDCardOcr();

      this.__bindBankOcr();
    }
  }, {
    key: "getFillStatus",
    value: function () {
      var _getFillStatus = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6() {
        var gtCounterId, res;
        return regenerator.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                gtCounterId = this.initData.gtCounterId;

                if (gtCounterId) {
                  _context6.next = 3;
                  break;
                }

                return _context6.abrupt("return", false);

              case 3:
                _context6.next = 5;
                return this.queryDanbaoRenMsgById(gtCounterId);

              case 5:
                res = _context6.sent;

                if (res.code === 200) {
                  this.__renderFillStatus(res.data.carFillStatus, res.data.houseFillStatus);
                }

              case 7:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getFillStatus() {
        return _getFillStatus.apply(this, arguments);
      }

      return getFillStatus;
    }()
  }, {
    key: "getPageDate",
    value: function () {
      var _getPageDate = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee7() {
        var gtCounterId, res, status, flowStatus;
        return regenerator.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                this.__setDisabled();

                gtCounterId = this.initData.gtCounterId;

                if (gtCounterId) {
                  _context7.next = 6;
                  break;
                }

                api.refreshHeaderLoadDone();

                this.__removeDisabled();

                return _context7.abrupt("return", false);

              case 6:
                api.showProgress({
                  title: '加载中...',
                  text: '',
                  modal: false
                });
                _context7.prev = 7;
                _context7.next = 10;
                return this.queryDanbaoRenMsgById(gtCounterId);

              case 10:
                res = _context7.sent;

                if (res.code === 200) {
                  // 是否填写车辆信息 1. 未填写  3. 已填写
                  // 是否填写房产信息 1. 未填写  3. 已填写
                  this.__renderFillStatus(res.data.carFillStatus, res.data.houseFillStatus);

                  this.__pageDataFillBack(res.data);

                  status = parseInt(this.initData.status); // 0：未填写信息   1：待发送  2：确认中  3：已确认   4：已作废  5：已签约  6：已拒签  ，默认为：0。

                  flowStatus = parseInt(this.initData.flowStatus); // 资料录入状态  // 0无填写 // 1担保业务申请填写 // 2反担保人列表 // 3文书送达地址 // 4其他附件上传

                  if (flowStatus < 2 && status < 3) {
                    this.__removeDisabled();
                  } else {
                    this.__setDisabled();
                  }
                }

                _context7.next = 17;
                break;

              case 14:
                _context7.prev = 14;
                _context7.t0 = _context7["catch"](7);
                api.toast({
                  msg: _context7.t0.msg || '出错啦',
                  location: 'middle'
                });

              case 17:
                api.hideProgress();
                api.refreshHeaderLoadDone();

              case 19:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[7, 14]]);
      }));

      function getPageDate() {
        return _getPageDate.apply(this, arguments);
      }

      return getPageDate;
    }()
  }, {
    key: "submit",
    value: function submit() {
      var _this10 = this;

      var status = parseInt(this.initData.status); // 0：未填写信息   1：待发送  2：确认中  3：已确认   4：已作废  5：已签约  6：已拒签  ，默认为：0。

      if (!isNaN(status) && status >= 3) {
        api.toast({
          msg: '担保人状态为已经确认',
          location: 'middle'
        });
        return;
      }

      if ($api.attr($api.byId('submit'), 'disabled')) {
        return;
      }

      this.__initValidation().validate({
        error: function error(msg) {
          api.toast({
            msg: msg,
            location: 'middle'
          });
        },
        success: function () {
          var _success = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee8(data) {
            var _this10$initData, gtCreditId, gtCounterId, type, isUpdate, postData, callMethod, res;

            return regenerator.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.prev = 0;
                    _this10$initData = _this10.initData, gtCreditId = _this10$initData.gtCreditId, gtCounterId = _this10$initData.gtCounterId, type = _this10$initData.type;
                    isUpdate = gtCounterId;
                    postData = _objectSpread$2(_objectSpread$2(_objectSpread$2({}, data), _this10.__getOtherParams()), {}, {
                      type: type,
                      gtCreditId: gtCreditId // 担保授信id

                    });
                    callMethod = '';

                    if (isUpdate) {
                      callMethod = 'updateDanbaoRen';
                      postData.gtCounterId = gtCounterId; // 反担保人id
                    } else {
                      callMethod = 'addDanbaoRen';
                      postData.responseLimitTime = 3; // 担保人响应时效 1：6小时 2：12 小时3：24小时，默认为： 3：24小时

                      postData.isNecessary = 0; // 是否必输： 1-是  0-否，默认： 0-否
                    }

                    _context8.next = 8;
                    return _this10[callMethod](postData);

                  case 8:
                    res = _context8.sent;

                    if (res && res.code === 200) {
                      if (isUpdate) {
                        api.toast({
                          msg: '更新担保人成功',
                          location: 'middle',
                          global: true
                        });
                      } else {
                        _this10.initData.gtCounterId = res.data.gtCounterId;
                        api.toast({
                          msg: '新增担保人成功',
                          location: 'middle',
                          global: true
                        });
                      }

                      api.closeWin();
                    }

                    _context8.next = 15;
                    break;

                  case 12:
                    _context8.prev = 12;
                    _context8.t0 = _context8["catch"](0);
                    api.toast({
                      msg: _context8.t0.msg,
                      location: 'middle'
                    });

                  case 15:
                  case "end":
                    return _context8.stop();
                }
              }
            }, _callee8, null, [[0, 12]]);
          }));

          function success(_x5) {
            return _success.apply(this, arguments);
          }

          return success;
        }()
      });
    }
  }]);

  return PageController;
}(Service);

apiready = function apiready() {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  new NumberLimit($api.byId('spouseIncome')); // 限制配偶年收入输入

  var ctrl = new PageController();
  ctrl.bindEvent();
  ctrl.initForm();
  api.addEventListener({
    name: 'viewappear'
  }, function (ret, err) {
    ctrl.getFillStatus();
  });
  ctrl.getPageDate();
  setRefreshHeaderInfo$1(function () {
    ctrl.getPageDate();
  });

  $api.byId('submit').onclick = function () {
    ctrl.submit();
  };
};
