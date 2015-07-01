var pageSize=7;
var distance=3;
var done= false;
var loading=false;
var look_id;

// sovrascrive la funzione globale
function goBack() {
	/* questo back è una malattia */
	
	

	try {
		
		var pageHack= Math.floor(currentSlide/4);
		//controllo se la pagina precedente è la stessa linea in formato griglia
		var backUrl = document.referrer.split("/").slice(-1)[0];
		backUrl = backUrl.replace("run.app?", "");
		var backDict = {
			id : "",
			season_number : "",
			collection : "",
			line_id : "",
			flavour : ""

		};
		backUrl.split("&").forEach(function(item) {
			backDict[item.split("=")[0]] = item.split("=")[1]

		})

		var currentUrlDict = {};
		location.search.substr(1).split("&").forEach(function(item) {
			currentUrlDict[item.split("=")[0]] = item.split("=")[1]

		})

		if (backDict.id == currentUrlDict.id
				&& backDict.season_number == currentUrlDict.season_number
				&& backDict.collection == currentUrlDict.collection
				&& backDict.line_id == currentUrlDict.line_id
				&& backDict.flavour == "grid") 
		{
			//malattia. Metto un cookie che scade tra due minuti che verrà letto dalla pagina precedente
			var expDate = new Date();
			expDate.setMinutes(expDate.getMinutes() + 2);
			setCookie('pageHack', pageHack, expDate);
			

		}
	} catch (ex) {

	}

	history.back();
}

function goTo(i)
{
	hideActInd();
	currentSlide=i;
	getById("slider_elementx4").scrollTop=1024* (currentSlide);
}


