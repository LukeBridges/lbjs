(function(){
	var iversion = "0.10b",
		iname = "lbjs",
		window = this,
		isSizzle = typeof Sizzle !== "undefined";
		
	window.lbjs = function(selector){
		var obj = new lbjsObject(), type = typeof selector;
		if(type == "object")
		{
			obj[0] = selector;
			obj.length = 1;
		}else if(type == "string"){
			var isHtml = selector.indexOf("<") > -1;
			if(!isHtml && isSizzle){
				Sizzle(selector,document,obj);
			}else if(isHtml && isSizzle){
				var temp = document.createElement("div");
				temp.innerHTML = selector;
				Sizzle("*",temp,obj);
			}else{
				obj[0] = document.createElement("div");
				obj.length = 1;
			}
		}else if(lbjs.array.isArray(selector)){
			obj = new lbjsObject(selector);
		}else{
			obj[0] = document.createElement("div");
			obj.length = 1;
		}
		return obj;
	};
	L = lbjs = window.lbjs;
	_L = _lbjs = window.lbjs;
	
	lbjsObject = function(selector){	
		if(selector)
		{
			for(var i = 0; i < selector.length; i++)
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
		append:		function(toAppend)
					{
						if(typeof toAppend == "string")
						{
							this[0].innerHTML += toAppend;
						}else{
							this[0].appendChild(toAppend);
						}
						return this;
					},
		appendBuild:function(toAppend)
					{
						this.appendCache += toAppend;
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
						if(isSizzle)
						{
							var ret = [];
							for(var i = 0; i < this.length; i++)
							{
								Sizzle(subselector, this[i], ret);
							}
							return new lbjsObject(ret);
						}
						return this;
					},
		first:		function()
					{
						return new lbjsObject(this[0]);
					},
		get:		function(pos)
					{
						return this[pos];
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
		noop:		function(){},
		prepend:	function(toPrepend)
					{
						if(typeof toPrepend == "string")
						{
							this[0].innerHTML = toPrepend + this[0].innerHTML;
						}else{
							this[0].insertBefore(toPrepend, this[this.length - 1].firstChild);
						}
						return this;
					},
		prependBuild:function(toPrepend)
					{
						this.prependCache += toPrepend;
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
						if(lbjs.xtra.isFunction(window.onload))
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
}());