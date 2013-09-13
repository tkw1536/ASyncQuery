/*
 * ASyncQuery.js - JavaScript Library
 *
 *
 *			(c) Tom Wiesing <tkw01536@googlemail.com> 2011
 *
 *			ASyncQuery.js is free software.
 *			It comes without any warranty, to the extent permitted by applicable law.
 *			You may redistribute and/or modify it, provided you comply to the following conditions:
 *			(0) Any changes made to this file and/or its dependencies must be marked in such a way
 *			    that it is obvious that they are not by the original author.
 *			(1) The original author of the original file must be named.
 *			(2) Any redistribution and/or modification may not be commercial, meaning no
 *			    product using this file and/or its references may be included in a commercial
 *			    product or project.
 *
 *			(c) Tom Wiesing <tkw01536@googlemail.com> 2011
 *			Last changes: 03rd December 2011
 */
ASyncQuery = (function(a, b, c) {
	for(var d in b) {
		if(b.hasOwnProperty(d)) {
			a[d] = b[d];
		}
	}
	a.fn = c;
	return a;
})(function() {
	/* get object id here */
	var args = new Array();
	for(var i = 0; i < arguments.length; i++) {
		args.push(arguments[i]);
	}
	var RunNowOverload = ASyncQuery["static"].overloadRunNow(args);
	var LookUpOverload = ASyncQuery["static"].overloadLookUp(args);
	if(RunNowOverload !== false) {
		var nowOverloadItem = new ASyncQuery.Type.ASyncQueryItem();
		for(a in ASyncQuery.QueryItem.prototype) {
			if(ASyncQuery.QueryItem.prototype.hasOwnProperty(a)) {
				nowOverloadItem[a] = ASyncQuery.QueryItem.prototype[a];
			}
		}
		ASyncQuery.QueryItem.call(nowOverloadItem, RunNowOverload[1]);
		window.setTimeout(function() {
			nowOverloadItem.perform();
			if(!nowOverloadItem.isDead()) {
				window.setTimeout(arguments.callee, RunNowOverload[0]);
			}
		}, RunNowOverload[0]);

		return nowOverloadItem;
	} else if(LookUpOverload !== false) {
		return ASyncQuery["static"].queries[LookUpOverload];
	} else {
		var infector = (function(a, b) {
			for(c in b) {
				if(b.hasOwnProperty(c)) {
					a[c] = b[c];
				}
			}
			return a;
		});
		var obj = new ASyncQuery.Type.ASyncQuery();
		obj.data({
			id : -1,
			running : false,
			currentItem : 0,
			nextItemDelay : 0,
			hasToBeStopped : false,
			queryItems : [],
			eventItems : [],
			ranItemNames : [],
			itemParallelMode: 0,
		});
		obj.option(ASyncQuery["static"].Array2Hash(arguments, ASyncQuery.defArgMap, ASyncQuery.defaults));
		ASyncQuery["static"].queries.push(obj);
		obj.data("id", ASyncQuery["static"].indexOf(ASyncQuery["static"].queries, obj));

		if(obj.option("autoStart")) {
			obj.start();
		}
		return obj;
	}
}, {
	"Type" : {
		ASyncQuery : function() {
			this.data_ = {};
			//Data
			this.option_ = {};
			//Options
			for(var key in ASyncQuery.fn){
				if(ASyncQuery.fn.hasOwnProperty(key)){
					this[key] = ASyncQuery.fn[key];
				}
			}
		},
		ASyncQueryItem : function() {
			this.data_ = {};
			//Data
			this.option_ = {};
			//Options
			for(var key in ASyncQuery.QueryItem.fn){
				if(ASyncQuery.QueryItem.fn.hasOwnProperty(key)){
					this[key] = ASyncQuery.QueryItem.fn[key];
				}
			}
		},
	},
	"defArgMap" : {
		"string" : ["name"],
		"function" : ["onError", "onIdle"],
		"boolean" : ["autoStart", "paralell"],
		"number" : ["maxParallelItems", "defaultPriority", "defaultTimeout"],
		"array" : [],
		"object" : [],
	},
	"defaults" : {
		name : "",
		onError : function() {
		},
		onIdle : function() {
		},
		autoStart : true,
		defaultScope : window,
		defaultPriority : 0,
		parallel: false,
		maxParallelItems : Infinity,
		defaultPersistence : 0,
		defaultTimeout: 0,
	},
	"static" : {
		"indexOf" : function(arr, obj) {
			for(var i = 0; i < arr.length; i++) {
				if(arr[i] === obj) {
					return i;
				}
			}
			return -1;
		},
		"Array2Hash" : function(args, map, defArgs) {
			var ObjectMap = {};
			for(key in map) {
				if(map.hasOwnProperty(key)) {
					try {
						ObjectMap[key] = map[key].concat([]);
					} catch(e) {
						ObjectMap[key] = [];
					}
				}

			}
			var ags = {};
			for(var i = 0; i < args.length; i++) {
				if( typeof args[i] == "string" && ObjectMap.string.length != 0) {
					ags[ObjectMap.string.shift()] = args[i];
				} else if( typeof args[i] == "number" && ObjectMap.number.length != 0) {
					ags[ObjectMap.number.shift()] = args[i];
				} else if( typeof args[i] == "function" && ObjectMap["function"].length != 0) {
					ags[ObjectMap["function"].shift()] = args[i];
				} else if( typeof args[i] == "boolean" && ObjectMap["boolean"].length != 0) {
					ags[ObjectMap["boolean"].shift()] = args[i];
				} else if(ObjectMap["array"].length != 0 && (args[i] instanceof Array || (Object.prototype.toString.call(args[i]) === '[object Array]'))) {
					ags[ObjectMap["array"].shift()] = args[i];
				} else if(ObjectMap["object"].length != 0 && typeof args[i] == "object" && !((args[i] instanceof Array || (Object.prototype.toString.call(args[i]) === '[object Array]')))) {
					ags[ObjectMap["object"].shift()] = args[i];
				} else if( typeof args[i] == "object" && !((args[i] instanceof Array || (Object.prototype.toString.call(args[i]) === '[object Array]')))) {
					for(var key in args[i]) {
						if(args[i].hasOwnProperty(key)) {
							ags[key] = args[i][key];
						}
					}
				}
			}
			for(var key in ags) {
				if(ags.hasOwnProperty(key)) {
					if(!defArgs.hasOwnProperty(key)) {
						delete ags[key];
					}
				}
			}
			for(var key in defArgs) {
				if(defArgs.hasOwnProperty(key)) {
					if(!ags.hasOwnProperty(key)) {
						ags[key] = defArgs[key];
					}
				}
			}
			return ags;
		},
		"queries" : [],
		"trywarn" : function(warning) {
			if(console.warn) {
				console.warn(warning);
			}
		},
		"overloadRunNow" : function(ags) {
			if(ags.length > 0) {
				if( typeof ags[0] == "function") {
					var Time;
					var i = 1;
					if(ags.length > i) {
						if( typeof ags[i] == "number") {
							Time = ags[i];
							i++;
						} else {
							Time = 0;
						}
					} else {
						Time = 0;
					}
					Options = ASyncQuery["static"].Array2Hash([ags[0]].concat(ags.slice(i)), ASyncQuery.QueryItem.defArgMap, ASyncQuery.QueryItem.defaults);
					return [Time, Options];
				} else {
					return false;
				}
			} else {
				return false;
			}
		},
		"overloadLookUp" : function(args) {
			if(args.length > 0) {
				var nm = args[0];
			} else {
				var nm = "";
			}
			if( typeof nm == "string") {
				for(var i = 0; i < ASyncQuery["static"].queries.length; i++) {
					if(ASyncQuery["static"].queries[i].option("name") == nm) {
						return i;
					}
				}
				return false;
			} else {
				return false;
			}
		},
	}
}, {
	option : function(Name, Value) {
		if( typeof Value != "undefined") {
			this.option_[Name] = Value;
			return this;
		} else {
			if( typeof Name != "string") {
				for(key in Name) {
					if(Name.hasOwnProperty(key)) {
						this.option(key, Name[key]);
					}
				}
				return this;
			} else {
				return this.option_[Name];
			}
		}
	},
	data : function(Name, Value) {
		if( typeof Value != "undefined") {
			this.data_[Name] = Value;
			return this;
		} else {
			if( typeof Name != "string") {
				for(key in Name) {
					if(Name.hasOwnProperty(key)) {
						this.data(key, Name[key]);
					}
				}
				return this;
			} else {
				return this.data_[Name];
			}
		}
	},
	dataApply : function(Name, Value) {
		if( typeof Value != "undefined") {
			if( typeof Value == "function") {
				this.data(Name, Value.call(this, this.data_[Name]));
			}
			return this;
		} else {
			if( typeof Name != "string") {
				for(key in Name) {
					if(Name.hasOwnProperty(key)) {
						this.dataApply(key, Name[key]);
					}
				}
				return this;
			} else {
				return this.data(Name);
			}
		}
	},
	parallel: function (arg1){
		if(typeof arg1 == "number"){
			if(arg1 > 0){
				this.data("maxParallelItems", arg1);
				this.parallel(true);
			} else {
				this.parallel(true);
			}
		} else if(typeof arg1 == "boolean"){
			this.option("parallel", arg1);
		} else {
			this.option("parallel", true);
		}
		return this;
	},
	serial: function (arg1){
		if(typeof arg1 == "boolean"){
			this.option("parallel", !arg1);
		} else {
			this.option("parallel", false);
		}
		return this;
	},
	start : function() {
		this.data("hasToBeStopped", false);
		if(!this.data("running")) {
			this.data("running", true);
			this.nextIteration();
		}
		return this;
	},
	stop : function() {
		this.data("hasToBeStopped", true);
		return this;
	},
	pause : function(length) {
		this.dataApply("nextItemDelay", function(nextItemDelay) {
			return nextItemDelay + length;
		});
		return this;
	},
	reset : function() {
		this.data("ranItemNames", []);
		return this;
	},
	clear : function() {
		this.clearItems();
		this.clearEventHandlers();
		return this;
	},
	clearItems : function() {
		for(var i = 0; i < this.data("queryItems").length; i++) {
			this.dataApply("queryItems", function(qItems) {
				qItems[i].kill();
				return qItems;
			})
		}
		return this;
	},
	clearEventHandlers : function() {
		for(var i = 0; i < this.data("eventItems").length; i++) {
			this.dataApply("eventItems", function(evItems) {
				evItems[i].kill();
				return evItems;
			});
		}
		return this;
	},
	clearEventHandlersFor : function(EventName) {
		for(var i = 0; i < this.eventItems.length; i++) {
			if(this.data("eventItems")[i].option("handlesEvent") == EventName) {
				this.dataApply("eventItems", function(evItems) {
					evItems[i].kill();
					return evItems;
				});
			}
		}
		return this;
	},
	iterate : function() {	
		if(this.data("queryItems").length > this.data("currentItem")) {
			var currentItem = parseInt(this.data("currentItem").toString());
			if(this.option("parallel") === true){
				var self = this;
				window.setTimeout(function(){
					self.iterationCore(currentItem);
				}, 0);
			} else {
				this.iterationCore(currentItem);
			}
		}
		this.dataApply("currentItem", function(item){
			item = item+1;
			var mylength = this.data("queryItems").length;
			if(mylength!=0){
				item = item % mylength;
			} else {
				item = 0;
			}
			return item;
		});
		this.nextIteration();
		return this;
	},
	iterationCore : function(currentItem){
		//IMplement maxPrallel
		var itemExists = (typeof this.data("queryItems")[currentItem] != "undefined");
		if(itemExists){
				
			this.data("queryItems")[currentItem].data("lockedbyQuery", true);
			this.dataApply("itemParallelMode", function(a){a = a+1; return a;});
			try{
				this.dataApply("queryItems", function(qItem) {
					qItem[currentItem].perform(this);
					return qItem;
				});
			} catch(e){
				//onError Handler
				this.option("onError").call(this, e);
			}
			if(this.data("queryItems")[currentItem].isDead()){
				//remove Item
				this.dataApply("queryItems", function(qItem) {
					qItem.splice(currentItem, 1);
					return qItem;
				});
			} else {
				this.data("queryItems")[currentItem].data("lockedbyQuery", false);//remove Lock
			}
			this.dataApply("itemParallelMode", function(a){a = a-1; return a;});
		}
		return this;
	},
	nextIteration : function() {
		if(!(this.data("queryItems").length == 0 || this.data("hasToBeStopped"))) {
			var self = this;
			window.setTimeout(function(){
				try{
					self.iterate();
				} catch(e){
					ASyncQuery["static"].trywarn("Can't continue ASyncQuery with id " + self.data("id") + ": " + e.toString());
				}
			}, this.data("nextItemDelay"));
			this.data("nextItemDelay", 0);
		} else if(this.data("hasToBeStopped")) {
			this.data("hasToBeStopped", false);
			/* We've stopped now */
			this.data("running", false);
		} else {
			this.data("running", false);
		}
		if(this.data("queryItems").length == 0) {
			try {
				this.option("onIdle").call(this);
			} catch(e) {
				this.option("onError").call(this, e);
			}
		}
		return this;
	},
	add : function() {
		var obj = new ASyncQuery.Type.ASyncQueryItem();
		obj.init(this);
		if(arguments.length > 0) {
			if(arguments[0] instanceof ASyncQuery.Type.ASyncQueryItem) {
				obj.option(arguments[0].option_);
				//copy options
			}
		}
		ASyncQuery.QueryItem.apply(obj, arguments);
		if(obj.isEventHandler()) {
			this.dataApply("eventItems", function(evItems) {
				evItems.push(obj);
				return evItems;
			});
		} else {
			this.dataApply("queryItems", function(qItems) {
				qItems.push(obj);
				return qItems;
			});
			if(this.option("autoStart")) {
				this.start();
			}
		}
		return this;
	},
	query : function() {
		return this.add.apply(this, arguments);
		/* Alias */
	},
	findItemWithName : function(Name) {
		for(var i = 0; i < this.data("queryItems").length; i++) {
			if(this.data("queryItems")[i].option("name") == Name) {
				return this.data("queryItems")[i];
			}
		}
		return null;
	},
	findEventHandlerWithName : function(Name) {
		for(var i = 0; i < this.data("eventItems").length; i++) {
			if(this.data("eventItems")[i].option("name") == Name) {
				return this.data("eventItems")[i];
			}
		}
		return null;
	},
	chain : function() {
		for(var i = 0; i < arguments.length; i++) {
			if( typeof arguments[i] == "function") {
				arguments[i].call(this);
			}
		}
		return this;
	},
});

