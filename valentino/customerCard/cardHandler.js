/*CARD HANDLER SCRIPT
 * Gestione della scheda cliente
 * */

var cardRoller=null;

var cardHandler={
		version:"ch1.1",
		clientId: "",
		isEditMode:false,	
		somethingChanged:false,
		changeBackground:function(bgUrl)
		{
			$("#bgDivCC").css("background-image", 'url("'+bgUrl+'")');
		},
		
		/*
		 * Nasconde le righe con valori non valorizzati
		 * */
		hideVoids:function(){
			
			//non va con red vs valentino
			if(!this.isEditMode)
			{
				$(".innerTable tr td:nth-child(2)").each(function() {
					if (!$(this).text()) {
						$(this).parent().hide();
					}
					else if($(this).parent().hasClass("editable"))
					{
						if(!$(this).find("label").text())				
						{
							$(this).parent().hide();
						}
					}
				}

				)
			}
			

		},
		goToPosition:function(pos)
		{   if (!$('#'+pos+'').hasClass('disabled')){
			
		
			
			var len =cardRoller.cellDimension;
			var posInt=parseInt(pos);
			var offset=pos*len;
			$("#leftMenu").animate({
				scrollTop :offset
				},300);

			//document.getElementById('leftMenu').scrollTop=offset;
		}
		},
		showVoids:function(editableOnly)
		{
			if(editableOnly)
			{
				$(".innerTable tr.editable").show()
				
				
			}
			else
			{
				$(".innerTable tr").show()
	
			}
			
		},
		
		setMode:function()
		{
			if(cardHandler.isEditMode)
			{
				cardHandler.showVoids();
				//nascondo label e faccio vedere input
				$(".innerTable tr td:nth-child(2)").find("label").hide();
				$("#dateContainer").show();
				$(".innerTable tr td:nth-child(2)").find("input").show();
				$(".innerTable tr td:nth-child(2)").find("select").show();
				$(".checkbox").show();
				$(".editable td:nth-child(2)").addClass("editableMode");
				$(".menuItem").removeClass("disabled");
			}
			else
			{
				cardHandler.hideVoids();
				//nascondo input e faccio vedere label
				$("#dateContainer").hide();
				$(".innerTable tr td:nth-child(2)").find("input").hide();
				$(".innerTable tr td:nth-child(2)").find("select").hide();
				$(".innerTable tr td:nth-child(2)").find("label").show();
				$(".editable td:nth-child(2)").removeClass("editableMode");
				$(".checkbox").hide();
				cardHandler.setDisabledCards();
				
			}
			
			
			
			
			
		},
		
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
			"ImTitle" : "GID",						
			"ImMktPermiss" : "Marketing",
			"ImPrfPermiss" : "Profiling",
			"SimCountry":"Country",
			"Birthdt":"Date of Birth"
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
			if(!getById("SimCompName").value &&(!getById("SimNameLast").value || !getById("SimNameFirst").value))
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
			var isFakeYear = document.getElementById("BirthdtCheck").classList.contains("checked");
			if(isFakeYear && !getById("ImEstAge").value)
			{
				result.isValid=false;
				result.message+="Without the year of birth, Estimated Age is mandatory.<br> "
			}
			
			
			/*
			è OBBLIGATORIO uno tra: 
			• Main Email 
			• Main Phone
			• Main Mobile
			• Mail Address + City 
		
			 * */
			
			if( !getById("ImMainEmail").value 
			   &&! getById("SimTelNumberMa").value	&&!getById("SimTelNumberMo").value	
			   && (!getById("ImStreet").value || ! getById("ImCity").value)
			)
			{
				result.isValid=false;
				result.message+="'E-mail' OR 'Mobile' OR 'Phone' OR 'Address + City' can't be empty.<br>";
			}
			
			//validità mail
			if(getById("ImMainEmail").value && !validEmail(getById("ImMainEmail").value))
			{
				result.isValid=false;
				result.message+="Main email is not a valid email address.";
			}
			
			//data di nascita deve essere nel passato
			if(getById("Birthdt").value)
			{
				var birthDate=new Date(getById("Birthdt").value);
				var now= new Date();
				var compDate = now - birthDate;
				
				if(compDate<0) //birthDate in the future
				{
					result.isValid=false;
					result.message+="Date of Birth can't be in the future.";
					
				}
				
				
			}
			
			
			return result;
		},
		
		
		refreshCurrentCard:function()
		{
			var target= $(".active td").attr("target");
			if(!cardHandler.isEditMode)
			{
				
				if(target)
				{
					if($(".active td").hasClass("disabled"))
					{
						$("#"+target).hide();
					}
					else
					{
					  cardHandler.showCard(target);
					}
				}
				
			}
			else
			{
				cardHandler.showCard(target);
			}
			
			
			
		},
		
		copyFromFieldsToLabels:function()
		{
			//copio dagli input alle label
			console.log("copyFromFieldsToLabels")
			
			var inputs= $("#mainContent :input");
			inputs.each(function()
			{
				var id= $(this).attr("id");
				var label_id= "l_"+id;
				var type= $(this).attr("type");
				var tag= $(this).prop("tagName").toLowerCase();
				if(tag=="select")
				{
					
					$("#"+label_id).text($("#"+id+" :selected").text())
				}
				else
				{
					$("#"+label_id).text($(this).val());
				}
				
				
			}		
			)
			//titolo
			$("#cardTitle").text($("#SimNameLast").val()+" "+ $("#SimNameFirst").val())
			
			var checks=$("#mainContent .checkbox");
			checks.each(function()
			{
				var id= $(this).attr("id");
				var label_id= "l_"+id;
				if(id!="BirthdtCheck")
				{
					var val= $(this).hasClass("checked")?"Yes":"No";
					$("#"+label_id).text(val);
					
					
				}
				
			}		
			
			)
			//birthdate
			$("#l_birthDate").text($("#fake").text());
			
		},
		
		copyFromLabelsToFields:function()
		{
			//copio dalle label agli input
			console.log("copyFromLabelsToFields")
			
			var inputs= $("#mainContent :input");
			inputs.each(function()
			{
				var id= $(this).attr("id");
				var label_id= "l_"+id;
				var type= $(this).attr("type");
				var tag= $(this).prop("tagName").toLowerCase();
				if(tag=="select")
				{
					var toFind=$("#"+label_id).text();
					$("#"+id+" option").each(function () {
				        if ($(this).text() == toFind) {
				            $(this).attr("selected", "selected");
				            return;
				        }
				    });				
					
				}
				else
				{
					$(this).val($("#"+label_id).text());
				}
				
				
			}		
			)
			
			var checks=$("#mainContent .checkbox");
			checks.each(function()
			{
				var id= $(this).attr("id");
				var label_id= "l_"+id;
				if(id!="BirthdtCheck")
				{
					$(this).removeClass("checked");
					var lval= $("#"+label_id).text();
					
					if(lval=="Yes")
						$(this).addClass("checked");
					
				}
				
			}		
			
			)
			//birthdate			
			$("#BirthdtCheck").removeClass("checked");
			var birthd= $("#l_birthDate").text();
			$("#fake").text(birthd)
			if(birthd.length==5)//fake year
			{
				$("#BirthdtCheck").addClass("checked");
				$("#Birthdt").attr("value", "1900-"+birthd);
			}
			else
			{
				$("#Birthdt").attr("value", birthd);
			}
			
			
		},
		
		toggleMode:function()
		{
			cardHandler.somethingChanged=false;
			cardHandler.isEditMode=!cardHandler.isEditMode;
			cardHandler.setMode()
			$("#cardEdit").toggleClass("editON");
            cardHandler.refreshCurrentCard();
		},
		
		//modifica effettuata correttamente. Copio da fields a label e cambio modalità in readonly
		onEditSuccess:function(exit)
		{
			if(exit)
			{
				closeCard();
			}
			else
			{
				cardHandler.copyFromFieldsToLabels();
				cardHandler.toggleMode(); //da edit a readonly
			}
			
		},
		
		onEditConfirmed:function(exit)
		{
			
			var result = cardHandler.validate()
			
			if( result.isValid)
			{
				hideModal()
				//chiamo l'edit
				cardHandler.editCustomerData(exit);
			}
			else
			{
				showBasicDialog(result.message);
			}
			
			
			
			
		},
		
		onEditRefused:function()
		{
			hideModal()
			cardHandler.copyFromLabelsToFields(); //ricopio i valori vecchi
			cardHandler.toggleMode();
		},
		
		onPencilClick:function()
		{
			if(!cardHandler.isEditMode)  // passo a edit. Nessun check da fare
			{
				cardHandler.toggleMode(); //toggle da readonly a edit
			}
			else
			{
				if(cardHandler.somethingChanged)
				{
					//faccio vedere dialog
					showYesNoCancelDialog({
						message:"Customer data have been changed. Do you wish to save the new data?",
						yesCallback:"cardHandler.onEditConfirmed()",
						noCallback:"cardHandler.onEditRefused()"
						
					})
				}
				else
				{
					cardHandler.toggleMode(); //toggle da edit a readonly
				}
				
				
				
			}
			
		},
		
		
		
		getClientData: function ()
		{
			htmlRequest("service.app",
			{
				action : 'getCustomerData',
				
				clientId:cardHandler.clientId,
				brand: authUser.brand_crm
			}
			      		
			
			);

		},
		getPurchaseSummary: function()
		{
			htmlRequest("service.app",
			{
				action : 'getPurchaseSummary',
				
				clientId:cardHandler.clientId
				
			}
			      		
			
			);

		},
		
		getPurchaseDetail:function ()
		{
			htmlRequest("service.app",
			{
				action : 'getPurchaseDetail',
				
				clientId:cardHandler.clientId
				
			}
			      		
			
			);

		},
		
		showCard:function(id)
		{
			$(".card").hide();
			
			$("#"+id).show();
		},
		
		toggleCheckbox:function(element)
		{
			cardHandler.somethingChanged=true;
			element.classList.toggle("checked");
			
		},
		

		toggleFakeYear : function() {
			cardHandler.somethingChanged=true;
			document.getElementById("BirthdtCheck").classList.toggle("checked");
			var isFakeYear = document.getElementById("BirthdtCheck").classList.contains("checked");
			var fakeValue = document.getElementById("fake").innerHTML;
			if (isFakeYear) {
				if (fakeValue) {
					document.getElementById("fake").innerHTML = fakeValue.substring(5);
					$("#Birthdt").attr("value", "1900-" + fakeValue.substring(5));
				} 
				else {
					$("#Birthdt").attr("value", "1900-01-01");
				}

			} 
			else // passo a data reale e non fake
			{
				if (fakeValue) {
					document.getElementById("fake").innerHTML = "1900-" + fakeValue;
				}
			}

		},
		
		onBirthdayChange: function()
		{
			var dvalue=$("#Birthdt").attr("value");
			var isFakeYear = document.getElementById("BirthdtCheck").classList.contains("checked");
			if(isFakeYear)
			{
				dvalue=dvalue.substring(5);
				$("#Birthdt").attr("value", "1900-"+dvalue);
			}
			document.getElementById("fake").innerHTML=dvalue
		},
		
		editCustomerData:function(exit)
	   {
		   
			var isFakeYear = document.getElementById("BirthdtCheck").classList.contains("checked");
			var Birthdt=$("#Birthdt").val();
			
			var dd = Birthdt.substring(8, 10);
			var mm = Birthdt.substring(5, 7);
			var yyyy =Birthdt.substring(0, 4);
			
			if(isFakeYear)
			{
				yyyy="0002" //default fake year
			}
			
			
			
		   var callparams = {
				   action: "editCustomerData",
				    exit: exit?true:false,  //per vedere se uscire o meno dopo modifica
				    SmPartner:this.clientId,
					ImBirthDd : dd,
					ImBirthMm : mm,
					ImBirthYyyy : yyyy,
					SiBrand : authUser.brand_crm,
					
				};
		   
		   var inputs= $("#mainContent :input");
			
			inputs.each(function()
			{
				var val= $(this).val();
				
				var id= $(this).attr("id"); 
				callparams[id]=val;
				
			}		
			)
			
			var checks=$("#mainContent .checkbox");
			checks.each(function()
			{
				var id= $(this).attr("id"); 
				if(id!="BirthdtCheck")
				{
					var val= $(this).hasClass("checked")?"X":"";
					callparams[id]=val;
					
					
				}
				
			}		
			
			)
			
			console.log(JSON.stringify(callparams));
			showActInd();
			htmlRequest("service.app", callparams);
	   },

			// inizializza il componente
	  onDocumentReady:function()
	  {
		  $(document).ready(function() {
				
		         
				cardRoller= new Roller({
					name:"cardRoller",
					tableId : "rollingTableCard",
					scrollingId : "leftMenu",
					activePosition : 5,
					//opzionali
					scrollType : "vertical",
					callback : function(activeElement) {
						var target = activeElement.cells[0].getAttribute("target");
						//solo se non è disabilitato
						if(!activeElement.cells[0].classList.contains("disabled"))
						{
							cardHandler.showCard(target);
						}
						else
						{
							$(".card").hide();
						}
						

					},
					cellDimension : 70
				});
				
				

				/*$(".menuItem").click(function() {
					var target = $(this).attr("target");
					if (target)
						cardHandler.showCard(target);
				})*/
				cardHandler.setMode();

			});
	  },
	   
	openCustomer : function(clientId) {
        this.clean();
		this.clientId = clientId;
		this.isEditMode = false;
		this.somethingChanged=false;
		this.getClientData();
		this.getPurchaseSummary();
		this.getPurchaseDetail();
		wishManager.printCustomerWishList(clientId);
		showActInd();

		

	},
	
	clean:function()
	{
		$(".card").each(function()
		{
			if($(this).attr("id")!="manageWishlist")
			{
				$(this).html("");//clean cards
			}
			else
			{
				$("#mytable > tbody").html("");
			}
				
		})
		
		
		
		
		$("#cardTitle").html("");
		$("#productFooter").html("");
		$("#cardEdit").removeClass("editON");
		$(".menuItem").addClass("disabled");
		if(getById("leftMenu"))
			getById("leftMenu").scrollTop=0;
	},
	
	showDetail:function(detail)
    {
		for (var key in detail)
		{
			if(getById(key))
			{
				if( key!="d_thumb")
				{
					getById(key).innerHTML=detail[key];
				}
				else
				{
					getById(key).src=detail[key];
				}
				
			}
				
		}
	   	
		$("#productDetail").show();
    },
    hideDetail:function()
    {
    	$("#productDetail").hide();
    },
    setDisabledCards:function()
    {      
        $(".menuItem").each(function()
    	    {
    		   var target=$(this).attr("target")
    		   var counter=0;   		   
    		   // count
    		   if(target && target!="manageWishlist")
    		   {
	    		   $("#"+target+" tr td:nth-child(2)").each(function() {
						
	    			   if($(this).parent().hasClass("editable"))
	    			   {
	    				   if($(this).find("label").text())				
							{
								counter++;
							}
						}
						else if ($(this).text()) 
						{
							
								counter++;
							
						}
					});
	    		   
	    		   //all void
	    		   if(counter==0)
	    		   {
	    			   $(this).addClass("disabled");
	    		   }
	    		   else
	    		   {
	    			   $(this).removeClass("disabled");
	    		   }
    		   }
     		   else if (target && target == "manageWishlist") {
				// controllo se ci sono elementi nella tabella dei wish
				if ($(".wishInnerTable").size() == 0) {
					$(this).addClass("disabled");
				} else {
					$(this).removeClass("disabled");
				}

			}
    		   
    	    })
    	
    },
    toggleWishItem:function(id)
    {
    	if(!id) return;
    	
    	var element= $("#wishSelect"+id);
    	
    	if(element.attr("src").indexOf("empty")!=-1)
		{			
			element.attr("src", baseUrl+"store_app/select_full_icon.png")
		}
		else
		{				
			element.attr("src", baseUrl+"store_app/select_empty_icon.png")
		}
    	
    	
    },
    selectAllWishItems:function()
    {
    				
		$(".wishSelect").attr("src", baseUrl+"store_app/select_full_icon.png")
		
    	
    	
    },
    deselectAllWishItems:function()
    {
    				
		$(".wishSelect").attr("src", baseUrl+"store_app/select_empty_icon.png")
		
    	
    	
    },
    
    deleteSelectedWishItemsConfirm:function()
    {
    	var html= yesnoDialog;
    	html=html.replace("[MESSAGE]", "Are you sure you want to delete all the items selected?");
    	html=html.replace("[YES]", "cardHandler.deleteSelectedWishItems()");
    	
    	showModal(html);
    },
    
	deleteSelectedWishItems : function() {
		var toDelete = [];
		try {
			$(".wishSelect").each(function() {
				if ($(this).attr("src").indexOf("full") != -1) {
					
					var dId= parseInt($(this).attr("targetId"),10)

					toDelete.push(dId);
				}

			})
			console.log("deleting "+ JSON.stringify(toDelete));
			wishManager.deleteWishItems(toDelete, function()
			{
				wishManager.printCustomerWishList(cardHandler.clientId);
			}		
			
			);
		} catch (e) {
			console.log(e.message);

		}
		
		
		
	}
    
		
}
