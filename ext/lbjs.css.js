lbjs.css = {pversion: 0.1};
lbjs.ext.extend({
	css:	function(arg1, arg2){
				var arg1type = typeof arg1, i, k, len, ret, getRet,
					specialProps = ["height"],
					pxReg = /px/gi,
					getValue = function(elem, prop){
						if(specialProps.indexOf(prop) > 0)
						{
							getRet = getComputedStyle(elem)[prop];
							if(getRet === "auto" && elem.style[prop] === 0)
							{
								getRet = 0;
							}
							return getRet;
						}
						return elem.style[prop];
					},
					setValue = function(elem, prop, val){
						elem.style[prop] = val;
					};
				
				if(arg1type === "string") //SINGLE
				{
					if(arg2) //SET
					{
						if(this.length > 1) //MANY
						{
							for(i = 0, len = this.length; i < len; i += 1)
							{
								setValue(this[i], arg1, arg2);
							}
						}else{ //ONE
							setValue(this[0], arg1, arg2);
						}
					}else{ //GET
						if(this.length > 1) //MANY
						{
							ret = [];
							for(i = 0, len = this.length; i < len; i += 1)
							{
								ret[ret.length] = getValue(this[i], arg1).replace(pxReg, '');
							}
							return ret;
						} //ONE
						return getValue(this[0], arg1).replace(pxReg, '');
					}
				}else if(arg1type === "object"){ //MANY
					ret = [];
					if(this.length > 1) // MANY
					{
						for(i = 0, len = this.length; i < len; i += 1) //EACH ELEM
						{
							for(k = 0, len = arg1.length; i < len; i += 1) //EACH PROP
							{
								if(arg1[k][1]) //SET
								{
									setValue(this[i], arg1[k][0], arg1[k][1]);
								}else{ //GET
									ret[ret.length] = getValue(this[i], arg1[k][0]).replace(pxReg, '');
								}
							}
						}
					}else{ //ONE
						for(k = 0, len = arg1.length; i < len; i += 1) //EACH PROP
						{
							if(arg1[k][1]) //SET
							{
								setValue(this[0], arg1[k][0], arg1[k][1]);
							}else{ //GET
								ret[ret.length] = getValue(this[0], arg1[k][0]).replace(pxReg, '');
							}
						}
					}
					return ret;
				}
				
				return this;
			}
});