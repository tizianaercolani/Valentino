

var sizesRoller;
var colorsRoller;

/* listener per la wishlist. Se uno aggiunge alla wishlist da menu laterale, si aggiorna il pulsante*/
function removeFavouriteListener(removedId)
{
	if(productHandler.sapid && removedId==productHandler.sapid)
	{
		$("#product-favorite").attr("src", baseUrl+"store_app/add_wishList.png")
	}
	
}
/*PRODUCT HANDLER SCRIPT
 * Gestione della scheda prodotto
 * 
 * 
 * entry point: openProduct
 * */
var productHandler = {
	version : "p1.0",
	sapid : "",
	currentSlide:0,
	color:"",
    brand:"",
	store : "",// codifica r3 dello store selezionato
	storeInfo:{},//info sullo store corrente
	current360:[],
	semaforoFav:false,
	openAvailability: false,
	
	openProduct:function(params)
	{
		this.sapid=params.sapid;
		this.color=params.color?params.color:"";
		//se non c'è il parametro store si prende lo store corrente
		this.store=params.store?params.store:this.getCurrentStore();
		this.brand=params.brand?params.brand:"";
		this.openAvailability=params.store?true:false;
		//cambio intestazione
		$(".sapidPlaceHolder").html(this.sapid);
		//carica i dati del prodotto dal DB
		this.getProductDataDB()
		//carica i dati da SAP
		this.getMaterialWithPrice();
		//carica le taglie colore
		this.getSizesColors();
		
		//carica i dati dello store corrente
		this.storeInfo={};
		this.loadStoreInfo();
		
		
			   this.hideAll();
			
		//vedo se il prodotto è pref o meno
		if(navStack)
			this.checkFavourite();
	},
	
	openCallback:function(colorIndex)
	{
		
		$("#containerProduct").show();
		setTimeout(function()
		{
			
			if(getById("content") && $("#content").is(':visible'))
			{
				$("#content").hide(); //nascondo la ricerca per evitare scroll
				
			}
			
			
		}, 200		
		)
		
		
		productHandler.goTo(colorIndex);
		if(this.openAvailability)
			{
			  this.availabilityShow();
			}
		productHandler.checkFavourite();
	},
	
	clear:function()
	{
		$("#slider_element").html("");
		this.hideAll();
		mailer.hide();
	},
	
	goTo:function(index)
	{
		console.log("productHandler.goTo: "+index);
		this.currentSlide=index;
		getById("slider_element").scrollTop=1024* (index);
		
	},
	
	scrollToCurrentSlide: function(animate){
		
		
		var scrollValue=1024* (productHandler.currentSlide);
		
		if(animate)
		{
			$("#slider_element").animate({
				scrollTop : scrollValue
				},200);
			
		}
		else
		{
			getById("slider_element").scrollTop=scrollValue;
		}
		
				

	},
	onSwipe:function(e)
	{
		e.stopPropagation();
	
		
		
		var currentSlideScroll= 1024* (productHandler.currentSlide);
		var currentScroll= getById('slider_element').scrollTop;
		
		if(currentScroll-currentSlideScroll>30)
		{
			//vai avanti
			productHandler.currentSlide=productHandler.currentSlide+1;
			
		}	
		else if(currentSlideScroll-currentScroll>30)
		{
			//vai indietro
			productHandler.currentSlide=productHandler.currentSlide-1;
			
			
		}
		else
		{
			//statte cca
			productHandler.currentSlide=productHandler.currentSlide;
			
		}
		productHandler.scrollToCurrentSlide(true);
		
		
	},
	
	getCurrentStore:function()
	{
		var storeIndex=0;
		//variabili def nella macro
		if(currentStoreIndex && stores.length>currentStoreIndex)
		{
			storeIndex=currentStoreIndex;
		}
		
		return stores[storeIndex].sto_r3;
		
		
	},
    sendMail:function()
    {
    	var urlProd=$(".prodImg:eq(" + this.currentSlide + ")").attr('src');
    	mailer.openImageMail(this.sapid, urlProd,'product');
    },
	hideAll: function(){
		
		this.detailHide();		
		this.availabilityHide();
		this.searchRegionHide();
	},
	
	detailShow: function(){
		
		
		this.availabilityHide();
		$("#prod-FixedP").show();
		$("#detail-product").removeClass("detail-productPopDown");
		$("#detail-product").addClass("detail-productPopUp");
		$("#detail-product").show();
		$("#product-listelem").removeClass("product-listelem");
		$("#product-listelem").addClass("product-Active");
	},

	detailHide: function (){
		
		$("#prod-FixedP").hide();
		$("#detail-product").addClass("detail-productPopDown");
		$("#detail-product").removeClass("detail-productPopUp");
		
		$("#product-listelem").addClass("product-listelem");
		$("#product-listelem").removeClass("product-Active");
		$("#detail-product").hide();
	},
	
	/*
	 * Restituisce l'url 360 del colore visualizzato.
	 * Se non c'è 360 per quel colore, restituisce il primo 360 disponibile
	 * */
	
	getCurrent360Url: function() {

		if (!this.current360 || this.current360.length == 0) {
			return "";
		}

		var url = this.current360[0].url;
		try {
			var curEl = $(".prodImg:eq(" + this.currentSlide + ")")
			var _fabric = curEl.attr("fabric");
			var _color = curEl.attr("color");

			for (var i = 0; i < this.current360.length; i++) {
				if (this.current360[i].fabric == _fabric
						&& this.current360[i].color == _color) {
					url = this.current360[i].url;
				}
			}
		} catch (ex) {

		}
		
		if(url.indexOf("http://") == -1)
			url="http://"+url;

		return url;

	},
	
	prod360Show: function (){
		

		$("#iframe360").attr("src","");
		getById("iframe360").src=this.getCurrent360Url();
		
		this.detailHide();
		this.availabilityHide();
		
		
		$("#product360-Element").removeClass("detail-productPopDown");
		$("#product360-Element").addClass("detail-productPopUp");
		$("#product360-Element").fadeIn();
		$("#product-3d").removeClass("product-listelem");
		$("#product-3d").addClass("product-Active");
	},
	prod360Hide: function (){
		
		
		$("#product360-Element").addClass("detail-productPopDown");
		$("#product360-Element").removeClass("detail-productPopUp");
		
		$("#product-3d").addClass("product-listelem");
		$("#product-3d").removeClass("product-Active");
		$("#product360-Element").css("display","none");

	},
	
	
	
	availabilityShow: function(){
		
		this.detailHide();
		$("#prod-FixedP").show();
		 $("#showLabel").hide();
	     $("#loading").hide();
		$("#availability").removeClass("detail-productPopDown");
		$("#availability").addClass("detail-productPopUp");
		$("#availability").show();
		$("#product-availability").removeClass("product-availability");
		$("#product-availability").addClass("product-Active");
	},

	availabilityHide: function(){
		
		$("#prod-FixedP").hide();
		$("#availability").addClass("detail-productPopDown");
		$("#availability").removeClass("detail-productPopUp");
		$("#availability").hide();
		$("#product-availability").addClass("product-availability");
		$("#product-availability").removeClass("product-Active");
		 $('#innerGiacenze').hide();
	     $('#avaliText').show();
	     $('#sizesCheck').hide();
	     $('#colorsCheck').hide();
	     $("#showLabel").hide();
	     $("#loading").hide();
	},
	searchRegionShow: function(){
		hideActInd();
		this.availabilityHide();
		$("#search_store_region").show();
		$("#prod-FixedP").show();
		$("#showLabel").hide();
		var color = $(".black").attr("target");
		var size = $(".blacksize").attr("target");
	
		//se la ricerca è per entrambi i campi non faccio vedere on hand e on hold altrimenti si
		if(size!="all" && color!="all") 
		{						
			$("#showLabel1").hide();
			$("#showLabel2").hide();
			$("#showLabel3").hide();

		}
		else
		{
			$("#showLabel1").show();
			$("#showLabel2").show();
			$("#showLabel3").show();
		}
		
	},
	searchRegionHide: function(){
		
		
		$("#search_store_region").hide();
		
		$("#availabilityStores").html("");
		$("#prod-FixedP").hide();
	},


	

	getMaterialWithPrice: function()
	{
		htmlRequest("sapservice.app",
		{
			action : 'getMaterialWithPrice',
			material:this.sapid
			
		}
		      		
		
		);

	},
	getProductDataDB: function ()
	{   showActInd();
		htmlRequest("service.app",
		{
			action : 'getProductPage',
			
			material:this.sapid,
			color:this.color
		}, null,//default inietto html
	    function() //connection error
	    {
	    	hideActInd();
	    	showBasicDialog("Connection error. Please Try Again.")
	    	
	    }
		      		
		
		);
		htmlRequest("service.app",
				{
					action : 'getProduct360',
					
					sapid:this.sapid,
					color:this.color
				}
				      		
				
				);

	},
	
	getSizesColors: function ()
	{
		$("#color").hide();
		showActInd();
		htmlRequest("sapservice.app",
		{
			action : 'getSizesColors',
			material:this.sapid
			
		}
		);

	},


	loadStoreInfo: function ()
	{
		htmlRequest("sapservice.app",
				{
					action : 'getStoresFull',
					store:this.store,
					forceTemplateName : 'valentino/sapservice/getStoresFull/loadStoreInfo.html'
					
				}
				      				
	    );
		
	},
	reloadStore: function (store)
	{
		var el =$("#"+store);
		var store =el.attr("store");
		var store_retail =el.attr("store_retail");
		var wsretailpro =el.attr("wsretailpro");
		var region =el.attr("region");
		el.unbind("click");
		
		el.html('<center><img class="loadingAvail"  src="'+baseUrl+'store_app/loading1.gif"/>	</center>');
		getAvailabilityStores({
	        store:store,
	        store_retail: store_retail,
			wsRetailPro: wsretailpro,
			region: region });
		
		
		
	},
	
	getAllStores: function (){	
		
		color=$(".black").attr("target");
		size=$(".blacksize").attr("target");
		
		if(color=="all" && size=="all"){
		     showBasicDialog("Please select size or color");
		     return;
		     }
		
		showActInd();
		
		htmlRequest("sapservice.app",
		{
		action : 'getStoresFull',
		region:this.storeInfo.region,
		sapid:this.sapid,
		brand:this.brand
		
	    }, null,//default inietto html
	    function() //connection error
	    {
	    	hideActInd();
	    	showBasicDialog("Connection error. Please Try Again.")
	    	
	    }
	    
	      );
		
	},
	getAvailabilityStores : function(regionStore) {
		var color = $(".black").attr("target");
		var size = $(".blacksize").attr("target");
		var check = "";
		var value = "";
		var call = false;
		if (color == "all" && size == "all") {
			call = false;

		}
		if (color == "all" && size != "all") {
			value = size;
			check = 'color';
			call = true;

		}
		if (size == "all" && color != "all") {
			value = color;
			call = true;
			check = 'size';

		}

		if (size != "all" && color != "all") {
			call = true;
			check = 'colsize';
			value = size + '/' + color;
		}

		if (call) {

			var params = {
				action : "getAvailability",
				material : this.sapid,
				value : value,
				forceTemplateName : 'valentino/sapservice/getAvailabilityStores/main.html',
				head : 'yes',
				check : check

			}
			for ( var k in regionStore)
				params[k] = regionStore[k];

			htmlRequest(
					"sapservice.app",
					params,
					null,
					function() {
						$("#" + params.store)
								.html(
										'<div class="connectionLost"><i class="icon-repeat" style="font-size: 30px;"></i>&nbsp; Connection Lost. Tap Here to reload.</div>');
						$("#" + params.store).click(function() {
							productHandler.reloadStore(params.store);
						}

						);
					}

			);

		}
	},
	nextPage: function(){
		var x=	$('.scrollableDiv').size();
		var y= x*3-3;
		
			var tar=$(".visibleDiv").attr("target");
			var t= parseInt(tar);
			tar2=t+3;
			if(t<=y && tar2<=y){
			$("[target='"+tar+"']").removeClass('visibleDiv');
			$("[target='"+tar+"']").addClass('hiddenDiv');
		
			
			var visiblePage=$("[target='"+tar2+"']");
			visiblePage.removeClass('hiddenDiv');
			visiblePage.addClass('visibleDiv');
			
			var visited =visiblePage.attr("visited");
			if(!visited || visited=="false")
			{
				visiblePage.find(".storeDiv").each(function()
						{
							var store =$(this).attr("store");
							var store_retail =$(this).attr("store_retail");
							var wsretailpro =$(this).attr("wsretailpro");
							var region =$(this).attr("region");
							productHandler.getAvailabilityStores({
					            store:store,
					            store_retail: store_retail,
								wsRetailPro: wsretailpro,
								region: region });
							
						}
						);
			}
			visiblePage.attr("visited", true);
			visiblePage.fadeIn();
			}
	},
			
	previousPage: function(){
		
		var tar=$(".visibleDiv").attr("target");
		var t= parseInt(tar);
		if(t>0){
		$("[target='"+tar+"']").removeClass('visibleDiv');
		$("[target='"+tar+"']").addClass('hiddenDiv');


		tar2=t-3;
		
		
		$("[target='"+tar2+"']").removeClass('hiddenDiv');
		$("[target='"+tar2+"']").addClass('visibleDiv');
		$("[target='"+tar2+"']").fadeIn();
		}
	},

	addFavourite: function (){

	var urlProd=$(".prodImg:eq(" + this.currentSlide + ")").attr('src2');


	navStack.favouritesAdd({id: productHandler.sapid,url: urlProd});
	},

	removeFavourite: function (){

		

		navStack.favouritesRemoveSingle( productHandler.sapid, showProductsFav);
	},

	
	toggleFavourite: function()
	{
		if(this.semaforoFav)
			return;
		
		
		this.semaforoFav=true;
		
		setTimeout(function(){ 
			productHandler.semaforoFav=false; 
		}, 500);
		
		
		if($("#product-favorite").attr("src").indexOf("add")!=-1)
		{
			//aggiungo e cambio immagine
			this.addFavourite();
			$("#product-favorite").attr("src", baseUrl+"store_app/remove_wishlist.png")
		}
		else
		{
			this.removeFavourite();
			
			$("#product-favorite").attr("src", baseUrl+"store_app/add_wishList.png")
		}
		
		
		
		
	},

	checkFavourite: function()
	{
		
		
		function draw(isFav)
		{				
			if(isFav)
			{
				$("#product-favorite").attr("src", baseUrl+"store_app/remove_wishlist.png")
				
				
			}
			else
			{
				$("#product-favorite").attr("src", baseUrl+"store_app/add_wishList.png")
				
			}
			
		}
		
		navStack.isFavourite({
			id:productHandler.sapid,
			callback:draw
		})
		
		
	},

	getAvailabilityCurrentStore: function (){
		var color = $(".black").attr("target");
		var size = $(".blacksize").attr("target");
		var check="";
		var value="";
		  var call=false;
		  if(color=="all" && size=="all"){
		     showBasicDialog("Please select size or color");
		     call=false;
		     }
		    if(color=="all" && size!="all"){
		      value=size;
		      check='color';
		      call=true;
		      
		    }
		   if(size=="all" && color!="all") {
		         value=color;
		         call=true;
		           check='size';
		         }
		         
		    if(size!="all" && color!="all") {
		        call=true;
		        check='colsize';
		        value=size+'/'+color;
		       
		        }
		    
		   

		  if(call){
			 showActInd();
			 
		   var params={
					action : 'getAvailability',
					material:this.sapid,
					store:this.store,
				    value:value,
				    check:check
				    
				}	
		   if(typeof this.storeInfo !== 'undefined')
		   {
			   for(var k in this.storeInfo) 
				   params[k]=this.storeInfo[k];
			   
		   }
			 

					   
		   htmlRequest("sapservice.app", 
				   params, 
				   null, //onsuccess inietto html
				   function() { //errore di connessione
					showBasicDialog("Connection error. Please Try Again."); 
					});
		   
		   $("#innerGiacenze").html("");
		   $('#avaliText').hide();
		  
			    
		 } else{
		      $('#showLabel').hide();
		      $('#avaliText').show();
			  $('#innerGiacenze').hide();
			    
		 }
		},
	

	onDocumentReady : function() {
		colorsRoller = new Roller({
			name : "Color Roller",
			tableId : "rollingTableColor",
			scrollingId : "scrollerRollerColor",
			activePosition : 3,

			//opzionali
			scrollType : "horizontal",
			activeClass : "black",
			callback : function(activeElement) {
				document.getElementById('innerDescrizioneColor').innerHTML=$(".black").attr("coldesc");
			},
			cellDimension : 100
		});

		sizesRoller = new Roller({
			name : "Size Roller",
			tableId : "rollingTableSize",
			scrollingId : "scrollerRollerSize",
			activePosition : 3,

			//opzionali
			scrollType : "horizontal",
			activeClass : "blacksize",
			callback : function(activeElement) {

			},
			cellDimension : 100
		});
		
		$("#slider_element").addSwipeEvents().bind("swipe",productHandler.onSwipe);

	}

}

productHandler.onDocumentReady();