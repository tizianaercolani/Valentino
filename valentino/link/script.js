       function getDataCustom() {
			var today = new Date();
			var currentMonth=today.getMonth() + 1;
			var currentDay=today.getDate() ;
			var currentHour=today.getHours() ;
			var currentMinute=today.getMinutes() ;
			var currentSeconds=today.getSeconds();
			
			if(currentMonth<10){
				currentMonth='0'+currentMonth;
			}
			if(currentDay<10){
				currentDay='0'+currentDay;
			}
			if(currentHour<10){
				currentHour='0'+currentHour;
			}
			if(currentMinute<10){
				currentMinute='0'+currentMinute;
			}
			
			var data = today.getFullYear() + "-" + currentMonth+ "-"+ currentDay + 'T';
			var ora = currentHour + ':' + currentMinute + ':00';
			var fulldate = data + ora;
			return fulldate;
		}

		function generateToken() {
			var username = getCookie('cookie_username');
			var dataCustom = getDataCustom();
			var chiave = '87654321';
			var text = chiave + dataCustom + username.toUpperCase();
			console.log(text)
			var hash = CryptoJS.SHA256(text);
			var token = hash.toString()
			console.log(token)
            return token
		}