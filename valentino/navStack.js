var NavStack = function(user, sessionid) {
	this.version = "1.2";
	this.sessionid=sessionid;
	this.dbName = "valentino_" + user.username + "_" + user.brand + '_DB';
	
	this.types = [ "collections","lines", "looks", "products", "links", "search", "customers" ]
	var maxSize = '65536';
	
	
	this.db = openDatabase(this.dbName, "", this.dbName, maxSize);
    
	if(this.db.version != this.version){
		  this.db.changeVersion(this.db.version, this.version, function(){	
			  //eventuali migrazioni
		  });
		}
	
  this.createSchema();	
  
};

NavStack.LOG_TAG="NAV_STACK ";

NavStack.prototype.createSchema=function()
{
	this.db.transaction(function(transaction) {		
		transaction.executeSql('CREATE TABLE IF NOT EXISTS nodes ' + '('
				+ 'id VARCHAR(50) PRIMARY KEY,'
				+ "label VARCHAR(50) NOT NULL DEFAULT '' ,"
				+ 'type VARCHAR(60) NOT NULL,'
				+ 'lastAccessDate DATETIME NOT NULL,' 
				+ "lastFlavour VARCHAR(60),"
				+ "sessionid VARCHAR(60),"
				+ 'url BLOB NOT NULL'
				+ ')',[], 
			    function(transaction,results){
			//console.log("Successfully created")
			},
			    function(transaction,error){console.log("Could not create nodes "+ error.message)});
		
		transaction.executeSql('CREATE TABLE IF NOT EXISTS edges ' + '('				
				+ 'parentId VARCHAR(50) ,'
				+ 'childId VARCHAR(50) ,' 
				+ "sessionid VARCHAR(60),"
				+ 'PRIMARY KEY (parentId, childId))',[], 
			    function(transaction,results){
			//console.log("")
			},
			
			    function(transaction,error){console.log("Could not create edges "+ error.message)});
		
		transaction.executeSql('CREATE TABLE IF NOT EXISTS favourites ' + '('				
				+ 'id VARCHAR(50) PRIMARY KEY,'
				+ 'type VARCHAR(50) ,'
				+ 'url BLOB NOT NULL,'
				+ 'creationDate DATETIME NOT NULL,'
				+ "attributes BLOB NOT NULL )" 
				,[], 
			    function(transaction,results){
			//console.log("");
			},
			
			    function(transaction,error){
				console.log("Could not create favourites "+ error.message)}
			);
		
		

	});
}

NavStack.prototype.splitUrlAndFlavour=function(url, type )
{
	var splitted= url.split("&")
	var item={
		url:"",
		flavour:""
	}
	
	var ignoredParams=["forceExecutionName", "flavour"];
	
	if(type=="products")
	{
		ignoredParams.push("color");
		ignoredParams.push("store");
		ignoredParams.push("brand");
	}
	
	for(var i=0; i<splitted.length; i++)
	{
		var tokens= splitted[i].split("=");
		var param=tokens[0];
		
		if(ignoredParams.indexOf(param)==-1)
		{
			item.url+=splitted[i]+"&";
		}
		
		if(splitted[i].indexOf("flavour=")!=-1)
		{
			item.flavour= splitted[i].replace("flavour=","");
		}
	}
	item.url= item.url.slice(0,-1); //levo & finale
	return item;
}

//inserisce nodo nel db e naviga nell'url
/*
 * input: 
 * 	item= 
 * 	{ 
 * 		url	url del nodo  
 * 		parentUrl (optional se non inserito verrà preso url corrente) 
 * 		type tipo nodo
 * 		label	descrizione del nodo 	
 *  }
 */
NavStack.prototype.navigate=function(item)
{
	
	item=this.processItem(item)
	
	this.insertItem(item, function(){window.location.assign(item.completeUrl)});
	
}

// inserisce url nel db senza navigazione.
/*
 * input: 
 * 	item= 
 * 	{ 
 * 		url	url del nodo  
 * 		parentUrl (optional se non inserito verrà preso url corrente) 
 * 		type tipo nodo
 * 		label	descrizione del nodo 	
 *  }
 */
