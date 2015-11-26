lbjs.ajax = {
	pversion: 	0.3,
	get: 		function(options)
				{
					'use strict';
					if(typeof options === "string" && !options.url)
					{
						options = {url: options}
					}
					var xmlhttp = new XMLHttpRequest();
					xmlhttp.onreadystatechange = function()
					{
						if(xmlhttp.readyState === 4 && xmlhttp.status === 200)
						{
							if(options.responseType && options.responseType === "XML")
							{
								options.success(xmlhttp.responseXML);
							}else{
								options.success(xmlhttp.responseText);
							}
						}
					}
					xmlhttp.open("GET",options.url,true);
					xmlhttp.send();
				}
};