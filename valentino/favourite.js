


function favouriteStack(){
	//inner Favourite list
	var innerHtml="";
	var innerHtml2="";
	innerHtml2+="<div id='taptoclosewishlist' onclick='closeFavouriteStack()'><hr class='hrStyle'color='#ffffff'><img class='tapHereImg'  src='"+baseUrl+"store_app/taptocloseWl.png'><hr class='hrStyle' color='#ffffff'></div>";
	
		//Products
       

	    innerHtml+="<div id='productListFavorite'>";
	    innerHtml+="<div ><img id='fav-listp' onclick='RemoveSelectedProduct()' src='"+baseUrl+"store_app/remove_selected_icon.png'/><img id='wishlistp'onclick='createWishlist()' src='"+baseUrl+"store_app/wishlist_selected_icon.png'></div><br>";
	    innerHtml+="<hr><div id='selectalllist' onclick='selectallProduct()'><img src='"+baseUrl+"store_app/selectallproduct.png'/></div><hr>";
	    innerHtml+="<div id='innerProductList'></div></div>";
	
	    
	document.getElementById("navigation_Scroll").innerHTML=innerHtml;
	document.getElementById("favourite-Stack").innerHTML=innerHtml2;
    showProductsFav();
}


var listProd=[];
function productlistFavourite(listProduct){
	
	if(document.getElementById("innerProductList"))
	{
		var innerHtml="";
		listProd=listProduct;
		var n=listProduct.length;
		for(var i=0;i<n;i++){
			
			innerHtml+="<div class='selectproduct' id='p"+i+"'  prod='"+listProduct[i].id+"' onclick='selectProduct("+i+")'><img src='"+baseUrl+"store_app/select_empty_icon.png'/></div>";
			innerHtml+="<div class='productWishlist'><span style='font-size:20px;margin-top:10px;margin-left:-70px;text-align:center'>"+listProduct[i].id+"</span><br><img src="+listProduct[i].url+"/></div>";
		}
		document.getElementById("innerProductList").innerHTML=innerHtml;
	}
	
}




function selectProduct(id){
	
	if(wish_isOpen())
		return;
	
	var srcp=$("#p"+id+" img").attr("src");
	if(srcp==""+baseUrl+"store_app/select_empty_icon.png"){
		$("#p"+id+" img").attr("src",""+baseUrl+"store_app/select_full_icon.png");
		var p=$("#p"+id+"").attr("prod");
	
		
	}else{
		$("#p"+id+" img").attr("src",""+baseUrl+"store_app/select_empty_icon.png");
		var p=$("#p"+id+"").attr("prod");
		
	}
}




function selectallProduct(){
	
	if(wish_isOpen())
		return;
	
	var np=$('.selectproduct').size(); 
	for(var id=0;id<np;id++){
		var src=$("#p"+id+" img").attr("src");
		if(src==""+baseUrl+"store_app/select_empty_icon.png"){
			$("#p"+id+" img").attr("src",""+baseUrl+"store_app/select_full_icon.png");
		    var p=$("#p"+id+"").attr("prod");
		    
			
		}
	}
}

function RemoveSelectedProduct(){
		
	if(wish_isOpen())
		return;
	
	var prodSel=$('.selectproduct').size();
	var prodRemove=[];
	var count=0;
	for(var idp=0;idp<prodSel;idp++){
		var srcProd=$("#p"+idp+" img").attr("src");
		
		if(srcProd==""+baseUrl+"store_app/select_full_icon.png"){
			$("#p"+idp+" img").attr("src",""+baseUrl+"store_app/select_empty_icon.png");
			var p=$("#p"+idp+"").attr("prod");
			prodRemove.push(p);			
			if(typeof removeFavouriteListener !== 'undefined')
			{
				removeFavouriteListener(p);
			}
			count++;
		}
		
	}
	if(count>0){
	 navStack.favouritesRemove(prodRemove,showProductsFav);
	// prodRemove.clear();
	showBasicDialog("Product/s were deleted successfully from favourites.");
	}else
	showBasicDialog("Select product to remove from favourites.");
}

function addProductTowishlist(){
	navStack.favouritesAddProduct(prodSelected);
	
}

