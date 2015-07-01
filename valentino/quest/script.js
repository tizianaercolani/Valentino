var state="HOME";
var mode="HOME";
var lastMode="";
/*   ----BARCODE START-----*/


function searchBarcodeHW(eancode)
{
	if(getById("waitBarcode"))
	{
		searchBarcode(eancode);
	}
	else
	{
		console.log("searchBarcodeHW: Modale non aperta.");
	}
	
	
	return eancode;
	//showBasicDialog("Nughy "+eancode);	
}


var barcodeHandler={
		checkStatus:function()
		{
			/*se getStatus non è implementato nel container nativo
			 * v 1.3 container o inferiori
			 *  
			 * */
			if (typeof(getStatus) == 'undefined') 
			{
				console.log("BARCODE HANDLER: Vecchia versione container. Chiamo fotocamera");
				nativeCallback('barcodeBtn')					
			}
			/*
			 * v.1.4 o superiori
			 * */
			else			
			{
				var status =getStatus();
				console.log("BARCODE HANDLER: status "+status);
				if(status>1) //hw collegato
				{
					
					console.log("BARCODE HANDLER: .Hw collegato. Apro modale");
					showModal(waitBarcodeDialog);
				}
				else //hw non collegato 
				{
					console.log("BARCODE HANDLER: .Hw non collegato o non attivo. Chiamo fotocamera");
					
					nativeCallback('barcodeBtn')		
				}
			}	
			
			
		},
		isSearching:false
		
}



function searchBarcode(eancode) {

	showActInd();

	showWaitingDialog("Please Wait. Testing Ean Code " + eancode);

	htmlRequest("service.app", {
		action : "getMaterialsFromEan",
		EAN : eancode,

	}, function(req, params) {

		hideActInd();
		if (req.status == 200) {
			console.log(req.responseText);
			var output = JSON.parse(req.responseText);

			if (output.error) {
				showBasicDialog("Connection error.");
			} else if (!output.material) {
				showBasicDialog("No product found with ean code " + eancode);

			} else {
				hideModal();
				navigateProduct(output.material, output.color);
			}

		} else {
			showBasicDialog("Connection error.");
		}
	}, function() // offline Handler
	{
		hideActInd();
		showBasicDialog("Connection error.");
	}

	)

}
function callBarCodeReader()
{
	
	var url= "pic2shop://scan?callback="+barCodeAlias+"://EAN";
	window.location.assign(url);
}

/*   ----BARCODE END-----*/




function goBack()
{
	if(mode=="HOME"){
		history.back();
		
	}
	if(mode=="STORE"){
	  state="HOME";
	  store="";
	  storesListHide();
	  mode="HOME";
	}
	if(mode=="INFO" && state=="STORE"){
		prodInfoHide();
		storesListShow();
		$('#inputcode').val("");
		}
	  if(mode=="INFO" && state=="HOME"){
			prodInfoHide();
			mode="HOME";
			$('#inputcode').val("");
		}
	if(mode=="ADV" ){
		clearFilters();
		advHide();
		

		
		}
	if(mode=="PROD" ){
	    mode="ADV"
	    
		contentListHide();
	}
	
	if(mode=="PRODCARD")
	{
		if($("#product360-Element").is(':visible'))
		{
			productHandler.prod360Hide();
		}
		else
		{
			if(lastMode=="PROD")
			{
				$("#content").show();
			}
				
			mode=lastMode
			
			
			$("#containerProduct").hide();
			productHandler.clear();
			
		}
		
		
	}
	
}


/*
 * Stati
 * HOME homepage
 * STORE elenco store (stato opzionale se si passa da availability)
 * INFO  scelta tra codice, barcode e adv search
 * ADV ricerca avanzata
 * PROD risultati ricerca prodotti
 * 
 * 
 * */

/*Funzione che si occupa del cambio modalità*/
/*function goBack()
{
	if(mode=="HOME"){
		history.back();
		
	}
	else if(mode=="STORE"){
	 changeMode("HOME");
	}
	else if(mode=="INFO" && state=="STORE"){
		changeMode("STORE");
		}
	else if(mode=="INFO" && state=="HOME"){
		changeMode("HOME");
	}
	else if(mode=="ADV" ){
		changeMode("INFO");
		
	}
	else if(mode=="PROD" ){
		changeMode("ADV");
	}
	
}
*/
/*
function changeMode(newMode)
{
	var lastMode= mode;
	mode= newMode;
	
	
	if(mode=="HOME"){
		
		
	}
	else if(mode=="STORE"){
	 
	}
	else if(mode=="INFO" ){
		
	}
	
	else if(mode=="ADV" ){
		
		
	}
	else if(mode=="PROD" ){
		
	}
	
	
}
*/


