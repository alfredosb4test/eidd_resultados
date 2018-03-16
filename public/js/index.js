var error=0;
var $tipo_usr='';
var mx;
var my; 
var $ancho = $(window).width();
var $load = $("<div class='span_load'>&nbsp;</div>").addClass('load');
// variables para los graficos
var $deficiente_total_C = $emergente_total_C = $normal_total_C = $alto_total_C = $superior_total_C = 0;
var $deficiente_total_L = $emergente_total_L = $normal_total_L = $alto_total_L = $superior_total_L = 0;
var $titulos = ['DEFICIENTE','EMERGENTE','NORMAL','ALTO','SUPERIOR']
var $colores = ['#F82001','#FAC612','#CCCCCC','#56D94F','#5EAC46']
var $colores_competencias = ['#054C89','#0A7FE3','#41CEF8','#07EBEB','#a0F6F6','#FBB799','#FB9467','#F89B41','#F57A03']
var niveles = ['DEFICIENTE','EMERGENTE','NORMAL','ALTO','SUPERIOR'];
var puestos = ['OPERATIVO','ENLACE','JEFE_DE_DEPARTAMENTO','SUBADMINISTRADOR','ADMINISTRADOR'];
var competencias = ['TRAB. EQUIPO','COMUNICACION','ACTITUD SERV.','ORIENTACION RESULTADOS','ANALISIS PROBLEMAS','LIDERAZGO','ORGANIZACION','NEGOCIACION','TOMA DECISIONES'];

var puestos_totales = {'OPERATIVO':0,'ENLACE':0,'JEFE_DE_DEPARTAMENTO':0,'SUBADMINISTRADOR':0,'ADMINISTRADOR':0};
// variables para graficas
graf_DEFICIENTE = new Array();   
graf_EMERGENTE = new Array();
graf_NORMAL = new Array();
graf_ALTO = new Array();
graf_SUPERIOR = new Array();

