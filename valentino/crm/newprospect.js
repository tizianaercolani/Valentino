
var newProspect={
		
		
		
		validate:function()
		{
			var result={
					isValid:true,
					message:""
					
			}
			
			/*check obbligatori
			 * GID 
			 * Source  e Source Description 
			 * Marketing e Profiling 
			   Country 
			 * 
			 * */

			//key:desc		
			var mandatoryMap = {
			"ImTitleN" : "GID",
			"ImSourceN" : "Source",
			"ImSourceDescN" : "Source Description",
			"ImMktPermissN" : "Marketing",
			"ImPrfPermissN" : "Profiling",
			"SimCountryN":"Country",
			"BirthdtNew":"Date of Birth"
		     };
			
			for(key in mandatoryMap)
			{
				if(!getById(key).value)
				{
					var desc=mandatoryMap[key];
					result.isValid=false;
					result.message+=desc+", ";
					
					
				}
				
			}
			if(!result.isValid)
			 {
				
				result.message= result.message.slice(0,-2)+" are mandatory.<br>"
			 }
			
			//LastName + FirstName o Company Name OBBLIGATORI	
			if(!getById("SimCompNameN").value &&(!getById("SimNameLastN").value || !getById("SimNameFirstN").value))
			{
				result.isValid=false;
				result.message+="Company OR Last Name + First Name are mandatory<br>"
			}
			
			
			
			/**
			 * 
			
					
			Se si attiva il flag "fake year" allora deve essere OBBLIGATORIA la valorizzazione 
			sia di DateOfBirth (l'anno della data scelta verrà ignorato) 
			che anche di EstimatedAge (quindi diventano entrambi obbligatori)
			*/
			var isFakeYear = document.getElementById("BirthdtCheckNew").classList.contains("checked");
			if(isFakeYear && !getById("ImEstAgeN").value)
			{
				result.isValid=false;
				result.message+="Without the year of birth, Estimated Age is mandatory.<br> "
			}
			
			
			/*
			se Marketing ha valore "Allowed" è OBBLIGATORIO uno tra: 
			• Main Email 
			• Main Phone
			• Main Mobile
			• Mail Address + City 
		
			 * */
			
			if(getById("ImMktPermissN").value=="1" && !getById("ImMainEmailN").value 
			   &&! getById("SimTelNumberMaN").value	&&!getById("SimTelNumberMoN").value	
			   && (!getById("ImStreetN").value || ! getById("ImCityN").value)
			)
			{
				result.isValid=false;
				result.message+="'E-mail' OR 'Mobile' OR 'Phone' OR 'Address + City' can't be empty.<br>";
			}
			
			//validità mail
			if(getById("ImMainEmailN").value && !validEmail(getById("ImMainEmailN").value))
			{
				result.isValid=false;
				result.message+="Main email is not a valid email address.<br>";
			}
			
			//data di nascita deve essere nel passato
			if(getById("BirthdtNew").value)
			{
				var birthDate=new Date(getById("BirthdtNew").value);
				var now= new Date();
				var compDate = now - birthDate;
				
				if(compDate<0) //birthDate in the future
				{
					result.isValid=false;
					result.message+="Date of Birth can't be in the future.<br>";
					
				}
				
				
			}
			
			//i numeri di telefono devono rispettare regular expression
			var telRegex=new RegExp("^[0-9]+$");
			
			if(getById("SimTelNumberMaN").value)
			{
				var v= getById("SimTelNumberMaN").value;
				v=v.replace(/-/g, "");
				
				if(!telRegex.test(v))
				{
					result.isValid=false;
					result.message+="Main Phone is not a valid telephone number.<br>";
				}
				
			}
			if(getById("SimTelNumberMoN").value)
			{
				var v= getById("SimTelNumberMoN").value;
				v=v.replace(/-/g, "");
				
				if(!telRegex.test(v))
				{
					result.isValid=false;
					result.message+="Main Mobile is not a valid telephone number.<br>";
				}
				
			}
			
			
			
			return result;
		},
		create:function()
		{
			var isFakeYear = document.getElementById("BirthdtCheckNew").classList.contains("checked");
			var Birthdt=$("#BirthdtNew").val();
			
			var dd = Birthdt.substring(8, 10);
			var mm = Birthdt.substring(5, 7);
			var yyyy =Birthdt.substring(0, 4);
			
			if(isFakeYear)
			{
				yyyy="0002" //default fake year
			}
			 
			
			var callparams = {
					action : 'createCustomer',
					IAssociate : authUser.associate, 
					ICreateStore: stores[currentStoreIndex].crm ,
					IDedicStore : stores[currentStoreIndex].crm,
					ImBirthDd : dd,
					ImBirthMm : mm,
					ImBirthYyyy : yyyy,
					SiBrand : authUser.brand_crm,
					
				};
			
			
			var inputs= $("#inputNew :input");
			
			inputs.each(function()
			{
				var val= $(this).val();
				//Levo la N alla fine. Messa per non fare conflitto con i nomi dei campi di ricerca e scheda
				var id= $(this).attr("id").slice(0,-1); 
				callparams[id]=val;
				
			}		
			)
			//console.log(JSON.stringify(callparams));
			showActInd();
			htmlRequest("service.app", callparams);
		},
		onAddClick:function()
		{
			var result = newProspect.validate()
			
			if( result.isValid)
			{
				//send
				newProspect.create();
			}
			else
			{
				showBasicDialog(result.message);
			}
		},
		clear:function()
		{
			$("#newProspect input").val("");
			$("#newProspect select option").removeAttr("selected");
			newProspect.clearBirthday();
			document.getElementById("regionTargetNew").innerHTML="<span style='color:white;'>PLEASE CHOOSE COUNTRY</span>";
			document.getElementById("inputNew").scrollTop=0;
			
		},
		clearBirthday:function()
		{
			$("#BirthdtCheckNew").removeClass("checked");
			document.getElementById("fakeNew").innerHTML="";
			
		},
		onBirthdayChange: function()
		{
			var dvalue=$("#BirthdtNew").attr("value");
			var isFakeYear = document.getElementById("BirthdtCheckNew").classList.contains("checked");
			if(isFakeYear)
			{
				dvalue=dvalue.substring(5);
				$("#BirthdtNew").attr("value", "1900-"+dvalue);
			}
			document.getElementById("fakeNew").innerHTML=dvalue
		},
		toggleFakeYear : function() {
			document.getElementById("BirthdtCheckNew").classList.toggle("checked");
			var isFakeYear = document.getElementById("BirthdtCheckNew").classList.contains("checked");
			var fakeValue = document.getElementById("fakeNew").innerHTML;
			if (isFakeYear) {
				if (fakeValue) {
					document.getElementById("fakeNew").innerHTML = fakeValue.substring(5);
					$("#BirthdtNew").attr("value", "1900-" + fakeValue.substring(5));
				} 
				else {
					$("#BirthdtNew").attr("value", "1900-01-01");
					document.getElementById("fakeNew").innerHTML="01-01"
				}

			} 
			else // passo a data reale e non fake
			{
				if (fakeValue) {
					document.getElementById("fakeNew").innerHTML = "1900-" + fakeValue;
				}
			}

		},
		getRegion:function()
		{
			var params={
				id:renderId,
				forceTemplateName:"TENANT-INF/getregion.html",
				target:"regionTargetNew",
				country:getById("SimCountryN").value,
				field: "ImRegionN",
					
			}
			
			htmlRequest("run.app", params);
			
		},
		
}






	 