



function viewChangepass(){
	var s=$("#home-icon").attr('src');
	if(s==""+baseUrl+"store_app/home_quest.png"){
		$("#chpws-icon").css({visibility: "visible"}).animate({opacity: 1.0},300);
		$("#home-icon").attr('src',""+baseUrl+"store_app/quest_button.png");
	}else{
	$("#chpws-icon").css({visibility: "hidden"}).animate({opacity: 0},300);
	$("#home-icon").attr('src',""+baseUrl+"store_app/home_quest.png");
	}
}

var currentUrlLook="";
var navStack;
var jssor_slider1;
initScroller();


function showNavigationPanel()
{
	$('#blackScreen').show()
	$("#navigation_Panel").animate({left: "0px"},300);
	$("#home-icon").css({visibility: "visible"}).animate({opacity: 0.7},300);
	$("#grid-icon").css({visibility: "visible"}).animate({opacity: 0.7},300);
	$("#wishlist-icon").css({visibility: "visible"}).animate({opacity: 1.0},300);
	$("#panel-button-fw").css({visibility: "visible"});
	$("#panel-button-bk").css({visibility: "hidden"});

}
function goToCrm()
{
	 var arr=wishManager.getCurrentCustomer();  
	var url="run.app?id="+customerId+"&clientId="+arr.id;
	window.location.assign(url);

}

function hideNavigationPanel()
{   
	if($("#navigation_Panel").hasClass("bigNavigationPanel")==false){
		
		$('#blackScreen').hide()
		$("#navigation_Panel").animate({left: "-250px"},300);
	    $("#home-icon").css({visibility: "hidden"}).animate({opacity: 0.0},400);
	    $("#grid-icon").css({visibility: "hidden"}).animate({opacity: 0.0},400);
		$("#chpws-icon").css({visibility: "hidden"}).animate({opacity: 0},300);
		$("#wishlist-icon").css({visibility: "hidden"}).animate({opacity: 0},300);
		$("#home-icon").attr('src',""+baseUrl+"store_app/home_quest.png");
	    $("#panel-button-fw").css({visibility: "hidden"});
		$("#panel-button-bk").css({visibility: "visible"});
		
	} else{
		 $("#navigation_Panel").animate({left: "-250px"},300);
		  $("#icon-panel").animate({left: "256px"},0);
		  $('#blackScreen').hide()
		    $("#home-icon").css({visibility: "hidden"}).animate({opacity: 0.0},400);
		    $("#grid-icon").css({visibility: "hidden"}).animate({opacity: 0.0},400);
			$("#chpws-icon").css({visibility: "hidden"}).animate({opacity: 0},300);
			$("#wishlist-icon").css({visibility: "hidden"}).animate({opacity: 0},300);
			$("#home-icon").attr('src',""+baseUrl+"store_app/home_quest.png");
		    $("#panel-button-fw").css({visibility: "hidden"});
			$("#panel-button-bk").css({visibility: "visible"});
			closewishList();
			closeFavouriteStack()
	}
}

function toggleNavigationPanel() {
	if ($("#panel-button-bk").css("visibility") == "visible") //è chiuso
	{ 
        showNavigationPanel();
	} 
	else //è aperto
	{
       hideNavigationPanel();
	}
}
var val=true;
var val2=true;
/*--------------- FUNZIONI DA LANCIARE ALL'AVVIO ---------------------*/
$(document).ready(function() {

	
	//inizializzo eventi pannello
if(getById("icon-panel"))
{
 $("#icon-panel").addSwipeEvents().bind("swiperight", showNavigationPanel);
	$("#icon-panel").addSwipeEvents().bind("swipeleft", hideNavigationPanel);

	$("#icon-panel").click(toggleNavigationPanel);
	
	//inizializzo stack navigation e disegno bookmark
	navStack= new NavStack(authUser,jsessionid);
    navStack.drawBookmarkByType("navigation_Scroll");
}


 
});



