/*
 * Authors Andreina & Tiziana
 * 
 * componente che gestisce l'effetto rullino orizzontale o verticale
 * Happy rolling.
 * 
 * da inizializzare quando il documento è caricato. 
 * 
 var myRoller;
  $(document).ready(function() {
    myRoller= new Roller({
				name:"My Roller",
				tableId : "rollingTable",
				scrollingId : "leftMenu",
				activePosition : 5,
				//opzionali
				scrollType : "vertical",
				callback : function(activeElement) {
					//do something with active element

				},
				cellDimension : 70
			});
  
  }
 * attaccare all'elemento che scrolla. 
 *  <div id="leftMenu" onscroll="myRoller.onScroll()">
 * 
 * 
 */
function Roller(params) {
	//parametri obbligatori
	this.tableId = params.tableId;// id della tabella da scrollare
	this.scrollingId = params.scrollingId;  //id dell'elemento contenitore che scrolla
	this.activePosition = params.activePosition
	this.lastPosition= params.lastPostion //ultima posizione legittima
	
	//opzionali
	this.scrollType = params.scrollType ? params.scrollType: "horizontal"; //possibili horizontal o vertical
	this.cellDimension = params.cellDimension ? params.cellDimension: 40; // dimensione della cella. width se horizontal, height se vertical
	this.activeClass = params.activeClass ? params.activeClass: "active"; //classe dell'elemento attivo
	this.callback = params.callback ? params.callback: function(activeEl){}  // funzione da applicare sull'elemento attivo;
    this.name= params.name?  params.name: "ROLLER"; //nome che può servire a distinguere i vari roller
	//parametri iniziali scroll
	this.lastScroll = 0;
	this.lastActive=0;
	this.direction = "forward";
	this.timer=null;
	this.interval=null;
	this.target=null;
	console.log(this.name + " Roller loaded. v"+this.version);
}
Roller.prototype.version="1.0.3";

Roller.prototype.getLength = function() {
		if (this.scrollType == "horizontal") {
			return this.tableEl.rows[0].cells.length;
		} else {
			return this.tableEl.rows.length;
		}
	};
	
Roller.prototype.getCurrentScroll = function() {
	if (this.scrollType == "horizontal") {
		return this.scrollingEl.scrollLeft;
	} else {
		return this.scrollingEl.scrollTop;
	}
};


Roller.prototype.scrollToPosition=function(position)
{
	var target = this.cellDimension * position
	if (this.scrollType == "horizontal") {
		
		getById(this.scrollingId).scrollLeft=target;
		
		
	} else {
		getById(this.scrollingId).scrollTop=target;

	}
	
}


Roller.prototype.setActiveElement = function(position, activateCallback) {
	
	
	var activePos = this.activePosition + position - 1;

	if (this.scrollType == "horizontal") {
		var el = this.tableEl.rows[0].cells[activePos];
		var items = this.tableEl.rows[0].cells;

	} else {
		var el = this.tableEl.rows[activePos];
		var items = this.tableEl.rows;
	}
	

	for ( var i = 0; i < items.length; i++) {
		items[i].classList.remove(this.activeClass);
	}
	
	
	el.classList.add(this.activeClass);
	
	
	//applico funzione sull'elemento attivo
	if(activateCallback)
	{
		console.log(this.name + " Roller activates callback on position "+ position); 
		this.callback(el);
		
	}
	//console.log(this.name + " Roller change "+ position); 	

};

Roller.prototype.getCurrentPosition=function()
{
	if (this.direction == "forward") //scroll up o verso destra
	{

		var position = Math.floor(this.getCurrentScroll()
				/ this.cellDimension);
	} else //scroll down o verso sinistra
	{

		var position = Math.ceil(this.getCurrentScroll()
				/ this.cellDimension);
	}
	// check posizioni non valide
	if(position<0)
	{
		position=0;
	}
	else if ( this.lastPosition && position>this.lastPosition)
	{
		
		position=this.lastPosition	
		
		
	}
		
	return position;
};

Roller.prototype.onScroll=function() {
	//calcolati
	this.tableEl = document.getElementById(this.tableId); //elemento fisico del dom
	this.scrollingEl = document.getElementById(this.scrollingId); //elemento che scrolla
	
	var numElements = this.getLength();

	var totalDimension = numElements * this.cellDimension;

	this.target = null;
	if (this.timer)
		clearTimeout(this.timer);
		
	 this.setActiveElement(this.getCurrentPosition()); 
	 var that=this;
	 

	
	 
	 
	

	this.timer = setTimeout(function() {
		
		var position= that.getCurrentPosition();
		
		that.target = that.cellDimension * position
		
		//scatena callback
		that.setActiveElement(position, true);

		if (that.scrollType == "horizontal") {
			$("#" + that.scrollingId).animate({
				scrollLeft : that.target
			}, 120);
		} else {
			$("#" + that.scrollingId).animate({
				scrollTop : that.target
			}, 120);

		}
		

	}, 100)

	var scroll = this.getCurrentScroll();

	this.direction = scroll < this.lastScroll ? "forward" : "back"

	this.lastScroll = this.getCurrentScroll();
}