$(document).ready(function(){

    $("#contenido").animate({opacity: .2}, 1000,function(){
        $("#contenido").animate({opacity: 1}, 0);
        $("#contenido").css({'background-image': 'url(img/sat_logo_4.png)'});
        $("#contenido").css({top:'0px'});
        $("#cont_bienvenida").show();
        $("#bar_top, #pie").show().animate({width: "100%"}, 200 );
    });

    $('#g_nombre').html('<span class="negritas">'+obj.g_nombre+"</span> - <span class='t_amarillo'>"+obj.ag.replace(/'/gi,"")+"</span> / <span class='t_amarillo'>"+obj.nivel+'</span>');
    
    $('#txt_ag').val("'"+obj.ag+"'");
    $('#txt_ambito').val(obj.nivel);    
    $('#txt_id_unidad').val(obj.unidad_permisos);
    $('#txt_proceso').val(obj.proceso);
    $('#txt_nivel').val(obj.nivel); 
    $('#txt_id_unidad').val(obj.unidad_permisos); //alert(obj.unidad_permisos)
    $('#g_nombre_host').html(" Desde: "+obj.nombre_host); 
    //alert("OK"+$('#txt_proceso').val()+" | "+obj.nombre_host)
    if(obj.nivel=='TEST'){
        $("#visitas").show().click(function(){
            //window.load("visitas_eidd.php")
            URL="visitas_eidd.php";
            day = new Date();
            id = day.getTime();
            eval("page" + id + " = window.open(URL, '" + id + "','toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=1,resizable=1,width=1200,height=540');");
        });
    }

    $('.boton').mouseenter(function(){
        //alert(this.id);
        switch (this.id) {
              case 'cerrar_sistema':                
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

    // evento para la pantalla de COmpracion de resultados vs.
    $("body").on('click', '.ver_grafica_chart', function(event) {
        event.preventDefault();
        //$(".container").hide();
        $("[id^=container_]").hide();
        $id = $(this).attr("id");
        x = $id.length;
        mostrar_graf = $id.substr(4,x);

        $("#"+mostrar_graf).show();
        $("#"+mostrar_graf).children().show();
    });
 
    $btn_click = function(e){
        //alert(this.id)
        $usr_ag = $('#txt_ag').val();
        $usr_nivel = $('#txt_nivel').val();
        $("#cont_bienvenida").hide();
        
        //$('#contenido_resul').animate({left:-$ancho*2,opacity:0}, 0, 'linear',function(){limpiar_datos();});
        $('#contenido_resul').css({opacity:0}); 
        $('#contenido_resul').toggleClass('animated fast fadeIn'); 
        limpiar_datos();
        //alert(this.id)    
        //alert($usr_nivel+" usr_ag:"+$usr_ag)
        $('.btn_menu').unbind('click');
        if(this.id == 'btn_unidad'){                            
            //$('#contenido_resul').css({'height':'0%'});           
            //alert($usr_nivel+" | "+$usr_ag)
            if($usr_nivel=='General' || $usr_nivel=='TEST')
                $url='resultados_eidd_xunidad'; // 'resultados_eidd_xunidad.php';
            if($usr_nivel=='Central')
                $url='resultados_eidd_xunidad';
            if($usr_nivel=='Local')
                $url='resultados_eidd_xunidad';
            if($usr_nivel=='Admin')
                $url='resultados_eidd_xunidad_restringido_admin';
            if($usr_nivel=='Central_Local') // para AGCTI Y AORS
                $url='resultados_eidd_xunidad_restringido'; 
                
            //alert($usr_nivel+" | url:"+$url+" |usr_ag:"+$usr_ag)
            $("#ajax_respuesta").html($load);
            $.ajax({
             type: "POST",
             contentType: "application/x-www-form-urlencoded", 
             url: $url,
             data: "tipo_busqueda=btn_unidad&usr_ag="+$usr_ag,     
             success: function(datos){ 
                console.log("JSON::"+JSON.stringify(obj))
                var datos = jQuery.parseJSON(datos);   
                if(datos.error == "errSQL"){
                    $('.btn_menu').bind('click',$btn_click);
                    $(document).ajaxStop(function(){
                        $.unblockUI
                        msg_blockUI("growlUI_msg", datos.err_txt, 'alert', '5px solid #ff1a00', '#000', 0);
                    });  
                    return;
                }
                $td_central = "<td class='hand' id='td_central_detalles' estado='minimizado' ambito='CENTRAL' etiqueta='CENTRAL' table='table_central_detalles' td='td_central_detalles'>"+
                                    "<strong><span class='glyphicon glyphicon-plus' aria-hidden='true'></span> CENTRAL</strong>"+
                               "</td>";
                $td_local = "<td class='hand' id='td_local_detalles' estado='minimizado' ambito='LOCAL' etiqueta='DESCONCENTRADA' table='table_local_detalles' td='td_local_detalles'>"+
                                   "<strong><span class='glyphicon glyphicon-minus' aria-hidden='true'></span> DESCONCENTRADA</strong>"+
                             "</td>";
                $td_admin = "<td class='hand' id='td_local_detalles' estado='minimizado' ambito='CENTRAL' etiqueta='Administracion' table='table_central_detalles' td='td_central_detalles'>"+
                                    "<strong><span class='glyphicon glyphicon-plus' aria-hidden='true'></span> Administracion</strong>"+
                               "</td>";                             
                // variables para los totales por nivel, solo informativos 
                $deficiente = '<td align="center" class="td_deficiente_total negritas">0</td>';
                $emergente = '<td align="center" class="td_emergente_total negritas">0</td>';
                $normal = '<td align="center" class="td_normal_total negritas">0</td>';
                $alto = '<td align="center" class="td_alto_total negritas">0</td>';
                $superior = '<td align="center" class="td_superior_total negritas">0</td>';

                
                $trTitulos = "<tr class='table_top'> "+
                    "<td id='th_ambito' class=' negritas' width='50%' align='center'>AMBITO</td> "+
                    "<td width='8.33%' class='f_rojo_fuerte t_blanco negritas' align='center'>DEFICIENTE</td> "+
                    "<td width='8.33%' class='f_rojo_claro t_blanco negritas' align='center'>EMERGENTE</td> "+
                    "<td width='8.33%' class='f_blanco negritas' align='center'>NORMAL</td> "+
                    "<td width='8.33%' class='f_verde_claro t_blanco negritas' align='center'>ALTO</td> "+
                    "<td width='8.33%' class='f_verde_fuerte t_blanco negritas' align='center'>SUPERIOR</td> "+
                    "<td width='8.33%' class=' negritas' align='center'>TOTAL</td> "+
                    "</tr> ";
                    $tr_central_detalle = "<tr style='display:none;' > "+
                        "<td id='table_central_detalles' colspan='10'></td> "+
                    "</tr>";
                    $tr_local_detalle = "<tr style='display:none;'> "+
                        "<td id='table_local_detalles' colspan='10'></td> "+
                    "</tr>";

                $tabla = $("<table border='0'></table>").addClass('table table-condensed').css({'width':'100%'}).append($trTitulos); 
                $("#contenido_resul").show();
                cont = 0;
                cont_local = 0;
                console.log("obj.g_nivel", obj.g_nivel)
                console.log("datos", datos)
                for(var myKey in datos) {
                    console.log("ambito", datos[myKey].ambito) 
                    if(obj.g_nivel == "Central"){  
                        //$("#contenido_resul").show().append('<br>'+datos[myKey].total+"-"+datos[myKey].perfil_final+"-"+datos[myKey].ambito+"-"+datos[myKey].id_ag_4);
                        if(datos[myKey].ambito == "CENTRAL"){ 
                            cont++; 
                            if(cont ==1){ 
                                key_unidad = datos[myKey].id_ag_4;
                                $tr_central = '<tr id="tr_admin_'+key_unidad+'" >'+$td_central+$deficiente+$emergente+$normal+$alto+$superior+'<td align="center" class="td_niveles_total"></td></tr>';                                   
                                $tabla.append('<tbody>'+$tr_central+$tr_central_detalle+'</tbody>');
                            }
                            x_unidad_totales_gral(key_unidad, datos[myKey].perfil_final, $tabla, datos[myKey].total, datos[myKey].ambito);
                            $total_niveles = $deficiente_total_C + $emergente_total_C + $normal_total_C + $alto_total_C+ $superior_total_C;
                            $tabla.find('#tr_admin_'+key_unidad).children('.td_niveles_total').text($total_niveles);                            
                        }
                        $categories_grafica = ['CENTRAL'];

                        $deficiente_total_grafica = [$deficiente_total_C];
                        $emergente_total_grafica = [$emergente_total_C];
                        $normal_total_grafica = [$normal_total_C];
                        $alto_total_grafica = [$alto_total_C];
                        $superior_total_grafica = [$superior_total_C];                          
                    }     
                    if(obj.g_nivel == "Admin"){  
                        //$("#contenido_resul").show().append('<br>'+datos[myKey].total+"-"+datos[myKey].perfil_final+"-"+datos[myKey].ambito+"-"+datos[myKey].id_ag_4);
                        cont++; 
                        if(cont ==1){
                            key_unidad = datos[myKey].id_ag_4;
                            $tr_central = '<tr id="tr_admin_'+key_unidad+'" >'+$td_admin+$deficiente+$emergente+$normal+$alto+$superior+'<td align="center" class="td_niveles_total negritas"></td></tr>';                                   
                            $tabla.append('<tbody>'+$tr_central+$tr_central_detalle+'</tbody>');
                        }
                        x_unidad_totales_gral(key_unidad, datos[myKey].perfil_final, $tabla, datos[myKey].total, datos[myKey].ambito);
                        $total_niveles = $deficiente_total_C + $emergente_total_C + $normal_total_C + $alto_total_C + $superior_total_C;
                        $tabla.find('#tr_admin_'+key_unidad).children('.td_niveles_total').text($total_niveles);                        
                    
                        $categories_grafica = ['CENTRAL'];

                        $deficiente_total_grafica = [$deficiente_total_C];
                        $emergente_total_grafica = [$emergente_total_C];
                        $normal_total_grafica = [$normal_total_C];
                        $alto_total_grafica = [$alto_total_C];
                        $superior_total_grafica = [$superior_total_C]; 
                        //alert("$deficiente_total_grafica "+$deficiente_total_grafica)                    
                    } 
                    if(obj.g_nivel == "Local"){  
                        //$("#contenido_resul").show().append('<br>'+datos[myKey].total+"-"+datos[myKey].perfil_final+"-"+datos[myKey].ambito+"-"+datos[myKey].id_ag_4);
                        cont++; 
                        if(cont ==1){
                            key_unidad = datos[myKey].id_ag_4;
                            $tr_central = '<tr id="tr_admin_'+key_unidad+'" >'+$td_local+$deficiente+$emergente+$normal+$alto+$superior+'<td align="center" class="td_niveles_total negritas"></td></tr>';                                   
                            $tabla.append('<tbody>'+$tr_central+$tr_local_detalle+'</tbody>');
                        }
                        x_unidad_totales_gral(key_unidad, datos[myKey].perfil_final, $tabla, datos[myKey].total, datos[myKey].ambito);
                        $total_niveles = $deficiente_total_L + $emergente_total_L + $normal_total_L + $alto_total_L + $superior_total_L;
                        $tabla.find('#tr_admin_'+key_unidad).children('.td_niveles_total').text($total_niveles);                        
                    
                        $categories_grafica = ['DESCONCENTRADA'];

                        $deficiente_total_grafica = [$deficiente_total_L];
                        $emergente_total_grafica = [$emergente_total_L];
                        $normal_total_grafica = [$normal_total_L];
                        $alto_total_grafica = [$alto_total_L];
                        $superior_total_grafica = [$superior_total_L];                     
                    }                      
                    if(obj.g_nivel == "Central_Local" || obj.g_nivel == "General" || obj.g_nivel == "TEST"){  
                        //$("#contenido_resul").show().append('<br>'+datos[myKey].total+"-"+datos[myKey].perfil_final+"-"+datos[myKey].ambito+"-"+datos[myKey].id_ag_4);
                        //alert(datos[myKey].ambito)
                        if(datos[myKey].ambito == "CENTRAL"){
                            cont++; 
                            if(cont ==1){
                                key_unidad = datos[myKey].id_ag_4;
                                $tr_central = '<tr id="tr_admin_'+key_unidad+'" >'+$td_central+$deficiente+$emergente+$normal+$alto+$superior+'<td align="center" class="td_niveles_total negritas"></td></tr>';                                   
                                $tabla.append('<tbody>'+$tr_central+$tr_central_detalle+'</tbody>');
                            }

                            x_unidad_totales_gral(key_unidad, datos[myKey].perfil_final, $tabla, datos[myKey].total, datos[myKey].ambito);
                            $total_niveles = $deficiente_total_C + $emergente_total_C + $normal_total_C + $alto_total_C + $superior_total_C;
                            $tabla.find('#tr_admin_'+key_unidad).children('.td_niveles_total').text($total_niveles);
                        }
                        if(datos[myKey].ambito == "LOCAL"){ 
                            cont_local++;                                                     
                            if(cont_local ==1){ 
                                key_unidad = datos[myKey].id_ag_4;
                                $tr_local = '<tr id="tr_admin_'+key_unidad+'" >'+$td_local+$deficiente+$emergente+$normal+$alto+$superior+'<td align="center" class="td_niveles_total_L negritas"></td></tr>';                                   
                                $tabla.append('<tbody>'+$tr_local+$tr_local_detalle+'</tbody>');     

                            }
                            x_unidad_totales_gral(key_unidad, datos[myKey].perfil_final, $tabla, datos[myKey].total, datos[myKey].ambito);
                            $total_niveles = $deficiente_total_L + $emergente_total_L + $normal_total_L + $alto_total_L + $superior_total_L;
                            $tabla.find('#tr_admin_'+key_unidad).children('.td_niveles_total_L').text($total_niveles);                            
                        }
                        $categories_grafica = ['CENTRAL', 'DESCONCENTRADA'];
                        $deficiente_total_grafica = [$deficiente_total_C, $deficiente_total_L];
                        $emergente_total_grafica = [$emergente_total_C, $emergente_total_L];
                        $normal_total_grafica = [$normal_total_C, $normal_total_L];
                        $alto_total_grafica = [$alto_total_C, $alto_total_L];
                        $superior_total_grafica = [$superior_total_C, $superior_total_L];                          
                    }                                                         
                } 
                

                $titulo = 'RESULTADOS DE EIDD '+anoAnterior+' - '+anoActual+' POR UNIDAD ADMINISTRATIVA Y AMBITO';
                grafica_uno($categories_grafica, [$deficiente_total_grafica, $emergente_total_grafica, $normal_total_grafica, 
                            $alto_total_grafica, $superior_total_grafica], $titulos, $colores, "container", $titulo);
                $titulo = 'RESULTADOS DE EIDD '+anoAnterior+' - '+anoActual+' POR UNIDAD ADMINISTRATIVA CENTRAL';
                grafica_pie($categories_grafica[0], $deficiente_total_grafica[0], $emergente_total_grafica[0], $normal_total_grafica[0], 
                            $alto_total_grafica[0], $superior_total_grafica[0], 'container_pie_C', $titulo);
                $titulo = 'RESULTADOS DE EIDD '+anoAnterior+' - '+anoActual+' POR UNIDAD ADMINISTRATIVA DESCONCENTRADA';
                grafica_pie($categories_grafica[1], $deficiente_total_grafica[1], $emergente_total_grafica[1], $normal_total_grafica[1], 
                            $alto_total_grafica[1], $superior_total_grafica[1], 'container_pie_L', $titulo);                            
                

                $("#contenido_resul").append($tabla);
                $("#grafica").show().appendTo($("#contenido_resul"));
                $("#grafica_bar").css("display", "table");
                $(".btn_menu").removeClass('btn_activo');
                $("#btn_unidad").addClass('btn_activo');
               //$("#contenido_resul").show().empty().html(datos);   
                $('#contenido_resul').animate({left:0,opacity:.7}, 'slow','easeOutCirc', function(){
                        $("#ajax_respuesta").empty();
                        $('.btn_menu').bind('click',$btn_click);
                        $('#contenido_resul').animate({opacity:1},'fast');
                    }
                );
                //$('#td_central_detalles').click();   
                
      
                      
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
            //window.location.href = "/resultados_eidd_xelemento";
            //return;
            $.ajax({
             type: "GET",
             contentType: "application/x-www-form-urlencoded", 
             url: "resultados_eidd_xelemento",
             data: "tipo_busqueda=xbrechasxpers&usr_ag="+$usr_ag,
             beforeSend:function(){ $("#ajax_respuesta").html($load); },     
             success: function(datos){ 
                //if ($('.msg_status').length)
                $("#contenido_resul").show();
                $(".btn_menu").removeClass('btn_activo');
                $("#btn_elemento").addClass('btn_activo');
                //$('#contenido_resul').animate({'height':'97%'},130, function(){                
                //alert(datos)
                 var datos = jQuery.parseJSON(datos);   
 

                if(datos.error == "errSQL"){
                    $('.btn_menu').bind('click',$btn_click);
                    $(document).ajaxStop(function(){
                        $.unblockUI
                        msg_blockUI("growlUI_msg", datos.err_txt, 'alert', '5px solid #ff1a00', '#000', 0);
                    });  
                    return;
                }

                $tr="";
                val_categorias = []; 
                val_fcal_360 = []; 
                val_indicadores = []; 
                val_entorno = []; 
                for(var myKey in datos) {
                    console.log("ambito", datos[myKey].ambito)
                    
                    $etiqueta = datos[myKey].ambito;
                    if(datos[myKey].ambito == 'LOCAL')
                        $etiqueta = 'DESCONCENTRADA';
                    $tr = $tr +"<tr><td width='40%'> "+
                                        "<strong>"+$etiqueta+"</strong>"+
                                   "</td>"+
                                   "<td width='20%' align='center'>"+datos[myKey].fcal_360.toFixed(2)+"</td>"+
                                   "<td width='20%' align='center'>"+datos[myKey].fcal_indicadores.toFixed(2)+"</td>"+
                                   "<td width='20%' align='center'>"+datos[myKey].fcal_entorno.toFixed(2)+"</td>"+
                            "<tr>";

                    val_categorias.push($etiqueta);
                    val_fcal_360.push(parseFloat(datos[myKey].fcal_360.toFixed(2)));
                    val_indicadores.push(parseFloat(datos[myKey].fcal_indicadores.toFixed(2)));
                    val_entorno.push(parseFloat(datos[myKey].fcal_entorno.toFixed(2)));

                }

                //$categorias = [$categorias.replace(/,+$/,'')];
 

                //$tabla = '<table class="tbl_datos" border="0" width="98%">';
                $tabla = `<table class="tbl_datos" border="0" width="98%"> 
                    <tr class='table_top negritas'>
                        <td id='th_ambito'>AMBITO</td>
                        <td align='center'>COMPETENCIAS 360</td>
                        <td align='center'>INDICADORES  OBJETIVOS</td>
                        <td align='center'>ENTORNO LABORA</td> 
                    </tr>
                    <tbody>
                        ${ $tr }
                    </tbody>
                    </table>
                    <br>`;
                     
                $titulosxElemento = ['INDICADORES - OBJETIVOS','COMPETENCIAS 360','ENTORNO LABORAL'];
                $coloresxElemento = ['#7FDDF4','#F7D580','#A1B4F4'];

                console.log("val_fcal_360: "+val_fcal_360);
                $titulo = 'RESULTADOS DE EIDD '+anoAnterior+' - '+anoActual+' POR ELEMENTO';
                grafica_uno(val_categorias, [val_fcal_360,val_indicadores,val_entorno], $titulosxElemento, $coloresxElemento, "container", $titulo);
                
                $("#contenido_resul").append($tabla).animate({opacity:1},'fast');
                $("#btn_graf_pie, #btn_graf_bar").hide();
                $("#grafica").show().appendTo($("#contenido_resul"));
                $("#grafica_bar").css("display", "table");


                $("#ajax_respuesta").empty();
                $('.btn_menu').bind('click',$btn_click);

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
            console.log("obj", JSON.stringify(obj));
            $.ajax({
             type: "GET",
             contentType: "application/x-www-form-urlencoded", 
             url: "resultados_x_vs",
             data: "tipo_busqueda=btn_vs&usr_ag="+$usr_ag+"&ambito="+$txt_ambito,
             beforeSend:function(){ $("#ajax_respuesta").html($load); },     
             success: function(datos){ 
                //if ($('.msg_status').length)
                console.log("datos:", datos);
                $("#contenido_resul").show();
                $(".btn_menu").removeClass('btn_activo');
                $("#btn_vs").addClass('btn_activo');
                 var datos = jQuery.parseJSON(datos);   
 

                if(datos.error == "errSQL"){
                    $('.btn_menu').bind('click',$btn_click);
                    $(document).ajaxStop(function(){
                        $.unblockUI
                        msg_blockUI("growlUI_msg", datos.err_txt, 'alert', '5px solid #ff1a00', '#000', 0);
                    });  
                    return;
                } 
                for(var KeyNiveles in niveles) {
                        armar_tbl_vs(obj.g_ags, obj.nivel, niveles[KeyNiveles], 'x_vs');
                }

                $tabla = `
                    <div style="position: relative;float: left;">
                        <img src="img/vs_2014.png"> 
                    </div>
                    <div style=" float: left;width: 95%;">
                    <table id="tbl_vs" class=" table table-condensed" style="padding:0px;">
                    <tr class='table_top'>    
                        <td id='th_ambito' align='center' class="negritas" width='150'>NIVEL</td>
                        <td width='8.33%' class='f_rojo_fuerte t_blanco negritas' align='center'>DEFICIENTE</td>
                        <td width='8.33%' class='f_rojo_claro t_blanco negritas' align='center'>EMERGENTE</td>
                        <td width='8.33%' class='f_blanco negritas' align='center'>NORMAL</td>
                        <td width='8.33%' class='f_verde_claro t_blanco negritas' align='center'>ALTO</td>
                        <td width='8.33%' class='f_verde_fuerte t_blanco negritas' align='center'>SUPERIOR</td>
                        <td align='center' class="negritas">TOTAL</td>
                    </tr> 
                    <tr><td>SUPERIOR
                            <div style="position:relative; float: right; padding-right:5px;" class="hover_rojo ver_grafica_chart" id="btn_container_superior">
                                <i class="fa fa-bar-chart hand" style="margin-left:20px"  aria-hidden="true"></i>
                            </div>
                        </td>
                        ${$tr_superior_vs[0]}
                        ${$tr_superior_vs[1]}
                        ${$tr_superior_vs[2]}
                        ${$tr_superior_vs[3]}
                        ${$tr_superior_vs[4]}
                        ${$tr_superior_vs[5]}
                    </tr>                     
                    <tr><td>ALTO
                            <div style="position:relative; float: right; padding-right:5px;" class="hover_rojo ver_grafica_chart" id="btn_container_alto">
                                <i class="fa fa-bar-chart hand" style="margin-left:20px"  aria-hidden="true"></i>
                            </div>
                        </td>                    
                        ${$tr_alto_vs[0]}
                        ${$tr_alto_vs[1]}
                        ${$tr_alto_vs[2]}
                        ${$tr_alto_vs[3]}
                        ${$tr_alto_vs[4]}
                        ${$tr_alto_vs[5]}
                    </tr> 
                    <tr><td>NORMAL
                            <div style="position:relative; float: right; padding-right:5px;" class="hover_rojo ver_grafica_chart" id="btn_container_normal">
                                <i class="fa fa-bar-chart hand" style="margin-left:20px"  aria-hidden="true"></i>
                            </div>
                        </td>                    
                        ${$tr_normal_vs[0]}
                        ${$tr_normal_vs[1]}
                        ${$tr_normal_vs[2]}
                        ${$tr_normal_vs[3]}
                        ${$tr_normal_vs[4]}
                        ${$tr_normal_vs[5]}
                    </tr>                                         
                    <tr><td>EMERGENTE
                            <div style="position:relative; float: right; padding-right:5px;" class="hover_rojo ver_grafica_chart" id="btn_container_emergente">
                                <i class="fa fa-bar-chart hand" style="margin-left:20px"  aria-hidden="true"></i>
                            </div>
                        </td>                    
                        ${$tr_emergente_vs[0]}
                        ${$tr_emergente_vs[1]}
                        ${$tr_emergente_vs[2]}
                        ${$tr_emergente_vs[3]}
                        ${$tr_emergente_vs[4]}
                        ${$tr_emergente_vs[5]}
                    </tr> 
                    <tr><td>DEFICIENTE 
                            <div style="position:relative; float: right; padding-right:5px;" class="hover_rojo ver_grafica_chart" id="btn_container_deficiente">
                                <i class="fa fa-bar-chart hand" style="margin-left:20px"  aria-hidden="true"></i>
                            </div>
                        </td>
                        ${$tr_deficiente_vs[0]}
                        ${$tr_deficiente_vs[1]}
                        ${$tr_deficiente_vs[2]}
                        ${$tr_deficiente_vs[3]}
                        ${$tr_deficiente_vs[4]}
                        ${$tr_deficiente_vs[5]}
                    </tr>   
                    <tr class='table_top' align='center'>
                        <td align='center' class="negritas">TOTAL</td>
                        <td class='negritas t_deficiente_totales_h'></td>
                        <td class='negritas t_emergente_totales_h'></td>
                        <td class='negritas t_normal_totales_h'></td>
                        <td class='negritas t_alto_totales_h'></td>
                        <td class='negritas t_superior_totales_h'></td>
                        <td class='negritas t_totales_h'></td>
                    </tr> 
                    <tr><td align="center" colspan="7"><img src="img/vs_2015.png"></td></tr>                    
                    </table></div>`;  
                $("#contenido_resul").append($tabla)                 
                //alert($deficiente_tr) ${$tr_DEFICIENTE}
                $totales_EMERGENTE=0, $totales_DEFICIENTE=0, $totales_NORMAL=0, $totales_ALTO=0, $totales_SUPERIOR=0;
                $totales_EMERGENTE_h=0, $totales_DEFICIENTE_h=0, $totales_NORMAL_h=0, $totales_ALTO_h=0, $totales_SUPERIOR_h=0;

                reset_matriz_graf_niveles();    // iguala a 0 las matrices de los valores 
                graf_activa = "";
                for(var KeyData in datos) {
                    //console.log("datos:", datos[KeyData].perfilvs+" | ", datos[KeyData].totales_vs+" | ", datos[KeyData].perfil_final);
                    if(datos[KeyData].perfilvs.toUpperCase() == "DEFICIENTE"){
                        console.log("datos DEFICIENTE:",datos[KeyData].perfil_final+" - ",datos[KeyData].totales_vs);
                        if(datos[KeyData].perfil_final.toUpperCase()=="DEFICIENTE") graf_DEFICIENTE['DEFICIENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="EMERGENTE") graf_DEFICIENTE['EMERGENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="NORMAL") graf_DEFICIENTE['NORMAL']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="ALTO") graf_DEFICIENTE['ALTO']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="SUPERIOR") graf_DEFICIENTE['SUPERIOR']=[datos[KeyData].totales_vs];                            
                    }        
                    if(datos[KeyData].perfilvs.toUpperCase() == "EMERGENTE"){
                            console.log("datos EMERGENTE: ",datos[KeyData].perfil_final+" - ",datos[KeyData].totales_vs);
                        if(datos[KeyData].perfil_final.toUpperCase()=="DEFICIENTE") graf_EMERGENTE['DEFICIENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="EMERGENTE") graf_EMERGENTE['EMERGENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="NORMAL") graf_EMERGENTE['NORMAL']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="ALTO") graf_EMERGENTE['ALTO']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="SUPERIOR") graf_EMERGENTE['SUPERIOR']=[datos[KeyData].totales_vs];
                    }
                    if(datos[KeyData].perfilvs.toUpperCase() == "NORMAL"){
                        if(datos[KeyData].perfil_final.toUpperCase()=="DEFICIENTE") graf_NORMAL['DEFICIENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="EMERGENTE") graf_NORMAL['EMERGENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="NORMAL") graf_NORMAL['NORMAL']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="ALTO") graf_NORMAL['ALTO']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="SUPERIOR") graf_NORMAL['SUPERIOR']=[datos[KeyData].totales_vs];
                    }                    
                    if(datos[KeyData].perfilvs.toUpperCase() == "ALTO"){
                        if(datos[KeyData].perfil_final.toUpperCase()=="DEFICIENTE") graf_ALTO['DEFICIENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="EMERGENTE") graf_ALTO['EMERGENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="NORMAL") graf_ALTO['NORMAL']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="ALTO") graf_ALTO['ALTO']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="SUPERIOR") graf_ALTO['SUPERIOR']=[datos[KeyData].totales_vs];
                    }  
                    if(datos[KeyData].perfilvs.toUpperCase() == "SUPERIOR"){
                        if(datos[KeyData].perfil_final.toUpperCase()=="DEFICIENTE") graf_SUPERIOR['DEFICIENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="EMERGENTE") graf_SUPERIOR['EMERGENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="NORMAL") graf_SUPERIOR['NORMAL']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="ALTO") graf_SUPERIOR['ALTO']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="SUPERIOR") graf_SUPERIOR['SUPERIOR']=[datos[KeyData].totales_vs];
                    }                                          
                    if(datos[KeyData].perfil_final.toUpperCase() == "DEFICIENTE"){
                        graf_activa = "container_deficiente";
                        $totales_DEFICIENTE_h += datos[KeyData].totales_vs;                        
                        $("#tbl_vs").find(".t_deficiente_totales_h").html($totales_DEFICIENTE_h);
                    }
                    if(datos[KeyData].perfil_final.toUpperCase() == "EMERGENTE"){
                        graf_activa = "container_emergente";
                        $totales_EMERGENTE_h += datos[KeyData].totales_vs;
                        //console.log("datos:", datos[KeyData].perfilvs+"|",datos[KeyData].perfil_final.toUpperCase()+"|",datos[KeyData].totales_vs+"|",$totales_DEFICIENTE_h);
                        $("#tbl_vs").find(".t_emergente_totales_h").html($totales_EMERGENTE_h);
                    }
                    if(datos[KeyData].perfil_final.toUpperCase() == "NORMAL"){
                        graf_activa = "container_normal";
                        $totales_NORMAL_h += datos[KeyData].totales_vs;
                        $("#tbl_vs").find(".t_normal_totales_h").html($totales_NORMAL_h);
                    }
                    if(datos[KeyData].perfil_final.toUpperCase() == "ALTO"){
                        graf_activa = "container_alto";
                        $totales_ALTO_h += datos[KeyData].totales_vs;
                        $("#tbl_vs").find(".t_alto_totales_h").html($totales_ALTO_h);
                    }
                    if(datos[KeyData].perfil_final.toUpperCase() == "SUPERIOR"){
                        graf_activa = "container_superior";
                        $totales_SUPERIOR_h += datos[KeyData].totales_vs;
                        $("#tbl_vs").find(".t_superior_totales_h").html($totales_SUPERIOR_h);
                    }
                                                                                                                                 
                    for(var KeyNiveles in niveles) {
                        $titulo = 'LA GRAFICA MUESTRA AL PERSONAL QUE DURANTE '+anoAnterior+' TUVO PERFIL '+datos[KeyData].perfilvs.toUpperCase()+' Y SE DISTRIBUYEN DE LA SIGUIENTE MANERA PARA '+anoActual;
                        if( niveles[KeyNiveles] == datos[KeyData].perfilvs.toUpperCase() && datos[KeyData].perfilvs.toUpperCase() == "DEFICIENTE" ){
                            $totales_DEFICIENTE += datos[KeyData].totales_vs;
                            $span="t_"+datos[KeyData].perfilvs.toLowerCase()+"_"+datos[KeyData].perfil_final.toLowerCase();
                            $("#tbl_vs").find("span."+$span).html(datos[KeyData].totales_vs).parent().attr({
                                btn: "xunidad",
                                usr_ag: "'"+obj.g_ags+"'",  
                                ambito: obj.g_nivel.toUpperCase(),
                                descripcion_unidad_permisos: obj.g_unidades_permisos,
                                perfil_final_2012_2013: datos[KeyData].perfil_final_2012_2013,
                                perfil_final: datos[KeyData].perfil_final,
                                g_nivel: obj.g_nivel,
                                "data-toggle": "modal",
                                "data-target": "#detalles_usr_vs",
                                "data-whatever": "Usuarios en Deficiente -> " + datos[KeyData].perfil_final                                   
                            }).addClass('td_detalles_central hand');
                            $("#tbl_vs").find(".t_"+datos[KeyData].perfilvs.toLowerCase()+"_totales").html($totales_DEFICIENTE); // totales Verticales


                            $graphics = $("#grafica").clone().find("#container").attr("id", "container_deficiente").hide();
                            $('#contenido_resul').append($graphics);                            
                            grafica_uno([niveles[KeyNiveles]], [graf_DEFICIENTE['DEFICIENTE'], graf_DEFICIENTE['EMERGENTE'], graf_DEFICIENTE['NORMAL'], graf_DEFICIENTE['ALTO'], graf_DEFICIENTE['SUPERIOR']], $titulos, $colores, "container_deficiente", $titulo);


                        }
                        if( niveles[KeyNiveles] == datos[KeyData].perfilvs.toUpperCase() && datos[KeyData].perfilvs.toUpperCase() == "EMERGENTE" ){                            
                            $totales_EMERGENTE += datos[KeyData].totales_vs;
                            $span="t_"+datos[KeyData].perfilvs.toLowerCase()+"_"+datos[KeyData].perfil_final.toLowerCase();
                            $("#tbl_vs").find("span."+$span).html(datos[KeyData].totales_vs).parent().attr({
                                btn: "xunidad",
                                usr_ag: "'"+obj.g_ags+"'",  
                                ambito: obj.g_nivel.toUpperCase(),
                                descripcion_unidad_permisos: obj.g_unidades_permisos,
                                perfil_final_2012_2013: datos[KeyData].perfil_final_2012_2013,
                                perfil_final: datos[KeyData].perfil_final,
                                g_nivel: obj.g_nivel,
                                "data-toggle": "modal",
                                "data-target": "#detalles_usr_vs",
                                "data-whatever": "Usuarios en Emergente -> "  + datos[KeyData].perfil_final                                   
                            }).addClass('td_detalles_central hand');
                            $("#tbl_vs").find(".t_"+datos[KeyData].perfilvs.toLowerCase()+"_totales").html($totales_EMERGENTE);                                                                                   

                            $graphics = $("#grafica").clone().find("#container").attr("id", "container_emergente").hide();
                            $('#contenido_resul').append($graphics);                        
                            grafica_uno([niveles[KeyNiveles]], [graf_EMERGENTE['DEFICIENTE'], graf_EMERGENTE['EMERGENTE'], graf_EMERGENTE['NORMAL'], graf_EMERGENTE['ALTO'], graf_EMERGENTE['SUPERIOR']], $titulos, $colores, "container_emergente", $titulo);

                        }
                        if( niveles[KeyNiveles] == datos[KeyData].perfilvs.toUpperCase() && datos[KeyData].perfilvs.toUpperCase() == "NORMAL" ){
                            $totales_NORMAL += datos[KeyData].totales_vs;
                            $span="t_"+datos[KeyData].perfilvs.toLowerCase()+"_"+datos[KeyData].perfil_final.toLowerCase();
                            $("#tbl_vs").find("span."+$span).html(datos[KeyData].totales_vs).parent().attr({
                                btn: "xunidad",
                                usr_ag: "'"+obj.g_ags+"'",  
                                ambito: obj.g_nivel.toUpperCase(),
                                descripcion_unidad_permisos: obj.g_unidades_permisos,
                                perfil_final_2012_2013: datos[KeyData].perfil_final_2012_2013,
                                perfil_final: datos[KeyData].perfil_final,
                                g_nivel: obj.g_nivel,
                                "data-toggle": "modal",
                                "data-target": "#detalles_usr_vs",
                                "data-whatever": "Usuarios en Normal -> " + datos[KeyData].perfil_final                              
                            }).addClass('td_detalles_central hand');
                            $("#tbl_vs").find(".t_"+datos[KeyData].perfilvs.toLowerCase()+"_totales").html($totales_NORMAL);

                            $graphics = $("#grafica").clone().find("#container").attr("id", "container_normal").hide();
                            $('#contenido_resul').append($graphics);                            
                            grafica_uno([niveles[KeyNiveles]], [graf_NORMAL['DEFICIENTE'], graf_NORMAL['EMERGENTE'], graf_NORMAL['NORMAL'], graf_NORMAL['ALTO'], graf_NORMAL['SUPERIOR']], $titulos, $colores, "container_normal", $titulo);

                        }
                        if( niveles[KeyNiveles] == datos[KeyData].perfilvs.toUpperCase() && datos[KeyData].perfilvs.toUpperCase() == "ALTO" ){
                            $totales_ALTO += datos[KeyData].totales_vs;
                            $span="t_"+datos[KeyData].perfilvs.toLowerCase()+"_"+datos[KeyData].perfil_final.toLowerCase();
                            $("#tbl_vs").find("span."+$span).html(datos[KeyData].totales_vs).parent().attr({
                                btn: "xunidad",
                                usr_ag: "'"+obj.g_ags+"'",  
                                ambito: obj.g_nivel.toUpperCase(),
                                descripcion_unidad_permisos: obj.g_unidades_permisos,
                                perfil_final_2012_2013: datos[KeyData].perfil_final_2012_2013,
                                perfil_final: datos[KeyData].perfil_final,
                                g_nivel: obj.g_nivel,
                                "data-toggle": "modal",
                                "data-target": "#detalles_usr_vs",
                                "data-whatever": "Usuarios en Alto -> " + datos[KeyData].perfil_final
                            }).addClass('td_detalles_central hand');
                            $("#tbl_vs").find(".t_"+datos[KeyData].perfilvs.toLowerCase()+"_totales").html($totales_ALTO);

                            $graphics = $("#grafica").clone().find("#container").attr("id", "container_alto").hide();
                            $('#contenido_resul').append($graphics);
                            grafica_uno([niveles[KeyNiveles]], [graf_ALTO['DEFICIENTE'], graf_ALTO['EMERGENTE'], graf_ALTO['NORMAL'], graf_ALTO['ALTO'], graf_ALTO['SUPERIOR']], $titulos, $colores, "container_alto", $titulo);

                        }  
                        if( niveles[KeyNiveles] == datos[KeyData].perfilvs.toUpperCase() && datos[KeyData].perfilvs.toUpperCase() == "SUPERIOR" ){
                            $totales_SUPERIOR += datos[KeyData].totales_vs;
                            $span="t_"+datos[KeyData].perfilvs.toLowerCase()+"_"+datos[KeyData].perfil_final.toLowerCase();
                            $("#tbl_vs").find("span."+$span).html(datos[KeyData].totales_vs).parent().attr({
                                btn: "xunidad",
                                usr_ag: "'"+obj.g_ags+"'",  
                                ambito: obj.g_nivel.toUpperCase(),
                                descripcion_unidad_permisos: obj.g_unidades_permisos,
                                perfil_final_2012_2013: datos[KeyData].perfil_final_2012_2013,
                                perfil_final: datos[KeyData].perfil_final,
                                g_nivel: obj.g_nivel,
                                "data-toggle": "modal",
                                "data-target": "#detalles_usr_vs",
                                "data-whatever": "Usuarios en Superior -> " + datos[KeyData].perfil_final
                            }).addClass('td_detalles_central hand');
                            $("#tbl_vs").find(".t_"+datos[KeyData].perfilvs.toLowerCase()+"_totales").html($totales_SUPERIOR);

                            $graphics = $("#grafica").clone().find("#container").attr("id", "container_superior").hide();
                            $('#contenido_resul').append($graphics);                            
                            grafica_uno([niveles[KeyNiveles]], [graf_SUPERIOR['DEFICIENTE'], graf_SUPERIOR['EMERGENTE'], graf_SUPERIOR['NORMAL'], graf_SUPERIOR['ALTO'], graf_SUPERIOR['SUPERIOR']], $titulos, $colores, "container_superior", $titulo);

                        }                                                 

                    }
                     
                }
                $totales_niveles_h =  $totales_EMERGENTE_h + $totales_DEFICIENTE_h + $totales_NORMAL_h + $totales_ALTO_h + $totales_SUPERIOR_h;
                $("#tbl_vs").find(".t_totales_h").html($totales_niveles_h);
                //console.log("graf_DEFICIENTE:", graf_DEFICIENTE)


                if(obj.g_nivel == "Central_Local" || obj.g_nivel == "General")
                    $categories_grafica = ['CENTRAL', 'DESCONCENTRADA'];

                if(obj.g_nivel == "Central" || obj.g_nivel == "Admin")
                    $categories_grafica = ['CENTRAL'];

                if(obj.g_nivel == "Local")
                    $categories_grafica = ['DESCONCENTRADA'];

                            
                $("#grafica").hide();   // cultar este contenedor ya que en esta pantalla no se usa
                $("#"+graf_activa).show();
                $("#contenido_resul").animate({opacity:1},'fast');
                $("#btn_graf_pie, #btn_graf_bar").hide();
                //$("#grafica").show().appendTo($("#contenido_resul"));
                $("#grafica_bar").css("display", "table");


                $("#ajax_respuesta").empty();
                $('.btn_menu').bind('click',$btn_click);
    

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
             type: "GET",
             contentType: "application/x-www-form-urlencoded", 
             url: "resultados_eidd_xnivel",
             data: "tipo_busqueda=btn_vs&usr_ag="+$usr_ag+"&ambito="+$txt_ambito,
             beforeSend:function(){ $("#ajax_respuesta").html($load); },     
             success: function(datos){ 
                //if ($('.msg_status').length)
                //alert(datos)
                var datos = jQuery.parseJSON(datos);

                for(var KeyNiveles in niveles) {
                  
                        armar_tbl_vs(obj.g_ags, obj.nivel, niveles[KeyNiveles], puestos[KeyNiveles], 'xnivel');
                }

                $tabla = `
                    <div style=" float: left;width: 100%;">
                    <table id="tbl_vs" class=" table table-condensed" style="padding:0px;">
                    <tr class='table_top'>    
                        <td id='th_ambito' align='center' class="negritas" width='150'>PERFIL FINAL</td>
                        <td width='8.33%' class='f_rojo_fuerte t_blanco negritas' align='center'>DEFICIENTE</td>
                        <td width='8.33%' class='f_rojo_claro t_blanco negritas' align='center'>EMERGENTE</td>
                        <td width='8.33%' class='f_blanco negritas' align='center'>NORMAL</td>
                        <td width='8.33%' class='f_verde_claro t_blanco negritas' align='center'>ALTO</td>
                        <td width='8.33%' class='f_verde_fuerte t_blanco negritas' align='center'>SUPERIOR</td>
                        <td align='center' class="negritas">TOTAL</td>
                    </tr> 
                    <tr><td>ADMINISTRADOR
                            <div style="position:relative; float: right; padding-right:5px;" class="hover_rojo ver_grafica_chart" id="btn_container_superior">
                                <i class="fa fa-bar-chart hand" style="margin-left:20px"  aria-hidden="true"></i>
                            </div>
                        </td>
                        ${$tr_superior_vs[0]}
                        ${$tr_superior_vs[1]}
                        ${$tr_superior_vs[2]}
                        ${$tr_superior_vs[3]}
                        ${$tr_superior_vs[4]}
                        ${$tr_superior_vs[5]}
                    </tr>                     
                    <tr><td>SUBADMINISTRADOR
                            <div style="position:relative; float: right; padding-right:5px;" class="hover_rojo ver_grafica_chart" id="btn_container_alto">
                                <i class="fa fa-bar-chart hand" style="margin-left:20px"  aria-hidden="true"></i>
                            </div>
                        </td>                    
                        ${$tr_alto_vs[0]}
                        ${$tr_alto_vs[1]}
                        ${$tr_alto_vs[2]}
                        ${$tr_alto_vs[3]}
                        ${$tr_alto_vs[4]}
                        ${$tr_alto_vs[5]}
                    </tr> 
                    <tr><td>JEFE DE DEPARTAMENTO
                            <div style="position:relative; float: right; padding-right:5px;" class="hover_rojo ver_grafica_chart" id="btn_container_normal">
                                <i class="fa fa-bar-chart hand" style="margin-left:20px"  aria-hidden="true"></i>
                            </div>
                        </td>                    
                        ${$tr_normal_vs[0]}
                        ${$tr_normal_vs[1]}
                        ${$tr_normal_vs[2]}
                        ${$tr_normal_vs[3]}
                        ${$tr_normal_vs[4]}
                        ${$tr_normal_vs[5]}
                    </tr>                                         
                    <tr><td>ENLACE
                            <div style="position:relative; float: right; padding-right:5px;" class="hover_rojo ver_grafica_chart" id="btn_container_emergente">
                                <i class="fa fa-bar-chart hand" style="margin-left:20px"  aria-hidden="true"></i>
                            </div>
                        </td>                    
                        ${$tr_emergente_vs[0]}
                        ${$tr_emergente_vs[1]}
                        ${$tr_emergente_vs[2]}
                        ${$tr_emergente_vs[3]}
                        ${$tr_emergente_vs[4]}
                        ${$tr_emergente_vs[5]}
                    </tr> 
                    <tr><td>OPERATIVO 
                            <div style="position:relative; float: right; padding-right:5px;" class="hover_rojo ver_grafica_chart" id="btn_container_deficiente">
                                <i class="fa fa-bar-chart hand" style="margin-left:20px"  aria-hidden="true"></i>
                            </div>
                        </td>
                        ${$tr_deficiente_vs[0]}
                        ${$tr_deficiente_vs[1]}
                        ${$tr_deficiente_vs[2]}
                        ${$tr_deficiente_vs[3]}
                        ${$tr_deficiente_vs[4]}
                        ${$tr_deficiente_vs[5]}
                    </tr>   
                    <tr class='table_top' align='center'>
                        <td align='center' class="negritas">TOTAL</td>
                        <td class='negritas t_deficiente_totales_h'></td>
                        <td class='negritas t_emergente_totales_h'></td>
                        <td class='negritas t_normal_totales_h'></td>
                        <td class='negritas t_alto_totales_h'></td>
                        <td class='negritas t_superior_totales_h'></td>
                        <td class='negritas t_totales_h'></td>
                    </tr>                    
                    </table></div>`;  


                $("#contenido_resul").show().append($tabla);
                $totales_EMERGENTE_h=0, $totales_DEFICIENTE_h=0, $totales_NORMAL_h=0, $totales_ALTO_h=0, $totales_SUPERIOR_h=0;
                puestos_totales = {'OPERATIVO':0,'ENLACE':0,'JEFE_DE_DEPARTAMENTO':0,'SUBADMINISTRADOR':0,'ADMINISTRADOR':0};
                reset_matriz_graf_niveles();
                for(var KeyData in datos) { 
                    //****************************************************************************************************//
                    // Totales Verticales y actualizar las matrices que contienen los datos para la grafica
                    if(datos[KeyData].perfilvs.toUpperCase() == 'OPERATIVO'){
                        if(datos[KeyData].perfil_final.toUpperCase()=="DEFICIENTE") graf_DEFICIENTE['DEFICIENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="EMERGENTE") graf_DEFICIENTE['EMERGENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="NORMAL") graf_DEFICIENTE['NORMAL']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="ALTO") graf_DEFICIENTE['ALTO']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="SUPERIOR") graf_DEFICIENTE['SUPERIOR']=[datos[KeyData].totales_vs];

                        puestos_totales['OPERATIVO'] = puestos_totales['OPERATIVO'] + datos[KeyData].totales_vs;
                        $("#tbl_vs").find("span.t_"+datos[KeyData].perfilvs.toLowerCase().replace(/ /g, "_") +"_totales" ).html(puestos_totales['OPERATIVO']);
                    }
                    if(datos[KeyData].perfilvs.toUpperCase() == 'ENLACE'){
                        if(datos[KeyData].perfil_final.toUpperCase()=="DEFICIENTE") graf_EMERGENTE['DEFICIENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="EMERGENTE") graf_EMERGENTE['EMERGENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="NORMAL") graf_EMERGENTE['NORMAL']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="ALTO") graf_EMERGENTE['ALTO']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="SUPERIOR") graf_EMERGENTE['SUPERIOR']=[datos[KeyData].totales_vs];

                        puestos_totales['ENLACE'] = puestos_totales['ENLACE'] + datos[KeyData].totales_vs;
                        $("#tbl_vs").find("span.t_"+datos[KeyData].perfilvs.toLowerCase().replace(/ /g, "_") +"_totales" ).html(puestos_totales['ENLACE']);
                    }
                    if(datos[KeyData].perfilvs.toUpperCase() == 'JEFE DE DEPARTAMENTO'){
                        if(datos[KeyData].perfil_final.toUpperCase()=="DEFICIENTE") graf_NORMAL['DEFICIENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="EMERGENTE") graf_NORMAL['EMERGENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="NORMAL") graf_NORMAL['NORMAL']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="ALTO") graf_NORMAL['ALTO']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="SUPERIOR") graf_NORMAL['SUPERIOR']=[datos[KeyData].totales_vs];

                        puestos_totales['JEFE_DE_DEPARTAMENTO'] = puestos_totales['JEFE_DE_DEPARTAMENTO'] + datos[KeyData].totales_vs;
                        $("#tbl_vs").find("span.t_"+datos[KeyData].perfilvs.toLowerCase().replace(/ /g, "_") +"_totales" ).html(puestos_totales['JEFE_DE_DEPARTAMENTO']);
                    }
                    if(datos[KeyData].perfilvs.toUpperCase() == 'SUBADMINISTRADOR'){
                        if(datos[KeyData].perfil_final.toUpperCase()=="DEFICIENTE") graf_ALTO['DEFICIENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="EMERGENTE") graf_ALTO['EMERGENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="NORMAL") graf_ALTO['NORMAL']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="ALTO") graf_ALTO['ALTO']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="SUPERIOR") graf_ALTO['SUPERIOR']=[datos[KeyData].totales_vs];

                        puestos_totales['SUBADMINISTRADOR'] = puestos_totales['SUBADMINISTRADOR'] + datos[KeyData].totales_vs;
                        $("#tbl_vs").find("span.t_"+datos[KeyData].perfilvs.toLowerCase().replace(/ /g, "_") +"_totales" ).html(puestos_totales['SUBADMINISTRADOR']);
                    }
                    if(datos[KeyData].perfilvs.toUpperCase() == 'ADMINISTRADOR'){
                        if(datos[KeyData].perfil_final.toUpperCase()=="DEFICIENTE") graf_SUPERIOR['DEFICIENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="EMERGENTE") graf_SUPERIOR['EMERGENTE']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="NORMAL") graf_SUPERIOR['NORMAL']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="ALTO") graf_SUPERIOR['ALTO']=[datos[KeyData].totales_vs];
                        if(datos[KeyData].perfil_final.toUpperCase()=="SUPERIOR") graf_SUPERIOR['SUPERIOR']=[datos[KeyData].totales_vs];

                        puestos_totales['ADMINISTRADOR'] = puestos_totales['ADMINISTRADOR'] + datos[KeyData].totales_vs;
                        $("#tbl_vs").find("span.t_"+datos[KeyData].perfilvs.toLowerCase().replace(/ /g, "_") +"_totales" ).html(puestos_totales['ADMINISTRADOR']);
                    }
                    //****************************************************************************************************//
                    // Totales Horizontales y saber que grafica mostrar
                    graf_activa = "";   
                    if(datos[KeyData].perfil_final.toUpperCase() == "EMERGENTE"){
                        graf_activa = "container_emergente";
                        $totales_EMERGENTE_h += datos[KeyData].totales_vs;                        
                        $("#tbl_vs").find(".t_emergente_totales_h").html($totales_EMERGENTE_h);
                    }
                    if(datos[KeyData].perfil_final.toUpperCase() == "DEFICIENTE"){
                        graf_activa = "container_deficiente";
                        $totales_DEFICIENTE_h += datos[KeyData].totales_vs;                        
                        $("#tbl_vs").find(".t_deficiente_totales_h").html($totales_DEFICIENTE_h);                 
                    }
                    if(datos[KeyData].perfil_final.toUpperCase() == "NORMAL"){
                        graf_activa = "container_normal";
                        $totales_NORMAL_h += datos[KeyData].totales_vs;                        
                        $("#tbl_vs").find(".t_normal_totales_h").html($totales_NORMAL_h);
                    }
                    if(datos[KeyData].perfil_final.toUpperCase() == "ALTO"){
                        graf_activa = "container_alto";
                        $totales_ALTO_h += datos[KeyData].totales_vs;                        
                        $("#tbl_vs").find(".t_alto_totales_h").html($totales_ALTO_h);
                    }
                    if(datos[KeyData].perfil_final.toUpperCase() == "SUPERIOR"){
                        graf_activa = "container_superior";
                        $totales_SUPERIOR_h += datos[KeyData].totales_vs;                        
                        $("#tbl_vs").find(".t_superior_totales_h").html($totales_SUPERIOR_h);
                    }

                    $total_niveles = $totales_EMERGENTE_h + $totales_DEFICIENTE_h + $totales_NORMAL_h + $totales_ALTO_h + $totales_SUPERIOR_h;
                    $("#tbl_vs").find(".t_totales_h").html($total_niveles);
                    //actualizar la tabla con las cantidades de personal 
                    $span="t_"+datos[KeyData].perfilvs.toLowerCase().replace(/ /g, "_")+"_"+datos[KeyData].perfil_final.toLowerCase();
                    $("#tbl_vs").find("span."+$span).html(datos[KeyData].totales_vs).parent().attr({
                        btn: "xnivel",
                        usr_ag: "'"+obj.g_ags+"'",                      
                        perfil_final: datos[KeyData].perfil_final,
                        puesto_nivel: datos[KeyData].perfilvs.toUpperCase(),
                        ambito: obj.g_nivel.toUpperCase(),
                        descripcion_unidad: obj.g_unidades_permisos,  
                        id_ag: "id_ag",
                        id_ag_4 : "id_ag_4",
                        vista: "vista",
                        g_nivel: obj.g_nivel,
                        "data-toggle": "modal",
                        "data-target": "#detalles_usr",
                        "data-whatever": datos[KeyData].perfilvs + " -> " + datos[KeyData].perfil_final
                    }).addClass('td_detalles_central hand');
                        
                }
                // armar las graficas para cada puesto             
                for(var KeyNiveles in niveles) {
                   // Crear las Graficas para cada Nivel
                   $titulo = 'RESULTADOS DE EIDD '+anoAnterior+' - '+anoActual+' POR NIVEL JERARQUICO';
                   console.log("for KeyNiveles:"+KeyNiveles)
                    if(niveles[KeyNiveles].toUpperCase() == 'DEFICIENTE' ){
                        $graphics = $("#grafica").clone().find("#container").attr("id", "container_deficiente").hide();
                        $('#contenido_resul').append($graphics);                
                        grafica_uno([puestos[KeyNiveles]], [graf_DEFICIENTE['DEFICIENTE'], graf_DEFICIENTE['EMERGENTE'], graf_DEFICIENTE['NORMAL'], graf_DEFICIENTE['ALTO'], graf_DEFICIENTE['SUPERIOR']], $titulos, $colores, "container_deficiente", $titulo);
                    }
                    if(niveles[KeyNiveles].toUpperCase() == 'EMERGENTE' ){
                        $graphics = $("#grafica").clone().find("#container").attr("id", "container_emergente").hide();
                        $('#contenido_resul').append($graphics);                
                        grafica_uno([puestos[KeyNiveles]], [graf_EMERGENTE['DEFICIENTE'], graf_EMERGENTE['EMERGENTE'], graf_EMERGENTE['NORMAL'], graf_EMERGENTE['ALTO'], graf_EMERGENTE['SUPERIOR']], $titulos, $colores, "container_emergente", $titulo);
                    }
                    if(niveles[KeyNiveles].toUpperCase() == 'NORMAL' ){
                        $graphics = $("#grafica").clone().find("#container").attr("id", "container_normal").hide();
                        $('#contenido_resul').append($graphics);                
                        grafica_uno([puestos[KeyNiveles]], [graf_NORMAL['DEFICIENTE'], graf_NORMAL['EMERGENTE'], graf_NORMAL['NORMAL'], graf_NORMAL['ALTO'], graf_NORMAL['SUPERIOR']], $titulos, $colores, "container_normal", $titulo);
                    }
                    if(niveles[KeyNiveles].toUpperCase() == 'ALTO' ){
                        $graphics = $("#grafica").clone().find("#container").attr("id", "container_alto").hide();
                        $('#contenido_resul').append($graphics);                
                        grafica_uno([puestos[KeyNiveles]], [graf_ALTO['DEFICIENTE'], graf_ALTO['EMERGENTE'], graf_ALTO['NORMAL'], graf_ALTO['ALTO'], graf_ALTO['SUPERIOR']], $titulos, $colores, "container_alto", $titulo);
                    }
                    if(niveles[KeyNiveles].toUpperCase() == 'SUPERIOR' ){
                        $graphics = $("#grafica").clone().find("#container").attr("id", "container_superior").hide();
                        $('#contenido_resul').append($graphics);                
                        grafica_uno([puestos[KeyNiveles]], [graf_SUPERIOR['DEFICIENTE'], graf_SUPERIOR['EMERGENTE'], graf_SUPERIOR['NORMAL'], graf_SUPERIOR['ALTO'], graf_SUPERIOR['SUPERIOR']], $titulos, $colores, "container_superior", $titulo);
                    }                                

                    $("#"+graf_activa).show();                
             
                }
   
                $(".btn_menu").removeClass('btn_activo');
                $("#btn_nivel").addClass('btn_activo');
                $("#contenido_resul").show().appendTo($("#contenido_resul"));            
                $("#contenido_resul").animate({opacity:1},'fast');
      
                $("#ajax_respuesta").empty();
                $('.btn_menu').bind('click',$btn_click);


             },
             timeout:90000,
             error: function(){                     
                    $("#ajax_respuesta").html('Problemas con el servidor intente de nuevo.');
                }      
            });         
        }            

        if(this.id == 'btn_brechasxnivel'){
            //$txt_ambito = $('#txt_nivel').val();
            //$('#contenido_resul').css({'height':'0%'});
            //$('#contenido_resul').animate({left:0}, {duration: 'slow', easing: 'easeOutBack'});
            //alert($txt_ambito)
            $.ajax({
             type: "GET",
             contentType: "application/x-www-form-urlencoded", 
             url: "resultados_x_brechasxnivel",
             data: "tipo_busqueda=btn_vs&usr_ag="+$usr_ag,
             beforeSend:function(){ $("#ajax_respuesta").html($load); },     
             success: function(datos){ 
                //if ($('.msg_status').length)
                //alert(datos)
                var datos = jQuery.parseJSON(datos);
                $categoriesAdministrador=$categoriesSubadministrador=$categoriesDepto=$categories_Enlace=$categories_Operativo="";
                $admin_t_trabajo_equipo = $admin_t_comunicacion = $admin_t_actitud_servicio = $admin_t_orientacion_resultados = $admin_t_analisis_problemas = $admin_t_liderazgo = $admin_t_organizacion = $admin_t_negociacion = $admin_t_toma_decisiones = $admin_t_personal_formar = 0;
                $subadm_t_trabajo_equipo = $subadm_t_comunicacion = $subadm_t_actitud_servicio = $subadm_t_orientacion_resultados = $subadm_t_analisis_problemas = $subadm_t_liderazgo = $subadm_t_organizacion = $subadm_t_negociacion = $subadm_t_toma_decisiones = $subadm_t_personal_formar = 0;
                $jdep_t_trabajo_equipo = $jdep_t_comunicacion = $jdep_t_actitud_servicio = $jdep_t_orientacion_resultados = $jdep_t_analisis_problemas = $jdep_t_liderazgo = $jdep_t_organizacion = $jdep_t_negociacion = $jdep_t_toma_decisiones = $jdep_t_personal_formar = 0;
                $enl_t_trabajo_equipo = $enl_t_comunicacion = $enl_t_actitud_servicio = $enl_t_orientacion_resultados = $enl_t_analisis_problemas = $enl_t_liderazgo = $enl_t_organizacion = $enl_t_negociacion = $enl_t_toma_decisiones = $enl_t_personal_formar = 0;
                $ope_t_trabajo_equipo = $ope_t_comunicacion = $ope_t_actitud_servicio = $ope_t_orientacion_resultados = $ope_t_analisis_problemas = $ope_t_liderazgo = $ope_t_organizacion = $ope_t_negociacion = $ope_t_toma_decisiones = $ope_t_personal_formar = 0;                

                $tr_administrador="";
                $tr_subadministrador="";
                $tr_jdepto="";
                $tr_enlace="";
                $tr_operativo="";

                reset_matriz_graf_competencias();    // iguala a 0 las matrices de los valores 
                graf_activa = "";                                 
                for(var KeyData  in datos) {  
                    console.log("total_brechas::", datos[KeyData].total_brechas)
                    $titulo = '';
                    // asignar eventos en caso de tener personal para el nivel y competencia 
                    if(datos[KeyData].puesto_nivel == 'Administrador' && datos[KeyData].total_brechas){
                        graf_activa = "container_superior";
                        $categoriesAdministrador = "'ADMINISTRADOR',"; 

                        (graf_SUPERIOR['trabajo_equipo'] = $admin_t_trabajo_equipo = datos[KeyData].trabajo_equipo) ? $class_trabajo_equipo = 'class="td_detalles_brechaxnivel hand"' : $class_trabajo_equipo = '';
                        (graf_SUPERIOR['comunicacion'] = $admin_t_comunicacion = datos[KeyData].comunicacion) ? $class_comunicacion = 'class="td_detalles_brechaxnivel hand"' : $class_comunicacion = '';
                        (graf_SUPERIOR['actitud_servicio'] = $admin_t_actitud_servicio = datos[KeyData].actitud_servicio) ? $class_actitud_servicio = 'class="td_detalles_brechaxnivel hand"' : $class_actitud_servicio = '';
                        (graf_SUPERIOR['orientacion_resultados'] = $admin_t_orientacion_resultados = datos[KeyData].orientacion_resultados) ? $class_orientacion_resultados = 'class="td_detalles_brechaxnivel hand"' : $class_orientacion_resultados = '';
                        (graf_SUPERIOR['analisis_problemas'] = $admin_t_analisis_problemas = datos[KeyData].analisis_problemas) ? $class_analisis_problemas = 'class="td_detalles_brechaxnivel hand"' : $class_analisis_problemas = '';
                        (graf_SUPERIOR['liderazgo'] = $admin_t_liderazgo = datos[KeyData].liderazgo) ? $class_liderazgo = 'class="td_detalles_brechaxnivel hand"' : $class_liderazgo = '';
                        (graf_SUPERIOR['organizacion'] = $admin_t_organizacion = datos[KeyData].organizacion) ? $class_organizacion = 'class="td_detalles_brechaxnivel hand"' : $class_organizacion = '';
                        (graf_SUPERIOR['negociacion'] = $admin_t_negociacion = datos[KeyData].negociacion) ? $class_negociacion = 'class="td_detalles_brechaxnivel hand"' : $class_negociacion = '';
                        (graf_SUPERIOR['toma_decisiones'] = $admin_t_toma_decisiones = datos[KeyData].toma_decisiones) ? $class_toma_decisiones = 'class="td_detalles_brechaxnivel hand"' : $class_toma_decisiones = '';
                        ($admin_t_personal_formar = datos[KeyData].personal_formar) ? $class_personal_formar = 'class="td_detalles_brechaxnivel hand"' : $class_personal_formar = '';
                        
                        $tr_administrador = `<tr class='tr_ADMINISTRADOR'>
                            <td>
                                ADMINISTRADOR
                                <div style="position:relative; float: right; padding-right:5px;" class="hover_rojo ver_grafica_chart" id="btn_container_superior">
                                    <i class="fa fa-bar-chart hand" style="margin-left:20px"  aria-hidden="true"></i>
                                </div>
                            </td>
                            <td align="center" width="6%" ${$class_trabajo_equipo} nivel="Administrador" comp="trabajo_equipo"> ${$admin_t_trabajo_equipo} </td>
                            <td align="center" width="6%" ${$class_comunicacion} nivel="Administrador" comp="comunicacion"> ${$admin_t_comunicacion} </td>
                            <td align="center" width="6%" ${$class_actitud_servicio} nivel="Administrador" comp="actitud_servicio"> ${$admin_t_actitud_servicio} </td>
                            <td align="center" width="6%" ${$class_orientacion_resultados} nivel="Administrador" comp="orientacion_resultados"> ${$admin_t_orientacion_resultados} </td>
                            <td align="center" width="6%" ${$class_analisis_problemas} nivel="Administrador" comp="analisis_problemas"> ${$admin_t_analisis_problemas} </td>
                            <td align="center" width="6%" ${$class_liderazgo} nivel="Administrador" comp="liderazgo"> ${$admin_t_liderazgo} </td>
                            <td align="center" width="6%" ${$class_organizacion} nivel="Administrador" comp="organizacion"> ${$admin_t_organizacion} </td>              
                            <td align="center" width="6%" ${$class_negociacion} nivel="Administrador" comp="negociacion"> ${$admin_t_negociacion} </td>
                            <td align="center" width="6%" ${$class_toma_decisiones} nivel="Administrador" comp="toma_decisiones"> ${$admin_t_toma_decisiones} </td>
                            </tr>`;
                        console.log("admin:"+$tr_administrador);
                        $graphics = $("#grafica").clone().find("#container").attr("id", "container_superior").hide();
                        $('#contenido_resul').append($graphics);                
                        grafica_uno(['ADMINISTRADOR'], [graf_SUPERIOR['trabajo_equipo'], graf_SUPERIOR['comunicacion'], graf_SUPERIOR['actitud_servicio'], graf_SUPERIOR['orientacion_resultados'], graf_SUPERIOR['analisis_problemas'], graf_SUPERIOR['liderazgo'], graf_SUPERIOR['organizacion'], graf_SUPERIOR['negociacion'], graf_SUPERIOR['toma_decisiones']], competencias, $colores_competencias, "container_superior");                            
                    }
                    if(datos[KeyData].puesto_nivel == 'Subadministrador' && datos[KeyData].total_brechas){                        
                        graf_activa = "container_alto";
                        $categoriesSubadministrador = "'SUBADMINISTRADOR',";
                                                                                                                                                                                                                                                                        
                        (graf_ALTO['trabajo_equipo'] = $subadm_t_trabajo_equipo = datos[KeyData].trabajo_equipo) ? $class_trabajo_equipo = 'class="td_detalles_brechaxnivel hand"' : $class_trabajo_equipo = '';
                        (graf_ALTO['comunicacion'] = $subadm_t_comunicacion = datos[KeyData].comunicacion) ? $class_comunicacion = 'class="td_detalles_brechaxnivel hand"' : $class_comunicacion = '';
                        (graf_ALTO['actitud_servicio'] = $subadm_t_actitud_servicio = datos[KeyData].actitud_servicio) ? $class_actitud_servicio = 'class="td_detalles_brechaxnivel hand"' : $class_actitud_servicio = '';
                        (graf_ALTO['orientacion_resultados'] = $subadm_t_orientacion_resultados = datos[KeyData].orientacion_resultados) ? $class_orientacion_resultados = 'class="td_detalles_brechaxnivel hand"' : $class_orientacion_resultados = '';
                        (graf_ALTO['analisis_problemas'] = $subadm_t_analisis_problemas = datos[KeyData].analisis_problemas) ? $class_analisis_problemas = 'class="td_detalles_brechaxnivel hand"' : $class_analisis_problemas = '';
                        (graf_ALTO['liderazgo'] = $subadm_t_liderazgo = datos[KeyData].liderazgo) ? $class_liderazgo = 'class="td_detalles_brechaxnivel hand"' : $class_liderazgo = '';
                        (graf_ALTO['organizacion'] = $subadm_t_organizacion = datos[KeyData].organizacion) ? $class_organizacion = 'class="td_detalles_brechaxnivel hand"' : $class_organizacion = '';
                        (graf_ALTO['negociacion'] = $subadm_t_negociacion = datos[KeyData].negociacion) ? $class_negociacion = 'class="td_detalles_brechaxnivel hand"' : $class_negociacion = '';
                        (graf_ALTO['toma_decisiones'] = $subadm_t_toma_decisiones = datos[KeyData].toma_decisiones) ? $class_toma_decisiones = 'class="td_detalles_brechaxnivel hand"' : $class_toma_decisiones = '';
                        ($subadm_t_personal_formar = datos[KeyData].personal_formar) ? $class_personal_formar = 'class="td_detalles_brechaxnivel hand"' : $class_personal_formar = '';
                                    
                        $tr_subadministrador = `<tr class='tr_SUBADMINISTRADOR'>
                            <td>
                                SUBADMINISTRADOR
                                <div style="position:relative; float: right; padding-right:5px;" class="hover_rojo ver_grafica_chart" id="btn_container_alto">
                                    <i class="fa fa-bar-chart hand" style="margin-left:20px"  aria-hidden="true"></i>
                                </div>
                            </td>
                            <td align="center" width="6%" ${ $class_trabajo_equipo } nivel="Subadministrador" comp="trabajo_equipo">${ $subadm_t_trabajo_equipo }</td>
                            <td align="center" width="6%" ${ $class_comunicacion } nivel="Subadministrador" comp="comunicacion">${ $subadm_t_comunicacion }</td>
                            <td align="center" width="6%" ${ $class_actitud_servicio } nivel="Subadministrador" comp="actitud_servicio">${ $subadm_t_actitud_servicio }</td>
                            <td align="center" width="6%" ${ $class_orientacion_resultados } nivel="Subadministrador" comp="orientacion_resultados">${ $subadm_t_orientacion_resultados }</td>
                            <td align="center" width="6%" ${ $class_analisis_problemas } nivel="Subadministrador" comp="analisis_problemas">${ $subadm_t_analisis_problemas }</td>
                            <td align="center" width="6%" ${ $class_liderazgo } nivel="Subadministrador" comp="liderazgo">${ $subadm_t_liderazgo }</td>
                            <td align="center" width="6%" ${ $class_organizacion } nivel="Subadministrador" comp="organizacion">${ $subadm_t_organizacion }</td>              
                            <td align="center" width="6%" ${ $class_negociacion } nivel="Subadministrador" comp="negociacion">${ $subadm_t_negociacion }</td>
                            <td align="center" width="6%" ${ $class_toma_decisiones } nivel="Subadministrador" comp="toma_decisiones">${ $subadm_t_toma_decisiones }</td>
                            </tr>`;
                        $graphics = $("#grafica").clone().find("#container").attr("id", "container_alto").hide();
                        $('#contenido_resul').append($graphics);                
                        grafica_uno(['SUBADMINISTRADOR'], [graf_ALTO['trabajo_equipo'], graf_ALTO['comunicacion'], graf_ALTO['actitud_servicio'], graf_ALTO['orientacion_resultados'], graf_ALTO['analisis_problemas'], graf_ALTO['liderazgo'], graf_ALTO['organizacion'], graf_ALTO['negociacion'], graf_ALTO['toma_decisiones']], competencias, $colores_competencias, "container_alto", $titulo);                                
                    }//<td align="center" width="6%" '.$class_personal_formar.' nivel="Subadministrador" comp="personal_formar">'.$subadm_t_personal_formar.'</td>
                    if(datos[KeyData].puesto_nivel == 'Jefe de Departamento' && datos[KeyData].total_brechas){
                        graf_activa = "container_normal";  
                        $categoriesDepto = "'JEFE DE DEPARTAMENTO',"; 
                        (graf_NORMAL['trabajo_equipo'] = $jdep_t_trabajo_equipo = datos[KeyData].trabajo_equipo) ? $class_trabajo_equipo = 'class="td_detalles_brechaxnivel hand"' : $class_trabajo_equipo = '';
                        (graf_NORMAL['comunicacion'] = $jdep_t_comunicacion = datos[KeyData].comunicacion) ? $class_comunicacion = 'class="td_detalles_brechaxnivel hand"' : $class_comunicacion = '';
                        (graf_NORMAL['actitud_servicio'] = $jdep_t_actitud_servicio = datos[KeyData].actitud_servicio) ? $class_actitud_servicio = 'class="td_detalles_brechaxnivel hand"' : $class_actitud_servicio = '';
                        (graf_NORMAL['orientacion_resultados'] = $jdep_t_orientacion_resultados = datos[KeyData].orientacion_resultados) ? $class_orientacion_resultados = 'class="td_detalles_brechaxnivel hand"' : $class_orientacion_resultados = '';
                        (graf_NORMAL['analisis_problemas'] = $jdep_t_analisis_problemas = datos[KeyData].analisis_problemas) ? $class_analisis_problemas = 'class="td_detalles_brechaxnivel hand"' : $class_analisis_problemas = '';
                        (graf_NORMAL['liderazgo'] = $jdep_t_liderazgo = datos[KeyData].liderazgo) ? $class_liderazgo = 'class="td_detalles_brechaxnivel hand"' : $class_liderazgo = '';
                        (graf_NORMAL['organizacion'] = $jdep_t_organizacion = datos[KeyData].organizacion) ? $class_organizacion = 'class="td_detalles_brechaxnivel hand"' : $class_organizacion = '';
                        (graf_NORMAL['negociacion'] = $jdep_t_negociacion = datos[KeyData].negociacion) ? $class_negociacion = 'class="td_detalles_brechaxnivel hand"' : $class_negociacion = '';
                        (graf_NORMAL['toma_decisiones'] = $jdep_t_toma_decisiones = datos[KeyData].toma_decisiones) ? $class_toma_decisiones = 'class="td_detalles_brechaxnivel hand"' : $class_toma_decisiones = '';
                        ($jdep_t_personal_formar = datos[KeyData].personal_formar) ? $class_personal_formar = 'class="td_detalles_brechaxnivel hand"' : $class_personal_formar = '';
                                    
                        $tr_jdepto = `<tr class='tr_JDEPTO'>
                            <td>
                                JEFE DE DEPARTAMENTO
                                <div style="position:relative; float: right; padding-right:5px;" class="hover_rojo ver_grafica_chart" id="btn_container_normal">
                                    <i class="fa fa-bar-chart hand" style="margin-left:20px"  aria-hidden="true"></i>
                                </div>
                            </td>
                            <td align="center" width="6%" ${ $class_trabajo_equipo } nivel="Jefe de departamento" comp="trabajo_equipo"> ${ $jdep_t_trabajo_equipo }</td>
                            <td align="center" width="6%" ${ $class_comunicacion } nivel="Jefe de departamento" comp="comunicacion"> ${ $jdep_t_comunicacion }</td>
                            <td align="center" width="6%" ${ $class_actitud_servicio } nivel="Jefe de departamento" comp="actitud_servicio"> ${ $jdep_t_actitud_servicio }</td>
                            <td align="center" width="6%" ${ $class_orientacion_resultados } nivel="Jefe de departamento" comp="orientacion_resultados"> ${ $jdep_t_orientacion_resultados }</td>
                            <td align="center" width="6%" ${ $class_analisis_problemas } nivel="Jefe de departamento" comp="analisis_problemas"> ${ $jdep_t_analisis_problemas }</td>
                            <td align="center" width="6%" ${ $class_liderazgo } nivel="Jefe de departamento" comp="liderazgo"> ${ $jdep_t_liderazgo }</td>
                            <td align="center" width="6%" ${ $class_organizacion } nivel="Jefe de departamento" comp="organizacion"> ${ $jdep_t_organizacion }</td>                
                            <td align="center" width="6%" ${ $class_negociacion } nivel="Jefe de departamento" comp="negociacion"> ${ $jdep_t_negociacion }</td>
                            <td align="center" width="6%" ${ $class_toma_decisiones } nivel="Jefe de departamento" comp="toma_decisiones"> ${ $jdep_t_toma_decisiones }</td>
                            </tr>`;
                        $graphics = $("#grafica").clone().find("#container").attr("id", "container_normal").hide();
                        $('#contenido_resul').append($graphics);                
                        grafica_uno(['JEFE DE DEPARTAMENTO'], [graf_NORMAL['trabajo_equipo'], graf_NORMAL['comunicacion'], graf_NORMAL['actitud_servicio'], graf_NORMAL['orientacion_resultados'], graf_NORMAL['analisis_problemas'], graf_NORMAL['liderazgo'], graf_NORMAL['organizacion'], graf_NORMAL['negociacion'], graf_NORMAL['toma_decisiones']], competencias, $colores_competencias, "container_normal", $titulo);                                    
                    }   //<td align="center" width="6%" '.$class_personal_formar.'  nivel="Jefe de departamento" comp="personal_formar">'.$jdep_t_personal_formar.'</td>    
                    if(datos[KeyData].puesto_nivel == 'Enlace' && datos[KeyData].total_brechas){
                        graf_activa = "container_emergente";
                        $categories_Enlace = "'ENLACE',";                         
                        (graf_EMERGENTE['trabajo_equipo'] = $enl_t_trabajo_equipo = datos[KeyData].trabajo_equipo) ? $class_trabajo_equipo = 'class="td_detalles_brechaxnivel hand"' : $class_trabajo_equipo = '';
                        (graf_EMERGENTE['comunicacion'] = $enl_t_comunicacion = datos[KeyData].comunicacion) ? $class_comunicacion = 'class="td_detalles_brechaxnivel hand"' : $class_comunicacion = '';
                        (graf_EMERGENTE['actitud_servicio'] = $enl_t_actitud_servicio = datos[KeyData].actitud_servicio) ? $class_actitud_servicio = 'class="td_detalles_brechaxnivel hand"' : $class_actitud_servicio = '';
                        (graf_EMERGENTE['orientacion_resultados'] = $enl_t_orientacion_resultados = datos[KeyData].orientacion_resultados) ? $class_orientacion_resultados = 'class="td_detalles_brechaxnivel hand"' : $class_orientacion_resultados = '';
                        (graf_EMERGENTE['analisis_problemas'] = $enl_t_analisis_problemas = datos[KeyData].analisis_problemas) ? $class_analisis_problemas = 'class="td_detalles_brechaxnivel hand"' : $class_analisis_problemas = '';
                        (graf_EMERGENTE['liderazgo'] = $enl_t_liderazgo = datos[KeyData].liderazgo) ? $class_liderazgo = 'class="td_detalles_brechaxnivel hand"' : $class_liderazgo = '';
                        (graf_EMERGENTE['organizacion'] = $enl_t_organizacion = datos[KeyData].organizacion) ? $class_organizacion = 'class="td_detalles_brechaxnivel hand"' : $class_organizacion = '';
                        (graf_EMERGENTE['negociacion'] = $enl_t_negociacion = datos[KeyData].negociacion) ? $class_negociacion = 'class="td_detalles_brechaxnivel hand"' : $class_negociacion = '';
                        (graf_EMERGENTE['toma_decisiones'] = $enl_t_toma_decisiones = datos[KeyData].toma_decisiones) ? $class_toma_decisiones = 'class="td_detalles_brechaxnivel hand"' : $class_toma_decisiones = '';
                        ($enl_t_personal_formar = datos[KeyData].personal_formar) ? $class_personal_formar = 'class="td_detalles_brechaxnivel hand"' : $class_personal_formar = '';
                                    
                        $tr_enlace = `<tr class='tr_ENLACE'>
                            <td>
                                ENLACE
                                <div style="position:relative; float: right; padding-right:5px;" class="hover_rojo ver_grafica_chart" id="btn_container_emergente">
                                    <i class="fa fa-bar-chart hand" style="margin-left:20px"  aria-hidden="true"></i>
                                </div>
                            </td>
                            <td align="center" width="6%" ${ $class_trabajo_equipo } nivel="Enlace" comp="trabajo_equipo"> ${ $enl_t_trabajo_equipo }</td>
                            <td align="center" width="6%" ${ $class_comunicacion } nivel="Enlace" comp="comunicacion"> ${ $enl_t_comunicacion }</td>
                            <td align="center" width="6%" ${ $class_actitud_servicio } nivel="Enlace" comp="actitud_servicio"> ${ $enl_t_actitud_servicio }</td>
                            <td align="center" width="6%" ${ $class_orientacion_resultados } nivel="Enlace" comp="orientacion_resultados"> ${ $enl_t_orientacion_resultados }</td>
                            <td align="center" width="6%" ${ $class_analisis_problemas } nivel="Enlace" comp="analisis_problemas"> ${ $enl_t_analisis_problemas }</td>
                            <td align="center" width="6%" ${ $class_liderazgo } nivel="Enlace" comp="liderazgo"> ${ $enl_t_liderazgo }</td>
                            <td align="center" width="6%" ${ $class_organizacion } nivel="Enlace" comp="organizacion"> ${ $enl_t_organizacion }</td>               
                            <td align="center" width="6%" ${ $class_negociacion } nivel="Enlace" comp="negociacion"> ${ $enl_t_negociacion }</td>
                            <td align="center" width="6%" ${ $class_toma_decisiones } nivel="Enlace" comp="toma_decisiones"> ${ $enl_t_toma_decisiones }</td>
                            </tr>`;
                        $graphics = $("#grafica").clone().find("#container").attr("id", "container_emergente").hide();
                        $('#contenido_resul').append($graphics);                
                        grafica_uno(['ENLACE'], [graf_EMERGENTE['trabajo_equipo'], graf_EMERGENTE['comunicacion'], graf_EMERGENTE['actitud_servicio'], graf_EMERGENTE['orientacion_resultados'], graf_EMERGENTE['analisis_problemas'], graf_EMERGENTE['liderazgo'], graf_EMERGENTE['organizacion'], graf_EMERGENTE['negociacion'], graf_EMERGENTE['toma_decisiones']], competencias, $colores_competencias, "container_emergente", $titulo);                                    
                    } //<td align="center" width="6%" '.$class_personal_formar.'  nivel="Enlace" comp="personal_formar">'.$enl_t_personal_formar.'</td>
                    if(datos[KeyData].puesto_nivel == 'Operativo' && datos[KeyData].total_brechas){
                        graf_activa = "container_deficiente";
                        $categories_Operativo = "'OPERATIVO',"; 
                        (graf_DEFICIENTE['trabajo_equipo'] = $ope_t_trabajo_equipo = datos[KeyData].trabajo_equipo) ? $class_trabajo_equipo = 'class="td_detalles_brechaxnivel hand"' : $class_trabajo_equipo = '';
                        (graf_DEFICIENTE['comunicacion'] = $ope_t_comunicacion = datos[KeyData].comunicacion) ? $class_comunicacion = 'class="td_detalles_brechaxnivel hand"' : $class_comunicacion = '';
                        (graf_DEFICIENTE['actitud_servicio'] = $ope_t_actitud_servicio = datos[KeyData].actitud_servicio) ? $class_actitud_servicio = 'class="td_detalles_brechaxnivel hand"' : $class_actitud_servicio = '';
                        (graf_DEFICIENTE['orientacion_resultados'] = $ope_t_orientacion_resultados = datos[KeyData].orientacion_resultados) ? $class_orientacion_resultados = 'class="td_detalles_brechaxnivel hand"' : $class_orientacion_resultados = '';
                        (graf_DEFICIENTE['analisis_problemas'] = $ope_t_analisis_problemas = datos[KeyData].analisis_problemas) ? $class_analisis_problemas = 'class="td_detalles_brechaxnivel hand"' : $class_analisis_problemas = '';
                        (graf_DEFICIENTE['liderazgo'] = $ope_t_liderazgo = datos[KeyData].liderazgo) ? $class_liderazgo = 'class="td_detalles_brechaxnivel hand"' : $class_liderazgo = '';
                        (graf_DEFICIENTE['organizacion'] = $ope_t_organizacion = datos[KeyData].organizacion) ? $class_organizacion = 'class="td_detalles_brechaxnivel hand"' : $class_organizacion = '';
                        (graf_DEFICIENTE['negociacion'] = $ope_t_negociacion = datos[KeyData].negociacion) ? $class_negociacion = 'class="td_detalles_brechaxnivel hand"' : $class_negociacion = '';
                        (graf_DEFICIENTE['toma_decisiones'] = $ope_t_toma_decisiones = datos[KeyData].toma_decisiones) ? $class_toma_decisiones = 'class="td_detalles_brechaxnivel hand"' : $class_toma_decisiones = '';
                        ($ope_t_personal_formar = datos[KeyData].personal_formar) ? $class_personal_formar = 'class="td_detalles_brechaxnivel hand"' : $class_personal_formar = '';
                                    
                        $tr_operativo = `<tr class='tr_OPERATIVO'>
                            <td>
                                OPERATIVO
                                <div style="position:relative; float: right; padding-right:5px;" class="hover_rojo ver_grafica_chart" id="btn_container_deficiente">
                                    <i class="fa fa-bar-chart hand" style="margin-left:20px"  aria-hidden="true"></i>
                                </div>
                            </td>
                            <td align="center" width="6%" ${ $class_trabajo_equipo} nivel="Operativo" comp="trabajo_equipo"> ${ $ope_t_trabajo_equipo }</td>
                            <td align="center" width="6%" ${ $class_comunicacion} nivel="Operativo" comp="comunicacion"> ${ $ope_t_comunicacion }</td>
                            <td align="center" width="6%" ${ $class_actitud_servicio} nivel="Operativo" comp="actitud_servicio"> ${ $ope_t_actitud_servicio }</td>
                            <td align="center" width="6%" ${ $class_orientacion_resultados} nivel="Operativo" comp="orientacion_resultados"> ${ $ope_t_orientacion_resultados }</td>
                            <td align="center" width="6%" ${ $class_analisis_problemas} nivel="Operativo" comp="analisis_problemas"> ${ $ope_t_analisis_problemas }</td>
                            <td align="center" width="6%" ${ $class_liderazgo} nivel="Operativo" comp="liderazgo"> ${ $ope_t_liderazgo }</td>
                            <td align="center" width="6%" ${ $class_organizacion} nivel="Operativo" comp="organizacion"> ${ $ope_t_organizacion }</td>                
                            <td align="center" width="6%" ${ $class_negociacion} nivel="Operativo" comp="negociacion"> ${ $ope_t_negociacion }</td>
                            <td align="center" width="6%" ${ $class_toma_decisiones} nivel="Operativo" comp="toma_decisiones"> ${ $ope_t_toma_decisiones }</td>
                            </tr>`;
                        $graphics = $("#grafica").clone().find("#container").attr("id", "container_deficiente").hide();
                        $('#contenido_resul').append($graphics);                
                        grafica_uno(['OPERATIVO'], [graf_DEFICIENTE['trabajo_equipo'], graf_DEFICIENTE['comunicacion'], graf_DEFICIENTE['actitud_servicio'], graf_DEFICIENTE['orientacion_resultados'], graf_DEFICIENTE['analisis_problemas'], graf_DEFICIENTE['liderazgo'], graf_DEFICIENTE['organizacion'], graf_DEFICIENTE['negociacion'], graf_DEFICIENTE['toma_decisiones']], competencias, $colores_competencias, "container_deficiente", $titulo);                                    
                    }  
                }

                $trabajo_equipo_total = $admin_t_trabajo_equipo + $subadm_t_trabajo_equipo + $jdep_t_trabajo_equipo + $enl_t_trabajo_equipo + $ope_t_trabajo_equipo;
                $comunicacion_total = $admin_t_comunicacion + $subadm_t_comunicacion + $jdep_t_comunicacion + $enl_t_comunicacion + $ope_t_comunicacion;
                $actitud_servicio_total = $admin_t_actitud_servicio + $subadm_t_actitud_servicio + $jdep_t_actitud_servicio + $enl_t_actitud_servicio + $ope_t_actitud_servicio;
                $orientacion_resultados_total = $admin_t_orientacion_resultados + $subadm_t_orientacion_resultados + $jdep_t_orientacion_resultados + $enl_t_orientacion_resultados + $ope_t_orientacion_resultados;
                $analisis_problemas_total = $admin_t_analisis_problemas + $subadm_t_analisis_problemas + $jdep_t_analisis_problemas + $enl_t_analisis_problemas + $ope_t_analisis_problemas;
                $liderazgo_total = $admin_t_liderazgo + $subadm_t_liderazgo + $jdep_t_liderazgo + $enl_t_liderazgo + $ope_t_liderazgo;
                $organizacion_total = $admin_t_organizacion + $subadm_t_organizacion + $jdep_t_organizacion + $enl_t_organizacion + $ope_t_organizacion;
                $toma_decisiones_total = $admin_t_toma_decisiones + $subadm_t_toma_decisiones + $jdep_t_toma_decisiones + $enl_t_toma_decisiones + $ope_t_toma_decisiones;
                $negociacion_total = $admin_t_negociacion + $subadm_t_negociacion + $jdep_t_negociacion + $enl_t_negociacion + $ope_t_negociacion;
                $personal_formar_total = $admin_t_personal_formar + $subadm_t_personal_formar + $jdep_t_personal_formar + $enl_t_personal_formar + $ope_t_personal_formar;

                $tabla = `<center><h2>PERSONAL CON BRECHAS NEGATIVAS POR NIVEL JERARQUICO</h2></center>
                <table border="0" width="95%" class=" table table-condensed" style="padding:0px;" id="tbl_xniveles">
                        <tr class='table_top_brecha'>
                            <th style="text-align:center" id='th_ambito' width='11%'>NIVEL</th>
                            <th style="text-align:center">TRABAJO EN EQUIPO</th>
                            <th style="text-align:center">COMUNICACION</th>
                            <th style="text-align:center">ACTITUD DE SERVICIO</th>
                            <th style="text-align:center">ORIENTACION A RESULTADOS</th>
                            <th style="text-align:center">ANALISIS DE PROBLEMAS</th>
                            <th style="text-align:center">LIDERAZGO</th>
                            <th style="text-align:center">ORGANIZACION</th>               
                            <th style="text-align:center">NEGOCIACION</th>
                            <th style="text-align:center">TOMA DE DECISIONES</th>
                            <!--<th>PERSONAL A FORMAR</th>-->
                        </tr>
                        <tbody>
                            ${ $tr_administrador }
                            ${ $tr_subadministrador }
                            ${ $tr_jdepto }
                            ${ $tr_enlace }
                            ${ $tr_operativo }
                            <tr class='table_top' align='center'>
                                <td>TOTAL</td>
                                <td class='negritas'> ${$trabajo_equipo_total} </td>
                                <td class='negritas'> ${$comunicacion_total} </td>
                                <td class='negritas'> ${$actitud_servicio_total} </td> 
                                <td class='negritas'> ${$orientacion_resultados_total} </td>
                                <td class='negritas'> ${$analisis_problemas_total} </td>
                                <td class='negritas'> ${$liderazgo_total} </td>
                                <td class='negritas'> ${$organizacion_total} </td>
                                <td class='negritas'> ${$negociacion_total} </td>
                                <td class='negritas'> ${$toma_decisiones_total} </td> 
                            </tr>                   
                        </tbody>
                </table>`;
 
                $("#contenido_resul").show().prepend($tabla)  
                //Agregar el evento a cada celda para el popup de los usuarios 
                $("#tbl_xniveles").find(".td_detalles_brechaxnivel").attr({
                    btn: "brechaxnivel",
                    usr_ag: "'"+obj.g_ags+"'",                      
                    perfil_final: 'perfil_final',
                    puesto_nivel: datos[KeyData].puesto_nivel.toUpperCase(),
                    ambito: obj.g_nivel.toUpperCase(),
                    descripcion_unidad: obj.g_unidades_permisos,  
                    id_ag: "id_ag",
                    id_ag_4 : "id_ag_4",
                    vista: "vista",
                    g_nivel: obj.g_nivel,
                    "data-toggle": "modal",
                    "data-target": "#detalles_usr",
                    "data-whatever": datos[KeyData].puesto_nivel
                }).addClass('td_detalles_central hand');
          
 
                // Encontrar en la tabla la primer coincidencia con la clase 'td_detalles_brechaxnivel' 
                // y realizar un clic a la clase para mostrar la grafica
                $("#tbl_xniveles tbody tr").find(".td_detalles_brechaxnivel").each(function() {
                     $(this).parent().find('.ver_grafica_chart').click();
                     return false;
                });
 
                $(".btn_menu").removeClass('btn_activo');
                $("#btn_brechasxnivel").addClass('btn_activo');
                $("#contenido_resul").animate({opacity:1},'fast');
                $("#ajax_respuesta").empty();
                $('.btn_menu').bind('click',$btn_click);

             },
             timeout:90000,
             error: function(){                     
                    $("#ajax_respuesta").html('Problemas con el servidor intente de nuevo.');
                }      
            });         
        } 

        if(this.id == 'btn_brechasxadmin'){
            //$txt_ambito = $('#txt_nivel').val();
            //$('#contenido_resul').css({'height':'0%'});
            //$('#contenido_resul').animate({left:0}, {duration: 'slow', easing: 'easeOutBack'});
            //alert($txt_ambito)
            $.ajax({
             type: "GET",
             contentType: "application/x-www-form-urlencoded", 
             url: "resultados_x_brechasxUA",
             data: "tipo_busqueda=btn_vs&usr_ag="+$usr_ag,
             beforeSend:function(){ $("#ajax_respuesta").html($load); },     
             success: function(datos){

                var datos = jQuery.parseJSON(datos); 

                $tabla = `<center><h2>PERSONAL CON BRECHAS NEGATIVAS POR UNIDAD ADMINISTRATIVA</h2></center>
                <table border="0" width="95%" class=" table table-condensed" style="padding:0px;" id="tbl_xniveles">
                        <tr class='table_top_brecha'>
                            <th style="text-align:center" id='th_ambito' width='11%'>UA</th>
                            <th style="text-align:center">TRABAJO EN EQUIPO</th>
                            <th style="text-align:center">COMUNICACION</th>
                            <th style="text-align:center">ACTITUD DE SERVICIO</th>
                            <th style="text-align:center">ORIENTACION A RESULTADOS</th>
                            <th style="text-align:center">ANALISIS DE PROBLEMAS</th>
                            <th style="text-align:center">LIDERAZGO</th>
                            <th style="text-align:center">ORGANIZACION</th>               
                            <th style="text-align:center">NEGOCIACION</th>
                            <th style="text-align:center">TOMA DE DECISIONES</th>
                            <!--<th>PERSONAL A FORMAR</th>-->
                        </tr>`; 

                reset_matriz_graf_competencias();    // iguala a 0 las matrices de los valores 
                graf_activa = "";

                $class_trabajo_equipo = "";
                for(var KeyData  in datos) { 
                        $descripion_ag = (datos[KeyData].descripcion_unidad) ? datos[KeyData].descripcion_unidad : datos[KeyData].unidad_negocio;
                        (graf_DEFICIENTE['trabajo_equipo'] = $ope_t_trabajo_equipo = datos[KeyData].trabajo_equipo) ? $class_trabajo_equipo = 'class="td_detalles_brechaxnivel hand"' : $class_trabajo_equipo = '';
                        (graf_DEFICIENTE['comunicacion'] = $ope_t_comunicacion = datos[KeyData].comunicacion) ? $class_comunicacion = 'class="td_detalles_brechaxnivel hand"' : $class_comunicacion = '';
                        (graf_DEFICIENTE['actitud_servicio'] = $ope_t_actitud_servicio = datos[KeyData].actitud_servicio) ? $class_actitud_servicio = 'class="td_detalles_brechaxnivel hand"' : $class_actitud_servicio = '';
                        (graf_DEFICIENTE['orientacion_resultados'] = $ope_t_orientacion_resultados = datos[KeyData].orientacion_resultados) ? $class_orientacion_resultados = 'class="td_detalles_brechaxnivel hand"' : $class_orientacion_resultados = '';
                        (graf_DEFICIENTE['analisis_problemas'] = $ope_t_analisis_problemas = datos[KeyData].analisis_problemas) ? $class_analisis_problemas = 'class="td_detalles_brechaxnivel hand"' : $class_analisis_problemas = '';
                        (graf_DEFICIENTE['liderazgo'] = $ope_t_liderazgo = datos[KeyData].liderazgo) ? $class_liderazgo = 'class="td_detalles_brechaxnivel hand"' : $class_liderazgo = '';
                        (graf_DEFICIENTE['organizacion'] = $ope_t_organizacion = datos[KeyData].organizacion) ? $class_organizacion = 'class="td_detalles_brechaxnivel hand"' : $class_organizacion = '';
                        (graf_DEFICIENTE['negociacion'] = $ope_t_negociacion = datos[KeyData].negociacion) ? $class_negociacion = 'class="td_detalles_brechaxnivel hand"' : $class_negociacion = '';
                        (graf_DEFICIENTE['toma_decisiones'] = $ope_t_toma_decisiones = datos[KeyData].toma_decisiones) ? $class_toma_decisiones = 'class="td_detalles_brechaxnivel hand"' : $class_toma_decisiones = '';                    
                    $tabla += `<tr>
                            <td>
                                ${ $descripion_ag } 
                            </td>
                            <td align="center" width="6%" ${ $class_trabajo_equipo} nivel="Operativo" comp="trabajo_equipo"> ${ datos[KeyData].trabajo_equipo }</td>
                            <td align="center" width="6%" ${ $class_comunicacion} nivel="Operativo" comp="comunicacion"> ${ datos[KeyData].comunicacion }</td>
                            <td align="center" width="6%" ${ $class_actitud_servicio} nivel="Operativo" comp="actitud_servicio"> ${ datos[KeyData].actitud_servicio }</td>
                            <td align="center" width="6%" ${ $class_orientacion_resultados} nivel="Operativo" comp="orientacion_resultados"> ${ datos[KeyData].orientacion_resultados }</td>
                            <td align="center" width="6%" ${ $class_analisis_problemas} nivel="Operativo" comp="analisis_problemas"> ${ datos[KeyData].analisis_problemas }</td>
                            <td align="center" width="6%" ${ $class_liderazgo} nivel="Operativo" comp="liderazgo"> ${ datos[KeyData].liderazgo }</td>
                            <td align="center" width="6%" ${ $class_organizacion} nivel="Operativo" comp="organizacion"> ${ datos[KeyData].organizacion }</td>                
                            <td align="center" width="6%" ${ $class_negociacion} nivel="Operativo" comp="negociacion"> ${ datos[KeyData].negociacion }</td>
                            <td align="center" width="6%" ${ $class_toma_decisiones} nivel="Operativo" comp="toma_decisiones"> ${ datos[KeyData].toma_decisiones }</td>
                            </tr>`;                    

                }


                $(".btn_menu").removeClass('btn_activo');
                $("#btn_brechasxadmin").addClass('btn_activo');
                $("#contenido_resul").show().append($tabla);
                $("#contenido_resul").animate({opacity:1},'fast');

                $graphics = $("#grafica").clone().find("#container").attr("id", "container_deficiente");
                $('#contenido_resul').append($graphics);                
                grafica_uno([$descripion_ag], [graf_DEFICIENTE['trabajo_equipo'], graf_DEFICIENTE['comunicacion'], graf_DEFICIENTE['actitud_servicio'], graf_DEFICIENTE['orientacion_resultados'], graf_DEFICIENTE['analisis_problemas'], graf_DEFICIENTE['liderazgo'], graf_DEFICIENTE['organizacion'], graf_DEFICIENTE['negociacion'], graf_DEFICIENTE['toma_decisiones']], competencias, $colores_competencias, "container_deficiente");
                
                //Agregar el evento a cada celda para el popup de los usuarios 
                $("#tbl_xniveles").find(".td_detalles_brechaxnivel").attr({
                    btn: "brechasxadmin",
                    usr_ag: "'"+obj.g_ags+"'",                      
                    perfil_final: 'perfil_final',
                    puesto_nivel: datos[KeyData].unidad_negocio.toUpperCase(),
                    ambito: obj.g_nivel.toUpperCase(),
                    descripcion_unidad: obj.g_unidades_permisos,  
                    id_ag: "id_ag",
                    id_ag_4 : "id_ag_4",
                    vista: "vista",
                    g_nivel: obj.g_nivel,
                    "data-toggle": "modal",
                    "data-target": "#detalles_usr",
                    "data-whatever": datos[KeyData].unidad_negocio
                }).addClass('td_detalles_central hand');

                $("#ajax_respuesta").empty();
                $('.btn_menu').bind('click',$btn_click);                
             },
             timeout:90000,
             error: function(){                     
                    $("#ajax_respuesta").html('Problemas con el servidor intente de nuevo.');
                }      
            });
        } 

        if(this.id == 'btn_brechasxpers'){
            //$txt_ambito = $('#txt_nivel').val();
            //$('#contenido_resul').css({'height':'0%'});
            //$('#contenido_resul').animate({left:0}, {duration: 'slow', easing: 'easeOutBack'});
            //alert($txt_ambito)
            $.ajax({
             type: "GET",
             contentType: "application/x-www-form-urlencoded", 
             url: "resultados_x_brechasxpers",
             data: "tipo_busqueda=btn_vs&usr_ag="+$usr_ag,
             beforeSend:function(){ $("#ajax_respuesta").html($load); },     
             success: function(datos){  
                var datos = jQuery.parseJSON(datos);
                $tabla = `<center><h2>PERSONAL CON BRECHAS NEGATIVAS POR UNIDAD ADMINISTRATIVA</h2></center>
                <table border="0" width="95%" class=" table table-condensed" style="padding:0px;" id="tbl_xniveles">
                        <tr class='table_top_brecha'>
                            <th style="text-align:center" id='th_ambito' width='11%'>Unidad</th>
                            <th style="text-align:center">BRECHAS(1)</th>
                            <th style="text-align:center">BRECHAS(2)</th>
                            <th style="text-align:center">BRECHAS(3)</th>
                            <th style="text-align:center">BRECHAS(4)</th>
                            <th style="text-align:center">BRECHAS(5)</th>
                            <th style="text-align:center">BRECHAS(6)</th>
                            <th style="text-align:center">BRECHAS(7)</th>               
                            <th style="text-align:center">BRECHAS(8)</th>
                            <th style="text-align:center">BRECHAS(9)</th>
                            <!--<th>PERSONAL A FORMAR</th>-->
                        </tr>`; 

                brechas_etiqueta = ['BRECHAS(1)','BRECHAS(2)','BRECHAS(3)','BRECHAS(4)','BRECHAS(5)','BRECHAS(6)','BRECHAS(7)','BRECHAS(8)','BRECHAS(9)'];
                reset_matriz_graf_competencias();    // iguala a 0 las matrices de los valores 
                graf_activa = "";

                $class_trabajo_equipo = "";
                for(var KeyData  in datos) { 
                        $descripion_ag = (datos[KeyData].descripcion_unidad) ? datos[KeyData].descripcion_unidad : datos[KeyData].unidad_negocio;
                        (graf_DEFICIENTE['trabajo_equipo'] = $ope_t_trabajo_equipo = datos[KeyData].trabajo_equipo) ? $class_trabajo_equipo = 'class="td_detalles_brechaxnivel hand"' : $class_trabajo_equipo = '';
                        (graf_DEFICIENTE['comunicacion'] = $ope_t_comunicacion = datos[KeyData].comunicacion) ? $class_comunicacion = 'class="td_detalles_brechaxnivel hand"' : $class_comunicacion = '';
                        (graf_DEFICIENTE['actitud_servicio'] = $ope_t_actitud_servicio = datos[KeyData].actitud_servicio) ? $class_actitud_servicio = 'class="td_detalles_brechaxnivel hand"' : $class_actitud_servicio = '';
                        (graf_DEFICIENTE['orientacion_resultados'] = $ope_t_orientacion_resultados = datos[KeyData].orientacion_resultados) ? $class_orientacion_resultados = 'class="td_detalles_brechaxnivel hand"' : $class_orientacion_resultados = '';
                        (graf_DEFICIENTE['analisis_problemas'] = $ope_t_analisis_problemas = datos[KeyData].analisis_problemas) ? $class_analisis_problemas = 'class="td_detalles_brechaxnivel hand"' : $class_analisis_problemas = '';
                        (graf_DEFICIENTE['liderazgo'] = $ope_t_liderazgo = datos[KeyData].liderazgo) ? $class_liderazgo = 'class="td_detalles_brechaxnivel hand"' : $class_liderazgo = '';
                        (graf_DEFICIENTE['organizacion'] = $ope_t_organizacion = datos[KeyData].organizacion) ? $class_organizacion = 'class="td_detalles_brechaxnivel hand"' : $class_organizacion = '';
                        (graf_DEFICIENTE['negociacion'] = $ope_t_negociacion = datos[KeyData].negociacion) ? $class_negociacion = 'class="td_detalles_brechaxnivel hand"' : $class_negociacion = '';
                        (graf_DEFICIENTE['toma_decisiones'] = $ope_t_toma_decisiones = datos[KeyData].toma_decisiones) ? $class_toma_decisiones = 'class="td_detalles_brechaxnivel hand"' : $class_toma_decisiones = '';                    
                    $tabla += `<tr>
                            <td>
                                ${ datos[KeyData].ag } 
                            </td>
                            <td align="center" width="6%" ${ $class_trabajo_equipo} brecha="1"> ${ datos[KeyData].trabajo_equipo }</td>
                            <td align="center" width="6%" ${ $class_comunicacion} brecha="2"> ${ datos[KeyData].comunicacion }</td>
                            <td align="center" width="6%" ${ $class_actitud_servicio} brecha="3"> ${ datos[KeyData].actitud_servicio }</td>
                            <td align="center" width="6%" ${ $class_orientacion_resultados} brecha="4"> ${ datos[KeyData].orientacion_resultados }</td>
                            <td align="center" width="6%" ${ $class_analisis_problemas} brecha="5"> ${ datos[KeyData].analisis_problemas }</td>
                            <td align="center" width="6%" ${ $class_liderazgo} brecha="6"> ${ datos[KeyData].liderazgo }</td>
                            <td align="center" width="6%" ${ $class_organizacion} brecha="7"> ${ datos[KeyData].organizacion }</td>                
                            <td align="center" width="6%" ${ $class_negociacion} brecha="8"> ${ datos[KeyData].negociacion }</td>
                            <td align="center" width="6%" ${ $class_toma_decisiones} brecha="9"> ${ datos[KeyData].toma_decisiones }</td>
                            </tr>`;                    

                }


                $(".btn_menu").removeClass('btn_activo');
                $("#btn_brechasxpers").addClass('btn_activo');
                $("#contenido_resul").show().append($tabla);
                $("#contenido_resul").animate({opacity:1},'fast');

                $graphics = $("#grafica").clone().find("#container").attr("id", "container_deficiente");
                $('#contenido_resul').append($graphics);                
                grafica_uno([$usr_ag], [graf_DEFICIENTE['trabajo_equipo'], graf_DEFICIENTE['comunicacion'], graf_DEFICIENTE['actitud_servicio'], graf_DEFICIENTE['orientacion_resultados'], graf_DEFICIENTE['analisis_problemas'], graf_DEFICIENTE['liderazgo'], graf_DEFICIENTE['organizacion'], graf_DEFICIENTE['negociacion'], graf_DEFICIENTE['toma_decisiones']], brechas_etiqueta, $colores_competencias, "container_deficiente");
                
                //Agregar el evento a cada celda para el popup de los usuarios 
                $("#tbl_xniveles").find(".td_detalles_brechaxnivel").attr({
                    btn: "brechasxpers",
                    usr_ag: "'"+obj.g_ags+"'",                      
                    perfil_final: 'perfil_final',
                    puesto_nivel: $usr_ag.toUpperCase(),
                    ambito: obj.g_nivel.toUpperCase(),
                    descripcion_unidad: obj.g_unidades_permisos,  
                    id_ag: "id_ag",
                    id_ag_4 : "id_ag_4",
                    vista: "vista",
                    g_nivel: obj.g_nivel,
                    "data-toggle": "modal",
                    "data-target": "#detalles_usr",
                    "data-whatever": $usr_ag
                }).addClass('td_detalles_central hand');

                $("#ajax_respuesta").empty();
                $('.btn_menu').bind('click',$btn_click);  

             },
             timeout:90000,
             error: function(){                     
                    $("#ajax_respuesta").html('Problemas con el servidor intente de nuevo.');
                }      
            }); 
        }

        if(this.id == 'btn_individual'){ 

            $(".btn_menu").removeClass('btn_activo');
            $("#btn_individual").addClass('btn_activo');
            $("#contenido_resul").show();                
            $("#cont_ficha").show().appendTo($("#contenido_resul"));            
            $("#contenido_resul").animate({opacity:1},'fast');
  
            $("#ajax_respuesta").empty();
            $('.btn_menu').bind('click',$btn_click);
    

            return;
 
        }                       
        
    }




    $('.btn_menu').click($btn_click);


    
    // Agregar evento al dar clic en Central o Local para desglosar sus Unidades Administrativas.
    $("body").on('click', '#td_central_detalles, #td_local_detalles', function(event) {        
        estado = $(this).attr('estado');        
        if(estado == 'minimizado'){ 
            $(this).attr('estado','maximizado');
            ambito = $(this).attr('ambito');
            tr = $(this).attr('table');
            td = $(this).attr('td');

            $etiqueta = ambito;
            if($etiqueta == 'LOCAL')
                $etiqueta = 'DESCONCENTRADA';

            $usr_ag = $('#txt_ag').val();
            $("#"+td).html("<strong><span class='glyphicon glyphicon-minus' aria-hidden='true'></span>"+$etiqueta+'</strong>');
            if($("#table_central_detalles").find('table').length > 0 && ambito == 'CENTRAL'){                
                $("#"+tr).parent().show();
                $("#th_ambito").attr('width','45%');
                $("#"+tr).fadeIn('slow');
                $("#ajax_respuesta").empty();    
                //alert('central')
                return;            
            }
            
            if($("#table_local_detalles").find('table').length > 0 && ambito == 'LOCAL'){                
                $("#"+tr).parent().show();
                $("#th_ambito").attr('width','45%');
                $("#"+tr).fadeIn('slow');
                $("#ajax_respuesta").empty();    
                return;            
            }            
            //alert("ambito: "+ambito+" usr_ag: "+$usr_ag)
            $.ajax({
             type: "GET",
             contentType: "application/x-www-form-urlencoded", 
             url: "resultados_eidd_detalles/",
             data: "tipo_busqueda=x_unidad&ambito="+ambito+"&usr_ag="+$usr_ag, 
             success: function(datos){ 
                //alert(datos)
                var datos = jQuery.parseJSON(datos);
                $("#"+tr).parent().show();
                $("#th_ambito").attr('width','45%');
                //$("#"+tr).html(datos);
                $("#"+tr).fadeIn('slow');
                $("#ajax_respuesta").empty();


                td_ancho = '8%';
                $deficiente = '<td width="'+td_ancho+'" align="center" class="td_deficiente_total">0</td>';
                $emergente = '<td width="'+td_ancho+'" align="center" class="td_emergente_total">0</td>';
                $normal = '<td width="'+td_ancho+'" align="center" class="td_normal_total">0</td>';
                $alto = '<td width="'+td_ancho+'" align="center" class="td_alto_total">0</td>';
                $superior = '<td width="'+td_ancho+'" align="center" class="td_superior_total">0</td>';
             
                //return;
                id_ag_4 = '';
                cont = 0;
                $total_Central = 0;
                $("#table_central_detalles").empty();
                for(var myKey in datos) {
                    //alert("ambito:"+ datos[myKey].ambito)
                    if(datos[myKey].ambito == "CENTRAL"){ //if(obj.g_nivel == "Central"){  
                        //$("#contenido_resul").show().append('<br>'+datos[myKey].total+"-"+datos[myKey].perfil_final+"-"+datos[myKey].ambito+"-"+datos[myKey].id_ag_4);
                        //$("#contenido_resul").show();  
                        if(obj.g_nivel == "Central" || obj.g_nivel == "General")
                            $nombre_central_admin = datos[myKey].descripcion_unidad;
                        if(obj.g_nivel == "Admin")
                            $nombre_central_admin = datos[myKey].descripcion_unidad_admin;                            
                        $txt_line = 't_underline';
                        $td_central_nombre =  "<td width='45%' estado='minimizado' class='hand "+$txt_line+" td_detalles_admin' "+ 
                        "descripcion_unidad='"+datos[myKey].descripcion_unidad+"' "+
                        "ambito='"+datos[myKey].ambito+"' "+
                        "id_central='"+datos[myKey].id_ag_4+"'>"+$nombre_central_admin+"</td>";
                    
                        if(id_ag_4 != datos[myKey].id_ag_4){ 
                            $total_Central = 0; // almacena la suma de la Central
                            key_unidad = datos[myKey].id_ag_4;
                            $("#table_central_detalles").append('<table class="" border="0" width="100%" style="margin-left: -6px;"><tbody class="tbody_'+key_unidad+'"><tr class="tr_detalles" id="tr_central_'+key_unidad+'" ></tr></tbody></table>');                                
                            $tr_central = $td_central_nombre+$deficiente+$emergente+$normal+$alto+$superior+'<td width="7.9%" align="center" class="td_niveles_total"></td>';                                   
                            $("#table_central_detalles").find('#tr_central_'+key_unidad).append($tr_central);
                            // almacenar un TR que contendra una tabla con las Unidades Administrativas 
                            $tr_admin_detalle = "<tr style='display:none;' class='detalles_central'> "+
                                                    "<td id='"+datos[myKey].id_ag_4+"' colspan='10'></td> "+
                                                "</tr>";
                            // Agregar el TR debajo de la Fila de cada Central                           
                            $("#table_central_detalles").find('.tbody_'+key_unidad).append($tr_admin_detalle);                                             
                        }
                        id_ag_4 = datos[myKey].id_ag_4;
                        $total_Central = $total_Central + datos[myKey].total;
                        //alert("detalles de las Admin "+$usr_ag+": "+key_unidad+": "+datos[myKey])
                        if(obj.g_nivel == "Central" || obj.g_nivel == "Central_Local" || obj.g_nivel == "General")
                            x_unidad_totales_central($usr_ag, key_unidad, datos, myKey, 'uni_central');
                        if(obj.g_nivel == "Admin")
                            x_unidad_totales_central($usr_ag, key_unidad, datos, myKey, 'uni_admin');                       

                        $("#table_central_detalles").find('#tr_central_'+key_unidad).children('.td_niveles_total').text($total_Central)
                    }

                    if(datos[myKey].ambito == "LOCAL"){ //if(obj.g_nivel == "Central"){  
                        //$("#contenido_resul").show().append('<br>'+datos[myKey].total+"-"+datos[myKey].perfil_final+"-"+datos[myKey].ambito+"-"+datos[myKey].id_ag_4);
                        //$("#contenido_resul").show();    

                        $txt_line = 't_underline';
                        $td_local_nombre =  "<td width='45%' class=' "+$txt_line+" td_detalles_admin' "+ 
                        "descripcion_unidad='"+datos[myKey].descripcion_unidad+"' "+
                        "ambito='"+datos[myKey].ambito+"' "+
                        "id_central='"+datos[myKey].id_ag_4+"'>"+datos[myKey].descripcion_unidad+"</td>";
                    
                        if(id_ag_4 != datos[myKey].id_ag_4){ 

                            $total_Local = 0; // almacena la suma de la Central
                            key_unidad = datos[myKey].id_ag_4;
                            $("#table_local_detalles").append('<table class="" border="0" width="100%" style="margin-left: -6px;"><tbody class="tbody_'+key_unidad+'"><tr class="tr_detalles" id="tr_central_'+key_unidad+'" ></tr></tbody></table>');                                
                            $tr_local = $td_local_nombre+$deficiente+$emergente+$normal+$alto+$superior+'<td width="7.9%" align="center" class="td_niveles_total"></td>';                                   
                            $("#table_local_detalles").find('#tr_central_'+key_unidad).append($tr_local);
                            // almacenar un TR que contendra una tabla con las Unidades Administrativas 
                            $tr_admin_detalle = "<tr style='display:none;' class='detalles_central'> "+
                                                    "<td id='"+datos[myKey].id_ag_4+"' colspan='10'></td> "+
                                                "</tr>";
                            // Agregar el TR debajo de la Fila de cada Central                           
                             $("#table_local_detalles").find('.tbody_'+key_unidad).append($tr_admin_detalle);                                             
                        }
                        //alert("Local"+obj.g_nivel) 
                        id_ag_4 = datos[myKey].id_ag_4;
                        $total_Local = $total_Local + datos[myKey].total;
                        //alert("detalles de las Admin "+$usr_ag+": "+key_unidad+": "+datos[myKey]+" g_nivel: "+obj.g_nivel)
                        if(obj.g_nivel == "Central_Local" || obj.g_nivel == "General")
                            x_unidad_totales_local($usr_ag, key_unidad, datos, myKey, 'uni_central');     //uni_central_local                    
                        if(obj.g_nivel == "Local"){
                              
                            x_unidad_totales_local($usr_ag, key_unidad, datos, myKey, 'uni_central');     //uni_central_local 
                        }
                        $("#table_local_detalles").find('#tr_central_'+key_unidad).children('.td_niveles_total').text($total_Local)
                    }                    
 
                }                
             },
             timeout:90000,
             error: function(){                     
                    $("#ajax_respuesta").html('Problemas con el servidor intente de nuevo.');
                }      
            });

        }
        if(estado == 'maximizado'){ 
            $(this).attr('estado','minimizado');
            $("#"+td).html("<strong><span class='glyphicon glyphicon-plus' aria-hidden='true'></span>"+$etiqueta+'</strong>');
            $("#"+tr).parent().hide();
        } 
    });
  


    // Desglosar Las Unidades Administrativas de la Central
    //$(".td_detalles_admin").toggle(      
    $("body").on('click', '.td_detalles_admin', function(event) {
        console.log("td_detalles_admin "+ JSON.stringify(obj) )    
        if(obj.nivel == "Admin" || obj.nivel == "Local")    return;             
        estado = $(this).attr('estado'); 
        //$(this).parent().parent().parent().siblings().css( {"opacity": "1","filter": "alpha(opacity=100)"} ); 
        $(this).parent().parent().parent().css( {"opacity": "1","filter": "alpha(opacity=100)", "font-weight":"normal"} );    
        if(estado == 'minimizado'){    
            $(".td_detalles_admin").attr('estado','minimizado');
            $(this).attr('estado','maximizado');    
            $(this).parent().parent().parent().siblings().css( {"opacity": "0.4","filter": "alpha(opacity=40)", "font-weight":"normal"} );      
            $id_central = $(this).attr("id_central");
            $clave_central = $("#"+$id_central).attr("id");
            $ambito = $(this).attr("ambito");
            //alert('id_central: '+$id_central+' | '+$clave_central+' | '+$ambito); //return;
            if($ambito == 'LOCAL')
                return;
            //$ambito = "Central";
            $usr_ag = $('#txt_ag').val();
            //$("#ajax_respuesta").html($load);

            if($("#"+$id_central).find('table').length > 0){   
                $(this).attr('estado','maximizado');        
                $(".detalles_central").hide();
                $("#"+$id_central).parent().fadeIn(); //slideDown
                $("#ajax_respuesta").empty(); 
                return;            
            }            
            //alert($ambito)
            $.ajax({
             type: "GET",
             contentType: "application/x-www-form-urlencoded", 
             url: "resultados_eidd_detalles_admin/",
             data: "tipo_busqueda=x_unidad_admin&ambito="+$ambito+"&usr_ag="+$usr_ag+"&clave_admin="+$clave_central+"&vista=central",  
             success: function(datos){ 
                //$("#"+$id_central).html(datos);
                var datos = jQuery.parseJSON(datos);
                $(".detalles_central").hide();
                $("#"+$id_central).parent().fadeIn();
                $("#ajax_respuesta").empty();
                $("#"+$id_central).empty();
                //$("#th_ambito").attr('width','45%');
                
                //$("#"+tr).fadeIn('slow');

                td_ancho = '8%';
                $deficiente = '<td width="'+td_ancho+'" align="center" class="td_deficiente_total">0</td>';
                $emergente = '<td width="'+td_ancho+'" align="center" class="td_emergente_total">0</td>';
                $normal = '<td width="'+td_ancho+'" align="center" class="td_normal_total">0</td>';
                $alto = '<td width="'+td_ancho+'" align="center" class="td_alto_total">0</td>';
                $superior = '<td width="'+td_ancho+'" align="center" class="td_superior_total">0</td>';
             
                //return;
                descripcion_unidad_admin = '';
                cont = 0;
                $total_Central = 0;
                //$("#tabrle_central_detalles").empty();
                for(var myKey in datos) {

                    if(descripcion_unidad_admin != datos[myKey].descripcion_unidad_admin){
                        //alert(id_ag + " | " + datos[myKey].id_ag)
                        $total_Central = 0; // almacena la suma de la Central
                        key_unidad = datos[myKey].id_ag; 
                        $td_admin_nombre =  "<td width='45%' estado='minimizado' class=' ' ><font color='#0033CC'><i class='fa fa-level-up fa-rotate-90 fa-2x' aria-hidden='true'></i> "+datos[myKey].descripcion_unidad_admin+"</font></td>";

                        $("#"+$id_central).append('<table class="f_admin" border="0" width="100%" style="margin-left: 0px;"><tbody><tr id="tr_admin_'+key_unidad+'"></tr></tbody></table>');                                
                        $tr_central = $td_admin_nombre+$deficiente+$emergente+$normal+$alto+$superior+'<td width="7.9%" align="center" class="td_niveles_total"></td>';                                   
                        $("#"+$id_central).find('#tr_admin_'+key_unidad).append($tr_central);

                    }
                    descripcion_unidad_admin = datos[myKey].descripcion_unidad_admin;
                    $total_Central = $total_Central + datos[myKey].total;

                    switch(datos[myKey].perfil_final) {
                        case "Deficiente":
                            $("#"+$id_central).find('#tr_admin_'+key_unidad).children('.td_deficiente_total').text(datos[myKey].total)
                            $("#"+$id_central).find('#tr_admin_'+key_unidad).children('.td_deficiente_total').attr({
                                btn: "xunidad",
                                usr_ag: $usr_ag,
                                id_ag: datos[myKey].id_ag,
                                id_ag_4: datos[myKey].id_ag_4,
                                vista: 'uni_admin', 
                                perfil_final: datos[myKey].perfil_final,
                                ambito: datos[myKey].ambito,
                                descripcion_unidad: datos[myKey].descripcion_unidad,
                                    "data-toggle": "modal",
                                    "data-target": "#detalles_usr",
                                    "data-whatever": "Usuarios en Deficiente"                                   
                            }).addClass('td_detalles_central hand');                                     
                            break;
                        case "Emergente":
                            $("#"+$id_central).find('#tr_admin_'+key_unidad).children('.td_emergente_total').text(datos[myKey].total)
                            $("#"+$id_central).find('#tr_admin_'+key_unidad).children('.td_emergente_total').attr({
                                btn: "xunidad",
                                usr_ag: $usr_ag,
                                id_ag: datos[myKey].id_ag,
                                id_ag_4: datos[myKey].id_ag_4,
                                vista: 'uni_admin', 
                                perfil_final: datos[myKey].perfil_final,
                                ambito: datos[myKey].ambito,
                                descripcion_unidad: datos[myKey].descripcion_unidad,
                                    "data-toggle": "modal",
                                    "data-target": "#detalles_usr",
                                    "data-whatever": "Usuarios en Emergente"                                 
                            }).addClass('td_detalles_central hand');                                     
                            break;                                                            
                        case "Normal": 
                            $("#"+$id_central).find('#tr_admin_'+key_unidad).children('.td_normal_total').text(datos[myKey].total)                                  
                            $("#"+$id_central).find('#tr_admin_'+key_unidad).children('.td_normal_total').attr({
                                btn: "xunidad",
                                usr_ag: $usr_ag,
                                id_ag: datos[myKey].id_ag,
                                id_ag_4: datos[myKey].id_ag_4,
                                vista: 'uni_admin', 
                                perfil_final: datos[myKey].perfil_final,
                                ambito: datos[myKey].ambito,
                                descripcion_unidad: datos[myKey].descripcion_unidad,
                                    "data-toggle": "modal",
                                    "data-target": "#detalles_usr",
                                    "data-whatever": "Usuarios en Normal"                                   
                            }).addClass('td_detalles_central hand');                                     
                            break;                            
                        case "Alto":
                            $("#"+$id_central).find('#tr_admin_'+key_unidad).children('.td_alto_total').text(datos[myKey].total)
                            $("#"+$id_central).find('#tr_admin_'+key_unidad).children('.td_alto_total').attr({
                                btn: "xunidad",
                                usr_ag: $usr_ag,
                                id_ag: datos[myKey].id_ag,
                                id_ag_4: datos[myKey].id_ag_4,
                                vista: 'uni_admin', 
                                perfil_final: datos[myKey].perfil_final,
                                ambito: datos[myKey].ambito,
                                descripcion_unidad: datos[myKey].descripcion_unidad,
                                    "data-toggle": "modal",
                                    "data-target": "#detalles_usr",
                                    "data-whatever": "Usuarios en Alto"                                   
                            }).addClass('td_detalles_central hand');                                     
                            break;
                        case "Superior":                                      
                            $("#"+$id_central).find('#tr_admin_'+key_unidad).children('.td_superior_total').text(datos[myKey].total)     
                            $("#"+$id_central).find('#tr_admin_'+key_unidad).children('.td_superior_total').attr({
                                btn: "xunidad",
                                usr_ag: $usr_ag,
                                id_ag: datos[myKey].id_ag,
                                id_ag_4: datos[myKey].id_ag_4,
                                vista: 'uni_admin', 
                                perfil_final: datos[myKey].perfil_final,
                                ambito: datos[myKey].ambito,
                                descripcion_unidad: datos[myKey].descripcion_unidad,
                                    "data-toggle": "modal",
                                    "data-target": "#detalles_usr",
                                    "data-whatever": "Usuarios en Superior"                                   
                            }).addClass('td_detalles_central hand');                                      
                            break; 
                    }  
                    $("#"+$id_central).find('#tr_admin_'+key_unidad).children('.td_niveles_total').text($total_Central)                  
                }    
                
             },
             timeout:90000,
             error: function(){                     
                    $("#ajax_respuesta").html('Problemas con el servidor intente de nuevo.');
                }      
            });
        }
        if(estado == 'maximizado'){ 
            $(this).attr('estado','minimizado');
            $(this).parent().parent().parent().siblings().css( {"opacity": "1","filter": "alpha(opacity=100)", "font-weight":"normal"} );
            $(this).parent().parent().parent().css( {"opacity": "1","filter": "alpha(opacity=100)", "font-weight":"normal"} );
            $(this).parent().next().hide(); // subir al nivel TR y seleccionar el siguiente TR que contiene las Administraciones 
        }         
    }); 

    // Evento para mostrar el listado de los empleados que contiene cada Nivel dentro de su Administracion (resultados_eidd_detalles_usr)
    //$(".td_detalles_central, .td_detalles_local").click(function(){
    $("body").on('click', '.td_detalles_central, .td_detalles_local', function(event) {            

    });  

    $('#detalles_usr').on('hidden.bs.modal', function (e) {
      $("#div_rombo").appendTo($('#div_cont_rombo'));
    })    
    // Mostrar la lista de empleados de acuerdo al perfil deseado
    $('#detalles_usr').on('show.bs.modal', function (event) {
      btn_ocultar_rombo();  
      
      $("#div_rombo").appendTo($('#detalles_usr .modal-body'));

      var button = $(event.relatedTarget) // Button that triggered the modal
      var recipient = button.data('whatever') // Extract info from data-* attributes
      // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
      // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
      var modal = $(this)
      modal.find('.modal-title').text(recipient)
      modal.find(".modal_contenido").html($load);
      //modal.find('.modal-body input').val(recipient)
        $btn = button.attr('btn');
        $usr_ag = button.attr('usr_ag');
        $perfil_final = button.attr('perfil_final');
        $ambito = button.attr('ambito');
        $id_ag = button.attr('id_ag');
        $id_ag_4 = button.attr('id_ag_4'); 
        $vista = button.attr('vista');         
        $etiqueta = $ambito;
        if($etiqueta == 'LOCAL')
            $etiqueta = 'DESCONCENTRADA';
        $descripcion_unidad = button.attr('descripcion_unidad');
        //alert($usr_ag+' | '+$perfil_final+' | '+$ambito+' | '+$id_ag+' | '+$id_ag_4+' | '+$vista) 
        
        if($btn == "xunidad"){
            $url = 'detalles_usr';
            $datos = "tipo_busqueda=detalles_xunidad&usr_ag="+$usr_ag+"&perfil_final="+$perfil_final+"&ambito="+$ambito+"&descripcion_unidad="+$descripcion_unidad+"&id_ag="+$id_ag+"&id_ag_4="+$id_ag_4+"&vista="+$vista
        }
        if($btn == "xnivel"){
            $url = 'detalles_usr_resumenxnivel';
            $puesto_nivel = button.attr('puesto_nivel');
            $datos = "tipo_busqueda=detalles_xunidad&usr_ag="+$usr_ag+"&perfil_final="+$perfil_final+"&ambito="+$ambito+"&descripcion_unidad="+$descripcion_unidad+"&id_ag="+$id_ag+"&id_ag_4="+$id_ag_4+"&vista="+$vista+"&puesto_nivel="+$puesto_nivel 
        }
        if($btn == "brechaxnivel"){
            $url = 'detalles_usr_brechaxnivel_jerarquico';
            $nivel = button.attr('nivel');
            $comp = button.attr('comp');
            modal.find('.modal-title').text($nivel+" | "+$comp)
            $datos = "tipo_busqueda=detalles_xunidad&usr_ag="+$usr_ag+"&perfil_final="+$perfil_final+"&ambito="+$ambito+"&descripcion_unidad="+$descripcion_unidad+"&id_ag="+$id_ag+"&id_ag_4="+$id_ag_4+"&vista="+$vista+"&nivel="+$nivel+"&comp="+$comp 
        }        
        if($btn == "brechasxadmin"){
            $url = 'detalles_usr_brechaxUA';
            $nivel = button.attr('nivel');
            $comp = button.attr('comp');
            modal.find('.modal-title').text($nivel+" | "+$comp)
            $datos = "tipo_busqueda=detalles_xunidad&usr_ag="+$usr_ag+"&perfil_final="+$perfil_final+"&ambito="+$ambito+"&descripcion_unidad="+$descripcion_unidad+"&id_ag="+$id_ag+"&id_ag_4="+$id_ag_4+"&vista="+$vista+"&nivel="+$nivel+"&comp="+$comp 
        }
        if($btn == "brechasxpers"){
            $url = 'detalles_usr_brechasxpers';
            $brecha = button.attr('brecha'); 
            modal.find('.modal-title').text("Brechas("+$brecha+")")
            $datos = "tipo_busqueda=detalles_xunidad&usr_ag="+$usr_ag+"&perfil_final="+$perfil_final+"&ambito="+$ambito+"&descripcion_unidad="+$descripcion_unidad+"&id_ag="+$id_ag+"&id_ag_4="+$id_ag_4+"&vista="+$vista+"&brecha="+$brecha 
        }        
 
        $.ajax({    
         type: "GET",
         contentType: "application/x-www-form-urlencoded", 
         url: $url,
         data: $datos,    
         success: function(datos){ 
            
            //alert(datos)
            var datos = jQuery.parseJSON(datos);            
             modal.find(".modal_contenido").empty();
            $url_fotos = 'http://10.228.128.93:8080/fotos/';    //http://99.95.143.139
            // Armar la cabecera de la tabla
            cont_cabecera = $("<div class='con_t_th table_top_modal'></div>");
            cont_cabecera.append('<div class="t_tr negritas" style="width:70px;height:37px; text-align:center;"># EMP.</div>');
            cont_cabecera.append('<div class="t_tr negritas t_underline hand" onclick="ordenar_tr_xunidad('+$usr_ag+', \''+$ambito+'\', \''+$descripcion_unidad+'\', \''+$perfil_final+'\', \'ORDER BY uni.nombre \', \''+$id_ag+'\', \''+$id_ag_4+'\', \''+$vista+'\')" style="width:451px;height:37px; text-align:center;">NOMBRE</div>');
            if($btn != "brechaxnivel" && $btn != "brechasxadmin" && $btn != "brechasxpers" ){
                cont_cabecera.append('<div class="t_tr negritas t_underline hand" onclick="ordenar_tr_xunidad('+$usr_ag+', \''+$ambito+'\', \''+$descripcion_unidad+'\', \''+$perfil_final+'\', \'ORDER BY uni.fcal_360 \', \''+$id_ag+'\', \''+$id_ag_4+'\', \''+$vista+'\')" style="width:70px;height:37px; text-align:center;">fcal 360</div>');
                cont_cabecera.append('<div class="t_tr negritas t_underline hand" onclick="ordenar_tr_xunidad('+$usr_ag+', \''+$ambito+'\', \''+$descripcion_unidad+'\', \''+$perfil_final+'\', \'ORDER BY uni.fcal_indicadores \', \''+$id_ag+'\', \''+$id_ag_4+'\', \''+$vista+'\')" style="width:90px;height:37px; text-align:center;">fcal INDICADORES</div>');
                cont_cabecera.append('<div class="t_tr negritas t_underline hand" onclick="ordenar_tr_xunidad('+$usr_ag+', \''+$ambito+'\', \''+$descripcion_unidad+'\', \''+$perfil_final+'\', \'ORDER BY uni.fcal_entorno \', \''+$id_ag+'\', \''+$id_ag_4+'\', \''+$vista+'\')" style="width:90px;height:37px; text-align:center;">fcal ENTORNO</div>');
                cont_cabecera.append('<div class="t_tr negritas t_underline hand" onclick="ordenar_tr_xunidad('+$usr_ag+', \''+$ambito+'\', \''+$descripcion_unidad+'\', \''+$perfil_final+'\', \'ORDER BY uni.fcal_EIDD \', \''+$id_ag+'\', \''+$id_ag_4+'\', \''+$vista+'\')" style="width:70px;height:37px; text-align:center;">fcal EIDD</div>');
            }
            modal.find(".modal_contenido").append(cont_cabecera);
           // modal.find(".modal_contenido").append('<div style="position:relative; height:39px;width:850px;"></div>');   // salto de linea 
            for(var myKey in datos) {
                if($btn == "brechaxnivel" || $btn == "brechasxadmin" || $btn == "brechasxpers"){
                    cont_fila = $("<div class='cont_fila' style='width:856px;'></div>");
                    cont_fila.append("<div class='t_tr bleft' style='width:70px;'>"+datos[myKey].id_empleado+"</div>");                
                    cont_fila.append("<div class='t_tr bright' style='width:780px'><a class='screenshot hand t_negro' rel='"+$url_fotos+datos[myKey].id_empleado+".jpg'>"+datos[myKey].nombre+"</a></div>");                             
                    cont_fila.append("<div class='t_tr font_small1 bright bleft bbottom' style='width:850px;'> "+ 
                                    "<span class='t_azul margen_left'>"+datos[myKey].desc_unidad+"</span> <strong>|</strong> <span class='t_marron'>"+datos[myKey].puesto_nivel+"</span></div>  ");                 
                }else{
                    cont_fila = $("<div class='cont_fila' style='width:856px;'></div>");
                    cont_fila.append("<div class='t_tr bleft' style='width:70px;'>"+datos[myKey].id_empleado+"</div>");                
                    cont_fila.append("<div class='t_tr' style='width:460px'><a class='screenshot hand t_negro' rel='"+$url_fotos+datos[myKey].id_empleado+".jpg'>"+datos[myKey].nombre+"</a></div>");               
                    cont_fila.append("<div class='t_tr' style='width:70px; text-align:center;'>"+datos[myKey].fcal_360.toFixed(2)+"</div>");
                    cont_fila.append("<div class='t_tr' style='width:90px; text-align:center;'>"+datos[myKey].fcal_indicadores.toFixed(2)+"</div>");
                    cont_fila.append("<div class='t_tr' style='width:90px; text-align:center;'>"+datos[myKey].fcal_entorno.toFixed(2)+"</div>");                             
                    cont_fila.append("<div class='t_tr bright t_underline hand' onclick=\"grafica_rombo('"+datos[myKey].fcal_EIDD+"','"+datos[myKey].perfil_final+"','"+datos[myKey].nombre+"')\" style='width:70px; text-align:center;'>"+datos[myKey].fcal_EIDD.toFixed(2)+"</div>");               
                    cont_fila.append("<div class='t_tr font_small1 bright bleft bbottom' style='width:850px;'> "+ 
                                        "<span class='t_azul margen_left'>"+datos[myKey].desc_unidad+"</span> <strong>|</strong> <span class='t_marron'>"+datos[myKey].puesto_nivel+"</span></div>  ");  
                }
                modal.find(".modal_contenido").append(cont_fila);
            } 

         },
         timeout:90000,
         error: function(){                     
                $("#ajax_respuesta").html('Problemas con el servidor intente de nuevo.');
            }      
        }).always(function() {
            screenshotPreview();
            
        });      
    });

