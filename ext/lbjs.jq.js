lbjs.jq = {
	pversion:	0.1,
	main:		function()
				{
					lbjs.ext.require("lbjs.ext");
					lbjs.ext.require("lbjs.xtra");
				},
	reg:		function()
				{
					$ = jQuery = jquery = lbjs = L;
					$.fn = LObject.prototype;
					$.fn.extend = lbjs.ext.extend;
					L.isFunction = 	lbjs.xtra.isFunction;
					L.support = {opacity: document.createElement("div").style.opacity};
				}
};