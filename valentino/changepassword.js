var changePw = {
	version : "1.0",

	isAuthenticatedMode : function() {
        return typeof authUser !== "undefined"; //se esiste la variabile authUser sono autenticato
	},
    //pulisce interfaccia e setta modalità
	clear : function() {
		
		$("#chpw_oldpassword").val("");
		$("#chpw_newpassword").val("");
		
		if(this.isAuthenticatedMode())
		{
			$("#chpw_login").attr("disabled",true)
			
		}
		else
		{
			
			
			
		}
		

	},
	
	show:function()
	{
		this.clear();
		// chiudo tutta la roba aperta
		try{
			hideActInd();
			hideModal();
			hideNavigationPanel();
		}
		catch(e)
		{
			
		}
		
		$("#changePassword").show();
		
	},
	
	hide:function(event)
	{
		if(event.target && event.target.id && event.target.id=="changePassword")
		{
			$("#changePassword").hide();
		}
		
	},

	validate : function(params) {
		
		if(!params.login || !params.oldpassword || !params.password ||!params.confirm_password)
		{
			// missing parameters
			var message="Error, missing parameters:<br>";
			if(!params.login) message+="USERNAME<br>";
			if(!params.oldpassword) message+="OLD PASSWORD<br>";
			if(!params.password) message+="NEW PASSWORD<br>";
			if(!params.confirm_password) message+="CONFIRM NEW PASSW.<br>";
						
			
			showBasicDialog(message);
			return false;
		}
		else if(params.oldpassword==params.password)
		{
			showBasicDialog("Your new password must be different than the old one.");
			return false;
		}
		else if(params.confirm_password!=params.password)
		{
			showBasicDialog("The new password and confirmation password do not match.");
			return false;
		}
		else
		{
			/*
			 * Europa :  la pwd deve essere di 8 caratteri
                USA : la pwd deve essere di 4 caratteri
			 * */
			var minLength=8;
			
			if(params.password.length<minLength)
			{
				showBasicDialog("The password must be at least "+ minLength+" characters");
				return false;
			}
			else
			{
				return true;
			}
 
			
		}

	},
	run : function() {
			
		
		  var params = {
				login: this.isAuthenticatedMode()? authUser.username: $("#chpw_login").val(),
				
				action : "changePassword",		
				oldpassword :$("#chpw_oldpassword").val() ,
				password : $("#chpw_newpassword").val(),
				confirm_password : $("#chpw_newpassword_c").val(),
				
			}	
		  if(this.validate(params))
		  {   showActInd();
			  htmlRequest("service.app", params);
		  }
			

	},

	/*
	 * Testare la funzionalità senza interfaccia.
	 * params:
	 * login: login utente. Se si è loggati verrà ignorata usando utente corrente
	 * region: region utente. Se si è loggati verrà ignorata usando utente corrente
	 * oldpassword: vecchia pw
	 * password: nuova pw
	 * 
	 * */
	test : function(params) {

		params.action = "changePassword";
		htmlRequest("service.app", params);

	}

}