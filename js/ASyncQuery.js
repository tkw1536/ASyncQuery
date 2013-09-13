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
 *			Last changes: 24th December 2011
 */
ASyncQuery = (function(undefined, ASyncQuery_Debug_Mode_Enabled){
	var ASyncQuery_Global_DataStore = {
		QueryList: [],
	}; // Global Data Store
	var ASyncQuery_Global_Data = function(key, value){
		if(typeof value == "undefined"){
			if(typeof key == "string"){
				return ASyncQuery_Global_DataStore[key.toString()];
			} else {
				for(k in key){
					if(key.hasOwnProperty(k)){
						arguments.callee(k, key[k]);
					}
				}
			}
		} else if(typeof key == "string") {
			ASyncQuery_Global_DataStore[key] = value;
			return value;
		}
	};
	var ASyncQuery_Global_DataApply = function(key, value){
		if(typeof value == "undefined"){
			if(typeof key == "string"){
				return ASyncQuery_Global_DataStore[key.toString()];
			} else {
				for(k in key){
					if(key.hasOwnProperty(k)){
						arguments.callee(k, key[k]);
					}
				}
			}
		} else if(typeof value == "function") {
			ASyncQuery_Global_DataStore[key] = value.call(null, ASyncQuery_Global_DataStore[key]);
			return ASyncQuery_Global_Data[key];
		}
	};
try{
	if(ASyncQuery_Debug_Mode_Enabled === true && console.warn){
		var ASyncQuery_Global_warning = function(warning){
			console.warn(warning);
		};
	} else {
		throw("AllowedError_YOU_SHOULD_NOT_SEE_THIS");
	} 
} catch(e){
	var ASyncQuery_Global_warning = function(){};
}


var ASyncQuery_Global_indexOf = Array.prototype.indexOf?function(arr, obj){
	return arr.indexOf(obj);
}:function(arr, obj){
	for(var i = 0; i < arr.length; i++) {
		if(arr[i] === obj) {
			return i;
		}
	}
	return -1;
};

var ASyncQuery_Global_Array2Hash = function(args, map, defArgs) {
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
};

//Overloads for Global ASync Function

var ASyncQuery_Global_overloadRunNow = function(ags) {
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
			Options = ASyncQuery_Global_Array2Hash([ags[0]].concat(ags.slice(i)), ASyncQuery.QueryItem.defArgMap, ASyncQuery.QueryItem.defaults);
			return [Time, Options];
		}
	}
	return false;
};
	
var ASyncQuery_Global_overloadLookUp = function(args) {
	if(args.length > 0) {
		var nm = args[0];
	} else {
		var nm = "";
	}
	if( typeof nm == "string") {
		var Queries = ASyncQuery_Global_Data("QueryList");
		for(var i=0; i < Queries.length; i++) {
			if(Queries[i].option("name") == nm) {
				return i;
			}
		}
	}
	return false;
};

