
var alphabetRoller;
  $(document).ready(function() {
    alphabetRoller= new Roller({
				name:"Alphabet Roller",
				tableId : "rollingTable",
				scrollingId : "scrollerRoller",
				activePosition : 4,
				lastPosition: 25,
				//opzionali
				scrollType : "horizontal",
				activeClass: "font_active",
				callback : function(activeElement) {
					activeSearch()

				},
				cellDimension : 40
			});
  
  });

/*
 * params
 * 	clientId= id scheda 
 *  callerMode= modalità che ha chiamato la scheda 
 *  label= descrizione cliente che serve per il trace
 * 
 * */


function showClientCard(params)
{
	var clientId= params.clientId;
	var callerMode=params.callerMode;
	var label=params.label;
	
	var parentUrl="run.app?id="+renderId;
	if(callerMode=="SEARCH" || callerMode=="RESULTS")
	{
		var paramsToString= searchHandler.getParamsToString();
		parentUrl="run.app?id="+renderId+"&startMode=SEARCH"+paramsToString;
		var date= searchHandler.lastSearchDate;
		var dateString= date.toLocaleDateString()+" "+date.toLocaleTimeString();
		
		var parentItem={
				parentUrl:"run.app?id="+renderId,
				url: parentUrl,
				label:"Search "+dateString,
				type:"search"
		}
		
	   	navStack.trace(parentItem);
		
	}
	
	var item={
			parentUrl:parentUrl,
			url: "run.app?id="+cardId+"&clientId="+clientId,
			label:label,
			type:"customers"
	}
	navStack.trace(item);
	
	
	$("#cardContent").attr("caller", callerMode);
	
	
	cardHandler.openCustomer(clientId);
	changeMode("CARD");
}

function showResults()
{
	changeMode("RESULTS");
}

function changeBackground(bgUrl)
{

}
function changeStore()
{
	currentStoreIndex= parseInt(getById("storeSelect").value);
	getById("storeDesc").innerHTML=stores[currentStoreIndex].desc+"<br><span class='indirizzoStore'>"+stores[currentStoreIndex].indirizzo+"</span>";
	var expDate = new Date();
	expDate.setYear(2500);	
	setCookie('currentStoreIndex', currentStoreIndex, expDate);	
	refreshAlphabet()
}

var mode="HOME";

function changeMode(newMode)
{
	var lastMode= mode;
	mode= newMode;
	
	if(mode=="ADDRESS")
	{
		$("#homeCRM").hide();
		$("#resultView").hide();
		$("#newProspect").hide();
		
		$("#searchClient").removeClass("centeredMODE").addClass("leftMODE")		
		$("#searchClient").show();
		$("#containerRubrica").show();
		$("#storeInfo").show();
		hideCard();
	}
	else if (mode=="HOME")
	{
		$("#searchClient").hide();
		$("#containerRubrica").hide();
		searchHandler.clear();
		$("#resultView").hide();
		newProspect.clear();
		$("#newProspect").hide();
		
				
		$("#homeCRM").show();
		$("#storeInfo").show();
		hideCard();
		
	}
	else if (mode=="SEARCH")
	{
		$("#homeCRM").hide();		
		$("#storeInfo").hide();
		$("#containerRubrica").hide();
		$("#resultView").hide();
		$("#newProspect").hide();
				
		$("#searchClient").removeClass("leftMODE").addClass("centeredMODE");
		$("#searchClient").show();
		hideCard();
	}
	else if(mode=="RESULTS")
	{
		$("#homeCRM").hide();		
		$("#storeInfo").hide();
		$("#containerRubrica").hide();
		$("#searchClient").hide();
		$("#newProspect").hide();
		$("#resultView").show();
		
		if(lastMode!="CARD")
		 $("#resultView").attr("caller", lastMode);
		
		hideCard();
		
	}
	else if(mode=="NEW")
	{
		$("#homeCRM").hide();		
		$("#storeInfo").show();
		$("#containerRubrica").hide();
		$("#resultView").hide();
		$("#searchClient").hide();
		
		$("#storeInfo").show();
		$("#newProspect").show();
		hideCard();
		
	}
	else if(mode=="NEW")
	{
		$("#homeCRM").hide();		
		$("#storeInfo").show();
		$("#containerRubrica").hide();
		$("#resultView").hide();
		$("#searchClient").hide();
		
		$("#storeInfo").show();
		$("#newProspect").show();
		hideCard();
		
	}
	else if(mode=="CARD")
	{
		$("#homeCRM").hide();		
		$("#storeInfo").hide();
		$("#containerRubrica").hide();
		$("#resultView").hide();
		$("#searchClient").hide();
		
		
		$("#newProspect").hide();
		$("#cardHeader").show();
		$("#cardContent").show();
		$("#segnalibro").show();
		$("#cardEdit").show();
	}
	
	
}


