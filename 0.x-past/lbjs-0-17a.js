(function(){
	var iversion = "0.17a",
		iname = "lbjs",
		window = this,
		isSizzle = typeof Sizzle !== 'undefined',
		isQuery = typeof document.querySelectorAll !== 'undefined',
		con = typeof console !== 'undefined' ? console : {log: function(){return null;}};
	
	window.lbjs = function(selector){
		var obj = new lbjsObject(), type = typeof selector, i = 0, result;
		if((type == "string") && (isSizzle || isQuery)){
			if(!(selector.indexOf("<") > -1)){
				if(isSizzle)
				{
					Sizzle(selector,document,obj);
				}else{
					result = document.querySelectorAll(selector);
					for(i = 0; i < result.length; i++)
					{
						obj[i] = result[i];
					}
					obj.length = result.length;
				}
			}else{
				var temp = document.createElement("div");
				temp.innerHTML = selector;
				if(isSizzle)
				{
					Sizzle("*",temp,obj);
				}else{
					result = temp.querySelectorAll("*");
					for(i = 0; i < result.length; i++)
					{
						obj[i] = result[i];
					}
					obj.length = result.length;
				}
			}
		}else if((type == "object" && selector.length) || lbjs.array.isArray(selector)){
			for(i = 0; i < selector.length; i++)
			{
				obj[i] = selector[i];
			}
			obj.length = selector.length;
		}else if(type == "object"){
			obj[0] = selector;
			obj.length = 1;
		}else{
			obj.length = 0;
		}
		return obj;
	};
	
	L = lbjs = _L = _lbjs = window.lbjs;
	
	lbjsObject = function(selector){	
		this.length = 0;
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
	lbjsObject.fn = {
		appendCache:"",
		prependCache:"",
		push:		Array.prototype.push,
		splice:		Array.prototype.splice,
		jq:			function()
					{
						if($)
						{
							return $(this);
						}else if(jQuery){
							return jQuery(this);
						}
						return this;
					},
		addClass:	function(toAdd)
					{
						if(toAdd)
						{
							for(var i = 0; i < this.length; i++)
							{
								this[i].className += toAdd;
							}
						}
						return this;
					},
		append:		function(toAppend)
					{
						if(toAppend)
						{
							var type = typeof toAppend;
							if(type == "string")
							{
								this[0].insertAdjacentHTML("beforeend", toAppend);
							}else if(type == "function"){
								this[0].insertAdjacentHTML("beforeend", toAppend());
							}else{
								this[0].appendChild(toAppend);
							}
						}
						return this;
					},
		appendBuild:function(toAppend)
					{
						if(toAppend)
						{
							var type = typeof toAppend;
							if(type == "string")
							{
								this.appendCache += toAppend;
							}else if(type == "function"){
								this.appendCache += toAppend();
							}
						}
						return this;
					},
		appendAdd:	function()
					{
						this[0].insertAdjacentHTML("beforeend", this.appendCache);
						this.appendCache = "";
						return this;
					},
		at:			function(pos)
					{
						if(pos)
						{
							return new lbjsObject([this[pos]]);
						}
						return this;
					},
		click:		function(func)
					{
						if(func)
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
						}
						return this;
					},
		debug:		function()
					{
						for(var i = 0; i < this.length; i++)
						{
							con.log(this[i]);
						}
						return this;
					},
		event:		function(eventIn, func)
					{
						if(eventIn && func)
						{
							for(var i = 0; i < this.length; i++)
							{
								if(this[i].attachEvent)
								{
									this[i].attachEvent("on" + eventIn, func);
								}else if(this[i].addEventListener){
									this[i].addEventListener(eventIn, func);
								}
							}
						}
						return this;
					},
		find:		function(subselector)
					{
						if(subselector)
						{
							var ret = [], i = 0;
							if(isSizzle)
							{
								
								for(i = 0; i < this.length; i++)
								{
									Sizzle(subselector, this[i], ret);
								}
							}else if(isQuery){
								for(i = 0; i < this.length; i++)
								{
									var topush = this[i].querySelectorAll(subselector);
									for(var j = 0; j < topush.length; j++)
									{
										ret.push(topush[j]);
									}
								}
							}
							if(ret == []){return this;}
							return new lbjsObject(ret);
						}
						return this;
					},
		filter:		function(filter)
					{
						if(filter)
						{
							var ret = [], first = this[0];
							for(var i = 0; i < first.children.length; i++)
							{
								if(first.children[i].tagName.toLowerCase() == filter.toLowerCase())
								{
									ret.push(first.children[i]);
								}
							}
							return new lbjsObject(ret);
						}
						return this;
					},
		first:		function()
					{
						return new lbjsObject([this[0]]);
					},
		get:		function(pos)
					{
						if(pos)
						{
							return this[pos];
						}
						return this;
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
						if(newHeight)
						{
							for(var i = 0; i < this.length; i++)
							{
								this[i].style.height = newHeight + "px";
							}
							return this;
						}else{
							return this[0].style.height;
						}
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
						if(hoverFunc === undefined)
						{
							hoverFunc = function(){};
						}
						if(outFunc === undefined)
						{
							outFunc = function(){};
						}
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
						return new lbjsObject([this[this.length - 1]]);
					},
		loop: 		function(todo)
					{
						if(todo)
						{
							for(var i = 0; i < this.length; i++)
							{
								todo(i, new lbjsObject([this[i]]));
							}
						}
						return this;
					},
		noop:		function(){return this;},
		prepend:	function(toPrepend)
					{
						if(toPrepend)
						{
							var type = typeof toPrepend;
							if(type == "string")
							{
								this[0].insertAdjacentHTML("afterbegin", toPrepend);
							}else if(type == "function"){
								this[0].insertAdjacentHTML("afterbegin", toPrepend());
							}else{
								this[0].insertBefore(toPrepend, this[this.length - 1].firstChild);
							}
						}
						return this;
					},
		prependBuild:function(toPrepend)
					{
						if(toPrepend)
						{
							var type = typeof toPrepend;
							if(type == "string")
							{
								this.prependCache += toPrepend;
							}else if(type == "function"){
								this.prependCache += toPrepend();
							}
						}
						return this;
					},
		prependAdd:	function()
					{
						this[0].insertAdjacentHTML("afterbegin", this.prependCache);
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
		removeClass:function(toDel)
					{
						if(toDel)
						{
							for(var i = 0; i < this.length; i++)
							{
								var classes = this[i].getAttribute('class');
								classes = classes.replace(toDel,'').replace('  ','');
								this[i].setAttribute('class', classes);
							}
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
					},
		text:		function(newText)
					{
						if(newText)
						{
							if((this[0].textContent) && (typeof this[0].textContent != "undefined"))
							{
								this[0].textContent = newText;
							}else{
								this[0].innerText = newText;
							}
						}else{
							if((this[0].textContent) && (typeof this[0].textContent != "undefined"))
							{
								return this[0].textContent;
							}else{
								return this[0].innerText;
							}
						}
						return this;
					},
		toggle:		function()
					{
						for(var i = 0; i < this.length; i++)
						{
							var status = this[i].style.display;
							if(status == "none" || status === "")
							{
								this[i].style.display = "block";
							}else{
								this[i].style.display = "none";
							}
						}
						return this;
					}
	};
	lbjsObject.prototype = lbjsObject.fn;
	lbjsObject.prototype.eq = lbjsObject.prototype.at;
	lbjsObject.prototype.each = lbjsObject.prototype.loop;
	
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
		xwidth: 	function(radius, angle){return radius*Math.sin(lbjs.number.deg2rad(angle));},
		yheight: 	function(radius, angle){return radius*Math.sin(lbjs.number.deg2rad(90 - angle));},
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
						$ = jQuery = lbjs = L;
						$.fn = lbjsObject.fn;
						lbjsObject.prototype.extend = 	function(newFunctions)
														{
															for(var propt in newFunctions){
																eval("lbjsObject.fn." + propt + " = " + newFunctions[propt]);
															}
														};
					}
	};
}());