/*********************************************************************************************************************************************/
/********************************************************* detalles_usr *********************************************************************/

/********************************************************* detalles_usr *********************************************************************/
/*********************************************************************************************************************************************/
    $('#detalles_usr_vs').on('hidden.bs.modal', function (e) {
      $("#div_rombo").appendTo($('#div_cont_rombo'));
    }) 
    $('#detalles_usr_vs').on('show.bs.modal', function (event) {
      btn_ocultar_rombo();  

      $("#div_rombo").appendTo($('#detalles_usr_vs .modal-body'));

      var button = $(event.relatedTarget) // Button that triggered the modal
      var recipient = button.data('whatever') // Extract info from data-* attributes 
      var modal = $(this)
      modal.find('.modal-title').text(recipient)
      modal.find(".modal_contenido").html($load);
      //modal.find('.modal-body input').val(recipient)

        $usr_ag = button.attr('usr_ag');        
        $ambito = button.attr('ambito');
        $descripcion_unidad_permisos = button.attr('descripcion_unidad_permisos');
        $perfil_final_2012_2013 = button.attr('perfil_final_2012_2013');
        $perfil_final = button.attr('perfil_final'); 
        $g_nivel = button.attr('g_nivel');         
        $orderby = " ORDER BY vs.nombre";

        $.ajax({    
         type: "GET",
         contentType: "application/x-www-form-urlencoded", 
         url: "resultados_eidd_detalles_usr_vs/",
         data: "usr_ag="+$usr_ag+"&ambito="+$ambito+"&descripcion_unidad_permisos="+$descripcion_unidad_permisos+"&perfil_final_2012_2013="+$perfil_final_2012_2013+"&perfil_final="+$perfil_final+"&g_nivel="+$g_nivel+"&orderby="+$orderby,    
         success: function(datos){ 
            
            //alert(datos)
            var datos = jQuery.parseJSON(datos);            
             modal.find(".modal_contenido").empty();
            $url_fotos = 'http://10.228.128.93:8080/fotos/';    //http://99.95.143.139
            // Armar la cabecera de la tabla

        $th_fechas_vs = `<div class="table_top_modal" style="border:none; ">
            <div class="t_tr negritas" style="width:70px;height:37px; text-align:center; border:0; background:#FFF;">&nbsp;</div>
            <div class="t_tr negritas btop" style="width:447px;height:37px; text-align:center; border:0; background:#FFF;">&nbsp;</div>
            <div class="t_tr negritas table_top btop bleft" style="width:170px;height:37px; text-align:center;">2016 - 2017</div>
            <div class="t_tr negritas table_top btop bright" style="width:160px;height:37px; text-align:center;">2017 - 2018</div>
        </div>`;
        
        $th_titulos_vs = `<div class="table_top_modal" style=" "> 
            <div class="t_tr negritas" style="width:70px;height:37px; text-align:center;"># EMP.</div>
            <div class="t_tr negritas t_underline hand" onclick="ordenar_tr_vs('.$usr_ag.', \''.$ambito.'\', \''.$perfil_final_2012_2013.'\', \''.$perfil_final.'\', \'ORDER BY vs.nombre \')"  style="width:450px;height:37px; text-align:center;">NOMBRE</div>
            <div class="t_tr negritas t_underline hand" onclick="ordenar_tr_vs('.$usr_ag.', \''.$ambito.'\', \''.$perfil_final_2012_2013.'\', \''.$perfil_final.'\', \'ORDER BY vs.EIDD_2012_2013 \')"
            style="width:70px;height:37px; text-align:center;">fcal EIDD</div>
            <div class="t_tr negritas" style="width:90px;height:37px; text-align:center;">PERFIL FINAL</div>
            <div class="t_tr negritas t_underline hand" onclick="ordenar_tr_vs('.$usr_ag.', \''.$ambito.'\', \''.$perfil_final_2012_2013.'\', \''.$perfil_final.'\', \'ORDER BY vs.fcal_EIDD \')" style="width:70px;height:37px; text-align:center;">fcal EIDD</div>
            <div class="t_tr negritas" style="width:90px;height:37px; text-align:center;">PERFIL FINAL</div></div>`;
            
 
            modal.find(".modal_contenido").append($th_fechas_vs);
            cont_cabecera = $("<div class='con_t_th '></div>");
            //cont_cabecera.append($th_fechas_vs); 
            cont_cabecera.append($th_titulos_vs);

            modal.find(".modal_contenido").append(cont_cabecera);
           // modal.find(".modal_contenido").append('<div style="position:relative; height:39px;width:850px;"></div>');   // salto de linea 

 

            for(var myKey in datos) {
                cont_fila = $("<div class='cont_fila' style='width:856px;'></div>");
                cont_fila.append("<div class='t_tr bleft' style='width:70px;'>"+datos[myKey].id_empleado+"</div>");                
                cont_fila.append("<div class='t_tr' style='width:440px'><a class='screenshot hand t_negro' rel='"+$url_fotos+datos[myKey].id_empleado+".jpg'>"+datos[myKey].nombre+"</a></div>");                               
                cont_fila.append("<div class='t_tr' style='width:90px; text-align:center;'>"+datos[myKey].EIDD_2012_2013.toFixed(2)+"</div>");
                cont_fila.append("<div class='t_tr' style='width:90px; text-align:center;'>"+datos[myKey].perfil_final_2012_2013+"</div>");                             
                cont_fila.append("<div class='t_tr  t_underline hand' onclick=\"grafica_rombo('"+datos[myKey].fcal_EIDD+"','"+datos[myKey].perfil_final+"','"+datos[myKey].nombre+"')\" style='width:70px; text-align:center;'>"+datos[myKey].fcal_EIDD.toFixed(2)+"</div>");               
                cont_fila.append("<div class='t_tr bright' style='width:90px;'>"+datos[myKey].perfil_final+"</div>"); 
                cont_fila.append("<div class='t_tr font_small1 bright bleft bbottom' style='width:850px;'> "+ 
                                    "<span class='t_azul margen_left'>"+datos[myKey].desc_unidad+"</span> <strong>/</strong> <span class='t_marron'>"+datos[myKey].puesto_nivel+"</span></div>  ");                 
                modal.find(".modal_contenido").append(cont_fila);
            } 
         },
         timeout:90000,
         error: function(){                     
                $("#ajax_respuesta").html('Problemas con el servidor intente de nuevo.');
            }      
        }).always(function() {
            screenshotPreview();
            
        });      
    });



     $("#btn_graf_bar").click(function(){
        $("#container, #controles_graf").fadeIn()
        $("#grafica_pie").hide();
     })
     $("#btn_graf_pie").click(function(){
        $("#grafica_pie").fadeIn().css("display", "table");
        $("#container, #controles_graf").hide();
     })

});

