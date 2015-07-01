var wishManager={
		tokenUrlEncoded:
"lR4Fmx7cUjWJDchaOXRrjbvyRWNF+VrQBCVy1rFklKB35bT3iEBVKve8ko/t/KjUmFqtqz4uQCWtaUGeZdKiMERd1xiR/6/K9ltD55GY2qUiIXQUkDHoNfTCoT/w2OqfBnF5mlTQUgsFi/KDhBktOgo0",
		
        getEntityId:function()
        {
        	return "currentCustomer_"+authUser.username;
        }, 

        getCurrentCustomer:function()
        {
        	var returnObj = null;
    		var itemString = localStorage.getItem(this.getEntityId());
    		if (itemString) {
    			returnObj = JSON.parse(itemString);
    		}

    		return returnObj;
        },
        
        setCurrentCustomer:function(id, title)
        {
        	localStorage.setItem(this.getEntityId(), JSON.stringify(
        	{
        		id:id,
        		title:title
        	}		
        	));
        },


		/*
		 * 
		 * Dato un item, 
		 * restituisce il pathname
		 * 
		 * 
		 * item:
		 * {
		 *   clientId: codice crm del cliene
		 *   prodId: sapid del prodotto
		 *   color: colore prodotto
		 *   size: taglia prodotto
		 *   
		 * 
		 *
		 * }
		 * 
		 * */
		
		getPathName:function(item)
		{
			//uguale a tenantspec
			return item.prodId+":"+item.color+":"+item.size+":"+item.clientId+":"+authUser.username+":";
		},
		
		
		/*
		 * 
		 * Dati gli input, 
		 * verifica se l'item è già nella wishlist del cliente. 
		 * chiama la template isWished
		 * 
		 * 
		 * item:
		 * {
		 *   clientId: codice crm del cliene
		 *   prodId: sapid del prodotto
		 *   color: colore prodotto
		 *   size: taglia prodotto
		 *   
		 * 
		 *
		 * }
		 * 
		 * 
		 * DEPRECATED
		 * */
		
		isWished:function(item)
		{
			item.username= item.username;
			
			htmlRequest("run.app", {
				id : renderId,
				forceTemplateName : 'wishlist/isWished.html',
				wishpath : 'wishlist/' + this.getPathName(item)
			})
			
			
			
		},
		/* 
		 * crea un item di wishlist
		 * 
		 * item:
		 * {
		 *  
		 *   prodId: sapid del prodotto
		 *   color: colore prodotto
		 *   size: taglia prodotto
		 *   url: url anteprima prodotto
		 *   description: opzionale, se serve qualcosa per descrivere il prodotto lo mettiamo in un json
		 * 
		 * }
		 * 
		 * */
		createWishItem:function(item)
		{
			item.username= authUser.username;
			
			var cust= this.getCurrentCustomer();
			
			if(!cust)
			{
				showBasicDialog("Please select a Customer");
				return;
			}
			
			item.clientId=cust.id;
			
			showActInd();
			
		   try{
			var json = {
					parentPath : '/wishlist',
					path :  this.getPathName(item),
					type : 'wishitem',
					attributeList : [ {
						name : 'username',
						value : item.username
					},{
						name : 'clientId',
						value : item.clientId
					}, {
						name : 'prodId',
						value : item. prodId
					}, {
						name : 'color',
						value : item.color
					}, {
						name : 'size',
						value : item.size
					}, {
						name : 'thumbUrl',
						value : item.url?item.url:""
					}, {
						name : 'description',
						value : item.description?item.description:""
					}

					],
					
				};

			htmlRequest("workingJson.app", {
				action : 'integration',
				token: wishManager.tokenUrlEncoded,
				payload : JSON.stringify(json)
			}, function(req, params) {
				if (req.status == 200) {
					var res = JSON.parse(req.responseText);
					htmlRequest("workingJson.app", {
						action : 'deploy',
						token: wishManager.tokenUrlEncoded,
						id : res.id
					}, function(req2, params) {
						hideActInd();
						if (req2.status == 200) {
							console.log("Wishlist deployed");
							showBasicDialog("Wishlist updated.");
							wishManager.refreshWishCard();
						} else {
							showBasicDialog("Connection error.");
						}
					});
				} else {
					// on error
					hideActInd();
					showBasicDialog("Connection error.");
				}
			}, function() { // nessuna connessione
				hideActInd();
				showBasicDialog("Connection error.");
			});
			
			

		   }catch(e)
		   {
			   console.log(e.message)
			   hideActInd();
			   showBasicDialog("Error in wishlist updating: "+e.message);
		   }
			
			
		},
		
		/*
		 * 
		 *
		 * Cancella gli item contenuti nell'array
		 * 
		 * 
		 * array:
		 * formato da id di combenia
		 * 
		 * */		
		deleteWishItems:function( array, onSuccessCallback)
		{
			if(!array ||!Array.isArray(array) || array.length==0)
			{
				showBasicDialog("Please select at least one item");
				return;
			}
			showActInd();
		try{	
			htmlRequest("workingJson.app", {
				action : 'delete',
				token: wishManager.tokenUrlEncoded,
				ids : array.join()
			}, function(req, params) {
				hideActInd();
				if (req.status == 200) {
					
					htmlRequest("workingJson.app", {
						action : 'deployDelete',
						token: wishManager.tokenUrlEncoded,
						ids : array.join()
					},
					function()
					{
						showBasicDialog("Items deleted successfully.");
						onSuccessCallback();
					}
					)
					
					
					
					
				} else {
					console.log(JSON.stringify(req));
					showBasicDialog("Error in items deletion.");
				}
			}, function() { // nessuna connessione
				hideActInd();
				showBasicDialog("Connection error.");
			});
			
		}catch(e)
		{
			console.log(e.message)
			   hideActInd();
			   showBasicDialog("Error in wishlist deleting: "+e.message);
		}
			
			
			
		},
		
		/**
		 * stampa la wishlist di un cliente
		 * la template è opzionale, se non inserita verrà stampata quella di default 
		 * 
		 * */
		
		
		printCustomerWishList:function(clientId, templateName)
		{
			var username= authUser.username;
			var template="wishlist/wishlist.html"
			if(templateName)
				template=templateName
				
				htmlRequest("run.app", {
					id : renderId,
					forceTemplateName : template,
					username:username,
					clientId:clientId
				})
			
			
		},
		refreshWishCard:function()
		{
			try{
			if(cardHandler && cardHandler.clientId ) //ho scheda cliente 
				{
				  wishManager.printCustomerWishList(cardHandler.clientId);
				
				}
			}catch(e)
			{
				
			}
		}
}