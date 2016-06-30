lbjs.text = {
	pversion: 0.1,
	getRanChar:	function(possible)
				{
					return possible.charAt(Math.floor(Math.random() * possible.length));
				},
	splitLines:	function(line)
				{
					return line.split("\n");
				}
};
