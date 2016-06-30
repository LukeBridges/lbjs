lbjs.circle = {
	pversion:	0.2,
	main:		function()
				{
					lbjs.ext.include("lbjs.number", "0.1");
				},
	xwidth: 	function(radius, angle){return radius * Math.sin(lbjs.number.deg2rad(angle));},
	yheight: 	function(radius, angle){return radius * Math.sin(lbjs.number.deg2rad(90 - angle));},
	points: 	function(radius, inx, iny, density)
				{
					let points = [], len = 360 / density;
					for(let i = 0; i < len; i += 1)
					{
						let angle = i * density;
						points[i] = {x: lbjs.circle.xwidth(radius, angle) + inx, y: lbjs.circle.yheight(radius, angle) + iny};
					}
					return points;
				}
};