/*********************************************************************************************************************************************/
/********************************************************* Evento FICHA  *********************************************************************/

/********************************************************* Buscar x Num Empleado  *************************************************************/
/*********************************************************************************************************************************************/
function enter_key_buscar( elEvento ) { 
    var evento = elEvento || window.event;
    var caracter = evento.charCode || evento.keyCode;
    $num_emp = $("#num_emp_ficha").val();
    if ( caracter == 13 ) { 
        $.ajax({
         type: "GET",
         contentType: "application/x-www-form-urlencoded", 
         url: "resultados_x_ficha",
         data: "tipo_busqueda=btn_vs&usr_ag="+$usr_ag+"&num_emp="+$num_emp,
         beforeSend:function(){ $("#ajax_respuesta").html($load); },     
         success: function(datos){  
 
            var datos = jQuery.parseJSON(datos);
 
            if(datos[0].error){ 
                $(document).ajaxStop(function(){
                    $.unblockUI
                    msg_blockUI("growlUI_msg", datos[0].error, 'fa fa-exclamation-triangle', '5px solid #ff1a00', '#000', 0);
                }); 
                $("#ajax_respuesta").empty(); 
                return;
            }
            if(datos[0].permiso == "no_permisos"){  
                $(document).ajaxStop(function(){
                    $.unblockUI
                    msg_blockUI("growlUI_msg", "Sin permisos para este resultado.", 'fa fa-exclamation-triangle', '5px solid #ff1a00', '#000', 0);
                });  
                $("#ajax_respuesta").empty();
                return;
            }

            $("#cont_res_ficha").show().appendTo($("#contenido_resul"));  


         },
         timeout:90000,
         error: function(){                     
                $("#ajax_respuesta").html('Problemas con el servidor intente de nuevo.');
            }      
        });
    }
}