function hideCard()
{
	$("#cardHeader").hide();
	$("#cardContent").hide();
	$("#segnalibro").hide();
	$("#cardEdit").hide();
	$("#productFooter").hide();
	
	
}

function closeCard()
{   
	hideModal();
	cardHandler.clean();
	var lastMode=$("#cardContent").attr("caller");
	if(lastMode)
		changeMode(lastMode);
	else
		changeMode("HOME");
}
//sovrascrive funzione globale
function goBack()
{
	hideActInd();
	if(startMode && startMode=="SEARCH" && mode=="SEARCH") // se search è la modalità di partenza
	{
		history.back();
	}	
	else if(mode=="ADDRESS" || mode=="SEARCH" || mode=="NEW")
	{
		changeMode("HOME");
	}
	else if(mode=="RESULTS")
	{
		var lastMode=$("#resultView").attr("caller");
		changeMode(lastMode);
	}
	else if(mode=="HOME")
	{
		history.back();
	}
	else if(mode=="CARD")
	{
		if(cardHandler.somethingChanged)
		{
			//faccio vedere dialog
			showYesNoCancelDialog({
				message:"Customer data have been changed. Do you wish to save and exit?",
				yesCallback:"cardHandler.onEditConfirmed(true)",
				noCallback:"closeCard()"
				
			})
			
		}
		else 
		{
			closeCard()
		}
	}
	
	
}


var x4 = {}
function scrollLetter(){
	var l_td = document.getElementById("rollingTable").rows[0].cells.length;
    var l_tr=l_td*40;
	x4.target = null;
	if (x4.tid)
		clearTimeout(x4.tid)
	    x4.tid = setTimeout(function() {
		x4.target = 40 * Math.round(getById('scrollerRoller').scrollLeft / 40);
	    
		var scroll=getById('rollingTable').rows[0].cells.length;
		for (var i=0;i<scroll;i++){
			var elem=getById('rollingTable').rows[0].cells[i];
			scroll_path=getById('scrollerRoller').scrollLeft;
			var ris=Math.round(elem.offsetLeft-x4.target);
			console.log(ris);
			if(ris<=135 && ris>=120){
				
			    getById('rollingTable').rows[0].cells[i].setAttribute("class", "font_active");
			    refreshStoreContacts();
			}else
				 getById('rollingTable').rows[0].cells[i].setAttribute("class", "font_inactive");
		}

		$("#scrollerRoller").animate({
			scrollLeft : x4.target
			},120);
		
                 
	}, 70)
	
}	





function toggleStar()
{
	$("#item-star").toggleClass("star_selected");
	refreshStoreContacts();
}

function clearInputSearch()
{
	 document.getElementById("input-searchRubrica").value="";
	 activeSearch();
}

function refreshStoreContacts() {
	// read input from interface
	var associateOnly = $("#item-star").hasClass("star_selected");
	var title = document.getElementById("input-searchRubrica").value;
	if (!title) //input vuoto, vedo la lettera selezionata
	{
       title=$(".font_active").attr("target");
	}
	// search
	getStoreContacts(title, associateOnly);

}

function getStoreContacts(title, associateOnly) {

	var params = {
		action : "getStoreContacts",
		title : title,
		store : stores[currentStoreIndex].crm,
		cardId : cardId,
		currentAssociate: authUser.associate

	}
	if (associateOnly) {
		params.associate = authUser.associate;
	}

	htmlRequest("service.app", params);

}
function refreshAlphabet() {

	var params = {
		action : "getAlphabet",		
		store : stores[currentStoreIndex].crm,


	}	
	htmlRequest("service.app", params);

}



var bool=false;


// DEPRECATED lascio se decidono di cambiare
function showNext(node){
	
	var arrowUp=baseUrl+ "store_app/arrowup.png";
	var arrowDown=baseUrl+"store_app/arrowdown.png";
	var index=node.rowIndex;
	var id_parent=node.id;
	var src_arrow=$("#"+id_parent).find("img").attr("src");
	if(bool==false){
	
	$("#"+id_parent).find("img").attr("src",arrowDown);
	var row = document.getElementById('table_search').rows[index+1];
	var id=row.id;
	document.getElementById(id).style.visibility="visible";
	bool=true;
	}else{
		
		$("#"+id_parent).find("img").attr("src",arrowUp);
		var row = document.getElementById('table_search').rows.length;
		for(var i=index+1;i<row;i++){
		var rows = document.getElementById('table_search').rows[i];
		var id=rows.id;
		document.getElementById(id).style.visibility="hidden";
		$("#"+id).find("img").attr("src",arrowUp);
		}
		bool=false;
	     }
}

var tid = null;
function activeSearch() {
	if (tid)
		clearTimeout(tid);
	tid = setTimeout(function(){
		refreshStoreContacts();
	}, 300);
}








	 