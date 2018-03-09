function valida_campo2(id, $etiqueta, $color_alert, $color_ok, $box, $box_color_alert, $box_color_ok){
	var primer_campo = 0;
	$.each(id, function(entryIndex, entry){
		var j_campo = $("#"+entry).val();
		if(j_campo.length <= 0 || /^\s+$/.test(j_campo)){
			//alert("error "+entry+"-"+entryIndex)		  
			error=1;
			if(primer_campo == 0)
				$("#"+$box[entryIndex]).focus();
			if($etiqueta != "")
				$("#"+$etiqueta[entryIndex]).css({'color':$color_alert[0]});
			if($box != "")
				$("#"+$box[entryIndex]).removeClass('text_box').addClass('text_box_alert'); //$("#"+$box[entryIndex]).css({'background-color':$box_color_alert[0]});
				
			// activar vibracion para elementos que no se llenaron	
			//$("#"+entry).trigger('startRumble');
			demoTimeout = setTimeout(function(){$("#"+entry).trigger('stopRumble');}, 300);		
			primer_campo++;
		}else{
			//alert("OK "+entry)
			if($etiqueta != "")	
				$("#"+$etiqueta[entryIndex]).css({'color':$color_ok[0]});
			if($box != "")
				$("#"+$box[entryIndex]).removeClass('text_box_alert').addClass('text_box'); //$("#"+$box[entryIndex]).css({'background-color':$box_color_ok[0]});
			
		}
	})
}
function validar_email2(id, $etiqueta, $color_alert, $color_ok, $box, $box_color_alert, $box_color_ok)
{
	var j_campo = $("#"+id).val();
	// creamos nuestra regla con expresiones regulares.

	var filter = /[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;
	// utilizamos test para comprobar si el parametro valor cumple la regla
	if(filter.test(j_campo)){
			//alert("OK "+j_campo)
			if($etiqueta != "")	
				$("#"+$etiqueta).css({'color':$color_ok[0]});
			if($box != "")
				$("#"+$box).css({'background-color':$box_color_ok[0]});	
		}else{
			//alert("error "+j_campo)
			error=1;
			if($etiqueta != "")
				$("#"+$etiqueta).css({'color':$color_alert[0]});
			if($box != "")
				$("#"+$box).css({'background-color':$box_color_alert[0]});		
		}
}
function limitaText(maximoCaracteres, id, elEvento) {
	var elemento = document.getElementById(id);
	var evento = elEvento || window.event;
	var caracter = evento.keyCode;
	
	if(elemento.value.length >= maximoCaracteres ) {
		if(caracter!=8)
			return false;
	}
	else {
		if(caracter==8 && elemento.value.length > 0)
			$("#num"+id).html(elemento.value.length-1);
		else if(caracter!=8){	
			$("#num"+id).html(elemento.value.length+1);
			return true;
		}
	}	
}

