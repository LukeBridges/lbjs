lbjs.ais = {
	pversion: 	0.60,
	main:		function(){
					lbjs.ais.iconLookup = {30: lbjs.ais.icons.y, 31: lbjs.ais.icons.o, 32: lbjs.ais.icons.o, 33: lbjs.ais.icons.dr, 34: lbjs.ais.icons.y, 35: lbjs.ais.icons.k,
						36: lbjs.ais.icons.b, 37: lbjs.ais.icons.b, 38: lbjs.ais.icons.w, 39: lbjs.ais.icons.w, 50: lbjs.ais.icons.g, 51: lbjs.ais.icons.g,
						52: lbjs.ais.icons.o, 53: lbjs.ais.icons.o, 54: lbjs.ais.icons.o, 55: lbjs.ais.icons.k, 56: lbjs.ais.icons.w, 57: lbjs.ais.icons.w,
						58: lbjs.ais.icons.g, 59: lbjs.ais.icons.g, 132: lbjs.ais.icons.home, 133: lbjs.ais.icons.track};
				},
	icons:		{home: false, hs: false, dr: false, track: false, k: false, b: false, a: false, g: false,
				r: false, w: false, y: false, m: false, o: false, n: false},
	iconLookup:	{},
	status:		['Underway', 'At Anchor', 'Not Under Command', 'Restricted Maneuverability', 'Constrained by Draught',
				'Moored', 'Aground', 'Engaged in Fishing', 'Underway by Sail', 'Reserved for HSC Category', 'Reserved for WIG Category',
				false, false, false, false, 'Default (15)'],
	type1:		['unspecified', 'Reserved', 'Wing In Grnd', '', 'Hi Spd Crft', '', 'Passenger', 'Cargo', 'Tanker', 'Other'],
	type2:		['', 'Haz A', 'Haz B', 'Haz C', 'Haz D', '','', '', '', ''],
	type3:		['Fishing', 'Towing', 'Towing', 'Dredger', 'Dive Vessel', 'Military Ops', 'Sail', 'Pleasure Craft', 'Reserved', 'Reserved'],
	type5:		['Pilot Vessel', 'SAR', 'Tug', 'Port Tender', 'Anti-polution', 'Law enforce', 'Local Vessel', 'Local Vessel', 'Medical Trans', 'Special craft'],
	navaid:		['Default Navaid', 'Reference point', 'RACON', 'Off Shore Structure', 'Spare',	'Light, without sectors',
					'Light, with sectors', 'Leading Light Front', 'Leading Light Rear',
					'Beacon, Cardinal N', 'Beacon, Cardinal E',	'Beacon, Cardinal S',
					'Beacon, Cardinal W', 'Beacon, Port hand', 'Beacon, Starboard hand',
					'Beacon, Preferred Channel port hand', 'Beacon, Preferred Channel starboard hand',
					'Beacon, Isolated danger', 'Beacon, Safe water', 'Beacon, Special mark',
					'Cardinal Mark N', 'Cardinal Mark E', 'Cardinal Mark S', 'Cardinal Mark W',
					'Port hand Mark', 'Starboard hand Mark', 'Preferred Channel Port hand',
					'Preferred Channel Starboard hand',	'Isolated danger', 'Safe Water',
					'Manned VTS', 'Light Vessel / LANBY', 'Reference Point'],
	getStatus: 	function(status)
				{
					let ret = lbjs.ais.status[parseInt(status,10)];
					return ret ? ret : status;
				},
	getClass: 	function(aisclass)
				{
					switch(aisclass)
					{
						case "A": return 'AIS Class A';
						case "B": return 'AIS Class B';
						case "L": return 'Local GPS';
						case "N": return 'Navigation Aid';
						case "P": return 'SAR Aircraft';
						case "S": return 'AIS Base Station';
						case "?": return 'Unknown';
						case "X": return 'No Data';
						default: return aisclass;
					}
				},
	getColour:	function(type)
				{
					let iconret = lbjs.ais.iconLookup[type],
						ret = [false, false, false, false, lbjs.ais.icons.hs, false, lbjs.ais.icons.b, lbjs.ais.icons.r, lbjs.ais.icons.m];
					if(iconret){return iconret;}
					if(type > 99){return lbjs.ais.icons.a;}  // "gray"
					ret = ret[Math.floor(type/10)];
					return ret ? ret : lbjs.ais.icons.w;
				},
	getType: 	function(id){
					let type = Math.floor(id / 10),
						rem = id % 10,
						result = '';
					if(type === 3){result = lbjs.ais.type3[rem];}
					else if(type === 5){result = lbjs.ais.type5[rem];}
					else if(id >= 100){result = lbjs.ais.navaid[id - 100];}
					else{
						result = lbjs.ais.type1[type];
						if(id < 100 && lbjs.ais.type2[rem] !== ''){result = result + ' ' + lbjs.ais.type2[rem];}
					}
					return result;
				},
	rangeBearing: 	function(lat1, lon1, lat2, lon2){
					const pi180 = Math.PI / 180,
						la1 = lat1 * pi180,
						lo1 = lon1 * pi180,
						la2 = lat2 * pi180,
						lo2 = lon2 * pi180,
						lo2lo1 = lo2 - lo1,
						cosla1 = Math.cos(la1),
						cosla2 = Math.cos(la2),
						sinla1 = Math.sin(la1),
						sinla2 = Math.sin(la2),
						coslo2lo1 = Math.cos(lo2lo1),
						x = (sinla1 * sinla2) + (cosla1 * cosla2 * coslo2lo1),
						y = Math.sin(lo2lo1) * cosla2,
						x2 = (cosla1 * sinla2) - (sinla1 * cosla2 * coslo2lo1);
					return {range: Math.round((((Math.PI / 2) - Math.atan(x / Math.sqrt(-x * x + 1))) * 10800 / Math.PI) * 10) / 10, 
							bearing: Math.round(((Math.atan2(y, x2) * 180 / Math.PI) + 360) % 360)};
				}
};
