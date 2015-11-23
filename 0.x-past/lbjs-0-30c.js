(function(){
	var iversion = "0.30c",
		iname = "lbjs",
		window = this,
		_cache = {	docGetElId : 	document.getElementById,
					docCreateEl : 	document.createElement,
					aPush : 		Array.prototype.push,
					getNewLObject : function(pass){return new LObject(pass);},
					tags : 			{div:true, body:true, table:true, tr:true, td:true, html:true,
									head:true, a:true, span:true, ul:true, li:true, ol:true, 
									p:true, h1:true, h2:true, h3:true, h4:true, h5:true, form:true, 
									input:true, select:true, textarea:true, b:true, i:true, u:true}};
	
	window.Grab = function(selector, scope, copyTo){
		var ret = [], temp, 
			nospace = selector.indexOf(" ") < 0, 
			nocss = selector.indexOf("[") < 0;
		scope = scope || document;
		if(nocss && nospace && scope.getElementById && (selector[0] === "#")){
			ret.push(_cache.docGetElId.call(scope, selector.slice(1)));
		}else if(nocss && nospace && scope.getElementsByClassName && (selector[0] === ".")){
			ret = scope.getElementsByClassName(selector.slice(1));
		}else if(nocss && nospace && scope.getElementsByTagName && (_cache.tags[selector])){
			ret = scope.getElementsByTagName(selector);
		}else if(nocss && _cache.docCreateEl && (selector[0] === "<")){
			temp = _cache.docCreateEl.call(document, "div");
			temp.innerHTML = selector;
			ret = temp.children;
		}else if(scope.querySelectorAll){
			ret = scope.querySelectorAll(selector);
		}
		if(copyTo){lbjs.array.copy(copyTo, ret);}
		return ret;
	};

	window.lbjs = function(selector, scope){
		var obj = _cache.getNewLObject();
		if(selector)
		{
			if(typeof selector === "string")
			{
				scope = scope || document;
				window.Grab(selector, scope, obj);
			}else if(selector.length){
				lbjs.array.copy(obj, selector);
			}else{
				obj[0] = selector;
				obj.length = 1;
			}
		}
		return obj;
	};
	
	window.L = window.l = function(selector, scope){
		return ["Using l or L is now deprecated, please use full lbjs instead"];
	};
	
	window.LObject = function(domArray){
		if(domArray){lbjs.array.copy(this, domArray);}
	};
	
	LObject.prototype = {
		appendCache:"",
		prependCache:"",
		length:		0,
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
								if(typeof toAdd === "function")
								{
									toAdd = toAdd.apply(this[i], [i, this[i].className]);
								}
								if(typeof toAdd === "string")
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
						return (pos ? _cache.getNewLObject([this[pos]]) : this);
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
								if(this[i].attachEvent){
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
						var i, j, ret = [], topush;
						
						if(subselector)
						{
							for(i = 0; i < this.length; i += 1)
							{
								topush = window.Grab(subselector, this[i]);
								for(j = 0; j < topush.length; j += 1)
								{
									ret.push(topush[j]);
								}
							}
							return ((ret.length === 0) ? this : _cache.getNewLObject(ret));
						}
						return this;
					},
		filter:		function(filter)
					{
						if(filter && (_cache.tags[filter]))
						{
							var ret = [], first = this[0], i, len;
							for(i = 0, len = first.children.length; i < len; i += 1)
							{
								if(first.children[i].tagName.toLowerCase() === filter.toLowerCase())
								{
									ret.push(first.children[i]);
								}
							}
							return _cache.getNewLObject(ret);
						}
						return this;
					},
		first:		function()
					{
						return _cache.getNewLObject([this[0]]);
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
						for(i = 0, len = this.length; i < len; i += 1)
						{
							if(typeof hoverFunc === "function")
							{
								if(this[i].onmouseover)
								{
									this[i].onmouseover = hoverFunc;
								}else{
									this.event("mouseover", hoverFunc);
								}
							}
							if(typeof outFunc === "function")
							{
								if(this[i].onmouseout)
								{
									this[i].onmouseout = outFunc;
								}else{
									this.event("mouseout", outFunc);
								}
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
								var temp = _cache.docCreateEl.call(doc, "div");
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
						return _cache.getNewLObject([this[this.length - 1]]);
					},
		loop: 		function(todo)
					{
						var i, len;
						if(typeof todo === "function")
						{
							for(i = 0, len = this.length; i < len; i += 1)
							{
								todo(i, _cache.getNewLObject([this[i]]));
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
							if(this[0].textContent)
							{
								this[0].textContent = newText;
							}
							this[0].innerText = newText;
						}else{
							if(this[0].textContent)
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
		val:		function(newVal){
						var i, len;
						if(newVal)
						{
							if(typeof newVal === "string")
							{
								for(i = 0, len = this.length; i < len; i += 1)
								{
									this[i].value = newVal;
								}
							}else if(lbjs.array.isArray(newVal)){
								for(i = 0, len = this.length; i < len; i += 1)
								{
									this[i].value = newVal[i];
								}
							}else if(typeof newVal === "function"){
								for(i = 0, len = this.length; i < len; i += 1)
								{
									this[i].value = newVal.apply(this[i], [i,this[i].value]);
								}
							}
							return this;
						}
						return this[0].value;
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
		copy:		function(outArray, inArray){
						var len, i = 0;
						if(inArray.constructor === Array)
						{
							_cache.aPush.apply(outArray, inArray);
						}else{
							for(len = inArray.length; i < len; i += 1)
							{
								outArray[i] = inArray[i];
							}
							outArray.length = inArray.length;
						}
					}
	};

	lbjs.text = {
		getRanChar:	function(possible){return possible.charAt(Math.floor(Math.random() * possible.length));},
		splitLines:	function(line){return line.split("\n");}
	};
	
	lbjs.xtra = {
		noop:		function(){return undefined;},
		isUndefined:function(varin){return varin === undefined;}
	};
	
	lbjs.ext = {
		_getHead:	function()
					{
						return document.getElementsByTagName ? document.getElementsByTagName('head')[0] : document.head;
					}(),
		include: 	function(name, ver, get)
					{
						var vercheck = function(nameIn){
								var plugin = window.lbjs[nameIn.split('.')[1]];
								if(plugin.pversion < ver){throw "Insufficient version of " + name;}
								if(plugin.main){plugin.main();}
								return true;
							},
							scr = _cache.docCreateEl.call(document, 'script');
						if(get !== false)
						{
							if(!window.lbjs[name.split('.')[1]] || get === true)
							{
								scr.type = 'text/javascript';
								scr.src = 'http://static.lukebridges.co.uk/lbjs/ext/' + name + '.js';
								scr.async = false;
								if(ver)
								{
									scr.onreadystatechange = scr.onload = function(){
										var state = scr.readyState;
										if(!vercheck.done && (!state || (state === "loaded" || state === "complete")))
										{
											vercheck.done = true;
											return vercheck(name);
										}
										return null;
									};
								}
								lbjs.ext._getHead.appendChild(scr);
							}
							return true;
						}
						if(ver){return vercheck(name);}
						return false;
					},
		includeList:function(deps, get)
					{	
						var i, len;
						for(i = 0, len = deps.length; i < len; i += 1)
						{	
							lbjs.ext.include(deps[i][0], deps[i][1], get);
						}
					},
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