var ASyncQuery = (function(a, b, c) {
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
		var RunNowOverload = ASyncQuery_Global_overloadRunNow(args);
		var LookUpOverload = ASyncQuery_Global_overloadLookUp(args);
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
			return ASyncQuery_Global_Data("QueryList")[LookUpOverload];
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
				running : false,
				currentItem : 0,
				nextItemDelay : 0,
				hasToBeStopped : false,
				queryItems : [],
				eventItems : [],
				ranItemNames : [],
			});
			obj.option(ASyncQuery_Global_Array2Hash(arguments, ASyncQuery.defArgMap, ASyncQuery.defaults));
			ASyncQuery_Global_DataApply("QueryList", function(QueryList){
				QueryList.push(obj);
				return QueryList;
			});
			if(obj.option("autoStart")) {
				obj.start();
			}
			return obj;
		}
	}, {
		"Type" : {
			ASyncQuery : function() {
				this.data_ = {};
				this.option_ = {};
				for(var key in ASyncQuery.fn){
					if(ASyncQuery.fn.hasOwnProperty(key)){
						this[key] = ASyncQuery.fn[key];
					}
				}
			},
			ASyncQueryItem : function() {
				this.data_ = {};
				this.option_ = {};
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
			"boolean" : ["autoStart"],
			"number" : ["defaultPriority", "defaultTimeout"],
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
			defaultPersistence : 0,
			defaultTimeout: 0,
		},
	}, {
		option : function(Name, Value) {
			if( typeof Value != "undefined") {
				this.option_[Name] = Value;
				return this;
			} else if( typeof Name != "string") {
				for(key in Name) {
					if(Name.hasOwnProperty(key)) {
						this.option(key, Name[key]);
					}
				}
					return this;
			} else {
					return this.option_[Name];
			}
		},
		data : function(Name, Value) {
			if( typeof Value != "undefined") {
				this.data_[Name] = Value;
				return this;
			} else if( typeof Name != "string") {
				for(key in Name) {
					if(Name.hasOwnProperty(key)) {
						this.data(key, Name[key]);
					}
				}
				return this;
			} else {
				return this.data_[Name];
			}
		},
		dataApply : function(Name, Value) {
			if( typeof Value != "undefined") {
				if( typeof Value == "function") {
					this.data(Name, Value.call(this, this.data_[Name]));
				}
				return this;
			} else if( typeof Name != "string") {
				for(key in Name) {
					if(Name.hasOwnProperty(key)) {
						this.dataApply(key, Name[key]);
					}
				}
				return this;
			} else {
				return this.data(Name);
			}
		},
		start : function(permanent) {
			this.data("hasToBeStopped", false);
			if(!this.data("running")) {
				this.data("running", true);
				var self = this;
				window.setTimeout(function(){
					self.nextIteration();
				}, 10);
			}
			if(typeof permanent == "boolean" && permanent === true){
				this.data("autoStart", true);
			}
			return this;
		},
		stop : function(permanent) {
			this.data("hasToBeStopped", true);
			if(typeof permanent == "boolean" && permanent === true){
				this.data("autoStart", false);
			}
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
			this.dataApply("eventItems", function(evItems) {
				for(var i = 0; i < evItems.length; i++) {
					evItems.splice(i, 1);
					i--;
				}
				return evItems;
			});
			return this;
		},
		clearEventHandlersFor : function(EventName) {
			this.dataApply("eventItems", function(evItems){
				for(var i = 0; i < evItems.length; i++) {
					if(evItems[i].option("handlesEvent") == EventName) {
						evItems.splice(i, 1);
						i--;
					}
				}
				return evItems;
			});
			return this;
		},
		raise: function(Name, SubEvents, Args){
			if(typeof SubEvents != "boolean"){
				Args = SubEvents;
				SubEvents = true;
			}
			var Events = [];
			var AllEvents = this.data("eventItems");
			for(var i =0;i<AllEvents.length;i++){
				if(AllEvents[i].isDead()){
					AllEvents.splice(i, 1);
					i--;
					continue;
				}
				var EventsName = AllEvents[i].option("handlesEvent");
				if(EventsName == Name || (SubEvents && EventsName.substring(0, Name.length+1) == Name+".")){
					Events.push(AllEvents[i]);
				}
			}
			if(typeof Args == "undefined"){
				window.setTimeout(function(){
					for(var i=0;i<Events.length;i++){
						Events[i].run();
					}
				});
			} else {
				window.setTimeout(function(){
					for(var i=0;i<Events.length;i++){
						Events[i].runWith(Args);
					}
				});
			}
			
			return this;
		},
		fire: function(){
			return this.raise.apply(this, arguments);
		},
		on: function(EvName){
			ags = [{"handlesEvent": EvName}];
			for(var i=1;i<arguments.length;i++){
				ags.push(arguments[i]);
			}
			this.add.apply(this, ags);
			return this;
		},
		off: function(EvName, HandlerName){
			if(typeof HandlerName != "string"){
				this.clearEventHandlersFor(EvName);
			} else {
				this.dataApply("eventItems", function(evItems){
					for(var i=0;i<evItems.length;i++){
						var item = evItems[i];
						if(item.option("handlesEvent") == EvName && item.option("Name") == HandlerName){
							item.kill();
						}
					}
					return evItems;
				})
			}
		},
		iterate : function() {
			var currentItem = this.data("currentItem");
			if(this.data("queryItems").length > currentItem) {
				try{
					this.dataApply("queryItems", function(qItem) {
						qItem[currentItem].perform(this);
						return qItem;
					});
				} catch(e){
					this.option("onError").call(this, e);
				}
				if(this.data("queryItems")[currentItem].isDead()){
					this.dataApply("queryItems", function(qItem) {
						qItem.splice(currentItem, 1);
						return qItem;
					});
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
		nextIteration : function() {
			if(!(this.data("queryItems").length == 0 || this.data("hasToBeStopped"))) {
				var self = this;
				window.setTimeout(function(){
					try{
						self.iterate();
					} catch(e){
						ASyncQuery_Global_warning("Can't continue ASyncQuery <" + self.option("id") + ">:" + e.toString());
					}
				}, this.data("nextItemDelay"));
				this.data("nextItemDelay", 0);
			} else if(this.data("hasToBeStopped")) {
				this.data("hasToBeStopped", false);
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
				}
			}
			ASyncQuery.QueryItem.apply(obj, arguments);
			if(obj.isEventHandler()) {
				this.dataApply("eventItems", function(evItems) {
					evItems.push(obj);
					return evItems;
				});
				obj.option("persistence", Infinity);
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
			this.option(ASyncQuery_Global_Array2Hash(arguments, ASyncQuery.QueryItem.defArgMap, ASyncQuery.QueryItem.defaults));
		} else {
			this.option(ASyncQuery_Global_Array2Hash(arguments, ASyncQuery.QueryItem.defArgMap, this.data("DefaultOptions")));
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
			this.data("DefaultOptions", ASyncQuery_Global_Array2Hash([{
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
			} else if( typeof Name != "string") {
				for(key in Name) {
					if(Name.hasOwnProperty(key)) {
						this.option(key, Name[key]);
					}
				}
					return this;
			} else {
					return this.option_[Name];
			}
		},
		data : function(Name, Value) {
			if( typeof Value != "undefined") {
				this.data_[Name] = Value;
				return this;
			} else if( typeof Name != "string") {
				for(key in Name) {
					if(Name.hasOwnProperty(key)) {
						this.data(key, Name[key]);
					}
				}
				return this;
			} else {
				return this.data_[Name];
			}
		},
		dataApply : function(Name, Value) {
			if( typeof Value != "undefined") {
				if( typeof Value == "function") {
					this.data(Name, Value.call(this, this.data_[Name]));
				}
				return this;
			} else if( typeof Name != "string") {
				for(key in Name) {
					if(Name.hasOwnProperty(key)) {
						this.dataApply(key, Name[key]);
					}
				}
				return this;
			} else {
				return this.data(Name);
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
					var indexof = ASyncQuery_Global_indexOf(Query.data("ranItemNames"), this.option("QueryItems")[i]);
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
	if(ASyncQuery_Debug_Mode_Enabled){
		//Debug Mode enabled
		AS = function(){/* [Nice try. It's not that easy. ] DEBUG_MODE_ENABLED */ return ASyncQuery.apply(42, arguments);};
		AS.Debug = function(obj){
			switch(obj){
				case "reset":
					var list = ASyncQuery_Global_Data("QueryList");
					for(var i=0;i<list.length;i++){
						list[i].stop().clear();
					}
					ASyncQuery_Global_DataStore = {QueryList: [],};
					return null;
				case "Data": 
					return ASyncQuery_Global_Data;
					break;
				case "DataApply": 
					return ASyncQuery_Global_DataApply;
					break;
				default:
					return ASyncQuery_Global_DataStore;
					break;
			}
		};
		return AS;
	} else {
		return function(){/* [Nice try. It's not that easy. ] */ return ASyncQuery.apply(42, arguments);};
	}
})(undefined, (function(){
	try{
		var head = document.getElementsByTagName("head")[0].innerHTML;
		head = head.match(/<!--[^>]*-->/gi);
		for(var i=0;i<head.length;i++){
			try{
				var elem = head[i].split("~");
				for(var j=0;j<elem.length;j++){
					var comm = elem[j];
					if(comm.substring(0, "ASyncQuery.js: ".length) == "ASyncQuery.js: "){
						var setting = comm.substring("ASyncQuery.js: ".length);
						var a = setting.indexOf("=")
						if(a != -1){
							if(setting.substring(0, a) == "Debug" && setting.substring(a+1) == "True"){
								return true;
							}
						}
					}
				}
			} catch(f){}
			
		}
	}catch(e){}
	return false;
})());