function nav(){
	 if(!getCookie('flavour')){
		var current_flavour=console_flavour;
	 }else{
		 var current_flavour=getCookie('flavour');
	 }
	 var expdate = new Date();
	    expdate.setYear(2222);
		setCookie('flavour',current_flavour, expdate); 
		window.location.assign("&forceExecutionName=setFlavour.txt&flavour="+current_flavour);
}
function changeView(current_flavour,id,extraparam,look_id) {

	    if(current_flavour=="full"){
		     var flavour="grid";
	     }
	    else{
		     var flavour="full";
	     }
	
	var expdate = new Date();
	expdate.setYear(2222);
	setCookie('flavour',flavour, expdate);
	var string_param="";
	for (var key in extraparam) {
		if(key!='forceExecutionName'){
			if(key!='flavour' && key!='lookid' && key!="page")
		string_param+= key + "=" + extraparam[key]+"&";
		}
	}
	if(look_id!=null){
	      window.location.assign('run.app?'+string_param+"forceExecutionName=setFlavour.txt&flavour="+flavour+"&lookid="+look_id);
	}else{
	      window.location.assign('run.app?'+string_param+"forceExecutionName=setFlavour.txt&flavour="+flavour);
        }
}
function goBack(){
	history.back()
}

function initScroller(){
	 jssor_slider1_starter = function (containerId) {
		 var jStartIndex=0;
		 
		 var jLazyLoader=function()
		 {
			 
		 }
		 
		 if(typeof start !== "undefined" && start)
		 {
			 jStartIndex=start;
		 }
		 
		 if(typeof lazyLoader !== "undefined" )
		 {
			 jLazyLoader=lazyLoader;
		 }
		 
		 
		 
         var _CaptionTransitions = [];
         _CaptionTransitions["L"] = { $Duration: 900, x: 0.6, $Easing: { $Left: $JssorEasing$.$EaseInOutSine }, $Opacity: 2 };
         _CaptionTransitions["R"] = { $Duration: 900, x: -0.6, $Easing: { $Left: $JssorEasing$.$EaseInOutSine }, $Opacity: 2 };
         _CaptionTransitions["T"] = { $Duration: 900, y: 0.6, $Easing: { $Top: $JssorEasing$.$EaseInOutSine }, $Opacity: 2 };
         _CaptionTransitions["B"] = { $Duration: 900, y: -0.6, $Easing: { $Top: $JssorEasing$.$EaseInOutSine }, $Opacity: 2 };
         //Reference http://www.jssor.com/development/tool-caption-transition-viewer.html

         var options = {
             $AutoPlay: false,                                    //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
             $PlayOrientation: 2,                                //[Optional] Orientation to play slide (for auto play, navigation), 1 horizental, 2 vertical, 5 horizental reverse, 6 vertical reverse, default value is 1
             $DragOrientation: 2,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)
             $LazyLoading:2,
             $Loop:0,
             $StartIndex: jStartIndex,            
             $CaptionSliderOptions: {                            //[Optional] Options which specifies how to animate caption
                 $Class: $JssorCaptionSlider$,                   //[Required] Class to create instance to animate caption
                 $CaptionTransitions: _CaptionTransitions,       //[Required] An array of caption transitions to play caption, see caption transition section at jssor slideshow transition builder
                 $PlayInMode: 0,                                 //[Optional] 0 None (no play), 1 Chain (goes after main slide), 3 Chain Flatten (goes after main slide and flatten all caption animations), default value is 1
                 $PlayOutMode: 0                                 //[Optional] 0 None (no play), 1 Chain (goes before main slide), 3 Chain Flatten (goes before main slide and flatten all caption animations), default value is 1
             }
         };

       jssor_slider1 = new $JssorSlider$(containerId, options, jLazyLoader);
     
     }
}




/*--------------- FUNZIONI DI UTILITY GENERICHE ---------------------*/
function leftPad(n, width, z) {
	  z = z || '0';
	  n = n + '';
	  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}


function prepareModal(content) {
	getById('modal').style.display = 'block';
	getById('modal-content').style.display = 'block';
	getById('modal-content').innerHTML = content;
	getById('modal').style.opacity = 0;
}


function showWaitingDialog(message){
	var html = waitingDialog.replace("[MESSAGE]", "" + message);

	showModal(html);
}

