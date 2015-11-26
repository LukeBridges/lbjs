lbjs.circle = {
	pversion:	0.1,
	main:		function()
				{
					lbjs.ext.require("lbjs.number", "0.1");
				},
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