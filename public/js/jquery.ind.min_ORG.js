var $load = $("<div class='span_load'>&nbsp;</div>").addClass('load');
var error=0;
var $ancho = $(window).width();
function animaTitulo()
{
	var sp='';
	var actual = document.title;
	document.title = actual.substr(1) + sp + actual.substring(0, 1);
	sp = (actual.substring(0, 1)==' ')?" ":""
	setTimeout('animaTitulo()', 200);
}
/************** ANIMA FONDO *****************/
var scrollSpeed = 70; 
var current = 0; 
var direction = 'h';
var $id_unidadDepto = ''; // almacena el id_unidadDepto seleccionado para cambiar de unidad administrativa
function bgscroll(){ 
	current -= 1; 
	$('div.clouds').css("backgroundPosition", (direction == 'h') ? current+"px 0" : "0 " + current+"px");
}
 setInterval("bgscroll()", scrollSpeed);
 
$(document).ready(function(e) {
	animaTitulo();

	

	 
	var demoTimeout;
	$( ".tbl_datos tr" ).hover(
		function(){$(this).css( "background-color", "#E0F0FC" );},
		function(){$(this).css( "background-color", "" );}
	);
	$('#pwd').focus();
 
	$("#btn_login").click(function(){
		$pwd = "";
		error=0;
		$('#cont_login').jrumble({		
			x: 5,
			y: 2,
			rotation: 3,
			speed: 1,
			opacity: false
		}); // habilita efecto vibrar
		$pwd=$('#pwd').val();
		valida_campo2(["pwd"],'','','',["pwd"], ["#FFD13A"], ["#E6FACB"]);			
		if(error){
			$('#pwd').focus();
			$('#cont_login').trigger('startRumble');
			demoTimeout = setTimeout(function(){$('#login-box').trigger('stopRumble');}, 300);			
			return;
		}

		$.ajax({
		 type: "POST",
		 contentType: "application/x-www-form-urlencoded", 
		 url: "funciones/valida_usr.php",
		 data: "accion=valida_usr&pwd="+$pwd,
		 beforeSend:function(){ $('#ajax_respuesta_login').html($load); },	   
		 success: function(data){
			//return;
			var obj = jQuery.parseJSON(data);	
			//alert(data);
			$('#ajax_respuesta_login').html("");	
			//alert(obj);	
			if(obj.tipo == "usr_registrado"){
				$('#cont_login').trigger('startRumble');
				demoTimeout = setTimeout(function(){$('#login-box').trigger('stopRumble');}, 300);
				$('#ajax_respuesta_login').html("<div class='msg alerta f_rojo_claro t_negro'><strong>El numero de Empleado:"+$pwd+" ya tiene un Password registrado, por favor accede con ese password.</strong></div>");
			}
			if(obj.tipo == "nuevo_ingreso"){	
			//alert(obj.nombre_unidad)	
			  $("#cont_login").fadeOut('fast',function(){$("#cont_frm_resgistro").fadeIn(); $('#pwd_reg_1').focus();});
			  $("#nombre_empleado_registro").text(obj.nombre+' ');
			  $("#ag_registro").text(obj.ag);
			  $("#descripcion_ag").text(obj.nombre_unidad); 
			  				
			  $("#txt_NumEmp").val(obj.NumEmp);
			  $("#txt_nombre").val(obj.nombre);
			  $("#txt_ag").val(obj.ag);
			  $("#txt_grado").val(obj.grado);
			  $("#txt_puesto").val(obj.puesto);
			  $("#txt_nivel").val(obj.nivel); 
			  $('#txt_id_unidad').val(obj.unidad_permisos);
			  
			  $("input:radio").change(function(){
				  $opt = $(this).val();
			  	  if($opt == "SI"){
					$("#opt_confirm").hide(); 
				  	$("#frm_pwd_confirm").fadeIn();
					$("#pwd_reg_1").focus();
				  }
			  	  if($opt == "NO"){
					$("#opt_confirm").hide(); 
				  	$("#lst_ag_confirm").fadeIn();
				 
				  }				  					  
			  });
			  // Si el usuario desea cambiar la administracion asignada por default
			  $("#lst_select_unidades").change(function(){
					//alert($(this).attr('value')); return;
					
					$id_unidadDepto = $(this).attr('value');
					if($id_unidadDepto == '') return; 
					
					$lst_text = $("#lst_select_unidades option:selected").text();
					$arr_lst_text = $lst_text.split("-");
					$("#descripcion_ag").text($arr_lst_text[2]); 
					//alert( $arr_lst_text[2] ); return;

			  });
			  $("#btn_cambiar_admin").click(function(){
				    if($id_unidadDepto == '') return; 
				    $txt_NumEmp = $("#txt_NumEmp").val();
					$txt_nivel = $("#txt_nivel").val();
					$txt_id_unidad = $("#txt_id_unidad").val(); 
					$.post('eidd.php',{accion:'registrar_admin', txt_NumEmp: $txt_NumEmp, id_unidadDepto: $id_unidadDepto, txt_nivel: $txt_nivel, txt_id_unidad: $txt_id_unidad},function(datos){
						//alert(datos)
						var obj2 = jQuery.parseJSON(datos);	
						if(obj2.tipo == "ok_update"){
							$("#lst_ag_confirm").hide(); 
							$("#frm_pwd_confirm").fadeIn();
							$("#pwd_reg_1").focus();
						}
						if(obj2.tipo == "error_sql" || obj2.tipo == "error_execute" || obj2.tipo == "error_parametros"){
							$("#cont_pregunta").html('<div class="msg alerta_err">(err.301) Problemas con el SQL</div>');
						}
					});				  
			  });
			  
			  if(obj.nombre_unidad == 'vacio'){
					$("#opt_confirm").hide(); 
				  	$("#frm_pwd_confirm").fadeIn();
					$("#descripcion_ag").text("General"); 
					$("#pwd_reg_1").focus();
			  }	 
			  // ,function(){$("#cont_frm_resgistro").fadeIn()}
			}
			if(obj.tipo == "registrado"){
				//alert(obj.unidad_permisos)
				/*
				$('#pwd').val('');
				$("#btn_login, #logoSAT").hide();
				$("#cont_login").slideUp(50);	
				$("#contenido").animate({opacity: .2}, 1000,function(){
					$("#contenido").animate({opacity: 1}, 0);
					$("#contenido").css({'background-image': 'url(images/sat_logo_4.png)'});
					$("#contenido").css({top:'0px'});
					$("#cont_bienvenida").show();
					$("#bar_top, #pie").show().animate({width: "100%"}, 200 );
				});
				$('#g_nombre').html('<span class="negritas">'+obj.nombre+"</span> - <span class='t_amarillo'>"+obj.ag.replace(/'/gi,"")+"</span> / <span class='t_amarillo'>"+obj.nivel+'</span>');
				$('#txt_ag').val(obj.ag);
				$('#txt_ambito').val(obj.nivel);	
				$('#txt_id_unidad').val(obj.unidad_permisos);
				$('#txt_proceso').val(obj.proceso);
				$("#txt_nivel").val(obj.nivel); 
				$('#txt_id_unidad').val(obj.unidad_permisos); //alert(obj.unidad_permisos)
				$('#g_nombre_host').html(" Desde: "+obj.nombre_host); 
				
				if(obj.nivel=='TEST'){
					$("#visitas").show().click(function(){
						//window.load("visitas_eidd.php")
						URL="visitas_eidd.php";
						day = new Date();
						id = day.getTime();
						eval("page" + id + " = window.open(URL, '" + id + "','toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=1,resizable=1,width=1200,height=540');");
					});
				}
  				*/
			}
		 },
		 error:function(){
			$('#ajax_respuesta_login').html("<div class='msg alerta f_rojo_claro t_negro'><strong>Problemas con el Servidor.</strong></div>");
		 }   
		});
		return; 
	});
 
	
	$('.boton').mouseenter(function(){
		switch (this.id) {
			  case 'cerrar_sistema':
				//alert(this.id);
				$clone = $('#btn_capa').clone().addClass('enterCapa hand').attr({'alt': 'Cerrar Sesion','title':'Cerrar Sesion'}).show().click(cerrar_sistema);
				$('#cerrar_sistema').append($clone);
				break;		
			  case 'font_size_menos':		  	
				$clone = $('#btn_capa').clone().addClass('enterCapa hand').attr({'alt': 'Cerrar Sesion','title':'Disminuir Letra'}).show().click(font_size_menos);
				$('#font_size_menos').append($clone);
				break;
			  case 'font_size_mas':		  
				$clone = $('#btn_capa').clone().addClass('enterCapa hand').attr({'alt': 'Cerrar Sesion','title':'Aumentar Letra'}).show().click(font_size_mas);
				$('#font_size_mas').append($clone);
				break;						
		}
	});
	$('.boton').mouseleave(function(){
		$('.enterCapa').remove();
	});
	
	
	$btn_click = function(e){
		$usr_ag = $('#txt_ag').val();
		$usr_nivel = $('#txt_nivel').val();
		$("#cont_bienvenida").hide();
		
		//$('#contenido_resul').animate({left:-$ancho*2,opacity:0}, 0, 'linear',function(){limpiar_datos();});
		$('#contenido_resul').css({left:-$ancho*2,opacity:0});
		limpiar_datos();
		//alert(this.id)	
		//alert($usr_nivel+" usr_ag:"+$usr_ag)
		$('.btn_menu').unbind('click');
		if(this.id == 'btn_unidad'){							
			//$('#contenido_resul').css({'height':'0%'});			
			//alert($usr_nivel+" | "+$usr_ag)
			if($usr_nivel=='General' || $usr_nivel=='TEST')
				$url='resultados_eidd_xunidad.php';
			if($usr_nivel=='Central')
				$url='resultados_eidd_xunidad_restringido_central.php';
			if($usr_nivel=='Local')
				$url='resultados_eidd_xunidad_restringido_local.php';
			if($usr_nivel=='Admin')
				$url='resultados_eidd_xunidad_restringido_admin.php';
			if($usr_nivel=='Central_Local')	// para AGCTI Y AORS
				$url='resultados_eidd_xunidad_restringido.php';	
				
			//alert($usr_nivel+" | url:"+$url+" |usr_ag:"+$usr_ag)
			$.ajax({
			 type: "POST",
			 contentType: "application/x-www-form-urlencoded", 
			 url: $url,
			 data: "tipo_busqueda=btn_unidad&usr_ag="+$usr_ag,
			 beforeSend:function(){ $("#ajax_respuesta").html($load); },	 
			 success: function(datos){ 
				//if ($('.msg_status').length)
				//alert(datos)
				$(".btn_menu").removeClass('btn_activo');
				$("#btn_unidad").addClass('btn_activo');
				
				//$('#contenido_resul').animate({'height':'97%'},130, function(){
				$("#contenido_resul").show().empty().html(datos);	
				$('#contenido_resul').animate({left:0,opacity:.7}, 'slow','easeOutCirc', function(){
						$("#ajax_respuesta").empty();
						$('.btn_menu').bind('click',$btn_click);
						$('#contenido_resul').animate({opacity:1},'fast');
					}
				);			
			 },
			 timeout:90000,
			 error: function(){ 					
					$("#ajax_respuesta").html('Problemas con el servidor intente de nuevo.');
				}	   
			});			
		}
		
		if(this.id == 'btn_elemento'){
			//$('#contenido_resul').css({'height':'0%'}); 
			//alert("AG")
			$.ajax({
			 type: "POST",
			 contentType: "application/x-www-form-urlencoded", 
			 url: "resultados_eidd_xelemento.php",
			 data: "tipo_busqueda=xbrechasxpers&usr_ag="+$usr_ag,
			 beforeSend:function(){ $("#ajax_respuesta").html($load); },	 
			 success: function(datos){ 
				//if ($('.msg_status').length)
				//alert(datos)
				$(".btn_menu").removeClass('btn_activo');
				$("#btn_elemento").addClass('btn_activo');
				//$('#contenido_resul').animate({'height':'97%'},130, function(){
				$("#contenido_resul").show().empty().html(datos);	
				$('#contenido_resul').animate({left:0,opacity:.7}, 'slow','easeOutCirc', function(){
						$("#ajax_respuesta").empty();
						$('.btn_menu').bind('click',$btn_click);
						$('#contenido_resul').animate({opacity:1},'fast');
					}
				);
			 },
			 timeout:90000,
			 error: function(){ 					
					$("#ajax_respuesta").html('Problemas con el servidor intente de nuevo.');
				}	   
			});			
		}
				
		if(this.id == 'btn_vs'){
			$txt_ambito = $('#txt_nivel').val();
			//$('#contenido_resul').css({'height':'0%'}); 
			//alert($load)
			$.ajax({
			 type: "POST",
			 contentType: "application/x-www-form-urlencoded", 
			 url: "resultados_eidd_xvs.php",
			 data: "tipo_busqueda=btn_vs&usr_ag="+$usr_ag+"&ambito="+$txt_ambito,
			 beforeSend:function(){ $("#ajax_respuesta").html($load); },	 
			 success: function(datos){ 
				//if ($('.msg_status').length)
				//alert(datos)
				$(".btn_menu").removeClass('btn_activo');
				$("#btn_vs").addClass('btn_activo');
				
 				$('#contenido_resul').animate({left:0,opacity:.7}, 1200,'easeOutCirc', function(){
						$("#ajax_respuesta").empty();
						$('.btn_menu').bind('click',$btn_click);
						$('#contenido_resul').animate({opacity:1},'fast');
					}
				); 
				$("#contenido_resul").show().empty().html(datos);	
	

			 },
			 timeout:90000,
			 error: function(){ 					
					$("#ajax_respuesta").html('Problemas con el servidor intente de nuevo.');
				}	    
  			});			
		}	
		if(this.id == 'btn_nivel'){
			$txt_ambito = $('#txt_nivel').val();
			//$('#contenido_resul').css({'height':'0%'});
			//$('#contenido_resul').animate({left:0}, {duration: 'slow', easing: 'easeOutBack'});
			//alert($txt_ambito)
			$.ajax({
			 type: "POST",
			 contentType: "application/x-www-form-urlencoded", 
			 url: "resultados_eidd_xnivel.php",
			 data: "tipo_busqueda=btn_vs&usr_ag="+$usr_ag+"&ambito="+$txt_ambito,
			 beforeSend:function(){ $("#ajax_respuesta").html($load); },	 
			 success: function(datos){ 
				//if ($('.msg_status').length)
				//alert(datos)
				$(".btn_menu").removeClass('btn_activo');
				$("#btn_nivel").addClass('btn_activo');
				$("#contenido_resul").show().empty().html(datos);	
				$('#contenido_resul').animate({left:0,opacity:.7}, 1200,'easeOutCirc', function(){
						$("#ajax_respuesta").empty();
						$('.btn_menu').bind('click',$btn_click);
						$('#contenido_resul').animate({opacity:1},'fast');
					}
				);
			 },
			 timeout:90000,
			 error: function(){ 					
					$("#ajax_respuesta").html('Problemas con el servidor intente de nuevo.');
				}	   
			});			
		}	
		if(this.id == 'btn_brechasxnivel'){
			$txt_id_unidad = $('#txt_id_unidad').val();
			//$('#contenido_resul').css({'height':'0%'});
			//alert($txt_id_unidad)
			$.ajax({
			 type: "POST",
			 contentType: "application/x-www-form-urlencoded", 
			 url: "resultados_eidd_xbrechasxnivel.php",
			 data: "tipo_busqueda=brechasxnivel&unidad_permisos="+$txt_id_unidad,
			 beforeSend:function(){ $("#ajax_respuesta").html($load); },	 
			 success: function(datos){ 
				//if ($('.msg_status').length)
				//alert(datos)
				$(".btn_menu").removeClass('btn_activo');
				$("#btn_brechasxnivel").addClass('btn_activo');
				$("#contenido_resul").show().empty().html(datos);	
				$('#contenido_resul').animate({left:0,opacity:.7}, 'slow','easeOutCirc', function(){
						$("#ajax_respuesta").empty();
						$('.btn_menu').bind('click',$btn_click);
						$('#contenido_resul').animate({opacity:1},'fast');
					}
				);
			 },
			 timeout:90000,
			 error: function(){ 					
					$("#ajax_respuesta").html('Problemas con el servidor intente de nuevo.');
				}	   
			});			
		}	
		if(this.id == 'btn_brechasxadmin'){
			//$('#contenido_resul').css({'height':'0%'});
			//alert("AG")
			$.ajax({
			 type: "POST",
			 contentType: "application/x-www-form-urlencoded", 
			 url: "resultados_eidd_xbrechasxag.php",
			 data: "tipo_busqueda=xbrechasxadmin&usr_ag="+$usr_ag,
			 beforeSend:function(){ $("#ajax_respuesta").html($load); },	 

			 success: function(datos){ 
				//if ($('.msg_status').length)
				//alert(datos)
				$(".btn_menu").removeClass('btn_activo');
				$("#btn_brechasxadmin").addClass('btn_activo');
				$("#contenido_resul").show().empty().html(datos);	
				$('#contenido_resul').animate({left:0,opacity:.7}, 'slow','easeOutCirc', function(){
						$("#ajax_respuesta").empty();
						$('.btn_menu').bind('click',$btn_click);
						$('#contenido_resul').animate({opacity:1},'fast');
					}
				);
			 },
			 timeout:90000,
			 error: function(){ 					
					$("#ajax_respuesta").html('Problemas con el servidor intente de nuevo.');
				}	   
			});			
		}
		if(this.id == 'btn_brechasxpers'){
			//$('#contenido_resul').css({'height':'0%'});
			//alert("AG")
			$.ajax({
			 type: "POST",
			 contentType: "application/x-www-form-urlencoded", 
			 url: "resultados_eidd_xbrechasxpers.php",
			 data: "tipo_busqueda=xbrechasxpers&usr_ag="+$usr_ag,
			 beforeSend:function(){ $("#ajax_respuesta").html($load); },	 
			 success: function(datos){ 
				//if ($('.msg_status').length)
				//alert(datos)
				$(".btn_menu").removeClass('btn_activo');
				$("#btn_brechasxpers").addClass('btn_activo');
				$("#contenido_resul").show().empty().html(datos);	
				$('#contenido_resul').animate({left:0,opacity:.7}, 'slow','easeOutCirc', function(){
						$("#ajax_respuesta").empty();
						$('.btn_menu').bind('click',$btn_click);
						$('#contenido_resul').animate({opacity:1},'fast');
					}
				);
			 },
			 timeout:90000,
			 error: function(){ 					
					$("#ajax_respuesta").html('Problemas con el servidor intente de nuevo.');
				}	   
			});			
		}		
		
			
		if(this.id == 'btn_individual'){
			//$('#contenido_resul').css({'height':'0%'});
			//alert("AG")
			$.ajax({
			 type: "POST",
			 contentType: "application/x-www-form-urlencoded", 
			 url: "resultados_eidd_xficha.php",
			 data: "tipo_busqueda=xbrechasxpers&usr_ag="+$usr_ag,
			 beforeSend:function(){ $("#ajax_respuesta").html($load); },	 
			 success: function(datos){ 
				//if ($('.msg_status').length)
				//alert(datos)
				$(".btn_menu").removeClass('btn_activo');
				$("#btn_individual").addClass('btn_activo');
				$("#contenido_resul").show().empty().html(datos);	
				$('#contenido_resul').animate({left:0,opacity:.7}, 'slow','easeOutCirc', function(){
						$("#ajax_respuesta").empty();
						$('.btn_menu').bind('click',$btn_click);
						$('#contenido_resul').animate({opacity:1},'fast');
					}
				);
			 },
			 timeout:90000,
			 error: function(){ 					
					$("#ajax_respuesta").html('Problemas con el servidor intente de nuevo.');
				}	   
			});			
		}		
	}
	$('.btn_menu').click($btn_click);
	

});
function cerrar_sistema(){
	$("#contenido").css({'background-image': 'url(images/sat_logo_3.png)', opacity: .1});
	$("#bar_top,#pie,#contenido_resul").fadeOut(400,function(){
		$("#contenido").css({top:'10%'});		//4.5	
		$("#bar_top,#pie").css({width :'5px'});
		$(".btn_menu").removeClass('btn_activo');
		$("#cont_bienvenida").hide();
		limpiar_datos();
		$("#contenido").animate({opacity: 1}, 600,function(){ 
			//$("#cont_login").fadeIn(450); $("#btn_login").show(); $('#pwd').focus();
			location.reload();
		});
		
	});
	$("#txt_NumEmp").attr("value", "");
	$.post("funciones/cerrar_sesion.php",function (data){ /*$('#test').html(data) */ });	
}
function limpiar_datos() {
	$("#contenido_resul ,#ajax_respuesta").empty();
	$("#dialog_detalles, #popup_contenido").remove();
}
function font_size_mas() {
	// variables para aumento de letra
 
	var $speech = $('#contenido');
	var defaultSize = $speech.css('fontSize');		
	var num = parseFloat( $speech.css('fontSize'), 10 );
	//alert(num)
	num *= 1.2;   
	if(num <=24)	   
		$speech.animate({fontSize: num + 'px'}, 'slow');
}
function font_size_menos() {
	// variables para aumento de letra
 
	var $speech = $('#contenido');
	var defaultSize = $speech.css('fontSize');		
	var num = parseFloat( $speech.css('fontSize'), 10 );
	num /= 1.2;
	if(num >=7)	   
		$speech.animate({fontSize: num + 'px'}, 'slow');
}	
function enter_key_estatus ( elEvento ) {	
	var evento = elEvento || window.event;
	var caracter = evento.charCode || evento.keyCode;
	if ( caracter == 13 ) {	
		$("#btn_login").click();
	}
}

