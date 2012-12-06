var structr = require("structr"),
_ = require("underscore"),
outcome = require("outcome"),
flow = require("./flow");

structr.mixin(require("structr-step"));

var Group = structr({

	/**
	 */

	"__construct": function(source) {
		this._source = source;
	},

	/**
	 */

	"step _call": function(each, args, next) {
		each(this._source, args, next);
		return this;
	}
});


var GroupFactory = structr({

	/**
	 */

	"__construct": function(clazz) {
		this._prototype = typeof clazz == "function" ? clazz.prototype : clazz;

		this._options = {
			flow: {}
		};

		this._setFlow();
	},


	/**
	 */

	"flow": function(config) {
		for(var prop in config) {
			var methods = config[prop];
			if(!(methods instanceof Array)) methods = [methods];

			for(var i = methods.length; i--;) {
				this._options.flow[methods[i]] = this._getFlow(prop, methods[i]);
			}
		}
		return this;
	},


	/**
	 */

	"create": function() {

		var proto = {},
		flow = this._options.flow,
		pre = this._options.pre,
		pos = this._options.pos;


		Object.keys(flow).forEach(function(key) {
			var each = flow[key];
			proto[key] = function() {
				return this._call(each, Array.prototype.slice.call(arguments, 0));
			}
		});


		return structr(Group, proto);
	},


	/**
	 */

	"_setFlow": function() {

		var flow = {};
		for(var key in this._prototype) {
			var prop = this._prototype[key];
			if(typeof prop == "function" && key.substr(0, 1) != "_") {
				flow[key] = this._getFlow(key);
			}
		}

		this._options.flow = flow;
	},


	/**
	 */

	"_getFlow": function(key, method) {
		return flow.decorate(key, method || key);
	}

});

module.exports = function(clazz) {
	return new GroupFactory(clazz);
}
