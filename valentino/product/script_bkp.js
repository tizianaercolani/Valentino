
//sovrascrive funzione globale
function goBack()
{
	if($("#product360-Element").is(':visible'))
	{
		prod360Hide();
	}
	else
	{
		history.back();
	}
	
}
function detailShow(){
	
	
	availabilityHide();
	$("#prod-Fixed").show();
	$("#detail-product").removeClass("detail-productPopDown");
	$("#detail-product").addClass("detail-productPopUp");
	$("#detail-product").show();
	$("#product-listelem").removeClass("product-listelem");
	$("#product-listelem").addClass("product-Active");
}

function detailHide(){
	
	$("#prod-Fixed").hide();
	$("#detail-product").addClass("detail-productPopDown");
	$("#detail-product").removeClass("detail-productPopUp");
	
	$("#product-listelem").addClass("product-listelem");
	$("#product-listelem").removeClass("product-Active");
	$("#detail-product").hide();
}


function getCurrent360Url() {

	if (!current360 || current360.length == 0) {
		return "";
	}

	var url = current360[0].url;
	try {
		var curEl = $(".prodImg:eq(" + jssor_slider1.$CurrentIndex() + ")")
		var _fabric = curEl.attr("fabric");
		var _color = curEl.attr("color");

		for (var i = 0; i < current360.length; i++) {
			if (current360[i].fabric == _fabric
					&& current360[i].color == _color) {
				url = current360[i].url;
			}
		}
	} catch (ex) {

	}
	
	if(url.indexOf("http://") == -1)
		url="http://"+url;

	return url;

}

function prod360Show(){
	

	$("#iframe360").attr("src","");
	getById("iframe360").src=getCurrent360Url();
	
	detailHide();
	availabilityHide();
	
	
	$("#product360-Element").removeClass("detail-productPopDown");
	$("#product360-Element").addClass("detail-productPopUp");
	$("#product360-Element").fadeIn();
	$("#product-3d").removeClass("product-listelem");
	$("#product-3d").addClass("product-Active");
}

function prod360Hide(){
	
	
	$("#product360-Element").addClass("detail-productPopDown");
	$("#product360-Element").removeClass("detail-productPopUp");
	
	$("#product-3d").addClass("product-listelem");
	$("#product-3d").removeClass("product-Active");
	$("#product360-Element").css("display","none");

}

function availabilityShow(){
	
	detailHide();
	$("#prod-Fixed").show();
	 $("#showLabel").hide();
     $("#loading").hide();
	$("#availability").removeClass("detail-productPopDown");
	$("#availability").addClass("detail-productPopUp");
	$("#availability").show();
	$("#product-availability").removeClass("product-availability");
	$("#product-availability").addClass("product-Active");
}

function availabilityHide(){
	
	$("#prod-Fixed").hide();
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
}
function searchRegionShow(){
	hideActInd();
	availabilityHide();
	$("#search_store_region").show();
	$("#prod-Fixed").show();
	$("#showLabel").hide();
}
function searchRegionHide(){
	
	
	$("#search_store_region").hide();
	
	$("#availabilityStores").html("");
	$("#prod-Fixed").hide();
}


function activityHide(){
	//prod360Hide();
	detailHide();
	searchRegionHide();
	availabilityHide();
}



function getMaterialWithPrice(sapid)
{
	htmlRequest("sapservice.app",
	{
		action : 'getMaterialWithPrice',
		material:sapid
		
	}
	      		
	
	);

}
function getProductPage(view,material,colore)
{   showActInd();
	htmlRequest("service.app",
	{
		action : 'getProductPage',
		view: view,
		material:material,
		color:colore
	}
	      		
	
	);

}
function getProductInfo(material)
{
	htmlRequest("service.app",
	{
		action : 'getProductInfo',
		material:material
	}
	      		
	
	);

}
function getSizesColors(sapid)
{
	$("#color").hide();
	showActInd();
	htmlRequest("sapservice.app",
	{
		action : 'getSizesColors',
		material:sapid
		
	}
	);

}


function loadStoreInfo(store_r3)
{
	htmlRequest("sapservice.app",
			{
				action : 'getStoresFull',
				store:store_r3,
				forceTemplateName : 'valentino/sapservice/getStoresFull/loadStoreInfo.html'
				
			}
			      				
    );
	
}


function getStores(store)
{
	htmlRequest("sapservice.app",
	{
		action : 'getStores',
		store:store
		
	}
	      		
	
	);

}
var color="all";
var size="all";
function saveColor(){
color=$(".black").attr("target");
document.getElementById('innerDescrizioneColor').innerHTML=$(".black").attr("coldesc");
}
function saveSize(){
	size=$(".blacksize").attr("target");

	}