function limpia_detalles(){
	tipo = $("#txt_tipo").val();
	tr = $("#txt_tr").val();
	td = $("#txt_td").val();
	//alert('ok');
	$("#"+tr).parent().css('display', 'none').hide();
	$("#th_ambito").attr('width','12%');
	$("#"+td).unbind("onclick");
	
	$("#"+td).bind("onclick", detalles_x_unidad); //"detalles_x_unidad('"+tipo+"', '"+tr+"', '"+td+"')"
	$("#"+td).html('<strong>+ '+tipo+'</strong>');
}
function grafica_rombo($calif, $perfil_final, $nombre){
	//alert($perfil_final)
	//grafica_rombo.php
	$.ajax({
	 type: "POST",
	 contentType: "application/x-www-form-urlencoded", 
	 url: "grafica_rombo.php",
	 data: "perfil_final="+$perfil_final+"&calif="+$calif+"&nombre="+$nombre,
	 beforeSend:function(){ $("#ajax_respuesta").html($load); },	 
	 success: function(datos){ 
	 	$("#popup_contenido").hide();
		$("#div_rombo").show().html(datos);
		$("#ajax_respuesta").empty();
	 },
	 timeout:90000,
	 error: function(){ 					
			$("#ajax_respuesta").html('Problemas con el servidor intente de nuevo.');
		}	   
	});
}
function btn_ocultar_rombo(){
	$("#popup_contenido").show();
	$("#div_rombo").hide();	
}