function clearFilters()
{
	$('#inputcolor').val("");
	 $('#inputfabric').val("");
	$('#inputclass').val("");
	seasonRoller.scrollToPosition(0);
	collectionRoller.scrollToPosition(0);
	lineRoller.scrollToPosition(0);
	
}

function change(){
	if(state=="STORE" && mode!="STORE"){
		getStores(store);
		
	}else{
		$('#divStore').hide();
	}
	
}



function prodInfoShow(){
    mode="INFO";
    change();
    $('#inputcode').val("");
	$("#prod-Fixed").show();
	$("#product-info").addClass("product-infoPopUp");
	$("#product-info").removeClass("product-infoPopDown");
	$("#product-info").show();
	$("#centralDiv").hide();
}

function closeAll(){
	$("#prod-Fixed").hide();
	$("#product-info").hide();
	$("#advanced-search").hide();
	$("#storesListContainer").hide();
	$("#centralDiv").show();
}
function prodInfoHide(){
	change();
	$("#prod-Fixed").hide();
	$("#product-info").addClass("product-infoPopDown");
	$("#product-info").removeClass("product-infoPopUp");
	$("#product-info").hide();
	$("#centralDiv").show();
}
function advShow(){
	mode="ADV";
	
	change();
	 prodInfoHide();
	$("#prod-Fixed").show();
	$("#advanced-search").addClass("advanced-searchPopUp");
	$("#advanced-search").removeClass("advanced-searchPopDown");
	$("#advanced-search").show();
	$("#centralDiv").hide();
}
function contentListShow(){
	change();
	mode="PROD";
	$("#advanced-search").hide();
	$("#prod-Fixed").show();
	$("#content-List").addClass("content-ListPopUp");
	$("#content-List").removeClass("content-ListPopDown");	
	$("#content-List").show();
	getById("content").scrollTop=0;
	$("#centralDiv").hide();
	
}
function contentListHide(){
	advShow();
	change();
	$("#content-List").addClass("content-ListPopDown");
	$("#content-List").removeClass("content-ListPopUp");
	
	$("#content-List").hide();
	if(getById("content"))
	{
		getById("content").innerHTML="";
		getById("content").scrollTop=0;
	}
	
	

}
function advHide(){
	prodInfoShow();
	change();
	$("#advanced-search").addClass("advanced-searchPopDown");
	$("#advanced-search").removeClass("advanced-searchPopUp");
	$("#advanced-search").hide();

}
function storesListShow(){
	mode="STORE";
	state="STORE";
	change();
	$("#prod-Fixed").show();
	$("#storesListContainer").addClass("product-infoPopUp");
	$("#storesListContainer").removeClass("product-infoPopDown");
	$("#storesListContainer").show();
	$("#centralDiv").hide();
}

function storesListHide(){
	change();
	$("#prod-Fixed").hide();
	$("#storesListContainer").addClass("product-infoPopDown");
	$("#storesListContainer").removeClass("product-infoPopUp");
	$("#storesListContainer").hide();
	$("#centralDiv").show();
}

function changeRegion()
{
	var e = document.getElementById("regionSelect");
	var r3 = e.options[e.selectedIndex].value;
	var regionDesc = e.options[e.selectedIndex].text;
	getById("regionSelected").innerHTML="in " +regionDesc+ " region";
	getStoresList(r3);
}

function nascondi(c){
	$("#"+c+"").hide();
	}


function goToCrm()
{
	var url="run.app?id="+crmId+"&startMode=SEARCH&display=quest"
	window.location.assign(url);

}

function searchProd() {
	var code = $('#inputcode').val().toUpperCase();
	if (!code) {
		showBasicDialog("Please insert a Product Code. ");
		$('#inputcode').blur();
	} else {
		showActInd();
		htmlRequest("service.app", {
			action : 'getProductExist',
			code : code

		}, null,
		function() //offline Handler
		{
			hideActInd();
			showBasicDialog("Connection error.");
		}
		);

	}
}
function getStores(store)
{
	htmlRequest("sapservice.app",
	{
		action : 'getStores',
		forceTemplateName : 'valentino/sapservice/getStores/storeInfo.html',
		store:store
		
	},null,
	function() //offline Handler
	{
		hideActInd();
		showBasicDialog("Connection error.");
	}
	      		
	
	);

}



$(document).ready(function (){

	$('#inputcode').keydown(function() {
		if (event.keyCode == 13) {
			searchProd();
		}
	});
	
});

function getSeasonFilters(){
	htmlRequest("service.app",
			{   action:"getSeasonFilters"
				
			    
			  
			});
}

