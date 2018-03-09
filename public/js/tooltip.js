/*
 * Url preview script 
 * powered by jQuery (http://www.jquery.com)
 * 
 * written by Alen Grakalic (http://cssglobe.com)
 * 
 * for more info visit http://cssglobe.com/post/1695/easiest-tooltip-and-image-preview-using-jquery
 *
 */
 
this.screenshotPreview = function(){	
	/* CONFIG */
		
		xOffset = 120;
		yOffset = 30;
		
		// these 2 variable determine popup's distance from the cursor
		// you might want to adjust to get the right result
		
	/* END CONFIG */
	$("a.screenshot").hover(function(e){
		this.t = this.title;
		this.title = "";	
		var c = (this.t != "") ? "<br/>" + this.t : "";
		$("body").append("<div id='screenshot'><img src='"+ this.rel +"' alt='imagen' onerror=\"this.src=\'img/default_user.png\' \" />"+ c +"</div>");
		//$(".modal_contenido").append("<span id='screenshot'><img src='"+ this.rel +"' alt='imagen' onerror=\"this.src=\'img/default_user.png\' \" />"+ c +"</span>");								 
		$("#screenshot")
			.css("top",(e.pageY - xOffset) + "px")
			.css("z-index",10000)	// anteriormente tenia valor de 1000 pero el modal se sobreponia y no mostraba la foto
			.css("left",(e.pageX + yOffset) + "px")
			.fadeIn("fast");						
    },
	function(){
		this.title = this.t;	
		$("#screenshot").remove();
    });	
	$("a.screenshot").mousemove(function(e){
		$("#screenshot")
			.css("top",(e.pageY - xOffset) + "px")
			.css("left",(e.pageX + yOffset) + "px");
	});			
};


// starting the script on page load
$(document).ready(function(){
	screenshotPreview();
});