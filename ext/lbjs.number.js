lbjs.number = {
	pversion:	0.3,
	_pi180:		function(){return Math.PI/180}(),
	getRandom:	function(min, max){return Math.floor(Math.random() * (max - min + 1)) + min;},
	getAvg:		function(numsIn)
				{
					let total = 0,
						len = numsIn.length;
					for(let pointer = 0; pointer < len; pointer += 1)
					{
						total += numsIn[pointer];
					}
					return total / numsIn.length;
				},
	deg2rad:	function(degrees){return degrees*lbjs.number._pi180;},
	binary:		function(number){return number.toString(2);},
	padBinary:	function(number, bits)
				{
					let raw = number.toString(2),
						dif = bits - raw.length,
						cache = new Array(dif + 1).join("0");
					return cache + raw;
				}
};
