(function(){
	var iversion = "0.28d",
		iname = "lbjs",
		window = this,
		isSizzle = typeof Sizzle !== 'undefined',
		tagList = ["div","body","table","tr","td","html","head","a","span","ul","li","ol","p","h1","h2","h3","h4","h5","form"];
	
	window.L = window.l = window.lbjs = function(selector){
		var obj = new LObject(), temp, nospace;
		if(selector && (typeof selector === "string") && (isSizzle || document.querySelectorAll))
		{
			nospace = (selector.indexOf(" ") === -1);
			if(nospace && (selector[0] === "#")){
				obj[0] = document.getElementById(selector.slice(1));
			}else if(nospace && (selector[0] === ".") && document.getElementsByClassName){
				lbjs.array.copy(obj, document.getElementsByClassName(selector.slice(1)));
			}else if(nospace && (tagList.indexOf(selector) > -1) && document.getElementsByTagName){
				lbjs.array.copy(obj, document.getElementsByTagName(selector));
			}else if((selector[0] === "<") && document.createElement){
				temp = document.createElement("div");
				temp.innerHTML = selector;
				lbjs.array.copy(obj, temp.children);
			}else{
				if(isSizzle){
					Sizzle(selector,document,obj);
				}else{
					lbjs.array.copy(obj, document.querySelectorAll(selector));
				}
			}
		}else if(selector && (typeof selector === "object")){
			if(selector.length || (selector.constructor === Array)){
				lbjs.array.copy(obj, selector);
			}else{
				obj[0] = selector;
			}
		}else{
			obj.length = 0;
		}
		return obj;
	};
	
	LObject = function(selector){	
		var i, len;
		this.length = 1;
		if(selector){lbjs.array.copy(this, selector);}
	};
	
	LObject.prototype = {
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
						toAdd = encodeURI(toAdd);
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
							var type = typeof toAppend, i, len;
							if(type === "string")
							{
								for(i = 0, len = this.length; i < len; i += 1)
								{
									if(this[i].insertAdjacentHTML)
									{
										this[i].insertAdjacentHTML("beforeend", toAppend);
									}else if(this[i].innerHTML){
										this[i].innerHTML += toAppend;
									}
								}
							}else if(type === "function"){
								for(i = 0, len = this.length; i < len; i += 1)
								{
									if(this[i].insertAdjacentHTML)
									{
										this[i].insertAdjacentHTML("beforeend", toAppend.apply(this[i]));
									}else if(this[i].innerHTML){
										this[i].innerHTML += toAppend.apply(this[i]);
									}
								}
							}else{
								for(i = 0, len = this.length; i < len; i += 1)
								{
									if(toAppend.length)
									{
										this[i].appendChild(toAppend[0]);
									}else{
										this[i].appendChild(toAppend);
									}
								}
							}
						}
						return this;
					},
		appendBuild:function(toAppend)
					{
						if(toAppend)
						{
							var type = typeof toAppend, i, len;
							if(type === "string")
							{
								for(i = 0, len = this.length; i < len; i += 1)
								{
									this.appendCache += toAppend;
								}
							}else if(type === "function"){
								for(i = 0, len = this.length; i < len; i += 1)
								{
									this.appendCache += toAppend.apply(this[i]);
								}
							}
						}
						return this;
					},
		appendAdd:	function()
					{
						var i, len;
						for(i = 0, len = this.length; i < len; i += 1)
						{
							this[i].insertAdjacentHTML("beforeend", this.appendCache);
						}
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
							}else if(document.querySelectorAll){
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
						var ret = [];
						lbjs.array.copy(ret, this);
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
							hoverFunc = function(){return null;};
						}
						if(outFunc === undefined)
						{
							outFunc = function(){return null;};
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
							var type = typeof toPrepend, i, len;
							if(type === "string")
							{
								for(i = 0, len = this.length; i < len; i += 1)
								{
									if(this[i].insertAdjacentHTML)
									{
										this[i].insertAdjacentHTML("afterbegin", toPrepend);
									}else{
										this[i].innerHTML = toPrepend + this[i].innerHTML;
									}
								}
							}else if(type === "function"){
								for(i = 0, len = this.length; i < len; i += 1)
								{
									if(this[i].insertAdjacentHTML)
									{
										this[i].insertAdjacentHTML("afterbegin", toPrepend.apply(this[i]));
									}else{
										this[i].innerHTML = toPrepend.apply(this[i]) + this[i].innerHTML;
									}
								}
							}else{
								for(i = 0, len = this.length; i < len; i += 1)
								{
									this[i].insertBefore(toPrepend, this[this.length - 1].firstChild);
								}
							}
						}
						return this;
					},
		prependBuild:function(toPrepend)
					{
						if(toPrepend)
						{
							var type = typeof toPrepend, i, len;
							if(type === "string")
							{
								for(i = 0, len = this.length; i < len; i += 1)
								{
									this[i].prependCache += toPrepend;
								}
							}else if(type === "function"){
								for(i = 0, len = this.length; i < len; i += 1)
								{
									this[i].prependCache += toPrepend.apply(this[i]);
								}
							}
						}
						return this;
					},
		prependAdd:	function()
					{
						var i, len;
						for(i = 0, len = this.length; i < len; i += 1)
						{
							this[i].insertAdjacentHTML("afterbegin", this.prependCache);
						}
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
								if(oldonload){oldonload();}
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
	LObject.prototype.eq = LObject.prototype.at;
	LObject.prototype.each = LObject.prototype.loop;
	
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
		isArray:	function(varIn){return varIn.constructor === Array;},
		copy:		function(obj, result){
						var len, i = 0;
						for(len = result.length; i < len; i += 1)
						{
							obj[i] = result[i];
						}
						obj.length = result.length;
					}
	};

	lbjs.text = {
		getRanChar:	function(possible){return possible.charAt(Math.floor(Math.random() * possible.length));},
		splitLines:	function(line){return line.split("\n");}
	};
	
	lbjs.xtra = {
		noop:		function(){return undefined;},
		isFunction:	function(varin){return typeof varin === "function";},
		isUndefined:function(varin){return varin === undefined;}
	};
	
	lbjs.jq = {
		reg:		function()
					{
						$ = jQuery = jquery = lbjs = L;
						$.fn = LObject.prototype;
						$.fn.extend = lbjs.ext.extend;
						L.isFunction = 	lbjs.xtra.isFunction;
						L.support = {opacity: document.createElement("div").style.opacity};
					}
	};
	
	lbjs.ext = {
		include: 	function(name, ver, get)
					{
						var vercheck = function(){
								var plugin = window.lbjs[name.split('.')[1]];
								if(plugin.pversion < ver){throw "";}
								try{plugin.main();}catch(ignore){}
								return true;
							},
							scr = document.createElement('script');
						if(get !== false)
						{
							if(!window.lbjs[name.split('.')[1]] || get === true)
							{
								scr.type = 'text/javascript';
								scr.src = 'http://static.lukebridges.co.uk/lbjs/ext/' + name + '.js';
								scr.async = false;
								scr.onreadystatechange = scr.onload = function(){
									var state = scr.readyState;
									if(!vercheck.done && (!state || (state === "loaded" || state === "complete")))
									{
										vercheck.done = true;
										return vercheck();
									}
									return null;
								};
								document.getElementsByTagName('head')[0].appendChild(scr);
							}
							return true;
						}
						return vercheck();
					},
		includeList:function(deps, get)
					{	
						var i = 0, len = deps.length;
						for(i; i < len; i += 1)
						{	
							lbjs.ext.require(deps[i][0], deps[i][1], get);
						}
					},
		require:	function(name, ver, get){lbjs.ext.include(name, ver, get);},
		requireList:function(deps, get){lbjs.ext.includeList(deps, get);},
		extend: 	function(newFunctions)
					{
						var propt;
						for(propt in newFunctions){
							if(newFunctions.hasOwnProperty(propt)){
								LObject.prototype[propt] = newFunctions[propt];
							}
						}
						return this;
					}
	};
}());