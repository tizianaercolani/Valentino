	
	function snap(currentSlide){
		$("#slider_elementx4").animate({
			scrollTop : 1024* (currentSlide)
			},250);
		 // document.getElementById('slider_elementx4').scrollTop=1024* (currentSlide);
		showNearSlides(currentSlide);
	}
	    var scroll=0;

		var x4 = {}
		

		var currentSlide=0;
		
		function sliderX4Scroll() {
			x4.target = null;
		    
			
				
				var currentSlideScroll= 1024* (currentSlide);
				var currentScroll= getById('slider_elementx4').scrollTop;
				
				if(currentScroll-currentSlideScroll>30)
				{
					//vai avanti
					currentSlide=currentSlide+1;
					snap(currentSlide);
				}	
				else if(currentSlideScroll-currentScroll>30)
				{
					//vai indietro
					currentSlide=currentSlide-1;
					snap(currentSlide);
					
					
				}
				else
				{
					//statte cca
					currentSlide=currentSlide;
					snap(currentSlide);
				}
				
					
				/*
				x4.target= 1024* Math.round(getById('slider_elementx4').scrollTop / 1024);
				var c=Math.round(getById('slider_elementx4').scrollTop / 1024);
				scroll=getById('slider_elementx4').scrollTop;
				var cal=x4.target-scroll;
				console.log(scroll);
				if(scroll>0){
					
					$("#slider_elementx4").animate({
						scrollTop : x4.target
						},100);
				}
				
			   
				var timeAnimation = Math.abs(getById('slider_elementx4').scrollTop-x4.target);
				
				*/
			

		}	

		function goTo(i)
		{
			currentSlide=i;
			getById("slider_elementx4").scrollTop=1024* (currentSlide);
			showNearSlides(currentSlide);
		}