function getCollectionFilters(){
	htmlRequest("service.app",
			{   action:"getCollectionFilters"
				
			    
			  
			});
}

function getLineFilters(){
	htmlRequest("service.app",
			{   action:"getLineFilters"
				
			    
			  
			});
}


function getCollectionName(){
	htmlRequest("service.app",
			{   action:"getSeason",
				
			    forceTemplateName : 'valentino/service/getCollectionName/main.html',
			  
			});
}
	
function goToProduct(sap_id){
	var sapid=sap_id.toUpperCase();
	navigateProduct(sapid);
	
}

function navigateProduct(sapid, color)
{   
	lastMode=mode;
	mode="PRODCARD";
	var item={
			url:'run.app?id='+prodId+'&sapid='+sapid,
			label:sapid,
			type:"products",
			parentUrl:""
			
	}
	
	if(color)
		item.url+="&color="+color;
	
	navStack.trace(item);
	showActInd();
	
	
	
	
	productHandler.openProduct({
		sapid:sapid,
		
		color:color,
		store:store,
			
	})
	
	
	//navStack.navigate(item);
	//getSizesColors(sapid);
	//window.location.assign('run.app?id='+prodId+'&sapid='+sapid+'&store='+store+'');
}

function getLineName(season,collection)
{
	htmlRequest("service.app",
	{
		action : 'getLines',
		
		forceTemplateName : 'valentino/service/getLineName/main.html',
			season_number:season,
			collection:collection
	}
	      		
	
	);

}



var seasonRoller;
var collectionRoller;
var lineRoller;
$(document).ready(function() {
  
	seasonRoller= new Roller({
		name:"Season Roller",
		tableId : "rollingTableSeason",
		scrollingId : "scrollerSeason",
		activePosition : 3,
		
		//opzionali
		scrollType : "horizontal",
		activeClass: "filterSelected",
		callback : function(activeElement) {
		
		//saveCollection();
		
		// getLineName(season_number,collection);

		},
		cellDimension : 200
	});
	
	collectionRoller= new Roller({
				name:"Collection Roller",
				tableId : "rollingTableCollection",
				scrollingId : "scrollerCollection",
				activePosition : 3,
				
				//opzionali
				scrollType : "horizontal",
				activeClass: "filterSelected",
				callback : function(activeElement) {
				
				//saveCollection();
				
				// getLineName(season_number,collection);

				},
				cellDimension : 200
			});
  
  lineRoller= new Roller({
		name:"Line Roller",
		tableId : "rollingTableLine",
		scrollingId : "scrollerLine",
		activePosition : 3,
		
		//opzionali
		scrollType : "horizontal",
		activeClass: "filterSelected",
		callback : function(activeElement) {
			//saveLine();
		},
		cellDimension : 200
	});


});

/*Funzione che effettua la ricerca avanzata*/
function getContent(index) 
{
	var color = $('#inputcolor').val().toUpperCase();
	var fabric = $('#inputfabric').val().toUpperCase();
	var model = $('#inputclass').val().toUpperCase();
	var limit=30;

	var season = $("#scrollerSeason .filterSelected").attr("target");
	var collection = $("#scrollerCollection .filterSelected").attr("target");
	var line = $("#scrollerLine .filterSelected").attr("target");

	if (season == "" && collection == "" && line == "" && color == ""
			&& fabric == "" && model == "") 
	{

		showBasicDialog("Please insert at least a search parameter.");

	} else {

		showActInd();
		if (index == 0) {
			htmlRequest("service.app", {
				action : 'getContent',

				season : season,
				collection : collection,
				line : line,
				color : color,
				store : store,
				idprod : prodId,
				fabric : fabric,
				model : model,
				index : index,
				limit: limit
			}, null, function() // offline Handler
			{
				hideActInd();
				showBasicDialog("Connection error.");
			});
		} else {
			htmlRequest("service.app", {
				action : 'getContent',
				season : season,
				collection : collection,
				line : line,
				color : color,
				store : store,
				idprod : prodId,
				fabric : fabric,
				model : model,
				index : index,
				limit: limit
			}, function(req, params) {
				hideActInd();
				if (req.status == 200) {
                  $("#arrow_"+index).hide();
					var html = req.responseText;
					$("#content").append(html);
				}
			}, function() // offline Handler
			{
				hideActInd();
				showBasicDialog("Connection error.");
			});
		}
	}
}


function getStoresList(region){
	htmlRequest("sapservice.app",
			{   action:"getStoresFull",
				
			    forceTemplateName : 'valentino/sapservice/getStoresList/main.html',
			    region:region
			  
			});
}
var store="";
function saveStore(valStore){
	store=valStore;
	$("#storesListContainer").hide();
	prodInfoShow();
}