var sizesRoller;
var colorsRoller;
$(document).ready(function() {
  
	
		
		$("#iframe360").addSwipeEvents().bind("doubletap",function(){
			alert("ZOOM")
		});
	
	colorsRoller= new Roller({
				name:"Color Roller",
				tableId : "rollingTableColor",
				scrollingId : "scrollerRollerColor",
				activePosition : 3,
				
				//opzionali
				scrollType : "horizontal",
				activeClass: "black",
				callback : function(activeElement) {
				

				document.getElementById('innerDescrizioneColor').innerHTML=$(".black").attr("coldesc");

				},
				cellDimension : 100
			});
  
  sizesRoller= new Roller({
		name:"Size Roller",
		tableId : "rollingTableSize",
		scrollingId : "scrollerRollerSize",
		activePosition : 3,
		
		//opzionali
		scrollType : "horizontal",
		activeClass: "blacksize",
		callback : function(activeElement) {
			

		},
		cellDimension : 100
	});

  checkFavourite();

});

function reloadStore(store)
{
	var el =$("#"+store);
	var store =el.attr("store");
	var store_retail =el.attr("store_retail");
	var wsretailpro =el.attr("wsretailpro");
	var region =el.attr("region");
	el.unbind("click");
	
	el.html('<center><img class="loadingAvail"  src="'+baseUrl+'store_app/loading1.gif"/>	</center>');
	getAvailabilityStores(_sapid,{
        store:store,
        store_retail: store_retail,
		wsRetailPro: wsretailpro,
		region: region },'yes');
	
	
	
}

function getProduct360(sapid){	
	

	htmlRequest("service.app",
	{
	action : 'getProduct360',
	sapid:sapid
	
    }
      );
	
}
function getProduct360Exisft(sapid,src){
	
	htmlRequest("service.app",
	{
	action : 'getProduct360Exist',
	material:sapid,
	imagesrc:src
	
    }
      );
}
function getStoresFull(sapid,region){	
	
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
	region:region,
	sapid:sapid,
	brand:brand
	
    }, null,
    function()
    {
    	hideActInd();
    	showBasicDialog("Connection error. Please Try Again.")
    	
    }
    
      );
	
}
function getAvailabilityStores(sapid,regionStore,head){	
	saveColor();
	saveSize();
	var check="";
	var value="";
	  var call=false;
	  if(color=="all" && size=="all"){
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
		  
		  var params={   action:"getAvailability",
					material:sapid,					
					value:value,
				    forceTemplateName : 'valentino/sapservice/getAvailabilityStores/main.html',
				    head:head,
				    check:check
				    
				}
		  for(var k in regionStore) 
			   params[k]=regionStore[k];
		 	
htmlRequest("sapservice.app",params, null, function()
{
	$("#"+params.store).html('<div class="connectionLost"><i class="icon-repeat" style="font-size: 30px;"></i>&nbsp; Connection Lost. Tap Here to reload.</div>');
	$("#"+params.store).click(function()
	{
		reloadStore(params.store);
	}		
	
	);
}		

);

}
}

function nextPage(){
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
						getAvailabilityStores(_sapid,{
				            store:store,
				            store_retail: store_retail,
							wsRetailPro: wsretailpro,
							region: region },'yes');
						
					}
					);
		}
		visiblePage.attr("visited", true);
		visiblePage.fadeIn();
		}
}
		
function previousPage(){
	
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
}

function removeFavouriteListener(removedId)
{
	if(removedId==_sapid)
	{
		$("#product-favorite").attr("src", baseUrl+"store_app/add_wishList.png")
	}
	
}


function addFavourite(){

var urlProd=$(".prodImg:eq(" + jssor_slider1.$CurrentIndex() + ")").attr('src2');


navStack.favouritesAdd({id: _sapid,url: urlProd});
}

function removeFavourite(){

	

	navStack.favouritesRemoveSingle( _sapid, showProductsFav);
	}

var semaforoFav=false;
function toggleFavourite()
{
	if(semaforoFav)
		return;
	
	
	semaforoFav=true;
	
	setTimeout(function(){ 
		semaforoFav=false; 
	}, 500);
	
	
	if($("#product-favorite").attr("src").indexOf("add")!=-1)
	{
		//aggiungo e cambio immagine
		addFavourite();
		$("#product-favorite").attr("src", baseUrl+"store_app/remove_wishlist.png")
	}
	else
	{
		removeFavourite();
		
		$("#product-favorite").attr("src", baseUrl+"store_app/add_wishList.png")
	}
	
	
	
	
}

function checkFavourite()
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
		id:_sapid,
		callback:draw
	})
	
	
}

function getEanCode(sapid,store){
	saveColor();
	saveSize();
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
				material:sapid,
				store:store,
			    value:value,
			    check:check
			    
			}	
	   if(typeof storeInfo !== 'undefined')
	   {
		   for(var k in storeInfo) 
			   params[k]=storeInfo[k];
		   
	   }
		 
	   htmlRequest("sapservice.app",params, null, function(){
		   showBasicDialog("Connection error. Please Try Again.")
	   });
	   
	   $("#innerGiacenze").html("");
		     $('#avaliText').hide();
		    
		      $('#search_in_region').show();
		    
	 } else{
	      $('#showLabel').hide();
	          $('#search_in_region').hide();
	          $('#avaliText').show();
		      $('#innerGiacenze').hide();
		    
	 }
	}