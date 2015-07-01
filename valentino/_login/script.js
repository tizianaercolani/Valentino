
function validate()
{
	
	
	var user=document.getElementById("username").value;
	var pass=document.getElementById("password").value;
	
	if(user && pass)
	{
		showActInd();
		setCookies();
		return true;
	}
	else
	{
		var messageL="Error. Missing parameters:";
		
		if(!user)
		{
			messageL+="<br>Username";
		}
			
		if(!pass)
		{
			messageL+="<br>Password";
		}
		    
		
		showBasicDialog(messageL);
		return false;
	}
	
}



function setCookies() {
		
	var expDate = new Date();
	expDate.setYear(2500);
	setCookie('cookie_username', document.getElementById("username").value, expDate);	
//	setCookie('cookie_region', "FAREAST", expDate);	
	setCookie('brand', document.getElementById("brand").value, expDate);	
	setCookie('barCodeAlias', barCodeAlias, expDate);
	//document.getElementById("errorLabel").innerHTML = "";
}


//patch per evitare problemi di cache della pagina di login
var setLastUser= function()
{
	var lastUserCookie= getCookie("cookie_username");
	var printedLastUser= document.getElementById("username").value;
	
	if(lastUserCookie && !printedLastUser)
	{
		document.getElementById("username").value=lastUserCookie;
	}
	
}