function showProductsFav(){
	
	navStack.favouritesDraw(productlistFavourite);
	$("#productListFavorite").show();


}
var wishList=[];

function createWishlist()
{
	if(wish_isOpen())
		return;
    
    wishList=[];
    $('.selectproduct').each(function()
    {
    	
    	var selectIcon=$(this).children("img").attr("src");
    	if(selectIcon.indexOf("full")!=-1) //selezionato
    		{
    		   var pId= $(this).attr("prod");
    		   
    		for(var j=0; j<listProd.length;j++)
    		  {
    			if(pId==listProd[j].id)
    			wishList.push(listProd[j]);
    		  }
    		
    		   
    		  
    		}
    }		
    );
    
    if(wishList.length==0)
    	{
    	showBasicDialog("Please select at least one favourite")
    	return;
    	}
    
    $("#navigation_Panel").removeClass('smallNavigationPanel');
	$("#navigation_Panel").addClass('bigNavigationPanel');
    $("#icon-panel").animate({left: "619px"},0);

    
    htmlRequest("run.app", {
		id : renderId,
		forceTemplateName : 'wishlist/wishListPanel.html',
		
	});
    
	
}

function wish_refreshItem(index)
{
	if(index>=wishList.length)
		return;
		
	var wish= wishList[index];
	
	$("#wishPanel_title").html(wish.id);
	$("#wishPanel_img").attr("src", wish.url);
	$(".productinWishlist").attr("target", index);
	
	colorSize(wish.id);
	
}


function wish_isOpen()
{
	return $("#navigation_Panel").hasClass('bigNavigationPanel');
}

function wish_refreshCurrentCustomer()
{
	var curCust=wishManager.getCurrentCustomer();  
	if(curCust && curCust.title)
	{
		$(".wishTapToLink").html("TAP TO LINK TO OTHER CUSTOMER");		
		$(".wishCustomer").html(curCust.title);
	}
	else
	{
		$(".wishTapToLink").html("TAP TO LINK TO CHOSEN CUSTOMER");
		$(".wishCustomer").html("");
	}
	
}


