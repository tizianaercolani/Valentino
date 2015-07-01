

	var x4 = {}
	function sliderX4Scroll() {
		x4.target = null;
		if (x4.tid)
			clearTimeout(x4.tid)
		x4.tid = setTimeout(function() {
			x4.target = 624 * Math.round(getById('slider_elementx4').scrollTop / 624);
			var timeAnimation = Math.abs(getById('slider_elementx4').scrollTop-x4.target);
			$("#slider_elementx4").animate({
			scrollTop : x4.target
			},120);
		}, 40)

	}	

	function getLines(season)
	{
		htmlRequest("service.app",
		{
			action : 'getLines',
			collection:season.collection,
			season_number:season.season_number
		}
		      		
		
		);

	}
