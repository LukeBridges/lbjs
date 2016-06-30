(function(){
	let iversion = "1.00a",
		iname = "lbjs",
		window = this,
		tags = 	{div:true, body:true, table:true, tr:true, td:true, html:true,
				head:true, a:true, span:true, ul:true, li:true, ol:true, 
				p:true, h1:true, h2:true, h3:true, h4:true, h5:true, form:true, 
				input:true, select:true, textarea:true, b:true, i:true, u:true,
				dl:true, dt:true, dd:true, blockquote:true, tt:true, em:true,
				strong:true, body: true};
	
	window.Grab = function(selector, scope = document, copyTo){
		let ret = []; 
		const nospace = selector.indexOf(" ") < 0, nocss = selector.indexOf("[") < 0;
		if(nocss && nospace && scope.getElementById && (selector[0] === "#")){
			ret.push(scope.getElementById(selector.slice(1)));
		}else if(nocss && nospace && scope.getElementsByClassName && (selector[0] === ".")){
			ret = scope.getElementsByClassName(selector.slice(1));
		}else if(nocss && nospace && scope.getElementsByTagName && tags[selector]){
			ret = scope.getElementsByTagName(selector);
		}else if(nocss && document.createElement && (selector[0] === "<")){
			let temp = document.createElement("div");
			temp.innerHTML = selector;
			ret = temp.children;
		}else if(scope.querySelectorAll){
			ret = scope.querySelectorAll(selector);
		}
		if(copyTo){lbjs.array.copy(copyTo, ret);}
		return ret;
	};

	window.l = window.lbjs = function(selector, scope){
		let obj = new LObject();
		if(selector)
		{
			if(typeof selector === "string")
			{
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
	
	class LObject {
		constructor(domArray){
			this.length = 0;
			if(domArray){lbjs.array.copy(this, domArray)};
		}
		add(toAdd)
		{
			let toAdd2 = lbjs(toAdd), startlen = this.length;
			for(let i = 0, len = toAdd2.length; i < len; i += 1)
			{
				this[startlen + i] = toAdd2[i];
			}
			return this;
		}
		addClass(toAdd)
		{
			if(toAdd)
			{
				toAdd = encodeURI(toAdd);
				for(let i = 0, len = this.length; i < len; i += 1)
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
		}
		append(toAppend)
		{
			if(toAppend)
			{
				let type = typeof toAppend;
				if(type === "string")
				{
					for(let i = 0, len = this.length; i < len; i += 1)
					{
						if(this[i].insertAdjacentHTML)
						{
							this[i].insertAdjacentHTML("beforeend", toAppend);
						}else if(this[i].innerHTML){
							this[i].innerHTML += toAppend;
						}
					}
				}else if(type === "function"){
					for(let i = 0, len = this.length; i < len; i += 1)
					{
						if(this[i].insertAdjacentHTML)
						{
							this[i].insertAdjacentHTML("beforeend", toAppend.apply(this[i]));
						}else if(this[i].innerHTML){
							this[i].innerHTML += toAppend.apply(this[i]);
						}
					}
				}else{
					for(let i = 0, len = this.length; i < len; i += 1)
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
		}
		appendBuild(toAppend)
		{
			if(toAppend)
			{
				let type = typeof toAppend;
				if(type === "string")
				{
					for(let i = 0, len = this.length; i < len; i += 1)
					{
						this.appendCache += toAppend;
					}
				}else if(type === "function"){
					for(let i = 0, len = this.length; i < len; i += 1)
					{
						this.appendCache += toAppend.apply(this[i]);
					}
				}
			}
			return this;
		}
		appendAdd()
		{
			for(let i = 0, len = this.length; i < len; i += 1)
			{
				this[i].insertAdjacentHTML("beforeend", this.appendCache);
			}
			this.appendCache = "";
			return this;
		}
		at(pos)
		{
			return pos ? new LObject([this[pos]]) : this;
		}
		attr(attrIn, val)
		{
			for(let i = 0, len = this.length; i < len; i += 1)
			{
				if(val)
				{
					this[i].setAttribute(attrIn, val);
				}else{
					if(typeof attrIn == "object")
					{
						for(let key in attrIn)
						{
							if(typeof attrIn[key] !== "function")
							{
								this[i].setAttribute(key, attrIn[key]);
							}
						}
					}else{
						return this[i].getAttribute(attrIn);
					}
				}
			}
			return this;
		}
		click(func)
		{
			if(func)
			{
				for(let i = 0, len = this.length; i < len; i += 1)
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
		}
		data(keyIn, val)
		{
			if(typeof keyIn == "string")
			{
				if(val)
				{
					for(let i = 0, len = this.length; i < len; i += 1)
					{
						this[i].setAttribute("data-" + keyIn, val);
					}
				}else{
					return this[0].getAttribute("data-" + keyIn);
				}
			}
			return this;
		}
		event(eventIn, func)
		{
			if(eventIn && func)
			{
				for(let i = 0, len = this.length; i < len; i += 1)
				{
					if(this[i].attachEvent){
						this[i].attachEvent("on" + eventIn, func);
					}else if(this[i].addEventListener){
						this[i].addEventListener(eventIn, func);
					}
				}
			}
			return this;
		}
		find(subselector)
		{						
			if(subselector)
			{
				let ret = [];
				for(let i = 0; i < this.length; i += 1)
				{
					let topush = window.Grab(subselector, this[i], false);
					for(let j = 0; j < topush.length; j += 1)
					{
						ret.push(topush[j]);
					}
				}
				return ((ret.length === 0) ? this : new LObject(ret));
			}
			return this;
		}
		filter(filter)
		{
			if(filter && (tags[filter]))
			{
				let ret = [], first = this[0];
				for(let i = 0, len = first.children.length; i < len; i += 1)
				{
					if(first.children[i].tagName.toLowerCase() === filter.toLowerCase())
					{
						ret.push(first.children[i]);
					}
				}
				return new LObject(ret);
			}
			return this;
		}
		first()
		{
			return new LObject([this[0]]);
		}
		get(pos)
		{
			return pos ? this[pos] : this;
		}
		getAll()
		{
			if(Array.from)
			{
				return Array.from(this);
			}
			let ret = [];
			lbjs.array.copy(ret, this);
			return ret;
		}
		height(newHeight)
		{
			if(newHeight)
			{
				if((typeof newHeight === "string") && newHeight.indexOf("px") > -1)
				{
					for(let i = 0, len = this.length; i < len; i += 1)
					{	
						this[i].style.height = newHeight;
					}
				}else{
					for(let i = 0, len = this.length; i < len; i += 1)
					{	
						this[i].style.height = newHeight + "px";
					}
				}	
				return this;
			}
			return this[0].style.height;
		}
		hide()
		{	
			for(let i = 0, len = this.length; i < len; i += 1)
			{
				if(this[i].style.visibility)
				{
					this[i].style.visibility = "hidden";
				}else{
					this[i].style.display = "none";
				}
			}
			return this;
		}
		hover(hoverFunc, outFunc)
		{
			for(let i = 0, len = this.length; i < len; i += 1)
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
		}
		html(newHtml)
		{
			if(newHtml)
			{
				if(typeof newHtml === "string")
				{
					this[0].innerHTML = newHtml;
				}else{
					let temp = _cache.docCreateEl.call(doc, "div");
					temp.appendChild(newHtml);
					this[0].innerHTML = temp.innerHTML;
				}
			}else{
				return this[0].innerHTML;
			}
			return this;
		}
		last()
		{
			return new LObject([this[this.length - 1]]);
		}
		loop(todo)
		{
			if(typeof todo === "function")
			{
				for(let i = 0, len = this.length; i < len; i += 1)
				{
					todo(i, new LObject([this[i]]));
				}
			}
			return this;
		}
		noop(){return this;}
		prepend(toPrepend)
		{
			if(toPrepend)
			{
				let type = typeof toPrepend;
				if(type === "string")
				{
					for(let i = 0, len = this.length; i < len; i += 1)
					{
						if(this[i].insertAdjacentHTML)
						{
							this[i].insertAdjacentHTML("afterbegin", toPrepend);
						}else{
							this[i].innerHTML = toPrepend + this[i].innerHTML;
						}
					}
				}else if(type === "function"){
					for(let i = 0, len = this.length; i < len; i += 1)
					{
						if(this[i].insertAdjacentHTML)
						{
							this[i].insertAdjacentHTML("afterbegin", toPrepend.apply(this[i]));
						}else{
							this[i].innerHTML = toPrepend.apply(this[i]) + this[i].innerHTML;
						}
					}
				}else{
					for(let i = 0, len = this.length; i < len; i += 1)
					{
						this[i].insertBefore(toPrepend, this[this.length - 1].firstChild);
					}
				}
			}
			return this;
		}
		prependBuild(toPrepend)
		{
			if(toPrepend)
			{
				let type = typeof toPrepend;
				if(type === "string")
				{
					for(let i = 0, len = this.length; i < len; i += 1)
					{
						this[i].prependCache += toPrepend;
					}
				}else if(type === "function"){
					for(let i = 0, len = this.length; i < len; i += 1)
					{
						this[i].prependCache += toPrepend.apply(this[i]);
					}
				}
			}
			return this;
		}
		prependAdd()
		{
			for(let i = 0, len = this.length; i < len; i += 1)
			{
				this[i].insertAdjacentHTML("afterbegin", this.prependCache);
			}
			this.prependCache = "";
			return this;
		}
		ready(func)
		{
			let oldonload = window.onload;
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
		}
		removeClass(toDel)
		{
			if(toDel)
			{
				for(let i = 0, len = this.length; i < len; i += 1)
				{
					let classes = this[i].getAttribute('class');
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
		}
		show()
		{
			for(let i = 0, len = this.length; i < len; i += 1)
			{
				if(this[i].style.visibility)
				{
					this[i].style.visibility = "display";
				}else{
					this[i].style.display = "block";
				}
			}
			return this;
		}
		text(newText)
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
		}
		toggle()
		{
			for(let i = 0, len = this.length; i < len; i += 1)
			{
				if(this[i].style.display === "none" || this[i].style.display === "")
				{
					this[i].style.display = "block";
				}else{
					this[i].style.display = "none";
				}
			}
			return this;
		}
		val(newVal)
		{
			if(newVal)
			{
				if(typeof newVal === "string")
				{
					for(let i = 0, len = this.length; i < len; i += 1)
					{
						this[i].value = newVal;
					}
				}else if(lbjs.array.isArray(newVal)){
					for(let i = 0, len = this.length; i < len; i += 1)
					{
						this[i].value = newVal[i];
					}
				}else if(typeof newVal === "function"){
					for(let i = 0, len = this.length; i < len; i += 1)
					{
						this[i].value = newVal.apply(this[i], [i, this[i].value]);
					}
				}
				return this;
			}
			return this[0].value;
		}
		width(newWidth)
		{
			if(newWidth)
			{
				if((typeof newWidth === "string") && newWidth.indexOf("px") > -1)
				{
					for(let i = 0, len = this.length; i < len; i += 1)
					{	
						this[i].style.width = newWidth;
					}
				}else{
					for(let i = 0, len = this.length; i < len; i += 1)
					{	
						this[i].style.width = newWidth + "px";
					}
				}
				return this;
			}
			return this[0].style.width;
		}
		push(...In){	
			Array.prototype.push(...In);
		}
		splice(...In){
			Array.prototype.splice(...In);
		}
		eq(...In){
			this.at(...In);
		}
		each(...In){
			this.loop(...In);
		}
	};
	
	window.LObject = LObject;
	
	lbjs.about = {
		pversion:	0.1,
		tag:		function(){return iname + "/" + iversion;},
		name: 		function(){return iname;},
		version: 	function(){return iversion;}
	};
	
	lbjs.array = {
		pversion:	0.2,
		inArray:	function(arrayIn, check)
					{
						for(let i = 0, len = arrayIn.length; i < len; i += 1)
						{
							if(arrayIn[i] === check){return i;}
						}
						return -1;
					},
		isArray:	function(varIn){return varIn.constructor === Array;},
		copy:		function(outArray, inArray){
						if(inArray.constructor === Array){
							Array.prototype.push.apply(outArray, inArray);
						}else{
							outArray.length = inArray.length;
							for(let i = 0, len = inArray.length; i < len; i += 1)
							{
								outArray[i] = inArray[i];
							}
							outArray.length = inArray.length;
						}
					}
	};

	lbjs.xtra = {
		pversion:	0.1,
		noop:		function(){return undefined;},
		repeat:		function(count, toDo)
					{
						if(typeof toDo === "function")
						{	
							while(count > 0)
							{
								toDo();
								count -= 1;
							}
						}
					}
	};
	
	lbjs.ext = {
		pversion:	0.2,
		extend: 	function(newFunctions)
					{
						for(let propt in newFunctions){
							if(newFunctions.hasOwnProperty(propt)){
								LObject.prototype[propt] = newFunctions[propt];
							}
						}
						return this;
					}
	};
}());
