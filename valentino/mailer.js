var mailer = {
	version : "1.1",
	action:"", 
	imageUrl:"",
	
    
	 getEntityId:function()
     {
     	return "mailfrom_"+authUser.username;
     },
     
     setLastFrom:function(from)
     {
    	 if(from)
    		 localStorage.setItem(this.getEntityId(), from);
     },
     
     getLastFrom:function()
     {
     	     	
     	return localStorage.getItem(this.getEntityId());
     },
     
     hide:function()
     {
    	 this.setLastFrom($("#mailer_from").val());
    	 this.clean();
    	 $("#mailer").hide();
     },
     
     close:function(event)
     {  
    	 if(event.target && event.target.id && event.target.id=="mailer")
 		{
 			
 		
    	 mailer.hide();
    	 
    	 
 		}
     },
     clean:function()
     {
    	 $("#mailer_to").val("");
    	 $("#mailer_subject").val("");
    	 $("#mailer_body").val("");
    	 this.imageUrl="";
     },
	
    openWishMail:function()
    {
    	$("#mailer_from").val(this.getLastFrom());
    	$("#mailer_subject").val("Wishlist for customer "+cardHandler.clientId);
    	$("#mailer_action").html("SHARE WISHLIST");
    	this.action="wish";
    	
    	
    	$("mailer_submit").click(mailer.sendWishMail);
    	$("#mailer").show();
    },
     
    openImageMail:function(prodId, imageUrl,type)
    {
    	$("#mailer_from").val(this.getLastFrom());
    	if(type=='product'){
    		$("#mailer_subject").val("Product ID "+prodId);
        	$("#mailer_action").html("SHARE THIS PRODUCT");
    	}else{
    		$("#mailer_subject").val("Look: "+prodId);
        	$("#mailer_action").html("SHARE THIS LOOK");
    	}
    	
    
    	this.action="prod";
    	this.imageUrl=imageUrl;
    	
    	$("mailer_submit").click(mailer.sendProductMail);
    	$("#mailer").show();
    },
    
    onSubmitClick:function()
    {
    	if(this.action=="prod")
    	{
    		this.sendProductMail();
    	}
    	else
    	{
    		this.sendWishMail();
    	}

    	
    },
     
	sendProductMail:function()
	{
		this.send({
			mailTemplate:"/valentino/service/sendEmail/shareProductMail.html",
			imageUrl:this.imageUrl
		})
	},
	
	sendWishMail:function()
	{
		
		this.send({
			mailTemplate:"/valentino/service/sendEmail/shareWishMail.html",
			username: authUser.username,
			clientId:cardHandler.clientId
		})
	},
	
     
	send:function(params)
	{
		params.action = 'sendEmail';
		params.from= $("#mailer_from").val();
		params.to= $("#mailer_to").val();
		params.subject=$("#mailer_subject").val();
		params.body=$("#mailer_body").val();
		if(this.validate(params))
		{
			htmlRequest("service.app",params);
		}
		
		
	},
	validate:function(params)
	{
		if(!params.from || !params.to || !params.subject )
		{
			// missing parameters
			var message="Error, missing parameter/s:<br>";
			if(!params.from) message+="FROM<br>";
			if(!params.to) message+="TO<br>";
			if(!params.subject) message+="SUBJECT<br>";
						
			
			showBasicDialog(message);
			return false;
		}
	
		else
		{
			return true;
		}
		
	}

}