NavStack.prototype.trace=function(item)
{

	item=this.processItem(item)
	
	this.insertItem(item, function(){});
	
}
NavStack.prototype.processItem=function(item)
{
	var sp=this.splitUrlAndFlavour(item.url, item.type);
	item.completeUrl=item.url;
	item.url=sp.url;
	item.lastFlavour=sp.flavour;

	if(!item.parentUrl)
	{
		item.parentUrl=location.href.split('/').slice(-1)[0];
	}
	item.parent=this.splitUrlAndFlavour(item.parentUrl).url;
	
	return item;
	
}



NavStack.prototype.drawBookmarkByType=function(idContainer)
{
	
	var that=this
	function draw(typeMap)
	{
		var html="";
		
		for(var type in typeMap)
		{
		  if($.inArray(type, that.types)!=-1)	
			{
			  var children=typeMap[type];
			   html+="<span>"+type+"</span>"
			   html+="<ul>";
			   for (var i=0; i<children.length; i++)
				   {
				      var item=children[i];
				      
				      var url=item.url;
				      if(item.lastFlavour)
				       {
				    	  url+="&forceExecutionName=setFlavour.txt&flavour="+item.lastFlavour
				       }
				      
				      html+="<li onclick=\"window.location.assign('"+url+"')\">"+item.label+"</li>"
				   }
			   html+="</ul>";
			}
		   
		}
		
		
		
		if(getById(idContainer))
		{
			getById(idContainer).innerHTML=html;
		}
		
		
	}
     
	this.getItemsByType(draw);
}

NavStack.prototype.cleanSession=function(tr, sessionid)
{
	tr.executeSql("delete from nodes where sessionid<>?",[sessionid]);
	tr.executeSql("delete from edges where sessionid<>?",[sessionid]);
}

/*
 *  Restituisce una mappa con i tipi che viene passata alla callback
 * */
NavStack.prototype.getItemsByType=function(callback)
{
	var that=this;
	
	this.db.transaction(function(tr) {
		
		 that.cleanSession(tr, that.sessionid);
		 tr.executeSql("select * from nodes  order by type asc, lastAccessDate desc",[], 
			   function(tr, results)
			   {
			      var typeMap={
			    		  
			      } 
			      var NumRows = results.rows.length;
			      for(var i=0; i<NumRows; i++)
			    	 {
			    	   var item= results.rows.item(i);
			    	  
			    	   if(!typeMap[item.type])
			    	   {
			    		   typeMap[item.type]=[];
			    	   }
			    	   
			    	   typeMap[item.type].push(item);
			    	   
			    	  
			    	 }
			      		      
			      callback(typeMap);
			       
			   },
			   function(tr, error) {
					console.log(NavStack.LOG_TAG
							+ "getItemsByType failed. Errore:"
							+ error.message + ' Codice:'
							+ error.code);
					
				}
		       
		     );
		
	}
	);
}



NavStack.prototype.insertItem = function(item, callback) {
   var that=this;   
   var hash= CryptoJS.SHA1(item.url).toString()
	
   this.db.transaction(function(tr) {
				tr.executeSql("insert or replace into nodes (id, label, type, lastFlavour, url,sessionid,  lastAccessDate) values (?,?,?,?,?,?,?)",
								[ hash, item.label, item.type, item.lastFlavour, item.url,that.sessionid,new Date()],
								function(tr, results) {
									
					              
								}, function(tr, error) {
									console.log(NavStack.LOG_TAG
											+ "insertItem node creation failed. Errore:"
											+ error.message + ' Codice:'
											+ error.code);
									
									
								}
							)
				if(item.parent)
				{
					var parentHash= CryptoJS.SHA1(item.parent).toString()
					tr.executeSql("insert or replace into edges (parentId, childId, sessionid) values(?,?,?)", [parentHash, hash, that.sessionid],function(tr, results) {
						
		
					}, function(tr, error) {
						console.log(NavStack.LOG_TAG
								+ "insertItem edge creation failed. Errore:"
								+ error.message + ' Codice:'
								+ error.code);
						
					})
				}
				

			}, callback, callback)

};






NavStack.prototype.clearCache = function() {
	this.db.transaction(function(transaction) {
		transaction.executeSql('delete from nodes ');
		transaction.executeSql('delete from edges ');
	});

};
NavStack.prototype.executeSql = function(query, params, callback) {
	this.db.transaction(function(transaction) {
		transaction.executeSql(query, params, callback
		);
	});

};