function __old_createWishlist(){
	var prodSel=$('.selectproduct').size();
	var c=0;
	
	$("#navigation_Panel").removeClass('smallNavigationPanel');
	$("#navigation_Panel").addClass('bigNavigationPanel');
    $("#icon-panel").animate({left: "619px"},0);
   
    var innerHtml='';
		//WishList
	    innerHtml+="<div id='productWishList'><img id='verticalLine2' src='"+baseUrl+"store_app/vertical_lines.png'/><img id='verticalLine' src='"+baseUrl+"store_app/vertical_lines.png'/>";
	    innerHtml+="<div id='insertWishlist'><span>INSERT IN WISHLIST</span><img id='backWl' onclick='closewishList()'src='"+baseUrl+"store_app/back_bt.png'/><br><div id='insertProduct_wl'></div>";
     var arr=wishManager.getCurrentCustomer();  
	wishList.splice(0,wishList.length);	
	
		
	
	for(var idp=0;idp<prodSel;idp++){
		var srcProd=$("#p"+idp+" img").attr("src");
		if(srcProd==""+baseUrl+"store_app/select_full_icon.png"){
			for(var j=0; j<listProd.length;j++){
				 var  p=$("#p"+idp+"").attr("prod");
		     var innerHtml2=''; 
		     if(p==listProd[j].id){
		    	
		 		innerHtml2="<div id='"+c+"' target='"+c+"' idprod='"+p+"' urlprod='"+listProd[j].url+"' class='productinWishlist'><span style='font-size:20px;margin-top:10px;margin-left:-70px;text-align:center'>"+listProd[j].id+"</span><br><img src="+listProd[j].url+"/></div>";
		 		innerHtml2+="<div id='divcolorSize'><hr style='margin-left:150px;width:90%'><div id='color'><span class='classText' style='font-size:12px; margin-left:110px;'>SWIPE TO SELECT COLOR</span><center>" +
		 				"<div class='check-boxwl'><img style='width:60px;margin-top:6px;' src='"+baseUrl+"store_app/check.png' /></div></div>" +
		 				"<hr id='hrFav' style=''><div id='scrollRollerColor'  onscroll='colorsRollerwl.onScroll()'></div></center>   " +
		 				"<div id='size' ><span class='classText' style='font-size:12px; margin-left:110px;'>SWIPE TO SELECT SIZE</span><center>" +
		 				" <div class='check-box-sizewl'><img style='width:60px;margin-top:6px;' src='"+baseUrl+"store_app/check.png' /></div>" +
		 				"<div id='scrollRollerSize' onscroll='sizesRollerwl.onScroll()'></div></center></div></div><hr style='margin-top:-10px;margin-left:50px;width:90%'>";
		 		if(arr==null){
		 			innerHtml2+="<center><div id='client_to_wishlist' onclick='searchFormClient()'><span class='classText' style='font-size:12px; margin-left:50px;margin-bottom:20px;'>TAP TO LINK TO CHOSEN CUSTOMER</span><br>" +
	 				"<img style='width:60px;margin-left:60px;margin-top:10px;' src='"+baseUrl+"store_app/link_customer_icon.png''/></div><center><hr style='margin-top:5px;margin-left:50px;width:90%'>";
		 		}else{
		 			innerHtml2+="<center><div id='client_to_wishlistSet' onclick='searchFormClient()'><span class='classText wishTapToLink' style='font-size:12px; margin-left:50px;margin-bottom:20px;'>TAP TO LINK TO OTHER CUSTOMER</span><br>" +
	 				"<img style='width:50px;margin-left:20px;' src='"+baseUrl+"store_app/link_customer_icon.png''/><span class='classText wishCustomer' style='font-size:20px; margin-left:2px;margin-bottom:20px;'>"+arr.title+"</span></div><center><hr style='margin-top:5px;margin-left:50px;width:90%'>";
		 		}
		 		
		 		wishList.push(innerHtml2);
		 		 c++;
		    }
		     
		      
		      $("#p"+idp+" img").attr("src",""+baseUrl+"store_app/select_empty_icon.png");  
		         
			}
		}
	} 
	if(c<=0){
		showBasicDialog("Select product for add to wishlist.");
	}else{
	innerHtml+="<div id='containerWl'><div id='prevWl' onclick='previousPagewl()'><img src='"+baseUrl+"store_app/previous_layer.png''/></div><div id='addwishlist' onclick='addToWishlist()'><img src='"+baseUrl+"store_app/add-client.png''/><span id='insertWlspan' class='classText' style='font-size:12px;'>INCLUDE IN WISHLIST</span></div>" +
	"<div id='nextWl'onclick='nextPagewl()'><img src='"+baseUrl+"store_app/next_layer.png''/></div></div>";
    document.getElementById("innerHtmlWL").innerHTML+=innerHtml;
    document.getElementById("insertProduct_wl").innerHTML=wishList[0];
    var  p1=$("#0").attr("idprod");
    colorSize(p1);
	 
	}

}
function closeFavouriteStack(){
	var innerHtml2="";
	
	innerHtml2+="<div id='taptoopenwishlist' onclick='favouriteStack()'><hr class='hrStyle' color='#ffffff'><img class='tapHereImg'  src='"+baseUrl+"store_app/tap_here_to_open_favourites.png'><hr class='hrStyle' color='#ffffff'></div>";
	document.getElementById("favourite-Stack").innerHTML=innerHtml2;
	navStack.drawBookmarkByType("navigation_Scroll");
	
}

function colorSize(sapid){
	
	htmlRequest("sapservice.app",
	{
		action : 'getSizesColors',
		material:sapid,
		forceTemplateName : 'valentino/wishlist/colorSizewishlist.html'
	}      		
);
}
var colorwl="all";
var sizewl="all";
function saveColorwl(){
colorwl=$(".blackwl").attr("target");

}
function saveSizewl(){
	sizewl=$(".blacksizewl").attr("target");

	}
