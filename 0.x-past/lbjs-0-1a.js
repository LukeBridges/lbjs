(function(){
	var iversion = "0.1a";
	var iname = "lbjs";

	var window = this,
	undefined, _lbjs = window.lbjs;
   
	lbjs = window.lbjs = function(selector){
		return new lbjsObject(selector);
	};

	lbjsObject = function(selector){
		var appendCache = "",
			prependCache = "";
			
		this.ready = function(func)
		{
			var oldonload = window.onload;
			if(typeof window.onload != 'function')
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
	
		this.append = function(toAppend){selector.innerHTML += toAppend};
		this.appendBuild = function(toAppend){appendCache += toAppend};
		this.appendAdd = function()
		{
			selector.innerHTML += appendCache;
			appendCache = "";
		};
		this.prepend = function(toPrepend){selector.innerHTML = toAppend + selector.innerHTML};
		this.prependBuild = function(toPrepend){prependCache += toPrepend};
		this.prependAdd = function()
		{
			selector.innerHTML += prependCache;
			prependCache = "";
		};
		this.html = function(newHtml){selector.innerHTML = newHtml};
		this.hide = function(){selector.style.display = "none"};
		this.show = function(){selector.style.display = "block"};
	};
	
	lbjs.about = lbjs.prototype = {
		tag:		function(){return iname + "/" + iversion},
		name: 		function(){return iname},
		version: 	function(){return iversion}
	};
	
	lbjs.circle = lbjs.prototype = {
		xwidth: 	function(radius, angle){return radius*Math.sin(lbjs.number.deg2rad(angle))/lbjs.number.sin90()},
		yheight: 	function(radius, angle){return radius*Math.sin(lbjs.number.deg2rad(90 - angle))/lbjs.number.sin90()},
		points: 	function(radius, inx, iny, density)
					{
						var points = new Array();
						for(var i = 0, len = 360 / density; i < len; i++)
						{
							var angle = i * density;
							points[i] = {x:this.xwidth(radius, angle) + inx,y:this.yheight(radius, angle) + iny};
						}
						return points;
					}
	};
	
	lbjs.file = lbjs.prototype = {
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
	
	lbjs.number = lbjs.prototype = {
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
		sin90:		function(){return Math.sin(this.deg2rad(90))},
		binary:		function(number){return number.toString(2)},
		padBinary:	function(number, bits)
					{
						var raw = number.toString(2),	
							dif = bits - raw.length,
							cache = "";
						for(var i = 0; i < dif; i++)
						{
							cache += "0";
						}
						return cache + raw;
					}
	};
	
	lbjs.text = lbjs.prototype = {
		getRanChar:	function(possible){return possible.charAt(Math.floor(Math.random() * possible.length))},
		splitLines:	function(line){return line.split("\n")}
	};
})();