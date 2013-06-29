(function(){
	var version = "0.0a";
	var name = "LBJs";

	var window = this,
	undefined, _lbjs = window.lbjs;
   
	//object initializarion
	lbjs = window.lbjs = function(selector){
		return new lbjsObject(selector);
	};
	//the custom javascript object
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
		
		this.appendDo = function()
		{
			selector.innerHTML += appendCache;
		};
	};
	
	lbjs.about = function(){return name + "/" + version;};
	lbjs.about.name = function(){return name;};
	lbjs.about.version = function(){return version;};
	
	lbjs.circle = function(){};
	lbjs.circle.xwidth = function(radius, angle){return radius*Math.sin(lbjs.number.deg2rad(angle))/lbjs.number.sin90;};
	lbjs.circle.yheight = function(radius, angle){return radius*Math.sin(lbjs.number.deg2rad(90 - angle))/lbjs.number.sin90;};
	lbjs.circle.points = function(radius, x, y, density)
	{
		var points = new Array();
	
		for(var i = 0; i < 360; i = i + density)
		{
			points[i][0] = lbjs.circle.xwidth(length, i) + x;
			points[i][1] = lbjs.circle.yheight(length, i) + y;
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