function showBasicDialog(message, action){
	var html = basicDialog.replace("[MESSAGE]", "" + message);
	if(action)
		html= html.replace("hideModal()", "hideModal();"+action);
    hideActInd();
	showModal(html);
}

function showYesNoCancelDialog(	params)
{
	var html=yesnocancelDialog.replace("[MESSAGE]", "" + params.message);
	html=html.replace("[YES]", params.yesCallback);
	html=html.replace("[NO]", params.noCallback);
	
	showModal(html)
	
}

function showModal(content) {
	prepareModal(content)
	adjModal();
}

function adjModal() {
	
	getById('modal-content').style.marginLeft = '-' + (getById('modal-content').offsetWidth / 2) + 'px';
	getById('modal-content').style.marginTop = '-' + (getById('modal-content').offsetHeight / 2) + 'px';
	if (getById('modal-content').offsetHeight < 512 && document.body.offsetHeight > 512)
		getById('modal-content').style.top = "33%";
	else
		getById('modal-content').style.top = "50%";
	getById('modal').style.opacity = 1;
	
}



function hideModal() {
	getById('modal').style.opacity = 0;
	setTimeout(function() {
		getById('modal').style.display = 'none'
		getById('modal-content').innerHTML = '';
	}, 250);
}


function confirmLogout()
{
	var html= yesnoDialog;
	html=html.replace("[MESSAGE]", "Are you sure you want to log out?");
	html=html.replace("[YES]", "customLogout()");
	
	showModal(html);
}

//logout 
function customLogout() {
	
	showActInd();
	htmlRequest("service.app", {
		action : "logout"
	}, function(req, params) {

		hideActInd();
		if (req.status == 200) {
			window.location.assign('run.app')

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



function showActInd() {
	// Setup the ajax indicator
	if ($('#ajaxBusy').length == 0)
		
	//	$('body').append('<div id="ajaxBusy"><div id="spinner" ><i id="spin" class="icon-spinner"></i></div></div>');

	$('body').append('<center><div id="panelActInd"><div id="ajaxBusy"><div id="spinner"><img src="' +baseUrl+'store_app/loading1.gif" height="200" width="200"></div></div></div></center>');
	$('#scrollerRollerSize').css("overflow","hidden");
	$('#scrollerRollerColor').css("overflow","hidden");
	$('#responseAvailability').css("overflow","hidden");
	$('#scrollerSeason').css("overflow","hidden");
	$('#scrollerCollection').css("overflow","hidden");
	$('#scrollerLine').css("overflow","hidden");
	
	$('#panelActInd').css({
		display : "none",
		position : "absolute",
		left : "0px",
		top : "0px",
		width : "100%",
		height : "100%",
		opacity : 0.9,
		'background-color':'rgba(0,0,0,0.5)',
		'z-index':'477423'
		
	});
	$('#ajaxBusy').css({
		display : "none",
		position : "absolute",
		left : "280px",
		top : "480px",
		width : "10%",
		height : "10%",
		opacity : 1,
		'z-index':'17745'
	});

	$('#spinner').css({
		marginLeft : "4px",
		verticalAlign : "middle",
		position : "absolute",
		left : "0px",
		
		top : "0px",
		textAlign : "center",
		display : "table-cell",
		fontSize : "40px",
		
		color : "black",

	});
	$('#panelActInd').show();
	$('#ajaxBusy').show();

}

function hideActInd()
{$('#panelActInd').hide();
	$('#ajaxBusy').hide();
	$('#scrollerRollerSize').css("overflow","auto");
	$('#scrollerRollerColor').css("overflow","auto");
	$('#responseAvailability').css("overflow","auto");
	$('#scrollerSeason').css("overflow","auto");
	$('#scrollerCollection').css("overflow","auto");
	$('#scrollerLine').css("overflow","auto");
}


function getStringDateTime(dateString)
{
	var jsDate = new Date(dateString);
	
	var stringDate=jsDate.toLocaleDateString()+" "+ jsDate.toLocaleTimeString()
	//console.log(stringDate);
	return stringDate;
}

function validEmail(email) {
	return email.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i);
}





