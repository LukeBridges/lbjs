(function(){
	var iversion = "0.12a",
		iname = "lbjs",
		window = this,
		isSizzle = typeof Sizzle !== "undefined",
		isQuery = typeof document.querySelectorAll !== "undefined";
		
	window.lbjs = function(selector){
		var obj = new lbjsObject(), type = typeof selector;
		if((isSizzle || isQuery) && (type == "string")){
			if(!(selector.indexOf("<") > -1)){
				if(isQuery)
				{
					obj = new lbjsObject(document.querySelectorAll(selector));
				}else{
					Sizzle(selector,document,obj);
				}
			}else{
				var temp = document.createElement("div");
				temp.innerHTML = selector;
				if(isQuery)
				{
					obj = new lbjsObject(temp.querySelectorAll("*"));
				}else{
					Sizzle("*",temp,obj);
				}
			}
		}else if(selector.length || lbjs.array.isArray(selector)){
			obj = new lbjsObject(selector);
		}else if(type == "object"){
				obj[0] = selector;
				obj.length = 1;
		}else{
			obj[0] = document.createElement("div");
			obj.length = 1;
		}
		return obj;
	};
	
	L = lbjs = _L = _lbjs = window.lbjs;
	
	lbjsObject = function(selector){	
		if(selector)
		{
			for(var i = 0, len = selector.length; i < len; i++)
			{
				this[i] = selector[i];
			}
			this.length = selector.length;
		}
	};
	lbjsObject.prototype = [];
	lbjsObject.prototype.length = 0;
	lbjsObject.prototype.fn = {
		appendCache:"",
		prependCache:"",
		push:		Array.prototype.push,
		jq:			function()
					{
						if(($ !== undefined)||(jQuery !== undefined))
						{
							return $(this);
						}
						return this;
					},
		append:		function(toAppend)
					{
						var type = typeof toAppend;
						if(type == "string")
						{
							this[0].innerHTML += toAppend;
						}else if(type == "function"){
							this[0].innerHTML += toAppend();
						}else{
							this[0].appendChild(toAppend);
						}
						return this;
					},
		appendBuild:function(toAppend)
					{
						var type = typeof toAppend;
						if(type == "string")
						{
							this.appendCache += toAppend;
						}else if(type == "function"){
							this.appendCache += toAppend();
						}
						return this;
					},
		appendAdd:	function()
					{
						this[0].innerHTML += this.appendCache;
						this.appendCache = "";
						return this;
					},
		at:			function(pos)
					{
						return new lbjsObject([this[pos]]);
					},
		click:		function(func)
					{
						for(var i = 0; i < this.length; i++)
						{
							if(this[i].onclick)
							{
								this[i].onclick = func;
							}else{
								this.event("click", func);
							}
						}
						return this;
					},
		debug:		function()
					{
						if(console)
						{
							for(var i = 0; i < this.length; i++)
							{
								console.log(this[i]);
							}
						}
						return this;
					},
		event:		function(event, func)
					{
						for(var i = 0; i < this.length; i++)
						{
							if(this[i].attachEvent)
							{
								this[i].attachEvent("on" + event, func);
							}else if(this[i].addEventListener){
								this[i].addEventListener(event, func);
							}
						}
						return this;
					},
		find:		function(subselector)
					{
						var ret = [];
						if(isQuery)
						{
							for(var i = 0; i < this.length; i++)
							{
								var topush = this[i].querySelectorAll(subselector);
								for(var j = 0; j < topush.length; j++)
								{
									ret.push(topush[j]);
								}
							}
						}else if(isSizzle){
							
							for(var i = 0; i < this.length; i++)
							{
								Sizzle(subselector, this[i], ret);
							}
						}
						if(ret == []) return this;
						return new lbjsObject(ret);;
					},
		first:		function()
					{
						return new lbjsObject(this[0]);
					},
		get:		function(pos)
					{
						return this[pos];
					},
		getAll:		function()
					{
						var ret = [];
						for(var i = 0; i < this.length; i++)
						{
							ret.push(this[i]);
						}
						return ret;
					},
		height:		function(newHeight)
					{
						for(var i = 0; i < this.length; i++)
						{
							this[i].style.height = "" + newHeight + "px";
						}
						return this;
					},
		hide:		function()
					{	
						for(var i = 0; i < this.length; i++)
						{
							this[i].style.display = "none";
						}
						return this;
					},
		hover:		function(hoverFunc, outFunc)
					{
						for(var i = 0; i < this.length; i++)
						{
							if(this[i].onmouseover)
							{
								this[i].onmouseover = hoverFunc;
							}else{
								this.event("mouseover", hoverFunc);
							}
							if(this[i].onmouseout)
							{
								this[i].onmouseout = outFunc;
							}else{
								this.event("mouseout", outFunc);
							}
						}
						return this;
					},
		html:		function(newHtml)
					{
						if(newHtml)
						{
							if(typeof newHtml == "string")
							{
								this[0].innerHTML = newHtml;
							}else{
								var temp = document.createElement("div");
								temp.appendChild(newHtml);
								this[0].innerHTML = temp.innerHTML;
							}
						}else{
							return this[0].innerHTML;
						}
						return this;
					},
		last:		function()
					{
						return new lbjsObject(this[this.length - 1]);
					},
		loop: 		function(todo)
					{
						for(var i = 0; i < this.length; i++)
						{
							todo(i, new lbjsObject([this[i]]));
						}
						return this;
					},
		noop:		function(){return this;},
		prepend:	function(toPrepend)
					{
						var type = typeof toPrepend;
						if(type == "string")
						{
							this[0].innerHTML = toPrepend + this[0].innerHTML;
						}else if(type == "function"){
							this[0].innerHTML = toPrepend() + this[0].innerHTML;
						}else{
							this[0].insertBefore(toPrepend, this[this.length - 1].firstChild);
						}
						return this;
					},
		prependBuild:function(toPrepend)
					{
						var type = typeof toPrepend;
						if(type == "string")
						{
							this.prependCache += toPrepend;
						}else if(type == "function"){
							this.prependCache += toPrepend();
						}
						return this;
					},
		prependAdd:	function()
					{
						this[0].innerHTML = this.prependCache + this[0].innerHTML;
						this.prependCache = "";
						return this;
					},
		ready:		function(func)
					{
						var oldonload = window.onload;
						if(typeof window.onload !== "function")
						{
							window.onload = func;
						}else{
							window.onload = function()
							{
								if(oldonload)
								{
									oldonload();
								}
								func();
							};
						}
						return this;
					},
		show:		function()
					{
						for(var i = 0; i < this.length; i++)
						{
							this[i].style.display = "block";
						}
						return this;
					}
	};
	lbjsObject.prototype = lbjsObject.prototype.fn;
	
	lbjs.about = {
		tag:		function(){return iname + "/" + iversion;},
		name: 		function(){return iname;},
		version: 	function(){return iversion;}
	};
	
	lbjs.array = {
		inArray:	function(arrayIn, check)
					{
						var len = arrayIn.length;
						for(var i = 0; i < len; i++)
						{
							if(arrayIn[i] == check){return i;}
						}
						return -1;
					},
		isArray:	function(varIn){return varIn.constructor == Array;}
	};
	
	lbjs.circle = {
		xwidth: 	function(radius, angle){return radius*Math.sin(lbjs.number.deg2rad(angle))/lbjs.number.sin90();},
		yheight: 	function(radius, angle){return radius*Math.sin(lbjs.number.deg2rad(90 - angle))/lbjs.number.sin90();},
		points: 	function(radius, inx, iny, density)
					{
						var points = [],
							len = 360 / density;
						for(var i = 0; i < len; i++)
						{
							var angle = i * density;
							points[i] = {x:lbjs.circle.xwidth(radius, angle) + inx,y:lbjs.circle.yheight(radius, angle) + iny};
						}
						return points;
					}
	};
	
	lbjs.file = {
		read:		function(filepath)
					{
						if(XMLHttpRequest)
						{
							var xmlhttp = new XMLHttpRequest();
							xmlhttp.open("GET",filepath,false);
							xmlhttp.send(null);
							return xmlhttp.responseText;
						}
						return "";
					}
	};
	
	lbjs.number = {
		getRandom:	function(min, max){return Math.floor(Math.random() * (max - min + 1)) + min;},
		getAvg:		function(numsIn)
					{
						var total = 0,
							len = numsIn.length;
						for(var pointer = 0; pointer < len; pointer++)
						{
							total += numsIn[pointer];
						}
						return total / numsIn.length;
					},
		deg2rad:	function(degrees){return degrees*Math.PI/180;},
		sin90:		function(){return Math.sin(lbjs.number.deg2rad(90));},
		binary:		function(number){return number.toString(2);},
		padBinary:	function(number, bits)
					{
						var raw = number.toString(2),	
							dif = bits - raw.length,
							cache = new Array(dif + 1).join("0");
						return cache + raw;
					}
	};
	
	lbjs.text = {
		getRanChar:	function(possible){return possible.charAt(Math.floor(Math.random() * possible.length));},
		splitLines:	function(line){return line.split("\n");}
	};
	
	lbjs.xtra = {
		noop:		function(){},
		isType:		function(varin, typein){return typeof varin == typein;},
		isFunction:	function(varin){return typeof varin == "function";},
		isUndefined:function(varin){return varin === undefined;}
	};
	
	lbjs.jq = {
		reg:		function()
					{
						$ = jQuery = lbjs;
						$.fn = lbjsObject.prototype;
						lbjsObject.prototype.each = 	lbjsObject.prototype.loop;
						lbjsObject.prototype.text = 	lbjsObject.prototype.html;
						lbjsObject.prototype.filter = 	function(){return this;};
						lbjsObject.prototype.extend = 	function(newFunctions)
														{
															for(var propt in newFunctions){
																eval("lbjsObject.prototype." + propt + " = " + newFunctions[propt]);
															}
														};
					}
	};
}());
