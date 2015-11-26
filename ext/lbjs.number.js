lbjs.number = {
	pversion:	0.1,
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