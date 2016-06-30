lbjs.jq = {
	pversion:	0.2,
	main:		function()
				{
					lbjs.ext.include("lbjs.ext");
					lbjs.ext.include("lbjs.xtra");
				},
	reg:		function()
				{
					$ = jQuery = jquery = lbjs;
					$.fn = LObject.prototype;
					$.fn.extend = lbjs.ext.extend;
					lbjs.extend = function(){
						for(var i = 1; i < arguments.length; i++){
							for(var key in arguments[i]){
								if(arguments[i].hasOwnProperty(key)){
									arguments[0][key] = arguments[i][key];
								}
							}
						}
						return arguments[0];
					};
					LObject.prototype.trigger = function(event){
						this[0][event]();
					};
					LObject.prototype.on = function(event, doWhat){
						this[0][event] = doWhat;
					};
					LObject.prototype.bind = function(event, doWhat){
						this.on("on" + event, doWhat);
					};
					LObject.prototype.not = function(selector){
						if(selector)
						{
							var ret = this, toRemove = window.Grab(selector, this);
							return new LObject(ret);
						}
						return this;
					};
					LObject.prototype.is = function(selector){
						var i, len;
						selector = lbjs(selector);
						for(i = 0, len = this.length; i < len; i += 1)
						{
							if(this[i] == selector[0])
							{
								return true;
							}
						}
						return false;
					};
					LObject.prototype.parent = function(){
						return lbjs(this.parentNode);
					};
					lbjs.isFunction = function(toTest){return typeof toTest === "function";};
					lbjs.support = {opacity: document.createElement("div").style.opacity};
					lbjs.event = function(eventIn, data){
						return new CustomEvent(eventIn, data);
					};
					lbjs.data = function(elemIn, keyIn, valIn){
						if(!valIn)
						{
							var ret;
							try{
								ret = lbjs(elemIn).attr("data-" + keyIn);
							}catch(err){
								ret = "";
							}
							return ret;
						}else{
							try{
								lbjs(elemIn).attr("data-" + keyIn, valIn);
							}catch(err){}
						}
					};
				}
};
lbjs.jq.reg();