var sizesRollerwl;
var colorsRollerwl;
$(document).ready(function() {
  
	
	colorsRollerwl= new Roller({
				name:"Color Roller wl",
				tableId : "rollTableColor",
				scrollingId : "scrollRollerColor",
				activePosition : 2,
				
				//opzionali
				scrollType : "horizontal",
				activeClass: "blackwl",
				callback : function(activeElement) {
					saveColorwl()

				},
				cellDimension : 60
			});
  
  sizesRollerwl= new Roller({
		name:"Size Roller wl",
		tableId : "rollTableSize",
		scrollingId : "scrollRollerSize",
		activePosition : 2,
		
		//opzionali
		scrollType : "horizontal",
		activeClass: "blacksizewl",
		callback : function(activeElement) {
			 saveSizewl()

		},
		cellDimension : 60
	});

 

});
function nextPagewl(){
	
	    var n=wishList.length;
		var tar=$(".productinWishlist").attr("target");
		
		
		var t= parseInt(tar);
		var t2=t+1;
		if(t2<n){
			document.getElementById("insertProduct_wl").innerHTML=wishList[t+1];
			
			var  p=$("#"+t2+"").attr("idprod");
			colorSize(p);
		}
}

function changePagewl(direction)
{
	var n=wishList.length;
	var tar=$(".productinWishlist").attr("target");
	
	
	var index= parseInt(tar);
	
	if(direction=="back")
	{
		index=index-1;
		if(index<0)
			return;
	}
	else
	{
		index=index+1;
		if(index>=n)
			return;
	}
	
		wish_refreshItem(index);
	
}
		
function previousPagewl(){
	
		var n=wishList.length;
		var tar=$(".productinWishlist").attr("target");
		var t= parseInt(tar);
		var t1=t-1;
		if(t>0){
			document.getElementById("insertProduct_wl").innerHTML=wishList[t1];
			
			var  p=$("#"+t1+"").attr("idprod");
			colorSize(p);
		}
}

function searchFormClient(){
	 $("#insertProduct_wl").hide();
	 $("#containerWl").hide();
	htmlRequest("run.app", {
		id : renderId,
		forceTemplateName : 'wishlist/searchClient.html',
		
	});
}
var clientId="";
 function searchCust() {
        clientId = document.getElementById('wish_clientId').value;
	var companyName = document.getElementById('wish_companyName').value;
	var firstName = document.getElementById('wish_firstName').value;
	var lastName = document.getElementById('wish_lastName').value;

	//validation
	if (clientId.length < 1 && companyName.length < 2 && lastName.length < 2) {
		showBasicDialog("Please compile Customer Id or at least one of Last Name or Company Name with at least 2 characters");
	} 
	else {
		showActInd();
		this.lastSearchDate=new Date();
		
		htmlRequest("service.app", {
			action : 'searchCustomers',
			
			clientId : clientId,
			"companyName" : companyName,
			forceTemplateName : 'valentino/wishlist/resultsearchClient.html',
			"firstName" : firstName,
			"lastName" : lastName,
			 brand : authUser.brand_crm
		}

		);
	}

}
 function backToaddWishlist(){
	 $("#searchWl").html("");
	 $("#insertProduct_wl").show();
	 $("#containerWl").show();
	 wish_refreshCurrentCustomer();
	 //document.getElementById("insertProduct_wl").innerHTML=wishList[0];
	 
	 //var  p1=$("#0").attr("idprod");
	   // colorSize(p1);
 }
 function addToWishlist(){
	 var n=wishList.length;
		var col=$("#scrollRollerColor .blackwl").attr("target");
		var siz=$("#scrollRollerSize .blacksizewl").attr("target");
		var pId=$("#wishPanel_title").html();
		var url=$("#wishPanel_img").attr("src");
		
	
	 var item=
		  {
		  prodId: pId,
	      color:col, 
		  size:siz,
		  url:url 
		 };
	 
	 wishManager.createWishItem(item);
	 changePagewl("next");
 }
 
 
 function closewishList(){
 	    document.getElementById("innerHtmlWL").innerHTML='';
		$("#navigation_Panel").removeClass('bigNavigationPanel');
		$("#navigation_Panel").addClass('smallNavigationPanel');
	    $("#icon-panel").animate({left: "256px"},0);
	    
 }