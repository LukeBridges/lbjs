(function(){
	var version = "0.0b";
	var name = "lbjs";

	var window = this,
	undefined, _lbjs = window.lbjs;
   
	lbjs = window.lbjs = function(selector){
		return new lbjsObject(selector);
	};

	lbjsObject = function(selector){
		var appendCache = "",
			prependCache = "";
	
		this.append = function(toAppend)
		{
			selector.innerHTML += toAppend;
		};
		this.appendBuild = function(toAppend)
		{
			appendCache += toAppend;
		};
		this.appendAdd = function()
		{
			selector.innerHTML += appendCache;
			appendCache = "";
		};
		this.prepend = function(toPrepend)
		{
			selector.innerHTML = toAppend + selector.innerHTML;
		};
		this.prependBuild = function(toPrepend)
		{
			prependCache += toPrepend;
		};
		this.prependAdd = function()
		{
			selector.innerHTML += prependCache;
			prependCache = "";
		};
		this.hide = function()
		{
			selector.style.display = "none";
		};
		this.show = function()
		{
			selector.style.display = "block";
		};
	};
	
	lbjs.about = function(){return name + "/" + version;};
	lbjs.about.name = function(){return name;};
	lbjs.about.version = function(){return version;};
	
	lbjs.circle = function(){};
	lbjs.circle.xwidth = function(radius, angle){return radius*Math.sin(lbjs.number.deg2rad(angle))/lbjs.number.sin90;};
	lbjs.circle.yheight = function(radius, angle){return radius*Math.sin(lbjs.number.deg2rad(90 - angle))/lbjs.number.sin90;};
	lbjs.circle.points = function(radius, inx, iny, density)
	{
		var points = new Array();
		
		for(var i = 0, len = 360 / density; i < len; i++)
		{
			var angle = i * density;
			points[i] = {x:lbjs.circle.xwidth(radius, angle) + inx,y:lbjs.circle.yheight(radius, angle) + iny};
		}
		
		return points;
	};
	
	lbjs.file = function(){};
	lbjs.file.read = function(filepath)
	{
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET",filepath,false);
		xmlhttp.send(null);
		return xmlhttp.responseText;
	};
	
	lbjs.number = function(){};
	lbjs.number.getRandom = function(min, max){return Math.floor(Math.random() * (max - min + 1)) + min;};
	lbjs.number.getAvg = function(numsIn)
	{
		var total = 0;
		for(var pointer = 0; pointer < numsIn.length; pointer++)
		{
			total += numsIn[pointer];
		}
		return total / numsIn.length;
	};
	lbjs.number.deg2rad = function(d){return d*3.14159265/180;};
	lbjs.number.sin90 = Math.sin(lbjs.number.deg2rad(90));
	
	lbjs.text = function(){};
	lbjs.text.getRandomChar = function(possible){return possible.charAt(Math.floor(Math.random() * possible.length));};
})();