function grafica_uno($categories, $totales, $titulos, $colores, $render, $titulo){  
        //alert("Cat: "+$categories+" | "+$normal_total)
        /*  GRAFICOS Bars*/ 
        console.log("$categories: "+$categories);
        console.log("$totales: "+$totales);
        console.log("$titulos: "+$titulos);
        
        seriesObj = []; 
        if($render == "")
            $render = "container";
        for(var myKey in $totales) {
            
            if($totales[myKey].length >= 2){
                for(var key in $totales[myKey]){
                    console.log("myKey length: "+$totales[myKey])
                    valoresGraf = $totales[myKey];
                }
            }else{
                valoresGraf = $totales[myKey];
            } 
            // si los valores a graficar no vienen como un Array lo convertimos en Array
            if( !Array.isArray(valoresGraf) )
                valoresGraf = [$totales[myKey]];

            console.log("valoresGraf: "+valoresGraf);
            seriesObj.push({name: $titulos[myKey],color: $colores[myKey], data: valoresGraf })
        }                      
                     
        console.log("seriesObj: "+ JSON.stringify(seriesObj) );
        var chart = null;
        var chart = new Highcharts.Chart({
            chart: {
                width: 900, 
                renderTo: $render,
                backgroundColor: false,
                type: 'column',
                margin: 75,
                options3d: {
                    enabled: true,
                    alpha: 0,
                    beta: 0,
                    depth: 50,
                    viewDistance: 25
                }
            },
            title: {
                text: $titulo
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: $categories
            },
            yAxis: {
                title: {
                    text: '( y )'
                }
            },
            
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b><br/>',
                shared: false
            },          

            plotOptions: {
                column: {
                    depth: 25                        
                },
                series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true 
                        }
                    }               
            },
             series: seriesObj


        });
    console.log("OK")
 

    // Activate the sliders
        $( "#slider-R0" ).slider({
            orientation: "vertical",
            range: "max",
            min: 0,
            max: 45,
            value: 0,
            slide: function( event, ui ) {
                chart.options.chart.options3d.alpha = ui.value;
                //showValues();
                chart.redraw(false);            
            }
        }); 
        $( "#slider-R1" ).slider({
            orientation: "vertical",
            range: "max",
            min: 0,
            max: 45,
            value: 0,
            slide: function( event, ui ) {
                chart.options.chart.options3d.beta = ui.value;
                //showValues();
                chart.redraw(false);            
            }
        }); 
        console.log("OK")          
}

