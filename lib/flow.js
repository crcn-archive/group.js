var structr = require("structr"),
outcome = require("outcome");

/**
 * how looping is handled. Sequentially? in Paralelly?
 */

var looping = {

	/**
	 * ONE at a time
	 */

	seq: function(source, each, cb) {

		var i = 0, n = source.length;

		function next(err) {
			if(err) return cb(err);
			if(i >= n) return cb();
			each(source[i++], next);
		}

		next();
	}
	,

	/**
	 * ALL at the same time
	 */

	par: function(source, each, cb) {
		var i = 0, n = source.length, nr = n;

		var errThrown = false;

		for(; i < n; i++) {
			each(source[i], function(err) {
				if(errThrown) return;
				if(err) {
					errThrown = true;
					return cb(err);
				}

				if(!(--nr)) {
					cb();
				}
			});
		}
	}
}


/**
 * how is the end callback handled? Is it called with *every* item? Is it called all at once?
 */

var callback = {
	map: function(loop, method) {
		return function(source, args, cb) {

			var map = [];

			loop(source, function(item, next) {
				try {
					/*var args2 = args.concat(),
					orgNext;

					if(args2[args2.length - 1] == "function") {
						orgNext = args2[args2.length - 1];
						args2[args2.length - 1] = function(result) {
							orgNext.call(null, null, result);
							map.push
						}
					}*/

					item[method].apply(item, args.concat(outcome.e(next).s(function(result) {
						// map.push(Array.prototype.slice.call(arguments, 0));
						map.push(result);
						next();
					})));	
				} catch(e) {
					return next(e);
				}
			}, outcome.e(cb).s(function() {
				cb(null, map);
			}));
		}
	},
	ret: function(loop, method) {
		return function(source, args, cb) {
			var map = [];

			loop(source, function(item, next) {
				try {
					map.push(item[method].apply(item, args));
					next();
				} catch(e) {
					next(e);
				}
			}, outcome.e(cb).s(function() {
				cb(null, map);
			}));
		}
	}
};

exports.loop = looping;


exports.decorate = function(properties, method) {

	var props = properties.split(" "),
	loop = looping[props.shift()] || looping.par,
	mapping = (callback[props.shift()] || callback.ret)(loop, method);

	return mapping;
}