//Favourites
/*params
{
	drawFunction: funzione callback per disegnare i preferiti
	type: look o product
	offset: opzionale per paginazione
	limit: opzionale per paginazione
	

}*/

NavStack.prototype.favouritesDraw = function(callback) {
	
	
	this.db.transaction(function(tr) {
		 tr.executeSql("select * from favourites  order by creationDate desc",[], 
			   function(tr, results)
			   {
			       
			     var numRows= results.rows.length
			     var output=[];
			     for(var i=0; i<numRows; i++)
			    	{
			    	 var record= results.rows.item(i);
			    	 var item= JSON.parse(record.attributes);
			    	 
			    	 item.id=record.id
			    	 item.url=record.url			    				    	 
			    	 output.push(item);
			    	}
			     
			    // console.log(JSON.stringify(output));
			     
			     callback(output);
			      		      
			       
			   },
			   function(tr, error) {
					console.log(NavStack.LOG_TAG
							+ "favouritesDraw failed. Errore:"
							+ error.message + ' Codice:'
							+ error.code);
					
					callback([]);
					
				}
		       
		     );
		
	}
	);
	
	
	
	
	

};
/**
 * aggiunge un prodotto ai preferiti
 * favObject:
 * {
 *    "id":"IB0VA3601ED",
 *    "url":url immagine
	  "class": "DRESS EMBROIDERED"

	  //SE VUOI AGGIUNGERE ALTRI CAMPI 
 * 
 * }
 * */
NavStack.prototype.favouritesAdd = function(favObject) {
 
	
	this.db.transaction(function(tr) {
		tr.executeSql("insert or replace into favourites (id, type, url, creationDate, attributes ) values (?,?,?,?,?)",
						[ favObject.id, "product", favObject.url, new Date(), JSON.stringify(favObject)],
						function(tr, results) {
							
			              
						}, function(tr, error) {
							console.log(NavStack.LOG_TAG
									+ "favouritesAdd creation failed. Errore:"
									+ error.message + ' Codice:'
									+ error.code);
							
							
						}
					)
		
		

	}, null, null);
	navStack.favouritesDraw(productlistFavourite);
};




/**
 * rimuove un prodotto dai preferiti
 * idFav: sapid del preferito se prodotto, da definire se look
 * 
 * */
NavStack.prototype.favouritesRemoveSingle = function(idFav, callback) {
	
   this.favouritesRemove([idFav], callback);
};
/**
 * rimuove un elenco di prodotti dai preferiti
 * idArray: array contenente gli id degli elementi da cancellare 
 * 
 * */
NavStack.prototype.favouritesRemove = function(idArray, callback) {
	
	this.db.transaction(function(tr) {
		
		for(var i=0; i<idArray.length; i++)
	   {
		tr.executeSql("delete from favourites where id=? ",
						[ idArray[i] ],
						function(tr, results) {
							if(callback)
								callback();
			 
			              
						}, function(tr, error) {
							console.log(NavStack.LOG_TAG
									+ "Favourite deletion failed:"
									+ error.message + ' Codice:'
									+ error.code);
							
							
						}
					);
		
		

	   }
	  
	}, null, null);
	
	

};

/**
 * dice se un prodotto è favorito
 * * params:
 * {
 *    "id": id del prodotto,
	  "callback": funzione da eseguire con la risposta 
	 
 * 
 * }
 * 
 * */
NavStack.prototype.isFavourite = function(params) {
	
	this.db.transaction(function(tr) {
		 tr.executeSql("select * from favourites  where id=?",[params.id], 
			   function(tr, results)
			   {
			       
			      var NumRows = results.rows.length;
			      if(NumRows>0)
			    	 params.callback(true);
			      else
			    	  params.callback(false);
			      		      
			       
			   },
			   function(tr, error) {
					console.log(NavStack.LOG_TAG
							+ "isFavourite failed. Errore:"
							+ error.message + ' Codice:'
							+ error.code);
					
					params.callback(false);
					
				}
		       
		     );
		
	}
	);
	
	
	
	
     
};



