
var searchHandler = {
		
	lastSearchDate: new Date(),	
		
	getParamsToString:function()
	{	
		
		var fields=["clientId", "companyName", "country", "firstName", "lastName", "phone", "mobile", "zip", "otherAlphabet"];
		
		var string="";
		var full=false;
		for(var i=0; i<fields.length; i++)
		{
			if(document.getElementById(fields[i]) && document.getElementById(fields[i]).value)
			{
				var field=fields[i];
				var value= document.getElementById(fields[i]).value
				string+="&"+field+"="+value;
				
				if(field!="clientId" &&field!="lastName")
					{
					  full=true;
					}
			}
		}
		if(full)
		{
			string+="&fullSearch=true";
		}
		
		return string;
		
	},

	search : function() {
		var clientId = document.getElementById('clientId').value;
		var companyName = document.getElementById('companyName').value;
		var country = document.getElementById('country').value;
		var firstName = document.getElementById('firstName').value;
		var lastName = document.getElementById('lastName').value;
		var phone = document.getElementById('phone').value;
		var mobile = document.getElementById('mobile').value;
		var zip = document.getElementById('zip').value;
		var card = "";
		var otherAlphabet = document.getElementById('otherAlphabet').value;

		//validation
		if (clientId.length < 1 && companyName.length < 2 && lastName.length < 2 && otherAlphabet.length < 2) {
			showBasicDialog("Please compile Customer Id or at least one of Last Name, Other Alphabet or Company Name with at least 2 characters");
		} 
		else {
			showActInd();
			this.lastSearchDate=new Date();
			
			htmlRequest("service.app", {
				action : 'searchCustomers',
				
				clientId : clientId,
				"companyName" : companyName,
				"country" : country,
				"firstName" : firstName,
				"lastName" : lastName,
				"phone" : phone,
				"mobile" : mobile,
				"zip" : zip,
				//"card" : card,
				"otherAlphabet" : otherAlphabet,
				brand : authUser.brand_crm
			}

			);
		}

	},
	
	toggleFields:function()
	{
		
		

		// determino lo stato corrente
		var areRowsVisible = $("#row_firstName").css("visibility")=="visible";

		if (areRowsVisible) {
			searchHandler.hideFields();
			
		} else {
			searchHandler.showFields();
		}
	},
	
	hideFields:function()
	{
		var arrowUp = baseUrl + "store_app/arrowup.png";
		
		$(".tr_showHide").css("visibility", "hidden")
		$("#row_clientId, #row_lastName").css("visibility", "visible")
		$("#toggleArrow").attr("src",arrowUp);
		$("#toggleClick div").show();
	},
	
	showFields:function()
	{
		var arrowDown = baseUrl + "store_app/arrowdown.png";
		$(".tr_showHide").css("visibility", "visible")
		$("#toggleArrow").attr("src",arrowDown);
		$("#toggleClick div").hide();
	},
	
	
	//pulisce l'interfaccia di search
	clear:function()
	{
		searchHandler.hideFields();
		
		document.getElementById('clientId').value="";
		document.getElementById('companyName').value="";
		 document.getElementById('country').value="";
		document.getElementById('firstName').value="";
		 document.getElementById('lastName').value="";
		document.getElementById('phone').value="";
		document.getElementById('mobile').value="";
		document.getElementById('zip').value="";
		
		document.getElementById('otherAlphabet').value="";
		
	}

}


$(document).ready(function(){
	$('.client_id').keydown(function() {
		if (event.keyCode == 13) {
			
			searchHandler.search();
			$('.client_id').blur();
		}
	});
})



	 