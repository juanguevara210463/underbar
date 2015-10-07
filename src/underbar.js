(() => {
  'use strict';

  window._ = {};

  // Returns whatever value is passed as the argument. 
  // If a function needs to provide an iterator when the user 
  // does not pass one in, use the identity function.
  _.identity = function(val) {
    return val;
  };

  /**
   * COLLECTIONS
   * ===========
   *
   * Functions that operate on collections of values; 
   * in JavaScript, a 'collection' is something that can contain a
   * number of values--either an array or an object.
   */

  // Return an array of the first n elements of an array. If n is undefined,
  // return just the first element.
  _.first = (array, n) => {
    return n === undefined ? array[0] : array.slice(0, n);
  };

  // Like first, but for the last elements. 
  // If n is undefined, return just the last element.
  _.last = (array, n) => {
    if (n === undefined) {
      return array[array.length - 1];
    } else {
      return n === 0 ? [] : array.slice(-n);
    }
  };

  // Call iterator(value, key, collection) for each element of collection.
  // Accepts both arrays and objects.
  _.each = (collection, iterator) => {
    if (Array.isArray(collection)) {
      for(var i = 0; i < collection.length; i++) {
        iterator(collection[i], i, collection);
      }
    } else {
      for (var key in collection) {
        iterator(collection[key], key, collection);
      }
    }
  };

  // Returns the index at which value can be found in the array, or -1 if value
  // is not present in the array.
  _.indexOf = function(array, target){
    var result = -1;

    _.each(array, function(item, index) {
      if (item === target && result === -1) {
        result = index;
      }
    });

    return result;
  };

  // Return all elements of an array that pass a truth test.
  _.filter = function(collection, test) {
    var passed = [];

    _.each(collection, function(item){
      if (test(item)) {
        passed.push(item);
      }
    });

    return passed;
  };

  // Return all elements of an array that don't pass a truth test.
  _.reject = function(collection, test) {
    return _.filter(collection, function(item){
      return !(test(item));
    });

    // Implemention without reusing _.filter()
    // var notpassed = [];
    // _.each(collection, function(item){
    //   if (!test(item)) {
    //     notpassed.push(item);
    //   }
    // });
    // return notpassed;
  };

  // Produce a duplicate-free version of the array.
  _.uniq = function(array) {
    var uniques = [];

    _.each(array, function(item){
      if ( _.indexOf(uniques, item) === -1 ) {
        uniques.push(item);
      }
    });

    return uniques;
  };


  // Return the results of applying an iterator to each element.
  _.map = function(collection, iterator) {
    var results = [];

    _.each(collection, function(item){
      results.push(iterator(item));
    })

    return results;
  };

  
  // Takes an array of objects and returns and array of the values of
  // a certain property in it. E.g. take an array of people and return
  // an array of just their ages
  _.pluck = function(collection, key) {
    return _.map(collection, function(item){
      return item[key];
    });
  };

  // Reduces an array or object to a single value by repetitively calling
  // iterator(accumulator, item) for each item. accumulator should be
  // the return value of the previous iterator call.
  //
  // You can pass in a starting value for the accumulator as the third argument
  // to reduce. If no starting value is passed, the first element is used as
  // the accumulator, and is never passed to the iterator. In other words, in
  // the case where a starting value is not passed, the iterator is not invoked
  // until the second element, with the first element as it's second argument.
  //
  // Example:
  //   var numbers = [1,2,3];
  //   var sum = _.reduce(numbers, function(total, number){
  //     return total + number;
  //   }, 0); // should be 6
  //
  //   var identity = _.reduce([5], function(total, number){
  //     return total + number * number;
  //   }); // should be 5, regardless of the iterator function passed in
  //          No accumulator is given so the first element is used.
  _.reduce = function(collection, iterator, accumulator) {

    _.each(collection, function(item, index, collection){
      if (accumulator === undefined) {
        accumulator = item;
      } else {
        accumulator = iterator(accumulator, item, index, collection)
      };
    });

    return accumulator;
  };

  // Determine if the array or object contains a given value (using `===`).
  _.contains = function(collection, target) {
    return _.reduce(collection, function(wasFound, item) {
      if (wasFound) {
        return true;
      }
      return item === target;
    }, false);
  };


  // Determine whether all of the elements match a truth test.
  _.every = function(collection, iterator) {
    return _.reduce(collection, function(wasTrue, value){
      if (wasTrue) {
        if (iterator) {
          return iterator(value) ? true : false;
        } else {
          return (value) ? true : false;
        }
      } else {
        return false;
      }
    }, true);
  };

  // Determine whether any of the elements pass a truth test. If no iterator is
  // provided, provide a default one
  _.some = function(collection, iterator) {
    return !_.every(collection, function(value){
      return (iterator) ? !iterator(value) : !value;
    });
  };


  /**
   * OBJECTS
   * =======
   *
   * In this section, we'll look at a couple of helpers for merging objects.
   */

  // Extend a given object with all the properties of the passed in
  // object(s).
  //
  // Example:
  //   var obj1 = {key1: "something"};
  //   _.extend(obj1, {
  //     key2: "something new",
  //     key3: "something else new"
  //   }, {
  //     bla: "even more stuff"
  //   }); // obj1 now contains key1, key2, key3 and bla
  _.extend = function(obj) {
    var objects = _.map(arguments, function(item){
      return item;
    }).slice(1);

    _.each(objects, function(item){
      _.each(item, function(value, key){
        obj[key] = value;
      })
    });
    return obj;
  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  _.defaults = function(obj) {
    var objects = _.map(arguments, function(item){
      return item;
    }).slice(1);

    _.each(objects, function(item){
      _.each(item, function(value, key){
        if (!obj.hasOwnProperty(key)) {
          obj[key] = value;
        }
      })
    });
    return obj;
  };


  /**
   * FUNCTIONS
   * =========
   *
   * Now we're getting into function decorators, which take in any function
   * and return out a new version of the function that works somewhat differently
   */

  // Return a function that can be called at most one time. Subsequent calls
  // should return the previously returned value.
  _.once = function(func) {
    // TIP: These variables are stored in a "closure scope" (worth researching),
    // so that they'll remain available to the newly-generated function every
    // time it's called.
    var alreadyCalled = false;
    var result;

    // TIP: We'll return a new function that delegates to the old one, but only
    // if it hasn't been called before.
    return function() {
      if (!alreadyCalled) {
        // TIP: .apply(this, arguments) is the standard way to pass on all of the
        // infromation from one function call to another.
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      // The new function always returns the originally computed result.
      return result;
    };
  };

  // Memorize an expensive function's results by storing them. You may assume
  // that the function takes only one argument and that it is a primitive.
  // memoize could be renamed to oncePerUniqueArgumentList; memoize does the
  // same thing as once, but based on many sets of unique arguments.
  //
  // _.memoize should return a function that, when called, will check if it has
  // already computed the result for the given argument and return that value
  // instead if possible.
  _.memoize = function(func) {
    var results = {}

    return function() {
      if (!results[arguments[0]]) {
        results[arguments[0]] = func.apply(this, arguments);
      }
      return results[arguments[0]];
    }
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  //
  // The arguments for the original function are passed after the wait
  // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
  // call someFunction('a', 'b') after 500ms
  _.delay = function(func, wait) {
    var args = _.map(arguments, function(item){
      return item;
    }).slice(2);

    setTimeout(function(){
      func.apply(this, args);
    }, wait);
  };


  /**
   * ADVANCED COLLECTION OPERATIONS
   * ==============================
   */

  // Randomizes the order of an array's contents.
  //
  // TIP: This function's test suite will ask that you not modify the original
  // input array. For a tip on how to make a copy of an array, see:
  // http://mdn.io/Array.prototype.slice
  _.shuffle = function(array) {
    // Implementation based on the Knuth Algorithm:
    // http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
    var clonedArary = array.slice();
    var shuffled = [];
    var randomIndex;
    var temp;
    var last;

    for (last = clonedArary.length - 1; last >= 0; last--) {
      temp = clonedArary[last];
      randomIndex = Math.floor(Math.random() * (last));
      clonedArary[last] = clonedArary[randomIndex];
      clonedArary[randomIndex] = temp;
      shuffled.push(clonedArary.pop());
    }
    return shuffled;

    // Simpler version using the native sort method :)
    // where shuffle can be seen as "randomly sorting"
    // return array.slice().sort(function() {return 0.5 - Math.random()});
  };


  /**
   * EXTRA CREDIT
   * =================
   *
   * Note: This is the end of the pre-course curriculum. Feel free to continue,
   * but nothing beyond here is required.
   */

  // Calls the method named by functionOrKey on each value in the list.
  // Note: You will need to learn a bit about .apply to complete this.
  _.invoke = function(collection, functionOrKey, args) {
    return _.map(collection, function(item){
      if (typeof(functionOrKey) === "function") {
        return functionOrKey.apply(item, args);
      } else {
        return item[functionOrKey].apply(item, args);
      }
    });
  };

  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the name
  // of that string. For example, _.sortBy(people, 'name') should sort
  // an array of people by their name.
  _.sortBy = function(collection, iterator) {
    return collection.sort(function(left, right){
      if (typeof(iterator) === 'string') {
        return (left[iterator] > right[iterator]) ? 1 : -1;
      } else {
        return (iterator(left) > iterator(right)) ? 1 : -1;
      }
    });
    // TODO: Investigate why omitting to return 0 still
    // pass the testes. Alternative solutions using map
    // to decorate the collection with a creteria to be used to sort
    // and then pluck back the decorated collection.
  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  //
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
  _.zip = function() {
    var output = [];
    for (var index = 0; index < arguments.length; index++) {
      output[index] = _.pluck(arguments, index);
    }
    return output;
  };

  // Takes a multidimensional array and converts it to a one-dimensional array.
  // The new array should contain all elements of the multidimensional array.
  //
  // Hint: Use Array.isArray to check if something is an array
  _.flatten = function(nestedArray, result) {
    var flat = [];

    (function deepFlatten(nestedArray) {
      for(var i = 0; i < nestedArray.length; i++) {
        if(Array.isArray(nestedArray[i])) {
          deepFlatten(nestedArray[i]);
        } else {
          flat.push(nestedArray[i]);
        }
      }
    })(nestedArray);
    return flat;
    // TODO: explore a second alternative that doesn't rely on a closure
    // but instead passes the result along each recursive call, as the function
    // signature in the excercise seems to hint towards...
  };

  // Takes an arbitrary number of arrays and produces an array that contains
  // every item shared between all the passed-in arrays.
  _.intersection = function() {
    var commons = [];
    var numArrays = arguments.length;
    var firstArray = arguments[0];
    for (var i = 0; i < firstArray.length; i++) {
      var item = firstArray[i];
      if (_.contains(commons, item)) {
        continue;
      }
      for (var j = 1; j < numArrays; j++) {
        if (!_.contains(arguments[j], item)) {
          break;
        }
      }
      if (j === numArrays) {
        commons.push(item);
      }
    }
    return commons;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var allTheRest = _.flatten(Array.prototype.slice.call(arguments, 1));
    return _.filter(array, function(value){
      return !_.contains(allTheRest, value);
    });
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.  See the Underbar readme for extra details
  // on this function.
  //
  // Note: This is difficult! It may take a while to implement.
  // Simple implementation without scheduling
  // _.throttle = function(func, wait) {
  //   var callable = true;
  //   var result;

  //   return function() {
  //     if (callable) {
  //       callable = false;
  //       result = func.apply(this, arguments);
  //       setTimeout(function(){
  //         callable = true;
  //       }, wait);
  //     }
  //     return result;
  //   };
  // };

  // Timer based implementation allowing for scheduling
  _.throttle = function(func, wait) {
    var lastTrigger;
    var timer;
    var results;

    return function () {
      // For Date.now() details: https://goo.gl/iYn3fA
      // For better compatibility use new Date().getTime();
      var now = Date.now();

      if (lastTrigger && now < lastTrigger + wait) {

        clearTimeout(timer);
        timer = setTimeout(function () {
          lastTrigger = now;
          results = func.apply(this, arguments);
        }, wait);

      } else {
        lastTrigger = now;
        results =func.apply(this, arguments);
      }
    };
  };
}());

