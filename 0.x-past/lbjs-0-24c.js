(function(){
	var iversion = "0.24c",
		iname = "lbjs",
		window = this,
		isSizzle = typeof Sizzle !== 'undefined',
		isQuery = document.querySelectorAll !== undefined,
		con = ((typeof console !== 'undefined') ? console : {log: function(){return;}, time: function(){return;}, timeEnd: function(){return;}});
	
	if(typeof lbjsDefer === 'function'){lbjsDefer();}
	
	window.lbjs = function(selector){
		var obj = new LObject(), type = typeof selector, i = 0, result, len, t, temp, tempChildren, 
			tagList = ["div","body","table","tr","td","html","head","a","span","ul","li","ol"],
			isTag = function(tag){
				for(t = 0, len = tagList.length; t < len; t += 1)
				{
					if(tagList[t] === tag){return true;}
				}
				return false;
			};
		if((type === "string") && (isSizzle || isQuery)){
			if((selector[0] === "#") && (selector.indexOf(" ") === -1)){
				obj[0] = document.getElementById(selector.substr(1, selector.length));
				obj.length = 1;
			}else if((selector.charAt(0) === ".") && (selector.indexOf(" ") === -1) && document.getElementsByClassName){
				result = document.getElementsByClassName(selector.substr(1, selector.length));
				for(len = result.length; i < len; i += 1)
				{
					obj[i] = result[i];
				}
				obj.length = result.length;
			}else if(isTag(selector) && (selector.indexOf(" ") === -1) && document.getElementsByTagName){
				result = document.getElementsByTagName(selector);
				for(len = result.length; i < len; i += 1)
				{
					obj[i] = result[i];
				}
				obj.length = result.length;
			}else if((selector[0] === "<") && document.createElement){
				temp = document.createElement("div");
				temp.innerHTML = selector;
				tempChildren = temp.children;
				for(len = tempChildren.length; i < len; i += 1)
				{
					obj[i] = tempChildren[i];
				}
				obj.length = tempChildren.length;
			}else{
				if(isSizzle)
				{
					Sizzle(selector,document,obj);
				}else{
					result = document.querySelectorAll(selector);
					for(len = result.length; i < len; i += 1)
					{
						obj[i] = result[i];
					}
					obj.length = result.length;
				}
			}
		}else if(type === "object"){
			if(selector.length || (selector.constructor === Array))
			{
				for(len = selector.length; i < len; i += 1)
				{
					obj[i] = selector[i];
				}
				obj.length = selector.length;
			}else{
				obj[0] = selector;
				obj.length = 1;
			}
		}else{
			obj.length = 0;
		}
		return obj;
	};
	
	L = l = lbjs = window.lbjs;
	
	LObject = function(selector){	
		var i, len;
		this.length = 0;
		if(selector)
		{
			for(i = 0, len = selector.length; i < len; i += 1)
			{
				this[i] = selector[i];
			}
			this.length = selector.length;
		}
	};
	LObject.prototype.length = 0;
	LObject.fn = LObject.prototype = {
		appendCache:"",
		prependCache:"",
		push:		Array.prototype.push,
		splice:		Array.prototype.splice,
		jq:			function()
					{
						if(jQuery){
							return jQuery(this);
						}
						if($){
							return $(this);
						}
						return this;
					},
		addClass:	function(toAdd)
					{
						var i, len;
						if(toAdd)
						{
							for(i = 0, len = this.length; i < len; i += 1)
							{
								if(this[i].className.indexOf(toAdd) < 0)
								{
									if(this[i].classList)
									{
										this[i].classList.add(toAdd);
									}else{
										this[i].className += toAdd;
									}
								}
							}
						}
						return this;
					},
		append:		function(toAppend)
					{
						if(toAppend)
						{
							var type = typeof toAppend;
							if(type === "string")
							{
								try
								{
									this[0].insertAdjacentHTML("beforeend", toAppend);
								}catch(err){
									try
									{
										this[0].innerHTML += toAppend;
									}catch(ignore){}
								}
							}else if(type === "function"){
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
							if(type === "string")
							{
								this.appendCache += toAppend;
							}else if(type === "function"){
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
						return (pos ? new LObject([this[pos]]) : this);
					},
		click:		function(func)
					{
						var i, len;
						if(func)
						{
							for(i = 0, len = this.length; i < len; i += 1)
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
						var i, len;
						for(i = 0, len = this.length; i < len; i += 1)
						{
							con.log(this[i]);
						}
						return this;
					},
		event:		function(eventIn, func)
					{
						var i, len;
						if(eventIn && func)
						{
							for(i = 0, len = this.length; i < len; i += 1)
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
						var i, j, len, ret, topush;
						if(subselector)
						{
							ret = [];
							if(isSizzle)
							{	
								for(i = 0, len = this.length; i < len; i += 1)
								{
									Sizzle(subselector, this[i], ret);
								}
							}else if(isQuery){
								for(i = 0, len = this.length; i < len; i += 1)
								{
									topush = this[i].querySelectorAll(subselector);
									for(j = 0; j < topush.length; j += 1)
									{
										ret.push(topush[j]);
									}
								}
							}
							return ((ret.length === 0) ? this : new LObject(ret));
						}
						return this;
					},
		filter:		function(filter)
					{
						if(filter)
						{
							var ret = [], first = this[0], i, len;
							for(i = 0, len = first.children.length; i < len; i += 1)
							{
								if(first.children[i].tagName.toLowerCase() === filter.toLowerCase())
								{
									ret.push(first.children[i]);
								}
							}
							return new LObject(ret);
						}
						return this;
					},
		first:		function()
					{
						return new LObject([this[0]]);
					},
		get:		function(pos)
					{
						return (pos ? this[pos] : this);
					},	
		getAll:		function()
					{
						var ret = [], i, len;
						for(i = 0, len = this.length; i < len; i += 1)
						{
							ret.push(this[i]);
						}
						return ret;
					},
		height:		function(newHeight)
					{
						var i, len;
						if(newHeight)
						{
							if((typeof newHeight === "string") && newHeight.indexOf("px") > -1)
							{
								for(i = 0, len = this.length; i < len; i += 1)
								{	
									this[i].style.height = newHeight;
								}
							}else{
								for(i = 0, len = this.length; i < len; i += 1)
								{	
									this[i].style.height = newHeight + "px";
								}
							}
							return this;
						}
						return this[0].style.height;
					},
		hide:		function()
					{	
						var i, len;
						for(i = 0, len = this.length; i < len; i += 1)
						{
							if(this[i].style.visibility)
							{
								this[i].style.visibility = "hidden";
							}else{
								this[i].style.display = "none";
							}
						}
						return this;
					},
		hover:		function(hoverFunc, outFunc)
					{
						var i, len;
						if(hoverFunc === undefined)
						{
							hoverFunc = function(){return;};
						}
						if(outFunc === undefined)
						{
							outFunc = function(){return;};
						}
						for(i = 0, len = this.length; i < len; i += 1)
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
							if(typeof newHtml === "string")
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
						return new LObject([this[this.length - 1]]);
					},
		loop: 		function(todo)
					{
						var i, len;
						if(typeof todo === "function")
						{
							for(i = 0, len = this.length; i < len; i += 1)
							{
								todo(i, new LObject([this[i]]));
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
							if(type === "string")
							{
								this[0].insertAdjacentHTML("afterbegin", toPrepend);
							}else if(type === "function"){
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
							if(type === "string")
							{
								this.prependCache += toPrepend;
							}else if(type === "function"){
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
						var i, len, classes;
						if(toDel)
						{
							for(i = 0, len = this.length; i < len; i += 1)
							{
								classes = this[i].getAttribute('class');
								if(classes.indexOf(toDel) > -1)
								{
									if(this[i].classList)
									{
										this[i].classList.remove(toDel);
									}else{
										classes = classes.replace(toDel,'').replace('  ','');
										this[i].setAttribute('class', classes);
									}
								}
							}
						}
						return this;
					},
		show:		function()
					{
						var i, len;
						for(i = 0, len = this.length; i < len; i += 1)
						{
							if(this[i].style.visibility)
							{
								this[i].style.visibility = "display";
							}else{
								this[i].style.display = "block";
							}
						}
						return this;
					},
		text:		function(newText)
					{
						if(newText)
						{
							if((this[0].textContent) && (this[0].textContent !== undefined))
							{
								this[0].textContent = newText;
							}
							this[0].innerText = newText;
						}else{
							if((this[0].textContent) && (this[0].textContent !== undefined))
							{
								return this[0].textContent;
							}
							return this[0].innerText;
						}
						return this;
					},
		toggle:		function()
					{
						var i, len;
						for(i = 0, len = this.length; i < len; i += 1)
						{
							if(this[i].style.display === "none" || this[i].style.display === "")
							{
								this[i].style.display = "block";
							}else{
								this[i].style.display = "none";
							}
						}
						return this;
					},
		width:		function(newWidth)
					{
						var i, len;
						if(newWidth)
						{
							if((typeof newWidth === "string") && newWidth.indexOf("px") > -1)
							{
								for(i = 0, len = this.length; i < len; i += 1)
								{	
									this[i].style.width = newWidth;
								}
							}else{
								for(i = 0, len = this.length; i < len; i += 1)
								{	
									this[i].style.width = newWidth + "px";
								}
							}
							return this;
						}
						return this[0].style.width;
					}
	};
	LObject.fn.eq = LObject.fn.at;
	LObject.fn.each = LObject.fn.loop;
	
	lbjs.about = {
		tag:		function(){return iname + "/" + iversion;},
		name: 		function(){return iname;},
		version: 	function(){return iversion;}
	};
	
	lbjs.array = {
		inArray:	function(arrayIn, check)
					{
						var len = arrayIn.length, i;
						for(i = 0; i < len; i += 1)
						{
							if(arrayIn[i] === check){return i;}
						}
						return -1;
					},
		isArray:	function(varIn){return varIn.constructor === Array;}
	};
	
	lbjs.circle = {
		xwidth: 	function(radius, angle){return radius*Math.sin(lbjs.number.deg2rad(angle));},
		yheight: 	function(radius, angle){return radius*Math.sin(lbjs.number.deg2rad(90 - angle));},
		points: 	function(radius, inx, iny, density)
					{
						var points = [], len = 360 / density, i, angle;
						for(i = 0; i < len; i += 1)
						{
							angle = i * density;
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
						var total = 0, len = numsIn.length, pointer;
						for(pointer = 0; pointer < len; pointer += 1)
						{
							total += numsIn[pointer];
						}
						return total / numsIn.length;
					},
		deg2rad:	function(degrees){return degrees*Math.PI/180;},
		binary:		function(number){return number.toString(2);},
		padBinary:	function(number, bits)
					{
						var raw = number.toString(2), dif = bits - raw.length, cache = new Array(dif + 1).join("0");
						return cache + raw;
					}
	};
	
	lbjs.text = {
		getRanChar:	function(possible){return possible.charAt(Math.floor(Math.random() * possible.length));},
		splitLines:	function(line){return line.split("\n");}
	};
	
	lbjs.xtra = {
		noop:		function(){return undefined;},
		isType:		function(varin, typein)
					{
						var type = typeof varin;
						return (type === typein) ? true : false;
					},
		isFunction:	function(varin){return typeof varin === "function";},
		isUndefined:function(varin){return varin === undefined;}
	};
	
	lbjs.jq = {
		reg:		function()
					{
						$ = jQuery = jquery = lbjs = L;
						$.fn = LObject.fn;
						LObject.fn.extend = 	function(newFunctions)
														{
															var propt;
															for(propt in newFunctions){
																if(newFunctions.hasOwnProperty(propt)){
																	LObject.fn[propt] = newFunctions[propt];
																}
															}
														};
					}
	};
	
	lbjs.ext = {
		require: 	function(name, ver)
					{
						ver = parseFloat(ver);
						var extVer = parseFloat(eval(name + ".pversion"));
						if(extVer < ver)
						{
							throw "";
						}
						return true;
					}
	};
}());