function grafica_pie($categories, $deficiente_total, $emergente_total, $normal_total, $alto_total, $superior_total, $contenedor, $titulo){
        /*  GRAFICOS Pie 3D*/ 
        // Build the chart
        // Radialize the colors
        //alert($categories)
        if($categories === undefined) return;

        $('#'+$contenedor).show();

        Highcharts.getOptions().plotOptions.pie.colors = (function () {
            var colors = [],
                base = Highcharts.getOptions().colors[0],
                i

            for (i = 0; i < 10; i++) {
                // Start out with a darkened base color (negative brighten), and end
                // up with a much brighter color
                colors.push(Highcharts.Color(base).brighten((i - 3) / 7).get());
            }
            return colors;
        }());      
        $('#'+$contenedor).highcharts({
            chart: {
                type: 'pie',
                backgroundColor: false,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,              
/*                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                }*/
            },
            title: {
                text: $titulo
            },
            tooltip: {
                pointFormat: ' <b>{point.percentage:.1f}%</b>'
            },

/*            legend: {
                align: 'right',
                verticalAlign: 'middle',
                layout: 'vertical'
            }, */           
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer', 
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b><br>{point.y}',
                        distance: 20
                    },

                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser 1',
                data: [
                    {
                        name: 'DEFICIENTE',
                        color: '#F82001',
                        y: parseInt($deficiente_total)
                    },
                    {
                        name: 'EMERGENTE',
                        color: '#FAC612', 
                        y: parseInt($emergente_total)
                    },
                    {
                        name: 'NORMAL',
                        color: '#CCCCCC',
                        y: parseInt($normal_total)
                    },
                    {
                        name: 'ALTO',
                        color: '#56D94F',
                        y: parseInt($alto_total)
                    },
                    {
                        name: 'SUPERIOR',
                        color: '#5EAC46',
                        y: parseInt($superior_total)
                    }                                                                                                
                ] 
            }]
        });   
}
function cerrar_sistema(){
    $("#contenido").css({'background-image': 'url(img/sat_logo_3.png)', opacity: .1});
    $("#bar_top,#pie,#contenido_resul").fadeOut(400,function(){
        $("#contenido").css({top:'10%'});       //4.5   
        $("#bar_top,#pie").css({width :'5px'});
        $(".btn_menu").removeClass('btn_activo');
        $("#cont_bienvenida").hide();
        limpiar_datos();
        $("#contenido").animate({opacity: 1}, 600,function(){ 
            //$("#cont_login").fadeIn(450); $("#btn_login").show(); $('#pwd').focus();
            //location.reload();
            window.location.href = "/logout";
        });
        
    });
    $("#txt_NumEmp").attr("value", "");
    $.post("funciones/cerrar_sesion.php",function (data){ /*$('#test').html(data) */ });    
}
function limpiar_datos() {
    if($("#contenido_resul").find("#grafica").length > 0){
        $("#grafica").appendTo($("#contenido"));
        $("#grafica_pie").hide();
        $("#btn_graf_pie, #btn_graf_bar").show();
        $("#container, #controles_graf").show()
    }    
    $("#dialog_detalles, #modal_contenido").remove();
    $("#grafica").hide();   // cultar este contenedor ya que en esta pantalla no se usa
    $("#cont_res_ficha").hide().appendTo($("#wrap_res_ficha"));
    $("#cont_ficha").hide().appendTo($("#wrap_ficha")); 
    $("#contenido_resul ,#ajax_respuesta").empty();
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
    console.log($perfil_final)
    $(".modal_contenido").hide();
    $("#div_rombo").show();
        $nivel = $perfil_final
        //cont_niveles - 362px
         
        $calif_entero = parseInt($calif);
        $(".etiquetas_niveles").css({"width":"0px"});
        // limpiar el fondo de las etiquetas que indican el perfil
        $("#niveles_defi, #niveles_emergente, #niveles_normal, #niveles_alto, #niveles_sup").removeClass("activo_nivel_def activo_nivel_emer activo_nivel_norm activo_nivel_alto activo_nivel_sup");
        // agregar la calificacion al lado del puntero
        $(".nota_calif").html($calif);
        $("#nivel_puntero").css({"margin-top":"1px"});


        function conver_px($calif, $px_min, $px_max, $rango_min, $rango_max){
            return $px_min - ( ( $px_min - $px_max ) * ( $rango_max - $calif) / ( $rango_max - $rango_min ) );
        }
        if($nivel == 'Deficiente'){
            $pixeles = conver_px( $calif, 278, 334, 50, 73.10 );
            console.log("DEF pixeles "+$pixeles)
            $("#nivel_puntero").animate({marginTop: $pixeles+"px",opacity: 1}, 1000 );    // $puntero_px + "px"
            $(".etiquetas_niveles").animate({width: "321px",opacity: 1}, 1500 );
            $("#niveles_defi").addClass('activo_nivel_def').css("width","0px").animate({width: "321px",opacity: 1}, 1500 );
        }
        if($nivel == 'Emergente'){
            $pixeles = conver_px( $calif, 230, 278, 73.11, 78.60 );
            $("#nivel_puntero").animate({marginTop: $pixeles+"px",opacity: 1}, 1000 );
            $(".etiquetas_niveles").animate({width: "321px",opacity: 1}, 1500 );
            $("#niveles_emergente").addClass('activo_nivel_emer').animate({width: "321px",opacity: 1}, 1500 );
        }
        if($nivel == 'Normal'){
            $pixeles = conver_px( $calif, 79, 231, 78.61, 89.60 );
            $("#nivel_puntero").animate({marginTop: $pixeles+"px",opacity: 1}, 1000 );
            $(".etiquetas_niveles").animate({width: "321px",opacity: 1}, 1500 );
            $("#niveles_normal").addClass('activo_nivel_norm').animate({width: "321px",opacity: 1}, 1500 );
        }
        if($nivel == 'Alto'){
            $pixeles = conver_px( $calif, 35, 79, 89.61, 95.10 );
            $("#nivel_puntero").animate({marginTop: $pixeles+"px",opacity: 1}, 1000 );
            $(".etiquetas_niveles").animate({width: "321px",opacity: 1}, 1500 );
            $("#niveles_alto").addClass('activo_nivel_alto').animate({width: "321px",opacity: 1}, 1500 );
        }
        if($nivel == 'Superior'){
            $pixeles = conver_px( $calif, -25, 35, 95.11, 100 );
            $("#nivel_puntero").animate({marginTop: $pixeles+"px",opacity: 1}, 1000 );
            $(".etiquetas_niveles").animate({width: "321px",opacity: 1}, 1500 );
            $("#niveles_sup").addClass('activo_nivel_sup').animate({width: "321px",opacity: 1}, 1500 );
        }
        if($nivel == 'Sin_Perfil'){ 
            $("#nivel_puntero").hide();
            $(".etiquetas_niveles").animate({width: "321px",opacity: 1}, 1500 );
        }
    return;
    
}
function btn_ocultar_rombo(){
    $(".modal_contenido").show();
    $("#div_rombo").hide(); 
}