/* cambia la history del browser selezionando la pagina corrente
 * naviga al look numero look_id
 * */		
	function navigateSingleLook(look_id)
	{
		var currentUrl= location.href.split('/').slice(-1)[0];
		if(currentUrl.indexOf("page=")!=-1)
		{
			currentUrl= currentUrl.substring(0, currentUrl.indexOf("page=")-1); //levo page alla fine se c'è
		
		}
		//nella variabile currentSlide c'è la slide corrente
		var currentPageUrl=currentUrl+"&page="+currentSlide;
		
		history.replaceState(null, null, currentPageUrl);
		changeView('grid',11,extra_param,look_id);
	}
		
	function getLooks(params)
	{	showActInd();
		params.action='getLooks';
		params.pageSize=4;
	    params.view="first_view";
		
		htmlRequest("service.app",
		params
		      		
		
		);
		//brucio il cookie di pageHack se presente
		var expDate = new Date();
		expDate.setYear(1950);
		setCookie('pageHack', 0, expDate);
		

	}
	function navigateProd(item)
	{
		
		var currentLookIndex= $("#materials").attr("currentLookIndex");
		
		var currentUrl= location.href.split('/').slice(-1)[0];
		if(currentUrl.indexOf("lookid=")!=-1)
		{
			currentUrl= currentUrl.substring(0, currentUrl.indexOf("lookid=")-1); //levo lookid
			
		}
		item.parentUrl=currentUrl+"&lookid="+currentLookIndex;
		item.type="products";
		
		navStack.navigate(item);
		
		
	}
	function getAccessories(material,child_id,page){
		htmlRequest("service.app",
				{
					action : 'getProductAccessories',
					material:material,
					childId:child_id,
					page:0,
					forceTemplateName : 'valentino/service/getLooks/accessories.html'
					
				}
				      				
	    );
	}
	function showNearSlides(index) {
		
		var last=parseInt($(".pageSlide").last().attr("pageIndex"),10);
		var prec= index-4; //diminuisco elaborazioni a 2
		var from= index-2;
		var to= index+2;
		var forw= index+4; //diminuisco elaborazioni a 2
		
		if(from<0)from=0;
		if(prec<0)prec=0;
		
		if(to>last)to=last;
		if(forw>last)forw=last;
		
			
		
		console.log("carico "+from +" a "+ to)
		
	/*carico le slide nella finestra tra from e to*/
			for (var i = from; i <= to; i++) {
				var img= $("#div_" +i+" ").find('img');
				img.each(function(){ 
					
				var scrpe=$(this).attr('src');
				
					if (scrpe == "") {
					var src2 = $(this).attr("src2");
					$(this).attr("src", src2);
					   }
					})
				}

	/*			
		console.log("svuoto "+prec +" a <"+ from);
	//svuoto le slide precedenti 

			for (var i = prec; i < from; i++) {
				var img = $("#div_" + i + " ").find('img');		
				img.each(function() {		
					if ($(this).attr("src") != "") {
						$(this).attr("src", "")
					}
		
				})
			}
			
			console.log("svuoto "+(to+1) +" a "+ forw);
	// svuoto le slide successive
			for (var i = to+1; i <= forw; i++) {
				var img = $("#div_" + i + " ").find('img');		
				img.each(function() {		
					if ($(this).attr("src") != "") {
						$(this).attr("src", "")
					}
		
				})
			}
	
*/

	}
	
	function getListAccessories(yearSelect,seasonSelect,skey,child_id,page){
		htmlRequest("service.app",
				{
					action : 'getListAccessories',
					year:yearSelect,
					collection:seasonSelect,
					skey:skey,
					child_id:child_id,
					page:0,
					forceTemplateName : 'valentino/service/getLooks/listAccessories.html'
					
				}
				      				
	    );
		
	}
	function setSeason(yearSelect,seasonSelect,child_id,page,show)
	{
		//Questo snippet è preso dal visualizzatore dei soli accessori donna. L'identificatore nel codice sap per il VGD è la W
		
	    show = show+'';
		var season=65;
		var coll_type='';
		// In pagina presento la scelta dell'anno e della stagione (Fall, FW, Spring, SS)
		// L'algoritmo che segue calcola la lettera associata a quella stagione, a partire da queste due sole variabili
		switch(seasonSelect)
		{
			case "PRE": coll_type="1"; //Old naming convention, W3 = VGD PRE
				break;
			case "MAIN": coll_type="3"; //Old naming convention, W1 = VGD MAIN 
				break;
			
			default: break;
		}
		//Questo calcolo permette di ottenere grazie ai valori di partenza 65 e 66, il codice ascii di una lettera maiuscola
		season += 2*(parseInt(yearSelect - 2011)); 
		if(season>=73){
			if(coll_type=="3") coll_type="0"; //Nella nuova naming convention, W0 = VGD MAIN
			if(coll_type=="1") coll_type="2"; //Nella nuova naming convention, W0 = VGD PRE
		}
		
		season = String.fromCharCode(season);
		var skey=season+'W'+coll_type;
		getListAccessories(yearSelect,seasonSelect,skey,child_id,page);
	}
