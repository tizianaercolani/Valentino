var state="HOME";
var mode="HOME";
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
/*
function __testEan(eancode)
{
	window.location.assign('run.app');
}*/

function testEan(eancode){
	
	showActInd();
	
	showBasicDialog("Testing Ean Code "+eancode);
	
	htmlRequest("sapservice.app",
	{
		action:"getMaterialsFromEan",
		EAN: eancode,
		
		
	}, function(req, params) {
		
		hideActInd();
		if (req.status == 200) {
			
			var output = JSON.parse(req.responseText);
			showBasicDialog(req.responseText);
			/*if(output.error)
			{
				showBasicDialog("Connection error.");
			}
			else if(!output.material)
			{
				showBasicDialog("No product found with ean code "+ eancode);
				
			}
			else
			{
				navigateProduct(output.material)
			}
			
			
			*/
			
		}
		else
		{
			showBasicDialog("Connection error.");
		}
	},
	function() //offline Handler
	{
		hideActInd();
		showBasicDialog("Connection error.");
	}
	
	
	)
			
	
	//window.location.assign('run.app?id='+prodId+'&ean='+eancode+'&store='+store+'&sapid=IB3VA1N11CF');

}
function callBarCodeReader()
{
	//var urlProd= baseUrl+'run.app?id='+prodId+'&barcode=EAN&store='+store+'';
	//pic2shop://scan?callback=p2sclient%3A//EAN"
	//var url= "pic2shop://scan?callback=valentinoBarCode%3A//EAN";
	//var url = "pic2shop://scan?callback=p2sclient%3A//EAN";
	
	//var urlProd= baseUrl+'run.app?id='+prodId+'&barcode=EAN&store='+store+'';
	var url= "pic2shop://scan?callback=valentinoBarCode://EAN";
	console.log("URL CALLBACK: "+url);
	window.location.assign(url);
}

function goToCrm()
{
	var url="run.app?id="+crmId+"&startMode=SEARCH&display=quest"
	window.location.assign(url);

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
	$('#inputcolor').val("");
	 $('#inputfabric').val("");
	$('#inputclass').val("");
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
	$("#centralDiv").hide();
}
function contentListHide(){
	advShow();
	change();
	$("#content-List").addClass("content-ListPopDown");
	$("#content-List").removeClass("content-ListPopUp");
	$("#content-List").hide();

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
function searchProd(){
	var sapid=$('#inputcode').val().toUpperCase();
	if(sapid==""){
		showBasicDialog("Please type your product code");
  		$('#inputcode').blur();
	}else{
htmlRequest("service.app",
		{
			action : 'getProductExist',
			material:sapid
			
		});

}}
function getStores(store)
{
	htmlRequest("sapservice.app",
	{
		action : 'getStores',
		forceTemplateName : 'valentino/sapservice/getStores/storeInfo.html',
		store:store
		
	}
	      		
	
	);

}



$(document).ready(function (){

	$('#inputcode').keydown(function() {
		if (event.keyCode == 13) {
			var sapid=$('#inputcode').val().toUpperCase();
			if(sapid==""){
				showBasicDialog("Search a Product");
		  		$('#inputcode').blur();
			}else{
				
			htmlRequest("service.app",
					{
						action : 'getProductExist',
						material:sapid
						
					});
			
			}
		}
	});
	
});

function getCollectionName(){
	htmlRequest("service.app",
			{   action:"getSeason",
				
			    forceTemplateName : 'valentino/service/getCollectionName/main.html',
			  
			});
}
	
function goToProduct(){
	var sapid=$('#inputcode').val().toUpperCase();
	navigateProduct(sapid);
	
}

function navigateProduct(sapid)
{   console.log(sapid);
	window.location.assign('run.app?id='+prodId+'&sapid='+sapid+'&store='+store+'');
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
var collection="";
var season_number="";
var line="";
function saveCollection(){
var save=$(".black").attr("target");
var arr = save.split(',');
season_number=arr[0];
collection=arr[1];

}
function saveLine(){
	line=$(".blackline").attr("target");
	}

var collectionRoller;
var lineRoller;
$(document).ready(function() {
  
	
	collectionRoller= new Roller({
				name:"Collection Roller",
				tableId : "rollingTableCollection",
				scrollingId : "scrollerCollection",
				activePosition : 3,
				
				//opzionali
				scrollType : "horizontal",
				activeClass: "black",
				callback : function(activeElement) {
				
				saveCollection();
				
				 getLineName(season_number,collection);

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
		activeClass: "blackline",
		callback : function(activeElement) {
			saveLine();
		},
		cellDimension : 200
	});


});

function getContent()
{ 
 var color=$('#inputcolor').val().toUpperCase();
  var fabric=$('#inputfabric').val().toUpperCase();
  var model=$('#inputclass').val().toUpperCase();
 
   if(season_number=="" && collection=="" && line=="" && color=="" && fabric=="" && model==""){
	
	   showBasicDialog("Please insert at least a search parameter.");
	   
   }else{
	 

	  
	$('#loading').show();
	htmlRequest("service.app",
	{
		action : 'getContent',
		
			season:season_number,
			collection:collection,
			line:line,
			color:color,
			store:store,
			idprod:prodId,
			fabric:fabric,
			model:model
	});
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
		advHide();
		$('#inputcolor').val("");
		 $('#inputfabric').val("");
		$('#inputclass').val("");
		
		}
	if(mode=="PROD" ){
	    mode="ADV"
		contentListHide();
	}
	
}