function msg_blockUI(etiqueta, texto, icono, borde_color, fondo_color, actualizar){   
    $("#growlUI_msg_txt").html(texto);
    $("#growlUI_icono").html('<span class="'+icono+'" aria-hidden="true"></span>');
    $.blockUI({
        message: $('.'+etiqueta), 
        fadeIn: 700,
        onOverlayClick: $.unblockUI,    // quitar alerta hasta dar clic 
            /*      se comentan lineas para  que onOverlayClick funcione
                    fadeOut: 700, 
                    timeout: 4000, 
                    showOverlay: false, 
            */
        onUnblock: function(){ 
            if(actualizar)
                location.reload(); 
        },
        centerY: false, 
        css: { 
            width: '600px', 
            border: borde_color, 
            padding: '14px', 
            backgroundColor: fondo_color, 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .9, 
            color: '#fff' 
        } 
    }); 
}
function x_unidad_totales_gral(key_unidad, perfil_final, $tabla, total, ambito) {

    switch(perfil_final) {
        case "Deficiente":
        //alert("perfil_final: "+perfil_final+" | ambito: "+ambito+"  | t: "+ total)
            $tabla.find('#tr_admin_'+key_unidad).children('.td_deficiente_total').text(total);
            //$deficiente_total_C = total;
            ambito == "CENTRAL" ? $deficiente_total_C = total : $deficiente_total_L = total;
            break;
        case "Emergente":
            $tabla.find('#tr_admin_'+key_unidad).children('.td_emergente_total').text(total);
            ambito == "CENTRAL" ? $emergente_total_C = total : $emergente_total_L = total;
            break;                                                            
        case "Normal": 
            $tabla.find('#tr_admin_'+key_unidad).children('.td_normal_total').text(total);
            ambito == "CENTRAL" ? $normal_total_C = total : $normal_total_L = total;
            break;                            
        case "Alto":
            $tabla.find('#tr_admin_'+key_unidad).children('.td_alto_total').text(total);
            ambito == "CENTRAL" ? $alto_total_C = total : $alto_total_L = total;
            break;
        case "Superior":   
            $tabla.find('#tr_admin_'+key_unidad).children('.td_superior_total').text(total);
            ambito == "CENTRAL" ? $superior_total_C = total : $superior_total_L = total;
            break; 
    } 
} 