ASyncQuery.QueryItem = (function(a, b, c) {
	for(var d in b) {
		if(b.hasOwnProperty(d)) {
			a[d] = b[d];
		}
	}
	a.fn = c;
	return a;
})(function() {
	if(!this.data("hasDefaultOptions")) {
		this.option(ASyncQuery["static"].Array2Hash(arguments, ASyncQuery.QueryItem.defArgMap, ASyncQuery.QueryItem.defaults));
	} else {
		this.option(ASyncQuery["static"].Array2Hash(arguments, ASyncQuery.QueryItem.defArgMap, this.data("DefaultOptions")));
	}
	if(this.option("name") == "") {
		this.option("name", (function() {
			var rmem = function(s) {
				var e = Math.floor(Math.random() * s.length);
				return s.substring(e, e + 1);
			};
			var lmem = function(l) {
				var s = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz";
				var r = "";
				for(var i = 0; i < l; i++) {
					r += rmem(s);
				}
				return r;
			}
			return lmem(10) + "-" + lmem(10) + "-" + lmem(10) + "-" + lmem(10) + "-" + lmem(10) + "-" + lmem(10) + "-" + lmem(10) + "-" + lmem(10);
		})());
	}
	this.data({
		persistence : 0,
		onDeathHandlerCalled : false,
		killed : false,
		addTimePoint: (new Date()).getTime(),
	})
	return this;
}, {
	"defArgMap" : {
		"string" : ["name"],
		"function" : ["function", "onError", "onDeath"],
		"number" : ["persistence", "priority", "timeout"],
		"array" : ["arguments", "QueryItems"],
		"boolean" : [],
		"object" : [],
	},
	"defaults" : {
		name : "",
		"function" : function() {
		},
		persistence : 0,
		priority : 0,
		timeout: 0,
		Scope : window, /* Special */
		arguments : [],
		QueryItems : [],
		handlesEvent : "",
		onError : function(e) {
			throw (e);
		},
		onDeath : function() {
		},
	},
}, {
	init : function(Query) {
		this.data("hasDefaultOptions", true);
		this.data("DefaultOptions", ASyncQuery["static"].Array2Hash([{
			Scope : Query.option("defaultScope"),
			priority : Query.option("defaultPriority"),
			persistence : Query.option("defaultPersistence"),
			timeout: Query.option("defaultTimeout"),
		}], {
			"string" : [],
			"function" : [],
			"number" : [],
			"array" : [],
			"boolean" : [],
			"object" : [],
		}, ASyncQuery.QueryItem.defaults));
		return this;
	},
	option : function(Name, Value) {
		if( typeof Value != "undefined") {
			this.option_[Name] = Value;
			return this;
		} else {
			if( typeof Name != "string") {
				for(key in Name) {
					if(Name.hasOwnProperty(key)) {
						this.option(key, Name[key]);
					}
				}
				return this;
			} else {
				return this.option_[Name];
			}
		}
	},
	data : function(Name, Value) {
		if( typeof Value != "undefined") {
			this.data_[Name] = Value;
			return this;
		} else {
			if( typeof Name != "string") {
				for(key in Name) {
					if(Name.hasOwnProperty(key)) {
						this.data(key, Name[key]);
					}
				}
				return this;
			} else {
				return this.data_[Name];
			}
		}
	},
	dataApply : function(Name, Value) {
		if( typeof Value != "undefined") {
			if( typeof Value == "function") {
				this.data(Name, Value.call(this, this.data_[Name]));
			}
			return this;
		} else {
			if( typeof Name != "string") {
				for(key in Name) {
					if(Name.hasOwnProperty(key)) {
						this.dataApply(key, Name[key]);
					}
				}
				return this;
			} else {
				return this.data(Name);
			}
		}
	},
	run : function(useErrorHandler) {
		return this.runWith(this.option("arguments"), useErrorHandler);
	},
	runWith : function(args, useErrorHandler) {
		try {
			var rat = this.option("function").apply(this.option("Scope"), args);
			return rat;
		} catch(e) {
			/* onError Handler */
			if(useErrorHandler) {
				this.option("onError").call(this, e);
			} else {
				throw (e);
				/* No error handler */
			}
		}
	},
	perform : function(Query) {
		return this.performWith(this.option("arguments"), Query);
	},
	performWith : function(args, Query) {
		if(this.isDead() || this.canPerformWith(Query) == false) {
			return undefined;
		} else {
			this.dataApply("persistence", function(per) {
				return (per + 1);
			});
			if( typeof Query != "undefined") {
				var me = this;
				Query.dataApply("ranItemNames", function(ranItemNames) {
					ranItemNames.push(me.option("name"));
					return ranItemNames;
				});
			}
			var ret = this.runWith(args, true);
			if(!this.data("onDeathHandlerCalled") && this.isDead()) {
				try {
					this.data("onDeathHandlerCalled", true);
					this.option("onDeath").call(this);
				} catch(e) {
					this.option("onError").call(this, e);
				}
			}
			return ret;
		}
	},
	kill : function() {
		this.data("killed", true);
		if(!this.data("onDeathHandlerCalled")) {
			try {
				this.data("onDeathHandlerCalled", true);
				this.option("onDeath").call(this);
			} catch(e) {
				this.option("onError").call(this, e);
			}
		}
		return this;
	},
	isDead : function() {
		return (this.data("persistence") > this.option("persistence") || this.data("killed"));
	},
	canPerformWith : function(Query) {
		if( typeof Query != "undefined") {
			for(var i = 0; i < Query.data("queryItems").length; i++) {
				if(!Query.data("queryItems")[i].isDead()) {
					if(Query.data("queryItems")[i].option("priority") > this.option("priority")) {
						return false;
					}
				}
			}
			if((new Date()).getTime() - this.data("addTimePoint") < this.option("timeout")){
				return false;
			}
			for(var i = 0; i < this.option("QueryItems").length; i++) {
				var indexof = ASyncQuery["static"].indexOf(Query.data("ranItemNames"), this.option("QueryItems")[i]);
				if(indexof == -1) {
					return false;
				}
			}
			return true;
		} else {
			return true;
		}
	},
	isEventHandler : function() {
		return (this.option("handlesEvent") !== "");
	},
	chain : function() {
		for(var i = 0; i < arguments.length; i++) {
			if( typeof arguments[i] == "function") {
				arguments[i].call(this);
			}
		}
		return this;
	},
});