function snap(currentSlide){
$("#slider_elementx4").animate({
		scrollTop : 1024* (currentSlide)
		},300);

// document.getElementById('slider_elementx4').scrollTop=1024* (currentSlide);
	
		//dynamicLoading();
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

		

	function getLooks(look,child_id,idlook,brand)
	{  				
		htmlRequest("service.app",
		{
			action : 'getLooks',
			collection:look.collection,
			season_number:look.season_number,
			line_id:look.line_id,
			child_id: child_id,
			idlook:idlook,
			pageSize:pageSize,
			view:"second_view",
			brand:brand
		}
		      		
		
		);
		
	}

	/*
	 *  Funzione per tracciare l'apertura del look
	 */	
	
function traceLook(lookIndex)
{
	
	var currentUrl= location.href.split('/').slice(-1)[0];
	var descIndex="look "+(lookIndex+1)
	
	var label= extra_param['season_number']+ " "+extra_param['collection']+" "+extra_param['line_id']+" "+descIndex;
	
	if(currentUrl.indexOf("lookid=")!=-1)
	{
		currentUrl= currentUrl.substring(0, currentUrl.indexOf("lookid=")-1); //levo lookid
	
	}
	currentUrlLook=currentUrl+"&lookid="+lookIndex;
	var item={
			parentUrl:currentUrl,
			url: currentUrl+"&lookid="+lookIndex,
			label:label,
			type:"looks"
	}
	
   	navStack.trace(item);
	
	history.replaceState(null, null, currentUrlLook);
}

/**
 *  naviga nella pag del prodotto e traccia l'apertura
 *  
 *  item deve contenere url e label
 * */
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

	
function getProd(material,child_id, lookIndex,brand){
	
	//$("#materials").animate({bottom: "0px"},300);
	if(material){
		showActInd();
		htmlRequest("service.app",
			{
		action : 'getProduct',
		child_id: child_id,
		material:material,
		brand:brand
	        }
	);
		showProduct(lookIndex);
		$('#product-share').show();
		look_id=lookIndex;
		
		}else
		showBasicDialog("NO PRODUCTS");
}
function sendMail()
{
	var urlProd=$("#look_" +look_id+ " img").attr('src');
	var label=look_id+" SEASON: "+season_number+" "+collection+" "+line_id;
	mailer.openImageMail(label, urlProd,'look');
}
function showProduct(lookIndex){

	     $("#materials").attr("currentLookIndex", lookIndex);
		 $("#materials").removeClass("materials-close");
		 $("#materials").addClass("materials-enter");
		 $("#materials").show();
		 $("#prod-Fixed").show();

}

function hideProduct(){
	 $("#materials").addClass("materials-close");
	 $("#materials").removeClass("materials-enter");
	 $("#materials").html(" ");
	 $("#materials").hide();
	 $("#prod-Fixed").hide();
	
}


function lllazyLoader(index)
{
	return;
  for(var i=index-4; i<=index+4; i++)
  {
	 
	  
	  $("img[llindex="+i+"]").each(
	    function()
		{
		  var llsrc= $(this).attr("llsrc");
		  $(this).attr("src", llsrc)
		  $(this).show();
		}	  
	  
	  )
  }
  for(var i=index-8; i<index-4; i++)
  {
	 
	  //W jquery
	  $("img[llindex="+i+"]").each(
	    function()
		{
		  
		  $(this).attr("src", "")
		  
		}	  
	  
	  )
  }
  for(var i=index+5; i<=index+9; i++)
  {
	 
	  //W jquery
	  $("img[llindex="+i+"]").each(
	    function()
		{
		  
		  $(this).attr("src", "")
		  
		}	  
	  
	  )
  }
  
  
	
	
}

function appendSlides(slides)
{
	var html="";
	for(var i=0; i<slides.length;i++)
	{
		var slide= lookSlideT;
		slide=slide.replace("[LOOK_ID]", slides[i].id);
		slide=slide.replace("[IMGURL]", slides[i].imgUrl);
		slide=slide.replace("[MAT]", slides[i].look_materials);
		slide=slide.replace("[CHILD]", child_id);
		slide=slide.replace("[INDEX]", slides[i].look_index);
		slide=slide.replace("[INDEX]", slides[i].look_index);
		slide=slide.replace("[INDEX]", slides[i].look_index);
		html+=slide;
	}
	$("#slider_elementx4").append(html);
	loading=false;
}

function dynamicLoading()
{
	if(done || loading)
		return;
	
	loading=true;
	var last=parseInt($(".lookSlide").last().attr("look_index"),10);
	console.log("dynamicLoading "+last);
	htmlRequest("service.app",
			{
		action : 'getLooks',
		collection:_collection,
		season_number:_season_number,
		line_id:_line_id,
		forceTemplateName:"valentino/service/getLooks/json-dynamic.html",
		pageSize: pageSize,
		offset:last+1,
		view:"second_view"
	}, function(req, params) {
		if (req.status == 200) {
			
			var slides = JSON.parse(req.responseText);
			
			if(slides.length<pageSize)
			{
				done=true;
			}
			
			appendSlides(slides);
		}
	});
	

}
/*
 * carica le immagini vicine alla corrente
 * Svuota le altre
 * */
function showNearSlides(lookid) {
	
	//var last=parseInt($(".lookSlide").last().attr("look_index"),10);
	
	var from= lookid-4;
	var to= lookid+4;
	
	if(from<0)
	{
		from=0;
	}
	
/*carico le slide nella finestra tra from e to*/
		for (var i = from; i <= to; i++) {
			$("img[llindex=" + i + "]").each(function() {
				if ($(this).attr("src") == "") {
					var src2 = $(this).attr("src2");
					$(this).attr("src", src2)
				}
			}

			)
		}
/*//svuoto le slide precedenti 

		for (var i = 0; i < from; i++) {
			$("img[llindex=" + i + "]").each(function() {
				
			if ($(this).attr("src") != "") {
				$(this).attr("src", "")
			}

			})
		}
//svuoto le slide successive 
		for (var i = to+1; i <= last; i++) {
			$("img[llindex=" + i + "]").each(function() {
			
			if ($(this).attr("src") != "") {

				$(this).attr("src", "")
			}

			})
		}
*/


}

$(document).ready(function(){
		$("#slider_elementx4").addSwipeEvents().bind("swipe",sliderX4Scroll);
		
});