function x_unidad_totales_central($usr_ag, key_unidad, datos, myKey, vista){
    // alert($usr_ag)
    switch(datos[myKey].perfil_final) {
        case "Deficiente":
            $("#table_central_detalles").find('#tr_central_'+key_unidad).children('.td_deficiente_total').text(datos[myKey].total)
            $("#table_central_detalles").find('#tr_central_'+key_unidad).children('.td_deficiente_total').attr({
                btn: "xunidad",
                usr_ag: $usr_ag,
                id_ag: datos[myKey].id_ag,
                id_ag_4: datos[myKey].id_ag_4,
                vista: vista, 
                perfil_final: datos[myKey].perfil_final,
                ambito: datos[myKey].ambito,
                descripcion_unidad: datos[myKey].descripcion_unidad,
                "data-toggle": "modal",
                "data-target": "#detalles_usr",
                "data-whatever": "Usuarios en Deficiente"                                    
            }).addClass('td_detalles_central hand');                                     
            break;
        case "Emergente":
            $("#table_central_detalles").find('#tr_central_'+key_unidad).children('.td_emergente_total').text(datos[myKey].total)
            $("#table_central_detalles").find('#tr_central_'+key_unidad).children('.td_emergente_total').attr({
                btn: "xunidad",
                usr_ag: $usr_ag,
                id_ag: datos[myKey].id_ag,
                id_ag_4: datos[myKey].id_ag_4,
                vista: vista, 
                perfil_final: datos[myKey].perfil_final,
                ambito: datos[myKey].ambito,
                descripcion_unidad: datos[myKey].descripcion_unidad,
                "data-toggle": "modal",
                "data-target": "#detalles_usr",
                "data-whatever": "Usuarios en Emergente"                                    
            }).addClass('td_detalles_central hand');                                     
            break;                                                            
        case "Normal": 
        
            $("#table_central_detalles").find('#tr_central_'+key_unidad).children('.td_normal_total').text(datos[myKey].total)                                  
            $("#table_central_detalles").find('#tr_central_'+key_unidad).children('.td_normal_total').attr({
                btn: "xunidad",
                usr_ag: $usr_ag,
                id_ag: datos[myKey].id_ag,
                id_ag_4: datos[myKey].id_ag_4,
                vista: vista, 
                perfil_final: datos[myKey].perfil_final,
                ambito: datos[myKey].ambito,
                descripcion_unidad: datos[myKey].descripcion_unidad,
                "data-toggle": "modal",
                "data-target": "#detalles_usr",
                "data-whatever": "Usuarios en Normal"
            }).addClass('td_detalles_central hand');                                     
            break;                            
        case "Alto":
            $("#table_central_detalles").find('#tr_central_'+key_unidad).children('.td_alto_total').text(datos[myKey].total)
            $("#table_central_detalles").find('#tr_central_'+key_unidad).children('.td_alto_total').attr({
                btn: "xunidad",
                usr_ag: $usr_ag,
                id_ag: datos[myKey].id_ag,
                id_ag_4: datos[myKey].id_ag_4,
                vista: vista, 
                perfil_final: datos[myKey].perfil_final,
                ambito: datos[myKey].ambito,
                descripcion_unidad: datos[myKey].descripcion_unidad,
                "data-toggle": "modal",
                "data-target": "#detalles_usr",
                "data-whatever": "Usuarios en Alto"                                    
            }).addClass('td_detalles_central hand');                                     
            break;
        case "Superior":                                      
            $("#table_central_detalles").find('#tr_central_'+key_unidad).children('.td_superior_total').text(datos[myKey].total)     
            $("#table_central_detalles").find('#tr_central_'+key_unidad).children('.td_superior_total').attr({
                btn: "xunidad",
                usr_ag: $usr_ag,
                id_ag: datos[myKey].id_ag,
                id_ag_4: datos[myKey].id_ag_4,
                vista: vista, 
                perfil_final: datos[myKey].perfil_final,
                ambito: datos[myKey].ambito,
                descripcion_unidad: datos[myKey].descripcion_unidad,
                "data-toggle": "modal",
                "data-target": "#detalles_usr",
                "data-whatever": "Usuarios en Superior"                                    
            }).addClass('td_detalles_central hand');                                      
            break; 
    } 
}  

function x_unidad_totales_local($usr_ag, key_unidad, datos, myKey, vista){
    // alert($usr_ag)
    switch(datos[myKey].perfil_final) {
        case "Deficiente":
            $("#table_local_detalles").find('#tr_central_'+key_unidad).children('.td_deficiente_total').text(datos[myKey].total)
            $("#table_local_detalles").find('#tr_central_'+key_unidad).children('.td_deficiente_total').attr({
                btn: "xunidad",
                usr_ag: $usr_ag,
                id_ag: datos[myKey].id_ag,
                id_ag_4: datos[myKey].id_ag_4,
                vista: vista, 
                perfil_final: datos[myKey].perfil_final,
                ambito: datos[myKey].ambito,
                descripcion_unidad: datos[myKey].descripcion_unidad,
                "data-toggle": "modal",
                "data-target": "#detalles_usr",
                "data-whatever": "Usuarios en Deficiente"                                    
            }).addClass('td_detalles_central hand');                                     
            break;
        case "Emergente":
            $("#table_local_detalles").find('#tr_central_'+key_unidad).children('.td_emergente_total').text(datos[myKey].total)
            $("#table_local_detalles").find('#tr_central_'+key_unidad).children('.td_emergente_total').attr({
                btn: "xunidad",
                usr_ag: $usr_ag,
                id_ag: datos[myKey].id_ag,
                id_ag_4: datos[myKey].id_ag_4,
                vista: vista, 
                perfil_final: datos[myKey].perfil_final,
                ambito: datos[myKey].ambito,
                descripcion_unidad: datos[myKey].descripcion_unidad,
                "data-toggle": "modal",
                "data-target": "#detalles_usr",
                "data-whatever": "Usuarios en Emergente"                                    
            }).addClass('td_detalles_central hand');                                     
            break;                                                            
        case "Normal": 
        
            $("#table_local_detalles").find('#tr_central_'+key_unidad).children('.td_normal_total').text(datos[myKey].total)                                  
            $("#table_local_detalles").find('#tr_central_'+key_unidad).children('.td_normal_total').attr({
                btn: "xunidad",
                usr_ag: $usr_ag,
                id_ag: datos[myKey].id_ag,
                id_ag_4: datos[myKey].id_ag_4,
                vista: vista, 
                perfil_final: datos[myKey].perfil_final,
                ambito: datos[myKey].ambito,
                descripcion_unidad: datos[myKey].descripcion_unidad,
                "data-toggle": "modal",
                "data-target": "#detalles_usr",
                "data-whatever": "Usuarios en Normal"
            }).addClass('td_detalles_central hand');                                     
            break;                            
        case "Alto":
            $("#table_local_detalles").find('#tr_central_'+key_unidad).children('.td_alto_total').text(datos[myKey].total)
            $("#table_local_detalles").find('#tr_central_'+key_unidad).children('.td_alto_total').attr({
                btn: "xunidad",
                usr_ag: $usr_ag,
                id_ag: datos[myKey].id_ag,
                id_ag_4: datos[myKey].id_ag_4,
                vista: vista, 
                perfil_final: datos[myKey].perfil_final,
                ambito: datos[myKey].ambito,
                descripcion_unidad: datos[myKey].descripcion_unidad,
                "data-toggle": "modal",
                "data-target": "#detalles_usr",
                "data-whatever": "Usuarios en Alto"                                    
            }).addClass('td_detalles_central hand');                                     
            break;
        case "Superior":                                      
            $("#table_local_detalles").find('#tr_central_'+key_unidad).children('.td_superior_total').text(datos[myKey].total)     
            $("#table_local_detalles").find('#tr_central_'+key_unidad).children('.td_superior_total').attr({
                btn: "xunidad",
                usr_ag: $usr_ag,
                id_ag: datos[myKey].id_ag,
                id_ag_4: datos[myKey].id_ag_4,
                vista: vista, 
                perfil_final: datos[myKey].perfil_final,
                ambito: datos[myKey].ambito,
                descripcion_unidad: datos[myKey].descripcion_unidad,
                "data-toggle": "modal",
                "data-target": "#detalles_usr",
                "data-whatever": "Usuarios en Superior"                                    
            }).addClass('td_detalles_central hand');                                      
            break; 
    } 
} 

/************************ Variables y funcion para el Comprativo de años VS*********************************/
var $tr_deficiente_vs = []; 
var $tr_emergente_vs = [];
var $tr_normal_vs = [];
var $tr_alto_vs = [];
var $tr_superior_vs = [];
function armar_tbl_vs($g_ags, $ambito, $nivel, $puesto, $btn){
    console.log("armar_tbl_vs: "+$puesto)
    $x=0;
    $bgcolor = "#FFE2BE";
    $clase_t_puesto = "";
    // niveles es un array declarado global ['DEFICIENTE','EMERGENTE','NORMAL','ALTO','SUPERIOR'];
    for(var KeyNiveles in niveles) {   
        $resaltar=""; 
        $clase_t_nivel = "t_"+$nivel.toLowerCase()+"_"+niveles[KeyNiveles].toLowerCase(); 
        if($puesto){
            $clase_t_puesto = "t_"+$puesto.toLowerCase()+"_"+niveles[KeyNiveles].toLowerCase(); 
        }
        if($nivel == 'DEFICIENTE'){
            if(niveles[KeyNiveles] == $nivel.toUpperCase() ){
                $resaltar="f_rojo_fuerte t_blanco";      
                $bgcolor = "#D4F0B3";  
            }
            if($btn == 'xnivel') { $resaltar=""; $bgcolor = ""; }            
            $tr_deficiente_vs[$x] = `<td width="11%"  align="center" bgcolor="${$bgcolor}" class="${$resaltar} td_detalles_usr_vs"
                            usr_ag="${$g_ags}" ambito="${$ambito}" 
                            perfil_final_2012_2013 = "${$nivel}"                             
                            perfil_final = "${niveles[KeyNiveles]}"><span class="${$clase_t_nivel} ${$clase_t_puesto}">0</span></td>`;
        }
        if($nivel == 'EMERGENTE'){
            if(niveles[KeyNiveles] == $nivel.toUpperCase() ){
                $resaltar="f_rojo_claro t_blanco";   
                $bgcolor = "#D4F0B3";      
            }   
            if($btn == 'xnivel') { $resaltar=""; $bgcolor = ""; }                            
            $tr_emergente_vs[$x] = `<td width="11%"  align="center" bgcolor="${$bgcolor}" class="${$resaltar} td_detalles_usr_vs"
                            usr_ag="${$g_ags}" ambito="${$ambito}" 
                            perfil_final_2012_2013 = "${$nivel}"                             
                            perfil_final = "${niveles[KeyNiveles]}"><span class="${$clase_t_nivel} ${$clase_t_puesto}">0</span></td>`;
        }
        if($nivel == 'NORMAL'){
            if(niveles[KeyNiveles] == $nivel.toUpperCase() ){
                $resaltar="f_blanco";   
                $bgcolor = "#D4F0B3";      
            }   
            if($btn == 'xnivel') { $resaltar=""; $bgcolor = ""; }                
            $tr_normal_vs[$x] = `<td width="11%"  align="center" bgcolor="${$bgcolor}" class="${$resaltar} td_detalles_usr_vs"
                            usr_ag="${$g_ags}" ambito="${$ambito}" 
                            perfil_final_2012_2013 = "${$nivel}"                             
                            perfil_final = "${niveles[KeyNiveles]}"><span class="${$clase_t_nivel} ${$clase_t_puesto}">0</span></td>`;
        } 
        if($nivel == 'ALTO'){
            if(niveles[KeyNiveles] == $nivel.toUpperCase() ){
                $resaltar="f_verde_claro t_blanco";   
                $bgcolor = "#D4F0B3";      
            } 
            if($btn == 'xnivel') { $resaltar=""; $bgcolor = ""; }                  
            $tr_alto_vs[$x] = `<td width="11%"  align="center" bgcolor="${$bgcolor}" class="${$resaltar} td_detalles_usr_vs"
                            usr_ag="${$g_ags}" ambito="${$ambito}" 
                            perfil_final_2012_2013 = "${$nivel}"                             
                            perfil_final = "${niveles[KeyNiveles]}"><span class="${$clase_t_nivel} ${$clase_t_puesto}">0</span></td>`;
        } 
        if($nivel == 'SUPERIOR'){
            if(niveles[KeyNiveles] == $nivel.toUpperCase() ){
                $resaltar="f_verde_fuerte t_blanco";   
                $bgcolor = "#D4F0B3";      
            }      
            if($btn == 'xnivel') { $resaltar=""; $bgcolor = ""; }             
            $tr_superior_vs[$x] = `<td width="11%"  align="center" bgcolor="${$bgcolor}" class="${$resaltar} td_detalles_usr_vs"
                            usr_ag="${$g_ags}" ambito="${$ambito}" 
                            perfil_final_2012_2013 = "${$nivel}"                             
                            perfil_final = "${niveles[KeyNiveles]}"><span class="${$clase_t_nivel} ${$clase_t_puesto}">0</span></td>`;
        }                        
        $x++;
    }
    $tr_deficiente_vs[$x] = `<td width="11%"  align="center" class="negritas"><span class="t_deficiente_totales t_operativo_totales">0</span></td>`;
    $tr_emergente_vs[$x] = `<td width="11%"  align="center" class="negritas"><span class="t_emergente_totales t_enlace_totales">0</span></td>`;
    $tr_normal_vs[$x] = `<td width="11%"  align="center" class="negritas"><span class="t_normal_totales t_jefe_de_departamento_totales">0</span></td>`;
    $tr_alto_vs[$x] = `<td width="11%"  align="center" class="negritas"><span class="t_alto_totales t_subadministrador_totales">0</span></td>`;
    $tr_superior_vs[$x] = `<td width="11%"  align="center" class="negritas"><span class="t_superior_totales t_administrador_totales">0</span></td>`;
} 

function reset_matriz_graf_niveles(){
                graf_DEFICIENTE['DEFICIENTE']=[0];
                graf_DEFICIENTE['EMERGENTE']=[0];
                graf_DEFICIENTE['NORMAL']=[0];
                graf_DEFICIENTE['ALTO']=[0];
                graf_DEFICIENTE['SUPERIOR']=[0];

                graf_EMERGENTE['DEFICIENTE']=[0];
                graf_EMERGENTE['EMERGENTE']=[0];
                graf_EMERGENTE['NORMAL']=[0];
                graf_EMERGENTE['ALTO']=[0];
                graf_EMERGENTE['SUPERIOR']=[0];  

                graf_NORMAL['DEFICIENTE']=[0];
                graf_NORMAL['EMERGENTE']=[0];
                graf_NORMAL['NORMAL']=[0];
                graf_NORMAL['ALTO']=[0];
                graf_NORMAL['SUPERIOR']=[0];  

                graf_ALTO['DEFICIENTE']=[0];
                graf_ALTO['EMERGENTE']=[0];
                graf_ALTO['NORMAL']=[0];
                graf_ALTO['ALTO']=[0];
                graf_ALTO['SUPERIOR']=[0];  

                graf_SUPERIOR['DEFICIENTE']=[0];
                graf_SUPERIOR['EMERGENTE']=[0];
                graf_SUPERIOR['NORMAL']=[0];
                graf_SUPERIOR['ALTO']=[0];
                graf_SUPERIOR['SUPERIOR']=[0];    
 }
 function reset_matriz_graf_competencias(){

 }
