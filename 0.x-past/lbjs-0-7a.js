(function(){
	var iversion = "0.7a",
		iname = "lbjs";

	var window = this,
	undefined, _lbjs = window.lbjs;
	undefined, _L = window.lbjs;
	
	var isSizzle = typeof(Sizzle) != "undefined";
   
	L = lbjs = window.lbjs = function(selector){
		if(isSizzle && lbjs.xtra.isType(selector,"string"))
		{
			return new lbjsObject(Sizzle(selector));
		}else if(lbjs.xtra.isType(selector,"string")){
			return new lbjsObject(document.createElement("div"));
		}else{
			return new lbjsObject(selector);
		}
	};
	
	lbjsObject = function(selector){
		var appendCache = "",
			prependCache = "";
			
		if(!lbjs.array.isArray(selector))
		{
			var oldselector = selector;
			selector = new Array();
			selector[0] = oldselector;
		}
		
		for(var i = 0; i < selector.length; i++)
		{
			this[i] = selector[i];
		}
		this.length = selector.length;
		var thislength = this.length;
			
		this.ready = function(func)
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
		};
		this.get = function(pos)
		{
			console.warn(".get is permanently deprecated in favour of using [pos] instead : [" + pos + "]");
			return this[pos];
		};
		this.at = function(pos)
		{
			return new lbjsObject(this[pos]);
		};
		this.append = function(toAppend)
		{
			if(lbjs.xtra.isType(toAppend, "string"))
			{
				this[0].innerHTML += toAppend;
			}else{
				this[0].appendChild(toAppend);
			}
			return this;
		};
		this.appendBuild = function(toAppend)
		{
			appendCache += toAppend;
			return this;
		};
		this.appendAdd = function()
		{
			this[0].innerHTML += appendCache;
			appendCache = "";
			return this;
		};
		this.prepend = function(toPrepend)
		{
			if(lbjs.xtra.isType(toPrepend, "string"))
			{
				this[0].innerHTML = toPrepend + this[0].innerHTML;
			}else{
				this[0].insertBefore(toPrepend, this[this.length - 1].firstChild);
			}
			return this;
		};
		this.prependBuild = function(toPrepend)
		{
			prependCache += toPrepend;
			return this;
		};
		this.prependAdd = function()
		{
			this[0].innerHTML = prependCache + this[0].innerHTML;
			prependCache = "";
			return this;
		};
		this.html = function(newHtml)
		{
			if(lbjs.xtra.isType(newHtml, "string"))
			{
				this[0].innerHTML = newHtml;
			}else{
				var temp = document.createElement("div");
				temp.appendChild(newHtml);
				this[0].innerHTML = temp.innerHTML;
			}
			return this;
		};
		this.hide = function()
		{	
			for(var i = 0; i < thislength; i++)
			{
				this[i].style.display = "none"
			}
			return this;
		};
		this.show = function()
		{
			for(var i = 0; i < thislength; i++)
			{
				this[i].style.display = "block"
			}
			return this;
		};
		this.event = function(event, func)
		{
			for(var i = 0; i < thislength; i++)
			{
				if(this[i].attachEvent)
				{
					this[i].attachEvent("on" + event, func);
				}else if(this[i].addEventListener){
					this[i].addEventListener(event, func);
				}
			}
			return this;
		};
		this.click = function(func)
		{
			for(var i = 0; i < thislength; i++)
			{
				if(this[i].onclick)
				{
					this[i].onclick = func;
				}else{
					this.event("click", func);
				}
			}
			return this;
		};
		this.hover = function(hoverFunc, outFunc)
		{
			for(var i = 0; i < thislength; i++)
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
		};
		this.loop = function(todo)
		{
			for(var i = 0; i < thislength; i++)
			{
				todo(i, lbjs(this[i]));
			}
		};
		this.debug = function()
		{
			if(console)
			{
				for(var i = 0; i < thislength; i++)
				{
					console.log(this[i]);
				}
			}
			return this;
		};
	};
	lbjsObject.prototype = [];
	lbjsObject.prototype.length = 0;
	
	lbjs.about = {
		tag:		function(){return iname + "/" + iversion},
		name: 		function(){return iname},
		version: 	function(){return iversion}
	};
	
	lbjs.array = {
		inArray:	function(arrayIn, check)
					{
						var len = arrayIn.length;
						for(var i = 0; i < len; i++)
						{
							if(arrayIn[i] == check){return i}
						}
						return -1;
					},
		isArray:	function(varIn){return varIn.constructor == Array;}
	};
	
	lbjs.circle = {
		xwidth: 	function(radius, angle){return radius*Math.sin(lbjs.number.deg2rad(angle))/lbjs.number.sin90()},
		yheight: 	function(radius, angle){return radius*Math.sin(lbjs.number.deg2rad(90 - angle))/lbjs.number.sin90()},
		points: 	function(radius, inx, iny, density)
					{
						var points = new Array();
						for(var i = 0, len = 360 / density; i < len; i++)
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
						}else{
							return "";
						}
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
		deg2rad:	function(degrees){return degrees*Math.PI/180},
		sin90:		function(){return Math.sin(lbjs.number.deg2rad(90))},
		binary:		function(number){return number.toString(2)},
		padBinary:	function(number, bits)
					{
						var raw = number.toString(2),	
							dif = bits - raw.length,
							cache = (new Array(dif + 1)).join("0");
						return cache + raw;
					}
	};
	
	lbjs.text = {
		getRanChar:	function(possible){return possible.charAt(Math.floor(Math.random() * possible.length))},
		splitLines:	function(line){return line.split("\n")}
	};
	
	lbjs.xtra = {
		noop:		function(){},
		isType:		function(varin, typein){return typeof(varin) == typein},
		isFunction:	function(varin){return typeof(varin) == "function"},
		isUndefined:function(varin){return typeof(varin) == "undefined"}
	};
})();