function setViewerSelection(yearSelect,seasonSelect,accessorie,child_id,page)
	{
		//Questo snippet è preso dal visualizzatore dei soli accessori donna. L'identificatore nel codice sap per il VGD è la W
		
	    show = show+'';
		var season=65;
		var coll_type='';
		var skey;
		// In pagina presento la scelta dell'anno e della stagione (Fall, FW, Spring, SS)
		// L'algoritmo che segue calcola la lettera associata a quella stagione, a partire da queste due sole variabili
		switch(seasonSelect)
		{  //old
			/*case "SS": coll_type="3"; //Old naming convention, W3 = VGD PRE
				break;
			case "Spring": coll_type="1"; //Old naming convention, W1 = VGD MAIN 
				break;
			case "FW":	coll_type="3"; season++; break; //Old naming convention, W3 = VGD PRE
			case "Fall": coll_type="1"; season++; break; //Old naming convention, W1 = VGD MAIN 
			default: break;*/
		case "PRE":
		coll_type = "1"; // Old naming convention, W3 = VGD PRE
		break;
	    case "MAIN":
		coll_type = "3"; // Old naming convention, W1 = VGD MAIN
		break;
	    default:
	 	break;
		}
		//Questo calcolo permette di ottenere grazie ai valori di partenza 65 e 66, il codice ascii di una lettera maiuscola
		season += 2*(parseInt(yearSelect - 2011)); 
		
		if(season<73) //Se la stagione è inferiore a I, utilizzo la VECCHIA naming convention
		{
			//Preparo la ricerca aggiungendo il carattere di categoria in base a quanto scelto in pagina
			//Sarebbe possibile aggiungere profondità e precisione di ricerca accodando alla variabile skey altre lettere che permettono di identificare sottocategorie di prodotti
			switch(accessorie)
			{
				case "allitems": skey=show;  break;
				case "bags": skey=show+'B'; break;
				case "belts": skey=show+'T'; break;
				case "jewelry": skey=show+'J'; break;
				case "gloves": skey=show+'G'; break;
				case "small": skey=show+'P'; break;
				case "shoes": skey=show+'S'; break;
				case "soft": skey=show+'V'; break;
				case "hats": skey=show+'H';  break;
				case "others": skey=show+'Z';  break;
				default: break;
			}
		}
		else //Se la stagione è superiore a I, utilizzo la NUOVA naming convention
		{
			if(coll_type=="3") coll_type="0"; //Nella nuova naming convention, W0 = VGD MAIN
			if(coll_type=="1") coll_type="2"; //Nella nuova naming convention, W0 = VGD PRE
			//Preparo la ricerca aggiungendo il carattere di categoria in base a quanto scelto in pagina
			//Sarebbe possibile aggiungere profondità e precisione di ricerca accodando alla variabile skey altre lettere che permettono di identificare sottocategorie di prodotti
			switch(accessorie)
			{
				case "allitems": skey=show+coll_type;  break;
				case "bags": skey=show+coll_type+'B'; break; 
				case "belts": skey=show+coll_type+'T'; break;
				case "jewelry": skey=show+coll_type+'J'; break;
				case "gloves": skey=show+coll_type+'G'; break;
				case "small": skey=show+coll_type+'P'; break;
				case "shoes": skey=show+coll_type+'S'; break;
				case "soft": skey='T'+coll_type; break;
				case "hats": skey=show+coll_type+'H';  break;
				case "others": skey=show+coll_type+'Z';  break;
				default: break;
			}
			//Imposto la coll_type a vuota perché necessario nella pagina di richiamo a Thron
		}
		season = String.fromCharCode(season); //Rendo il codice ascii una lettera e la salvo in season
		var material=season+skey;
		getAccessories(material,child_id,page)
	}	
	
	
	
	
	$(document).ready(function(){
		$("#slider_elementx4").addSwipeEvents().bind("swipe",sliderX4Scroll);
		
});
	//Script Quest
	
	var state="HOME";
	var mode="HOME";
	var lastMode="";
	/*   ----BARCODE START-----*/


	function goBack()
	{
		if(mode=="HOME"){
			history.back();
			
		}
		
		if(mode=="LIST"){
			mode="HOME";
			 $('#choseAccessories').show();
			 $('#slider_elementx4').hide();
		}
		
		if(mode=="PRODCARD")
		{
			
			if($("#product360-Element").is(':visible'))
			{
				productHandler.prod360Hide();
			}
			else
			{
				
				mode="LIST";	
				
				$("#containerProduct").hide();
				productHandler.clear();
				
			}
			
			
		}
		
	}

	function nascondi(c){
		$("#"+c+"").hide();
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
			
			color:color
			
				
		})
		
		
		//navStack.navigate(item);
		//getSizesColors(sapid);
		//window.location.assign('run.app?id='+prodId+'&sapid='+sapid+'&store='+store+'');
	}

	