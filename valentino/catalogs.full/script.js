

	var x4 = {}
	function sliderX4Scroll() {
		x4.target = null;
		var scroll=0;
		if (x4.tid)
			clearTimeout(x4.tid)
		x4.tid = setTimeout(function() {
			x4.target = 1053 * Math.round(getById('slider_elementx4').scrollTop / 1053);
			var timeAnimation = Math.abs(getById('slider_elementx4').scrollTop-x4.target);
			console.log(getById("slider_elementx4").offsetTop)
			
			$("#slider_elementx4").animate({
			scrollTop : x4.target
			},100);
			
		}, 300)

	}	

	function getCollection(child_id,view)
	{
		htmlRequest("service.app",
		{
			action : 'getSeason',
			child_id: child_id,
            view: view
			

		}
		      		
		
		);

	}
