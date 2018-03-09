var express = require('express'),
    router = express.Router(),
    connectionManager = require('../models/article'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    logout = require('express-passport-logout'),
    md5 = require('md5'),
	flash = require('connect-flash'), // enviar msg de error en el login
	date = require('date-and-time'),
	dns = require('dns');

 
var $;

require("jsdom/lib/old-api").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }
    $ = require("jquery")(window);
    doSomething();
});

 function doSomething(){
    var deferred = $.Deferred();
}
 var $gerales ="'AGACE','AGSC','AGA','AGAFF','AGCTI','AGE','AGGC','AGRS','AGJ','AGR','JESAT','AGP','AGH'";

module.exports = function (app) {
  app.use('/', router);
};


router.use(flash());
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done){
    done(null, user);
});
passport.deserializeUser(function(user, done){
    done(null, user);
}); 

passport.use(new LocalStrategy(
    { 
        passwordField: false,
        usernameField: 'username',
        passReqToCallback : true         
    },
    function(req, username, password, done){
         console.log("--- usernameX: "+username);
        //console.log("--- passwordX: "+password);
        //console.log("************************************************************* username: "+username);
        
        connectionManager.getConnection()
            .then(function (connection) {
            	$pwd = username;
            	$pwd_md5 = "pwd|"+md5(username);
            	$status_query = 1;

				$sql = "SELECT * FROM tbl_usuarios WHERE password = ? AND activo = ?";
				var query = connectionManager.prepareQuery($sql, [$pwd_md5, '1']);
				console.log("SQ1: "+query);
            	//$sql = "SELECT * FROM tbl_usuarios WHERE password = '"+$pwd_md5+"' AND activo = '1'"; // AND registrado = 1
                connection.query(query, function (error, results) {
                    if (error) 
                        return done(null, false, {'message': 'Error con la Base de Datos.'}); //return done(null, false);
                    
                    //console.log("deferred:"+$sql+JSON.stringify(results));
					numRows = results.length; 
					console.log("OK SQL1 "+numRows);
					if(numRows){
                    	console.log("SQ1 results");
                    	//$r_json = JSON.parse(results[0]);
	                    if(results[0].Nombre){     
	                    	req.session.tipo = 'registrado';    
		                    req.session.ag = results[0].ag;
		                    req.session.NumEmp = results[0].NumEmp;
		                    req.session.grado = results[0].grado;
		                    req.session.puesto = results[0].puesto;
		                    req.session.nivel = results[0].nivel; 
		                    req.session.nombre_host = results[0].nombre_host;
		                    req.session.proceso = 24;
		                    req.session.unidades_permisos = results[0].descripcion_unidad_permisos;
		                    req.session.unidad_permisos = results[0].id_unidadDepto;

							req.session.g_nombre = results[0].Nombre; 
							req.session.g_ags = results[0].ag;
							req.session.g_id_unidadDepto = results[0].id_unidadDepto;
							req.session.g_NumEmp = results[0].NumEmp;
							req.session.g_nivel = results[0].nivel; 
							req.session.g_ag_permisos = results[0].ag_permisos;
							req.session.g_unidades_permisos = results[0].descripcion_unidad_permisos;

							
							var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
							ip = ip.split(':').slice(-1);
							console.log('IP : '+ip);
							req.session.g_ip = ip;
							/*
							var1 = dns.reverse(req.session.g_ip.toString(), function(err, addresses, nombre_host) {
								  if (err) {
								    console.log(err);
								    return;  
								  }  
								  console.log("rec: "+addresses);
								  return nombre_host = "addresses";
								});
							console.log("nombre_host: "+JSON.stringify(var1))
							*/ 
					        return done(null, results[0]);                                       
				    	}
				    	connection.end();
                    }
                    else{ // ya esta registrado pero esta introduciendo un pwd erroneo
                    	if(isNaN($pwd))
                    		return done(null, false, {'message': 'Numero de Empleado invalido.'});

						$sql2 = 'SELECT * FROM tbl_usuarios WHERE registrado = ? AND activo = ? AND NumEmp = ?';
						var query = connectionManager.prepareQuery($sql2, [1, '1', $pwd]);	
						console.log("SQL2 "+query);

						connection.query(query, function (error, results) {
		                    if (error) 
		                        return done(null, false, {'message': 'Error con la Base de Datos.'});

		                    numRows = results.length; 
		                    console.log("deferred:"+JSON.stringify(results));
		                    if(numRows){
		                    	return done(null, false, {'message': 'El numero de Empleado: '+$pwd+' ya tiene un Password registrado, por favor accede con ese password.'});
		                    	//$r_json = JSON.parse(results[0]);
			                    if(results[0].Nombre){  
			                    	req.session.tipo = 'registrado';    
				                    req.session.ag = results[0].ag;
				                    req.session.NumEmp = results[0].NumEmp;
				                    req.session.grado = results[0].grado;
				                    req.session.puesto = results[0].puesto;
				                    req.session.nivel = results[0].nivel; 
				                    req.session.nombre_host = results[0].nombre_host;
				                    req.session.proceso = 24;
				                    req.session.unidades_permisos = results[0].descripcion_unidad_permisos;
				                    req.session.unidad_permisos = results[0].id_unidadDepto;

									req.session.g_nombre = results[0].Nombre; 
									req.session.g_ags = results[0].ag;
									req.session.g_id_unidadDepto = results[0].id_unidadDepto;
									req.session.g_NumEmp = results[0].NumEmp;
									req.session.g_nivel = results[0].nivel; 
									req.session.g_ag_permisos = results[0].ag_permisos;
									req.session.g_unidades_permisos = results[0].descripcion_unidad_permisos;

							        console.log("registrado pero esta introduciendo un pwd erroneo "+results[0].registrado);
							        return done(null, results[0]);  	
							    }
							}else{	// sin registro hay que registrarlo
								$sql3 = 'SELECT * FROM tbl_usuarios WHERE registrado = ? AND activo = ? AND NumEmp = ?';
								var query = connectionManager.prepareQuery($sql2, [0, '1', $pwd]);	
								console.log("SQL3 "+query);

								connection.query(query, function (error, results) {
				                    if (error) 
				                        return done(null, false, {'message': 'Error con la Base de Datos.'});

				                    numRows = results.length; 								
				                    if(numRows){
				                    	//$r_json = JSON.parse(results[0]);
					                    if(results[0].Nombre){ 

					                    	$id_unidadDepto = results[0].id_unidadDepto; 	
					                    	$id_unidadDepto = $id_unidadDepto.replace(/'/gi,""); 	
					                    	if($id_unidadDepto.length <= 4)
					                    		$sqlag = "SELECT * from cat_ag WHERE id_unidadDepto_4 = ?";
					                    	else
					                    		$sqlag = "SELECT * from cat_ag WHERE id_unidadDepto = ?";
					                    	console.log("------------------sqlag  "+$sqlag);	
					                    	console.log("------------------$id_unidadDepto  "+$id_unidadDepto);	
					                    	var queryag = connectionManager.prepareQuery($sqlag, [$id_unidadDepto]);
					                    	
					                    	connection.query(queryag, function (error, resultsAG) {
					                    		if (error) 
					                    			console.log("error  "+error);
					                    		numRows = resultsAG.length;
							                    if(numRows){
					                    	 		console.log("------------------descripcion_unidad_admin  "+resultsAG[0].descripcion_unidad_admin);	
					                    	 		$descripcion_unidad_admin = resultsAG[0].descripcion_unidad_admin;
							                    }else
							                    	$descripcion_unidad_admin = "";
					                    		//$ag = resultsAG[0].ag; 
					                    		
						                    
						                    req.session.numemp = results[0].NumEmp;
						                    req.session.nombre = results[0].Nombre;
						                    req.session.ag = results[0].ag;
						                    req.session.ag_permisos = results[0].ag_permisos;
						                    req.session.nivel = results[0].nivel;
						                    req.session.registrado = results[0].registrado;
						                    req.session.descripcion_unidad_permisos = results[0].descripcion_unidad_permisos;
						                    req.session.descripcion_unidad_admin = $descripcion_unidad_admin;

											req.session.g_nombre = results[0].Nombre; 
											req.session.g_ags = results[0].ag;
											req.session.g_id_unidadDepto = results[0].id_unidadDepto;
											req.session.g_NumEmp = results[0].NumEmp;
											req.session.g_nivel = results[0].nivel; 
											req.session.g_ag_permisos = results[0].ag_permisos;
											req.session.g_unidades_permisos = results[0].descripcion_unidad_permisos;

									        console.log("Nuevo Registro"+results[0].registrado);
									        return done(null, results[0]); 

					                    	});

 	
									    }
									}else
										return done(null, false, {'message': 'Sin permisos.'});
								});	
							}
							//connection.end();     		                    
						});			    		
			    		//return done(null, false, {'message': 'Usuario no existente.'});
			    		// {'message': 'No user found 1.'}	req.flash('message', 'Oops! Mauvais password.')
 
					}
                    	
                });
 

            }).then(function (connection) {

            }).fail(function (err) {
                console.error(err);
                return done(null, false, {'message': 'Error con la Base de Datos.'});
                //deferred.reject(err);
        });
    }
));

router.post('/login', passport.authenticate('local',{
    successRedirect: '/index.js',
    failureRedirect: '/',
    failureFlash: true
}));
//usuarios = geUsuarios();
router.get('/', function (req, res, next) {
    //var generales = connection.getGenerales();
	 err_login = req.flash('error');
	 console.log('req.err_login:'+err_login);

    res.render('login', {
      title: 'Directorio ACCH3',
      msg_err: err_login,
      registradoOK:''
    });
});
router.get('/logout', function(req, res) {
    req.logout();
    req.session.destroy(function (err) {
    res.redirect('/');
    });    
});

router.get('/index.js', function (req, res, next) {
    //var generales = connection.getGenerales();    
    console.log('-------------XXX>  '+req.isAuthenticated()); // +req.user  
    console.log('registrado:'+req.user['registrado'])
    console.log('nombre:'+req.user['Nombre'])
    console.log('ag_permisos:'+req.user['ag_permisos'])
    console.log('id_unidadDepto:'+req.user['id_unidadDepto'])
    console.log('descripcion_unidad_admin:'+req.session.descripcion_unidad_admin)
    console.log('req.session.nombre:'+req.session.nombre)

    authenticated = req.isAuthenticated();
    if(req.isAuthenticated() === true){
        if(req.user['registrado'] == '1'){
	        res.render('index', {
	          title: "EIDD 2016 - 2017",
	          g_usuario: req.user['Nombre'],
	          g_authenticated: authenticated,
	          id_unidadDepto: req.user['id_unidadDepto'],
	          obj: req.session,
	          ejs: "plantilla_contenido"
	        });
        }
        else{
	        res.render('login_registrar', {
	          title: "EIDD 2016 - 2017 - Registro",
	          g_usuario: req.user['Nombre'],
	          g_num_emp: req.user['NumEmp'],
	          g_authenticated: authenticated,
	          error: ''
	        });        	
        }

    }else
        res.redirect('/');
});
router.get('/registrado_ok', function (req, res, next) {
    res.render('index', {
      title: "EIDD 2016 - 2017",
      g_usuario: req.session.nombre,
      g_authenticated: true,
      id_unidadDepto: req.session.id_unidadDepto,
      obj: req.session
    });
});

router.post('/registrar_pwd', function(req, res, next) {	
	var pwd_reg_1 = req.body.pwd_reg_1;
	var num_emp = req.body.num_emp;
	var $pwd = "pwd|"+md5(pwd_reg_1); 	
    connectionManager.getConnection()
        .then(function (connection) {
        	 
			$sql = "SELECT NumEmp FROM tbl_usuarios WHERE password = ?";
			var $sql = connectionManager.prepareQuery($sql, [$pwd]);	        	
        	console.log("------------------------------------------------------------");
            connection.query($sql, function (error, results) {
                if (error) 
                    console.error(error);   
				
				numRows = results.length; 
				console.log("SQL1 "+$sql+" numRows:"+numRows);
				if(numRows){
					//return done(null, false, {'tipo': 'pwd_ocupado'});
                    //update_r = '{"tipo":"pwd_ocupado"}';                    
                    //res.json(update_r);
			        res.render('login_registrar', {
			          title: "EIDD 2016 - 2017 - Registro",
			          g_usuario: req.user['Nombre'],
			          g_num_emp: req.user['NumEmp'],
			          g_authenticated: authenticated,
			          error: 'Contraseña no disponible'
			        });                    	                
                    connection.end();    		        
				}else{ 
					console.log("if: "+pwd_reg_1+" != "+num_emp);
					if(pwd_reg_1 !== num_emp){
						$sql2 = "SELECT NumEmp FROM tbl_usuarios WHERE NumEmp = ? UNION SELECT NumEmp FROM tbl_usuarios WHERE password = ?";
						var $sql2 = connectionManager.prepareQuery($sql2, [pwd_reg_1, $pwd]);	
						console.log("SQL 2 "+$sql2);
						connection.query($sql2, function (error, results) {
			                if (error) 
			                    console.error(error); 						
							numRows = results.length; 
							console.log("OK SQL 2 rows: "+numRows);
							if(numRows){			 
						        res.render('login_registrar', {
						          title: "EIDD 2016 - 2017 - Registro",
						          g_usuario: req.user['Nombre'],
						          g_num_emp: req.user['NumEmp'],
						          g_authenticated: authenticated,
						          error: 'Contraseña no disponible'
						        });                    	                
			                    connection.end();
							}else{
								var now = new Date();
								fecha = date.format(now, 'YYYY/MM/DD HH:mm:ss');
								console.log("fecha:"+fecha);
								console.log("fecha:"+fecha);
								$sql2 = "UPDATE tbl_usuarios SET password = ?, registrado = ?, fecha_registro = ? WHERE NumEmp = ?";
								var $sql_update = connectionManager.prepareQuery($sql2, [$pwd, '1', fecha, num_emp]);					
								
								//$sql_update = "UPDATE tbl_usuarios SET password = '"+$pwd+"', registrado = 1, fecha_registro = '"+fecha+"' WHERE NumEmp = '"+num_emp+"'";
				                console.log("OK SQL 3: "+$sql_update);
				                connection.query($sql_update, function (error, results) {
					                if (error){
					                    console.error(error); 	
					                	update_r = '{"tipo":"error_execute"}';
					                	connection.end();
					                	res.json(update_r);		                    
					                }
					                console.log("results.affectedRows:"+results.affectedRows);
					                if(results.affectedRows){
					                	console.log("render INDEX - pwd_reg_1 !== num_emp");
					                	res.redirect('/registrado_ok');					                	
					                	connection.end(); 
					                   /*
					                    update_r = '{"tipo":"updateOK"}';
					                    res.json(update_r);	 
					                                   	
					                	//res.redirect('/registrado_ok');
					                	
								        res.render('index', {
								          title: "Directorio ACCH3",
								          g_usuario: req.session.nombre,
								          g_authenticated: true
								        });
				                		*/
					                }else{
					                	update_r = '{"tipo":"error_execute"}';
					                	res.json(update_r);		
					                }
					                //connection.end();	
				                });	
							}		            
							
			            });	

					}else{
								var now = new Date();
								fecha = date.format(now, 'YYYY/MM/DD HH:mm:ss');
								console.log("fecha:"+fecha);
								console.log("fecha:"+fecha);
								$sql2 = "UPDATE tbl_usuarios SET password = ?, registrado = ?, fecha_registro = ? WHERE NumEmp = ?";
								var $sql_update = connectionManager.prepareQuery($sql2, [$pwd, '1', fecha, num_emp]);					
								
								//$sql_update = "UPDATE tbl_usuarios SET password = '"+$pwd+"', registrado = 1, fecha_registro = '"+fecha+"' WHERE NumEmp = '"+num_emp+"'";
				                console.log("OK SQL 3: "+$sql_update);
				                connection.query($sql_update, function (error, results) {
					                if (error){
					                    console.error(error); 	
					                	update_r = '{"tipo":"error_execute"}';
					                	connection.end();
					                	res.json(update_r);		                    
					                }
					                console.log("results.affectedRows:"+results.affectedRows);
					                if(results.affectedRows){
					                	console.log("render INDEX =="+pwd_reg_1);
					                	req.session.registradoOK=pwd_reg_1;
					                	res.redirect('/registrado_ok');
					                	
					                	connection.end(); 
					                   /*
					                    update_r = '{"tipo":"updateOK"}';
					                    res.json(update_r);	 
					                                   	
					                	//res.redirect('/registrado_ok');
					                	
								        res.render('index', {
								          title: "Directorio ACCH3",
								          g_usuario: req.session.nombre,
								          g_authenticated: true
								        });
				                		*/
					                }else{
					                	update_r = '{"tipo":"error_execute"}';
					                	res.json(update_r);		
					                }
					                //connection.end();	
				                });	
							}
					
				}
		                     			 				
			});	
				/*

				$sql = "UPDATE tbl_usuarios SET password = '$pwd', registrado = 1, fecha_registro = '".date('Y-m-d H:i:s')."' WHERE NumEmp = '$no_empleado'";
				if ($result = $conn->conn_mysqli->query($sql)) {
					if($conn->conn_mysqli->affected_rows){
						echo '{"tipo":"updateOK","pwd":"'.$pwd_1.'"}';
					}else
						echo '{"tipo":"updateERR"}';
				}else
					echo '{"tipo":"errConexion","err_txt":"Problemas con el Servidor."}';
                
                */	
        })
        .fail(function (err) {
            console.error(JSON.stringify(err));
            //deferred.reject(err);
    	}); 
    	  
});

router.post('/resultados_eidd_xunidad', function(req, res, next) {
    	resp = '{"accion":"OK", "descripcion":"'+req.session.g_unidades_permisos+'", "g_ags":"'+req.session.g_ags+'", "g_nivel":"'+req.session.g_nivel+'"}';
    	$usr_ag = req.session.g_ags;
    	$descripcion_unidad_permisos = req.session.g_unidades_permisos;
    	$g_nivel = req.session.g_nivel;
    	
		if($usr_ag == 'GENERAL')
			$usr_ag = $gerales;
		else
			$usr_ag = $usr_ag;			
			
		if($descripcion_unidad_permisos == "'GENERAL'")
			$unidad_permisos = "";
		else{	 
			if($descripcion_unidad_permisos.length >= 8 && $g_nivel != "Central_Local")
				$unidad_permisos = "AND id_ag IN("+$descripcion_unidad_permisos+")";
			else
				$unidad_permisos = "AND id_ag_4 IN("+$descripcion_unidad_permisos+")";			
		}

		if($g_nivel == "General")
			$unidad_permisos = "";
		$sql2 = "";
		if($g_nivel == "Central"){
			$unidad_permisos = "AND id_ag_4 IN("+$descripcion_unidad_permisos+")";
		   	$sql = "SELECT id_empleado, COUNT(id_empleado) AS total, perfil_final,  ambito, id_ag_4 "+
				"FROM tbl_resumen_unidad "+
				"WHERE unidad_negocio IN ('"+$usr_ag+"') AND perfil_final!='Sin_Perfil'  "+$unidad_permisos+
				" GROUP BY perfil_final, ambito ";
				/*+				
				"UNION "+				
				"SELECT id_empleado, COUNT(id_empleado) AS total, perfil_final,  ambito, id_ag_4 "+
				"FROM tbl_resumen_unidad "+
				"WHERE unidad_negocio IN ('"+$usr_ag+"')  AND ambito = 'LOCAL' AND perfil_final!='Sin_Perfil' "+
				"GROUP BY perfil_final, ambito ORDER BY ambito"; 	*/		
		//if($g_nivel == "Central" && $ambito == "LOCAL")
		}else{
			$sql = "SELECT id_empleado, COUNT(id_empleado) AS total, perfil_final,  ambito, id_ag_4 "+
				"FROM `tbl_resumen_unidad` "+
				"WHERE unidad_negocio IN ('"+$usr_ag+"')  "+$unidad_permisos+
				"GROUP BY perfil_final, ambito ORDER BY ambito"; 
		}
		console.log("sql resultados_eidd_xunidad: "+$sql);
	    connectionManager.getConnection()
	        .then(function (connection) {

	            connection.query($sql, function (error, results) {
	                if (error) 
	                    return res.json('{"error":"errSQL","err_txt":"Problemas con la Base de Datos"}');	
					
					numRows = results.length; 
					console.log(results[0]);
					if(numRows){					
		                var proj = JSON.stringify(results);
		                console.log(proj); 
						res.json(proj);	
						/*
						setTimeout(function() {
						  res.json(proj);	
						}, 3000);
						*/							
					}	
					connection.end(); 
				});
			});	    	
});
 
// En Central o Local al dar click regresa sus Unidades Administrativas. 
router.get('/resultados_eidd_detalles', function(req, res, next) { 
	// $conn->get_x_unidad_detalles_central_local($usr_ag, $tipo_vista, $_SESSION['g_unidades_permisos'],$_SESSION['g_nivel']);
	// function get_x_unidad_detalles_central_local($usr_ag, $ambito, $descripcion_unidad_permisos, $g_nivel){
		$ambito = req.query.ambito; 
    	$descripcion_unidad_permisos = req.session.g_unidades_permisos;
    	$g_nivel = req.session.g_nivel;	
		console.log("g_nivel:"+$g_nivel + " ambito:"+$ambito);

		$ambito_sql = " AND ambito = '"+$ambito+"' ";
		if($usr_ag == 'GENERAL')
			$usr_ag = $gerales;
		else
			$usr_ag = req.query.usr_ag;
		
		if($descripcion_unidad_permisos == "'GENERAL'")
			$unidad_permisos = "";
		//else
		//	$unidad_permisos = "AND id_ag IN(".$descripcion_unidad_permisos.")";	
			
		if($g_nivel == "General")
			$unidad_permisos = "";

		if($g_nivel == "Central" && $ambito == "CENTRAL")
			$unidad_permisos = "AND id_ag_4 IN("+$descripcion_unidad_permisos+")";
			
		if($g_nivel == "Local" && $ambito == "LOCAL")
			$unidad_permisos = "AND id_ag_4 IN("+$descripcion_unidad_permisos+")";	
					
		if($g_nivel == "Central" && $ambito == "LOCAL")
			$unidad_permisos = "";
			
		if($g_nivel == "Central_Local" ){
			$unidad_permisos = "AND id_ag_4 IN("+$descripcion_unidad_permisos+")";
			$ambito = "";	
		}
		
		$sql = "SELECT id_empleado, COUNT(id_empleado) AS total, perfil_final, ambito, id_ag, id_ag_4, descripcion_unidad_admin, descripcion_unidad "+
				"FROM tbl_resumen_unidad "+
				"WHERE unidad_negocio IN ("+$usr_ag+") "+$ambito_sql+" "+$unidad_permisos+"  AND perfil_final!='Sin_Perfil'  GROUP BY perfil_final, descripcion_unidad ORDER BY descripcion_unidad";

		console.log("SQL resultados_eidd_detalles: "+$sql);
	    connectionManager.getConnection()
	        .then(function (connection) {

	            connection.query($sql, function (error, results) {
	                if (error) 
	                    console.error(error);   
					
					numRows = results.length; 
					console.log(results[0]);
					if(numRows){
		                var proj = JSON.stringify(results);
		                console.log(proj); 
						res.json(proj);	
					}	
					connection.end(); 
				});
			});	

});

// Desglosar Las Unidades Administrativas de la Central
router.get('/resultados_eidd_detalles_admin', function(req, res, next) {
														 //($usr_ag, $ambito, $g_unidades_permisos,$_SESSION['g_nivel'], $vista);
	// function get_x_unidad_detalles_central_local_admin($usr_ag, $ambito, $descripcion_unidad_permisos, $g_nivel, $vista){
	$g_nivel = req.session.g_nivel;	
	$descripcion_unidad_permisos = "'"+req.query.clave_admin+"'"; //req.session.g_unidades_permisos;
	$ambito = req.query.ambito;
	$vista = req.query.vista;



	if($usr_ag == 'GENERAL') 
		$usr_ag = $gerales;
	else
		$usr_ag = req.query.usr_ag;

	if($descripcion_unidad_permisos == "'GENERAL'")
		$unidad_permisos = "";
	else{
		// no cuadra cantidades de central con las mostradas en las administraciones la razon  por el digito de 4 ej 300G pero tmb hay 201G y el td solo toma uno
		if($vista == "central") // Busca todas las administraciones de dicha Central
			$unidad_permisos = "AND id_ag_4 IN("+$descripcion_unidad_permisos+")";			
		else
			$unidad_permisos = "AND id_ag IN("+$descripcion_unidad_permisos+")";			
	}
	// se anula esta condicion ya que cuando el GENERAL visualiza una central listaba todas las administraciones en general
	if($g_nivel == "GeneralX")	
		$unidad_permisos = "";

	$sql = "SELECT id_empleado, COUNT(id_empleado) AS total, perfil_final,tbl_resumen_unidad.ambito, id_ag, id_ag_4, descripcion_unidad, cat_ag.descripcion_unidad_admin "+
			"FROM `tbl_resumen_unidad`, cat_ag "+ 
			"WHERE cat_ag.id_unidadDepto = tbl_resumen_unidad.id_ag AND perfil_final!='Sin_Perfil' AND unidad_negocio IN ("+$usr_ag+") and tbl_resumen_unidad.ambito='"+$ambito+"' "+$unidad_permisos+" "+  
			"GROUP BY perfil_final, cat_ag.descripcion_unidad_admin ORDER BY descripcion_unidad_admin";


		console.log("SQL resultados_eidd_detalles_admin: "+$sql);
	    connectionManager.getConnection()
	        .then(function (connection) {

	            connection.query($sql, function (error, results) {
	                if (error) 
	                    console.error(error);   
					
					numRows = results.length; 
					console.log(results[0]);
					if(numRows){
		                var proj = JSON.stringify(results);
		                console.log(proj); 
						res.json(proj);	
					}	
					connection.end(); 
				});
			});	
});




router.post('/resultados_eidd_xunidad_restringido_admin', function(req, res, next) {
    	resp = '{"accion":"OK", "descripcion":"'+req.session.g_unidades_permisos+'", "g_ags":"'+req.session.g_ags+'", "g_nivel":"'+req.session.g_nivel+'"}';
    	$usr_ag = req.session.g_ags;
    	$descripcion_unidad_permisos = req.session.g_unidades_permisos;
    	$g_nivel = req.session.g_nivel;
    	
		if($usr_ag == 'GENERAL')
			$usr_ag = $gerales;
		else
			$usr_ag = $usr_ag;			
			
		if($descripcion_unidad_permisos == "'GENERAL'")
			$unidad_permisos = "";
		else{	 
			if($descripcion_unidad_permisos.length >= 8 && $g_nivel != "Central_Local")
				$unidad_permisos = "AND id_ag IN("+$descripcion_unidad_permisos+")";
			else
				$unidad_permisos = "AND id_ag_4 IN("+$descripcion_unidad_permisos+")";			
		}

		if($g_nivel == "General")
			$unidad_permisos = "";
		$sql2 = "";
		if($g_nivel == "Central"){
			$unidad_permisos = "AND id_ag_4 IN("+$descripcion_unidad_permisos+")";
		   	$sql = "SELECT id_empleado, COUNT(id_empleado) AS total, perfil_final,  ambito, id_ag_4 "+
				"FROM tbl_resumen_unidad "+
				"WHERE unidad_negocio IN ('"+$usr_ag+"') AND perfil_final!='Sin_Perfil'  "+$unidad_permisos+
				" GROUP BY perfil_final, ambito "+				
				"UNION "+				
				"SELECT id_empleado, COUNT(id_empleado) AS total, perfil_final,  ambito, id_ag_4 "+
				"FROM tbl_resumen_unidad "+
				"WHERE unidad_negocio IN ('"+$usr_ag+"')  AND ambito = 'LOCAL' AND perfil_final!='Sin_Perfil' "+
				"GROUP BY perfil_final, ambito ORDER BY ambito"; 			
		//if($g_nivel == "Central" && $ambito == "LOCAL")
		}else{
			$sql = "SELECT id_empleado, COUNT(id_empleado) AS total, perfil_final,  ambito, id_ag_4 "+
				"FROM `tbl_resumen_unidad` "+
				"WHERE unidad_negocio IN ('"+$usr_ag+"')  "+$unidad_permisos+
				"GROUP BY perfil_final, ambito ORDER BY ambito"; 
		}
		console.log("sql resultados_eidd_xunidad_restringido_admin: "+$sql);
	    connectionManager.getConnection()
	        .then(function (connection) {

	            connection.query($sql, function (error, results) {
	                if (error) 
	                    return res.json('{"error":"errSQL","err_txt":"Problemas con la Base de Datos"}');	
					
					numRows = results.length; 
					console.log(results[0]);
					if(numRows){					
		                var proj = JSON.stringify(results);
		                console.log(proj); 
						res.json(proj);	
						/*
						setTimeout(function() {
						  res.json(proj);	
						}, 3000);
						*/							
					}	
					connection.end(); 
				});
			});	    	
});

// Regresa resultados para el caso de Central_Local
router.post('/resultados_eidd_xunidad_restringido', function(req, res, next) {
    	resp = '{"accion":"OK", "descripcion":"'+req.session.g_unidades_permisos+'", "g_ags":"'+req.session.g_ags+'", "g_nivel":"'+req.session.g_nivel+'"}';
    	$usr_ag = req.session.g_ags;
    	$descripcion_unidad_permisos = req.session.g_unidades_permisos;
    	$g_nivel = req.session.g_nivel;
    	



		if($usr_ag == 'GENERAL')
			$usr_ag = $gerales;
		else
			$usr_ag = $usr_ag;			
			
		if($descripcion_unidad_permisos == "'GENERAL'")
			$unidad_permisos = "";
		else{			
			if($descripcion_unidad_permisos.length >= 8 && $g_nivel != "Central_Local")
				$unidad_permisos = "AND id_ag IN("+$descripcion_unidad_permisos+")";
			else
				$unidad_permisos = "AND id_ag_4 IN("+$descripcion_unidad_permisos+")";	
		}
		if($g_nivel == "General")
			$unidad_permisos = "";

		if($g_nivel == "Central"){
			$unidad_permisos = "AND id_ag_4 IN("+$descripcion_unidad_permisos+")";
		   	$sql = "SELECT id_empleado, COUNT(id_empleado) AS total, perfil_final,  ambito "+
				"FROM `tbl_resumen_unidad` "+
				"WHERE unidad_negocio IN ('"+$usr_ag+"')  "+$unidad_permisos+
				"GROUP BY perfil_final, ambito "+
				
				"UNION"+ 
				
				"SELECT id_empleado, COUNT(id_empleado) AS total, perfil_final,  ambito "+
				"FROM `tbl_resumen_unidad` "+
				"WHERE unidad_negocio IN ('"+$usr_ag+"')  AND ambito = 'LOCAL'"+
				"GROUP BY perfil_final, ambito ORDER BY ambito"; 			
		//if($g_nivel == "Central" && $ambito == "LOCAL")
		}else{
			$sql = "SELECT id_empleado, COUNT(id_empleado) AS total, perfil_final,  ambito "+
				"FROM `tbl_resumen_unidad` "+
				"WHERE unidad_negocio IN ('"+$usr_ag+"')  "+$unidad_permisos+
				"GROUP BY perfil_final, ambito ORDER BY ambito"; 
		}

		console.log("sql resultados_eidd_xunidad_restringido:********************* "+$sql);
	    connectionManager.getConnection()
	        .then(function (connection) {

	            connection.query($sql, function (error, results) {
	                if (error) 
	                    return res.json('{"error":"errSQL","err_txt":"Problemas con la Base de Datos"}');	
					
					numRows = results.length; 
					console.log(results[0]);
					if(numRows){					
		                var proj = JSON.stringify(results);
		                console.log(proj); 
						res.json(proj);	
						/*
						setTimeout(function() {
						  res.json(proj);	
						}, 3000);
						*/							
					}	
					connection.end(); 
				});
			});			    	
});



/*************************************************  brechasxelemento  *****************************************************/
router.get('/resultados_eidd_xelemento', function(req, res, next) {

 //get_x_elemento($ag, $descripcion_unidad_permisos, $g_nivel)

    	resp = '{"accion resultados_eidd_xelemento":"OK", "descripcion":"'+req.session.g_unidades_permisos+'", "g_ags":"'+req.session.g_ags+'", "g_nivel":"'+req.session.g_nivel+'"}';
    	console.log(req.session)
    	$usr_ag = req.session.g_ags;
    	$descripcion_unidad_permisos = req.session.g_unidades_permisos;
    	$g_nivel = req.session.g_nivel;

		if($usr_ag == 'GENERAL')
			$usr_ag = $gerales;
		else
			$usr_ag = $usr_ag;			
			
		if($descripcion_unidad_permisos == "'GENERAL'")
			$unidad_permisos = "";
		else{			 
			if($descripcion_unidad_permisos.length >= 8 && $g_nivel != "Central_Local")
				$unidad_permisos = "AND id_ag IN("+$descripcion_unidad_permisos+")";
			else
				$unidad_permisos = "AND id_ag_4 IN("+$descripcion_unidad_permisos+")";	
		}
		if($g_nivel == "General")
			$unidad_permisos = "";

		// La tabla tbl_resumen_nivel tiene lo mismo que tbl_elementos por lo que la sustituye	
		$sql = "SELECT id_empleado, ambito, AVG(fcal_360) AS fcal_360, AVG(fcal_indicadores) AS fcal_indicadores,AVG(fcal_entorno)  AS fcal_entorno "+
				"FROM `tbl_resumen_nivel` WHERE unidad_negocio IN ('"+$usr_ag+"') "+$unidad_permisos+
				"GROUP BY ambito";

		console.log("sql resultados_eidd_xelemento:********************* "+$sql);
	    connectionManager.getConnection()
	        .then(function (connection) {

	            connection.query($sql, function (error, results) {
	                if (error) 
	                    return res.json('{"error":"errSQL","err_txt":"Problemas con la Base de Datos"}');	
					
					numRows = results.length; 
					console.log(results[0]);
					if(numRows){					
		                var proj = JSON.stringify(results);
		                console.log(proj); 
  
						res.json(proj);							
					}	
					connection.end(); 
				});
			});					
 
});

/*************************************************  Comparativo VS  *****************************************************/
router.get('/resultados_x_vs', function(req, res, next) {

    	$usr_ag = req.session.g_ags;
    	$descripcion_unidad_permisos = req.session.g_unidades_permisos;
    	$g_nivel = req.session.g_nivel;


		$ambito = $g_nivel.toUpperCase();
		if($ambito == 'LOCAL'){
			$ambito = " AND ambito='LOCAL' ";
			$agrupar = "perfil_final, ambito";
		}
		if($ambito == 'CENTRAL' || $ambito == 'ADMIN'){
			$ambito = " AND ambito='CENTRAL' ";	
			$agrupar = "perfil_final, ambito";
		}
		if($ambito == 'CENTRAL_LOCAL'){
			$ambito = "  AND (ambito='CENTRAL' OR ambito = 'LOCAL' OR ambito = 'REGIONAL') ";
			$agrupar = "perfil_final";
		}
		if($ambito == 'GENERAL'){
			$ambito = "  AND (ambito='CENTRAL' OR ambito = 'LOCAL' OR ambito = 'REGIONAL') ";
			$agrupar = "perfil_final";
		}	
		if($ambito == 'TEST'){
			$ambito = "  ";
			$agrupar = "perfil_final";
		}			
		if($usr_ag == 'GENERAL')
			$usr_ag = $gerales;
		else
			$usr_ag = $usr_ag;	


		if($descripcion_unidad_permisos == "'GENERAL'")
			$unidad_permisos = "";
		else{
			//$unidad_permisos = "AND id_ag IN(".$descripcion_unidad_permisos.")"; 
			if($descripcion_unidad_permisos.length >= 8 && $g_nivel != "Central_Local")
				$unidad_permisos = "AND id_ag IN("+$descripcion_unidad_permisos+")";
			else
				$unidad_permisos = "AND id_ag_4 IN("+$descripcion_unidad_permisos+")";				
		}
		if($g_nivel == "General")
			$unidad_permisos = "";
 
							
		$sql = `SELECT id_empleado, 'Deficiente' as perfilvs, perfil_final, COUNT(id_empleado) AS totales_vs FROM tbl_comparativo2013vs2012
				WHERE unidad_negocio IN ('${$usr_ag}') ${$ambito} ${$unidad_permisos} AND
				perfil_final_2012_2013 = 'Deficiente' GROUP BY ${$agrupar}
				
				UNION
				
				SELECT id_empleado, 'Emergente' as perfilvs, perfil_final, COUNT(id_empleado) AS totales_vs FROM tbl_comparativo2013vs2012
				WHERE unidad_negocio IN ('${$usr_ag}') ${$ambito} ${$unidad_permisos} AND
				perfil_final_2012_2013 = 'Emergente' GROUP BY ${$agrupar}
				
				UNION
				
				SELECT id_empleado, 'Normal' as perfilvs, perfil_final, COUNT(id_empleado) AS totales_vs FROM tbl_comparativo2013vs2012
				WHERE unidad_negocio IN ('${$usr_ag}') ${$ambito} ${$unidad_permisos} AND
				perfil_final_2012_2013 = 'Normal' GROUP BY ${$agrupar}
				
				UNION
				
				SELECT id_empleado, 'Potencial' as perfilvs, perfil_final, COUNT(id_empleado) AS totales_vs FROM tbl_comparativo2013vs2012
				WHERE unidad_negocio IN ('${$usr_ag}') ${$ambito} ${$unidad_permisos} AND
				perfil_final_2012_2013 = 'Potencial' GROUP BY ${$agrupar}
				
				UNION
				
				SELECT id_empleado, 'Alto' as perfilvs, perfil_final, COUNT(id_empleado) AS totales_vs FROM tbl_comparativo2013vs2012
				WHERE unidad_negocio IN ('${$usr_ag}') ${$ambito} ${$unidad_permisos} AND
				perfil_final_2012_2013 = 'Alto' GROUP BY ${$agrupar}
				
				UNION
				
				SELECT id_empleado, 'Superior' as perfilvs, perfil_final, COUNT(id_empleado) AS totales_vs FROM tbl_comparativo2013vs2012
				WHERE unidad_negocio IN ('${$usr_ag}') ${$ambito} ${$unidad_permisos} AND
				perfil_final_2012_2013 = 'Superior' GROUP BY ${$agrupar}`;	


		console.log("sql resultados_x_vs:********************* "+$sql);
	    connectionManager.getConnection()
	        .then(function (connection) {

	            connection.query($sql, function (error, results) {
	                if (error) 
	                    return res.json('{"error":"errSQL","err_txt":"Problemas con la Base de Datos"}');	
					
					numRows = results.length; 
					console.log(results[0]);
					if(numRows){					
		                var proj = JSON.stringify(results);
		                console.log(proj); 
  
						res.json(proj);							
					}	
					connection.end(); 
				});
			});	
 
});

router.get('/resultados_eidd_xnivel', function(req, res, next) {
	// $usr_ag, $ambito, $perfil_final_2012_2013, $perfil_final, $descripcion_unidad_permisos, $g_nivel, $orderby='ORDER BY vs.nombre'
	$usr_ag = req.query.usr_ag;
	$ambito = req.query.ambito;
	$descripcion_unidad_permisos = req.session.g_unidades_permisos;
	$perfil_final  = req.query.perfil_final;	
	$g_nivel = req.session.g_nivel;	
	$orderby = req.query.orderby;	
 	
 	$ambito = $g_nivel.toUpperCase();
	console.log("ambito: "+$ambito); 

 
		if($ambito == 'LOCAL'){
			$ambito = " AND ambito='LOCAL' ";
			$agrupar = "perfil_final, ambito";
		}
		if($ambito == 'CENTRAL' || $ambito == 'ADMIN'){
			$ambito = " AND ambito='CENTRAL' ";	
			$agrupar = "perfil_final, ambito";
		}
		if($ambito == 'CENTRAL_LOCAL'){
			$ambito = "  AND (ambito='CENTRAL' OR ambito = 'LOCAL' OR ambito = 'REGIONAL') ";
			$agrupar = "perfil_final";
		}
		if($ambito == 'GENERAL'){
			$ambito = "  AND (ambito='CENTRAL' OR ambito = 'LOCAL' OR ambito = 'REGIONAL') ";
			$agrupar = "perfil_final";
		}	
		if($ambito == 'TEST'){
			$ambito = "  ";
			$agrupar = "perfil_final";
		}
console.log("1: "); 	
		if($usr_ag == 'GENERAL')
			$usr_ag = $gerales;
		else
			$usr_ag = $usr_ag;	
console.log("2: "); 
		if($descripcion_unidad_permisos == "'GENERAL'")
			$unidad_permisos = "";
		else{
			if($descripcion_unidad_permisos.length >= 8 && $g_nivel != "Central_Local")
				$unidad_permisos = "AND vs.id_ag IN("+$descripcion_unidad_permisos+")";
			else{
				console.log("3: "); 
				if($g_nivel == 'Central_Local')
					$unidad_permisos = "AND (id_ag_4 IN("+$descripcion_unidad_permisos+") )";
				if($g_nivel == 'Central' || $g_nivel == 'Local')
					$unidad_permisos = "AND id_ag_4 IN("+$descripcion_unidad_permisos+")";					
			}
		}

		if($g_nivel == "General")
			$unidad_permisos = ""; 

console.log("sql: "); 
		$sql = `
				SELECT id_empleado, 'Administrador' as perfilvs, perfil_final, COUNT(perfil_final) as totales_vs 
				FROM tbl_resumen_nivel
				WHERE unidad_negocio IN (${$usr_ag}) ${$ambito} AND puesto_nivel= 'Administrador' ${$unidad_permisos}
				GROUP BY ${$agrupar}
				
				UNION
				
				SELECT id_empleado, 'Subadministrador' as perfilvs, perfil_final, COUNT(perfil_final) as totales_vs 
				FROM tbl_resumen_nivel
				WHERE unidad_negocio IN (${$usr_ag}) ${$ambito} AND puesto_nivel= 'Subadministrador' ${$unidad_permisos}
				GROUP BY ${$agrupar}
				
				UNION
				
				SELECT id_empleado, 'Jefe de departamento' as perfilvs, perfil_final, COUNT(perfil_final) as totales_vs 
				FROM tbl_resumen_nivel
				WHERE unidad_negocio IN (${$usr_ag}) ${$ambito} AND puesto_nivel= 'Jefe de departamento' ${$unidad_permisos}
				GROUP BY ${$agrupar}
				
				UNION
				
				SELECT id_empleado, 'Enlace' as perfilvs, perfil_final, COUNT(perfil_final) as totales_vs 
				FROM tbl_resumen_nivel
				WHERE unidad_negocio IN (${$usr_ag}) ${$ambito} AND puesto_nivel= 'Enlace' ${$unidad_permisos}
				GROUP BY ${$agrupar}
				
				UNION
				
				SELECT id_empleado, 'Operativo' as perfilvs, perfil_final, COUNT(perfil_final) as totales_vs
				FROM tbl_resumen_nivel
				WHERE unidad_negocio IN (${$usr_ag}) ${$ambito} AND puesto_nivel= 'Operativo' ${$unidad_permisos}
				GROUP BY ${$agrupar} `;	




	console.log("SQL resultados_eidd_xnivel: "+$sql); 
    connectionManager.getConnection()
        .then(function (connection) {

            connection.query($sql, function (error, results) {
                if (error) 
                    console.error(error);   
				
				numRows = results.length; 
				console.log(results[0]);
				if(numRows){
	                var proj = JSON.stringify(results);
	                console.log(proj); 
					res.json(proj);	
				}	
				connection.end(); 
			});
		});	
});




router.get('/resultados_x_brechasxnivel', function(req, res, next) {
	// $usr_ag, $ambito, $perfil_final_2012_2013, $perfil_final, $descripcion_unidad_permisos, $g_nivel, $orderby='ORDER BY vs.nombre'
 	$descripcion_unidad_permisos = req.session.g_unidades_permisos;
	$g_nivel = req.session.g_nivel;	
	$usr_ag = req.query.usr_ag;

	if($g_nivel == 'Admin' || $g_nivel == 'Central' || $g_nivel == 'Local' || $g_nivel == 'Central_Local'){
		if($descripcion_unidad_permisos.length >= 8 && $g_nivel != "Central_Local")
			$unidad_permisos = " AND id_ag IN("+$descripcion_unidad_permisos+")";
		else
			$unidad_permisos = " AND id_ag_4 IN("+$descripcion_unidad_permisos+")";
	}

	if($g_nivel == "General")
		$unidad_permisos = "";
			
	$sql = `SELECT id_empleado, puesto_nivel, 
				SUM(trabajo_equipo) AS trabajo_equipo, 
				SUM(comunicacion) AS comunicacion, 
				SUM(actitud_servicio) AS actitud_servicio, 
				SUM(orientacion_resultados) AS orientacion_resultados, 
				SUM(analisis_problemas) AS analisis_problemas,
				SUM(liderazgo) AS liderazgo,
				SUM(organizacion) AS organizacion,
				SUM(negociacion) AS negociacion,
				SUM(toma_decisiones) AS toma_decisiones,
				COUNT(id_empleado) AS personal_formar,
				total_brechas
			FROM tbl_brechas
			WHERE unidad_negocio IN (${$usr_ag}) ${$unidad_permisos}
			GROUP BY puesto_nivel`; 

	console.log("SQL resultados_eidd_xnivel: "+$sql); 
    connectionManager.getConnection()
        .then(function (connection) {

            connection.query($sql, function (error, results) {
                if (error) 
                    console.error(error);   
				
				numRows = results.length; 
				console.log(results[0]);
				if(numRows){
	                var proj = JSON.stringify(results);
	                console.log(proj); 
					res.json(proj);	
				}	
				connection.end(); 
			});
		});	
});

router.get('/resultados_x_brechasxUA', function(req, res, next) {
	// $usr_ag, $ambito, $perfil_final_2012_2013, $perfil_final, $descripcion_unidad_permisos, $g_nivel, $orderby='ORDER BY vs.nombre'
 	$descripcion_unidad_permisos = req.session.g_unidades_permisos;
	$g_nivel = req.session.g_nivel;	
	$usr_ag = req.query.usr_ag;

	if($usr_ag == 'GENERAL')
		$usr_ag = $gerales;
	else
		$usr_ag = $usr_ag;

	if($descripcion_unidad_permisos == "'GENERAL'")
		$unidad_permisos = "";
	else{
		if($descripcion_unidad_permisos.length >= 8 && $g_nivel != "Central_Local"){
			$unidad_permisos = " AND id_ag IN("+$descripcion_unidad_permisos+")";
			$descripcion_unidad = 'cat_ag.descripcion_unidad_admin as descripcion_unidad';	// Ver la Administracion
		}
		else{
			$unidad_permisos = " AND id_ag_4 IN("+$descripcion_unidad_permisos+")";
			$descripcion_unidad = 'cat_ag.ag as descripcion_unidad';	// Ver a Central
		}
	}
			

		$n_unidades = ($descripcion_unidad_permisos != "'GENERAL'") ? $descripcion_unidad_permisos.split(" ").length : 2;	
		
		if($n_unidades == 1 ){
			$sql = `SELECT id_empleado, unidad_negocio, 
			 SUM(trabajo_equipo) AS trabajo_equipo, 
			 SUM(comunicacion) AS comunicacion, 
			 SUM(actitud_servicio) AS actitud_servicio, 
			 SUM(orientacion_resultados) AS orientacion_resultados, 
			 SUM(analisis_problemas) AS analisis_problemas, 
			 SUM(liderazgo) AS liderazgo, 
			 SUM(organizacion) AS organizacion, 
			 SUM(negociacion) AS negociacion, 
			 SUM(toma_decisiones) AS toma_decisiones, 
			SUM(trabajo_equipo+comunicacion+actitud_servicio+orientacion_resultados+analisis_problemas+liderazgo+organizacion+negociacion+toma_decisiones) AS totalAG, ${$descripcion_unidad}
			FROM tbl_brechas, cat_ag
			WHERE cat_ag.id_unidadDepto=tbl_brechas.id_ag AND unidad_negocio IN (${$usr_ag}) ${$unidad_permisos} GROUP BY unidad_negocio`;
		}else{
			 $sql = `SELECT id_empleado, unidad_negocio, 
				SUM(trabajo_equipo) AS trabajo_equipo, 
				SUM(comunicacion) AS comunicacion, 
				SUM(actitud_servicio) AS actitud_servicio, 
				SUM(orientacion_resultados) AS orientacion_resultados, 
				SUM(analisis_problemas) AS analisis_problemas,
				SUM(liderazgo) AS liderazgo,
				SUM(organizacion) AS organizacion,
				SUM(negociacion) AS negociacion,
				SUM(toma_decisiones) AS toma_decisiones,
				SUM(trabajo_equipo+comunicacion+actitud_servicio+orientacion_resultados+analisis_problemas+liderazgo+organizacion+negociacion+toma_decisiones) AS totalAG
				FROM tbl_brechas WHERE unidad_negocio IN (${$usr_ag}) ${$unidad_permisos}
				GROUP BY unidad_negocio`;
		}

 
	console.log("SQL resultados_eidd_xbrechaUA: "+$sql); 
    connectionManager.getConnection()
        .then(function (connection) {

            connection.query($sql, function (error, results) {
                if (error) 
                    console.error(error);   
				
				numRows = results.length; 
				console.log(results[0]);
				if(numRows){
	                var proj = JSON.stringify(results);
	                console.log(proj); 
					res.json(proj);	
				}	
				connection.end(); 
			});
		});	
});


/***************************************************************************************************************/
// Detalles de los usuarios en PupUp
// buscar los empleados de a cuerdo a la Unidad Administrativa y el perfil solicitado (poppup)
/***************************************************************************************************************/
router.get('/detalles_usr', function(req, res, next) {
	
	$usr_ag = req.query.usr_ag;
	$ambito = req.query.ambito;
	$descripcion_unidad  = req.query.descripcion_unidad;
	$perfil_final  = req.query.perfil_final;
	$usr_ag = req.query.usr_ag;
	$vista = req.query.vista;
	$id_ag_4 = req.query.id_ag_4;	
	$g_nivel = req.session.g_nivel;	
 	
 	$unidad_permisos = "";
 	console.log("***-> SQL unidad_permisos: "+$unidad_permisos); 

	if(typeof(req.query.id_ag) != "undefined" && req.query.id_ag !== null)
		$g_unidades_permisos = "'"+req.query.id_ag+"'";
	else
		$g_unidades_permisos = "'"+req.session.g_unidades_permisos+"'";	

	$orderby='ORDER BY uni.nombre';
	if(typeof(req.query.orderby) != "undefined" && req.query.orderby !== null)
		$orderby = req.query.orderby;

	//($usr_ag, $ambito, $descripcion_unidad, $perfil_final, $g_nivel, $g_unidades_permisos, $orderby='ORDER BY uni.nombre', $id_ag, $id_ag_4, $vista="")
	//echo "g_nivel: ".$g_nivel." | id_ag_4: $id_ag_4 | vista: $vista | descripcion_unidad: $descripcion_unidad | g_unidades_permisos: $g_unidades_permisos<br>";
console.log("g_nivel: "+$g_nivel+" | vista: "+$vista+" | id_ag_4: "+$id_ag_4+" | descripcion_unidad: "+$descripcion_unidad+" | g_nivel: "+$g_nivel); 
console.log("SQL unidad_permisos: 1"+$unidad_permisos); 
	if($usr_ag == 'GENERAL')
		$usr_ag = $gerales;
	else
		$usr_ag = req.query.usr_ag;

	if($g_nivel == "General")
		$unidad_permisos = ""; 
	if($g_unidades_permisos == "'GENERAL'")
		$unidad_permisos = "AND tbl_ficha_2.descripcion_unidad IN('"+$descripcion_unidad+"')";	
	else{
		
		if($vista == 'uni_central')
			$unidad_permisos = "AND tbl_ficha_2.id_ag_4 IN('"+$id_ag_4+"')  "; //$unidad_permisos = " AND tbl_ficha_2.descripcion_unidad='".$descripcion_unidad."'";
		if($vista == 'uni_admin')
			$unidad_permisos = "AND tbl_ficha_2.id_ag IN("+$g_unidades_permisos+")  ";				
		//$unidad_permisos = "AND tbl_ficha_2.id_ag IN(".$g_unidades_permisos.") AND tbl_ficha_2.descripcion_unidad='".$descripcion_unidad."'";				
	}
 
	if($g_nivel == "Central"){	//if($g_nivel == "Central"){

		if($vista == 'uni_central')
			$unidad_permisos = "AND tbl_ficha_2.id_ag_4 IN('"+$id_ag_4+"')  ";
		if($vista == 'uni_admin')
			$unidad_permisos = "AND tbl_ficha_2.id_ag IN("+$g_unidades_permisos+")  ";
		
		if($ambito == "LOCAL")	// SI es un Central y quiere ver el personal de una local
			$unidad_permisos = " AND tbl_ficha_2.descripcion_unidad IN('"+$descripcion_unidad+"')";	
	}
	if($g_nivel == "Admin"){
		if($vista == 'uni_central')
			$unidad_permisos = "AND tbl_ficha_2.id_ag_4 IN('"+$id_ag_4+"')  ";
		if($vista == 'uni_admin')
			$unidad_permisos = "AND tbl_ficha_2.id_ag IN("+$g_unidades_permisos+")  ";
	}
	if($g_nivel == "Central_Local" ){
		if($vista == 'uni_central')
			$unidad_permisos = "AND tbl_ficha_2.id_ag_4 IN('"+$id_ag_4+"')  ";
		if($vista == 'uni_admin')
			$unidad_permisos = "AND tbl_ficha_2.id_ag IN("+$g_unidades_permisos+")  ";
	}
console.log("SQL unidad_permisos: "+$unidad_permisos); 
	/*$sql = "SELECT uni.id_empleado, uni.nombre, uni.perfil_final, uni.ambito, uni.descripcion_unidad, uni.fcal_360, uni.fcal_indicadores, uni.fcal_entorno, uni.fcal_EIDD, tbl_ficha_2.descripcion_unidad_admin as desc_unidad , tbl_ficha_2.puesto_nivel
			FROM `tbl_resumen_unidad` uni, `tbl_ficha_2`
			WHERE uni.id_empleado = tbl_ficha_2.num_empleado AND uni.unidad_negocio IN (".$usr_ag.") and uni.ambito='".$ambito."' and uni.descripcion_unidad = '".$descripcion_unidad."' AND uni.perfil_final = '".$perfil_final."'
			$orderby"; */
	$sql = "SELECT uni.id_empleado, uni.nombre, uni.perfil_final, uni.ambito, uni.descripcion_unidad, IFNULL(uni.fcal_360,0) fcal_360, IFNULL(uni.fcal_indicadores,0) fcal_indicadores, IFNULL(uni.fcal_entorno,0) fcal_entorno, IFNULL(uni.fcal_EIDD,0) fcal_EIDD, "+ 
			"tbl_ficha_2.descripcion_unidad_admin as desc_unidad , tbl_ficha_2.puesto_nivel "+
			"FROM `tbl_resumen_unidad` uni, `tbl_ficha_2` "+
			"WHERE uni.id_empleado = tbl_ficha_2.num_empleado AND uni.unidad_negocio IN ("+$usr_ag+") and uni.ambito='"+$ambito+"' "+
			$unidad_permisos+" AND uni.perfil_final = '"+$perfil_final+"' "+$orderby;	
	//echo "<br>";		

	console.log("SQL resultados_eidd_detalles_usr: "+$sql); 
    connectionManager.getConnection()
        .then(function (connection) {

            connection.query($sql, function (error, results) {
                if (error) 
                    console.error(error);   
				
				numRows = results.length; 
				console.log(results[0]);
				if(numRows){
	                var proj = JSON.stringify(results);
	                console.log(proj); 
					res.json(proj);	
				}	
				connection.end(); 
			});
		});	 
});

// buscar los empleados de a cuerdo a la Unidad Administrativa y el perfil solicitado (poppup)
router.get('/resultados_eidd_detalles_usr_vs', function(req, res, next) {
	// $usr_ag, $ambito, $perfil_final_2012_2013, $perfil_final, $descripcion_unidad_permisos, $g_nivel, $orderby='ORDER BY vs.nombre'
	$usr_ag = req.query.usr_ag;
	$ambito = req.query.ambito;
	$descripcion_unidad_permisos  = req.query.descripcion_unidad_permisos;
	$perfil_final_2012_2013  = req.query.perfil_final_2012_2013;	
	$perfil_final  = req.query.perfil_final;	
	$g_nivel = req.session.g_nivel;	
	$orderby = req.query.orderby;	
 	
	console.log("ambito: "+$ambito); 

		if($ambito == 'LOCAL'){
			$ambito = " AND vs.ambito='LOCAL' ";
		}
		if($ambito == 'CENTRAL' || $ambito == 'ADMIN'){
			$ambito = " AND vs.ambito='CENTRAL' ";	
		}
		if($ambito == 'CENTRAL_LOCAL'){
			$ambito = "  AND (vs.ambito='CENTRAL' OR vs.ambito = 'LOCAL' OR vs.ambito = 'REGIONAL') ";
		}	
		if($ambito == 'GENERAL'){
			$ambito = "  AND (vs.ambito='CENTRAL' OR vs.ambito = 'LOCAL' OR vs.ambito = 'REGIONAL') "; 
		}	
		if($ambito == 'TEST'){
			$ambito = "  "; 
		}

		if($usr_ag == 'GENERAL')
			$usr_ag = $gerales;
		else
			$usr_ag = $usr_ag;	
		if($descripcion_unidad_permisos == "'GENERAL'")
			$unidad_permisos = "";
		else{
			if($descripcion_unidad_permisos.length >= 8 && $g_nivel != "Central_Local")
				$unidad_permisos = "AND vs.id_ag IN("+$descripcion_unidad_permisos+")";
			else
				$unidad_permisos = "AND vs.id_ag_4 IN("+$descripcion_unidad_permisos+")";			
		}
		if($g_nivel == "General")
			$unidad_permisos = "";
				
		$sql = "SELECT vs.id_empleado, vs.nombre,  vs.fcal_EIDD, vs.perfil_final, vs.EIDD_2012_2013, vs.perfil_final_2012_2013, tbl_ficha_2.descripcion_unidad_admin as desc_unidad , tbl_ficha_2.puesto_nivel"+
				" FROM `tbl_comparativo2013vs2012` vs, `tbl_ficha_2`"+
				" WHERE vs.id_empleado = tbl_ficha_2.num_empleado AND vs.unidad_negocio IN ("+$usr_ag+") "+$ambito+" AND "+
				" vs.`perfil_final_2012_2013` = '"+$perfil_final_2012_2013+"' AND "+
				" vs.perfil_final = '"+$perfil_final+"' "+$unidad_permisos+" "+$orderby;




	console.log("SQL resultados_eidd_detalles_usr_vs: "+$sql); 
    connectionManager.getConnection()
        .then(function (connection) {

            connection.query($sql, function (error, results) {
                if (error) 
                    console.error(error);   
				
				numRows = results.length; 
				console.log(results[0]);
				if(numRows){
	                var proj = JSON.stringify(results);
	                console.log(proj); 
					res.json(proj);	
				}	
				connection.end(); 
			});
		});	
});


// buscar los empleados de a cuerdo a la Unidad Administrativa y el perfil solicitado (poppup)
router.get('/detalles_usr_resumenxnivel', function(req, res, next) {
	// $usr_ag, $ambito, $perfil_final_2012_2013, $perfil_final, $descripcion_unidad_permisos, $g_nivel, $orderby='ORDER BY vs.nombre'
	$usr_ag = req.query.usr_ag;
	$ambito = req.query.ambito;
	$descripcion_unidad_permisos  = req.query.descripcion_unidad; 	
	$perfil_final  = req.query.perfil_final;	
	$puesto_nivel = req.query.puesto_nivel;	
	$g_nivel = req.session.g_nivel;	
	$orderby = "ORDER BY niv.nombre";	
 	
	console.log("resultados_eidd_detalles_usr_resumenxnivel ambito: "+ JSON.stringify(req.query) ); 

 
		if($ambito == 'LOCAL'){
			$ambito = " AND niv.ambito='LOCAL' ";
		}
		if($ambito == 'CENTRAL' || $ambito == 'ADMIN'){
			$ambito = " AND niv.ambito='CENTRAL' ";	
		}
		if($ambito == 'CENTRAL_LOCAL'){
			$ambito = "  AND (niv.ambito='CENTRAL' OR niv.ambito = 'LOCAL'  OR niv.ambito = 'REGIONAL') ";
		}	
		if($ambito == 'GENERAL'){
			$ambito = "  AND (niv.ambito='CENTRAL' OR niv.ambito = 'LOCAL' OR niv.ambito = 'REGIONAL') "; 
		}	
		if($ambito == 'TEST'){
			$ambito = "  "; 
		}			
		if($usr_ag == 'GENERAL')
			$usr_ag = $gerales;
		else
			$usr_ag = $usr_ag;
		if($descripcion_unidad_permisos == "'GENERAL'")
			$unidad_permisos = "";
		else{
			if($descripcion_unidad_permisos.length >= 8 && $g_nivel != "Central_Local")
				$unidad_permisos = "AND niv.id_ag IN("+$descripcion_unidad_permisos+")";
			else{ 
				if($g_nivel == 'Central_Local')
					$unidad_permisos = "AND (niv.id_ag_4 IN("+$descripcion_unidad_permisos+") )";
				if($g_nivel == 'Central' || $g_nivel == 'Local')
					$unidad_permisos = "AND niv.id_ag_4 IN("+$descripcion_unidad_permisos+")";					
			}			
		}


	console.log("ok "+$usr_ag)
	console.log("ok "+$ambito)
	console.log("ok "+$puesto_nivel)
	console.log("ok "+$perfil_final)
	console.log("ok "+$unidad_permisos)
	console.log("ok "+$orderby)


		$sql = `SELECT niv.id_empleado, niv.nombre, niv.fcal_360, niv.fcal_indicadores, niv.fcal_entorno, niv.fcal_EIDD, niv.perfil_final, tbl_ficha_2.descripcion_unidad_admin as desc_unidad , tbl_ficha_2.puesto_nivel
				FROM tbl_resumen_nivel niv, tbl_ficha_2
				WHERE niv.id_empleado = tbl_ficha_2.num_empleado AND niv.unidad_negocio IN (${$usr_ag}) ${$ambito} AND 
					  niv.puesto_nivel= '${$puesto_nivel}' AND niv.perfil_final = '${$perfil_final}'  ${$unidad_permisos}
				GROUP BY niv.nombre
				${$orderby}`;
console.log("ok")



	console.log("SQL resultados_eidd_detalles_usr_vs: "+$sql); 
    connectionManager.getConnection()
        .then(function (connection) {

            connection.query($sql, function (error, results) {
                if (error) 
                    console.error(error);   
				
				numRows = results.length; 
				console.log(results[0]);
				if(numRows){
	                var proj = JSON.stringify(results);
	                console.log(proj); 
					res.json(proj);	
				}	
				connection.end(); 
			});
		});	
});


router.get('/detalles_usr_brechaxnivel_jerarquico', function(req, res, next) {
	// $usr_ag, $ambito, $perfil_final_2012_2013, $perfil_final, $descripcion_unidad_permisos, $g_nivel, $orderby='ORDER BY vs.nombre'
	$usr_ag = req.query.usr_ag;
	$ambito = req.query.ambito;
	$descripcion_unidad_permisos  = req.query.descripcion_unidad; 	
	$perfil_final  = req.query.perfil_final;	
	$puesto_nivel = req.query.puesto_nivel;	
	$g_nivel = req.session.g_nivel;	
	$orderby = "ORDER BY niv.nombre";	
 	$puesto_nivel = req.query.nivel;	
 	$campo_competencia = req.query.comp;	
		if($descripcion_unidad_permisos == "'GENERAL'")
			$unidad_permisos = "";
		else{
			if($descripcion_unidad_permisos.length >= 8 && $g_nivel != "Central_Local")
				$unidad_permisos = "AND tbl_ficha_2.id_ag IN("+$descripcion_unidad_permisos+")";
			else{ 
				if($g_nivel == 'Central_Local')
					$unidad_permisos = "AND (tbl_ficha_2.id_ag_4 IN("+$descripcion_unidad_permisos+") )";
				if($g_nivel == 'Central' || $g_nivel == 'Local')
					$unidad_permisos = "AND tbl_ficha_2.id_ag_4 IN("+$descripcion_unidad_permisos+")";					
			}
		}	

		$g_unidades_permisos = req.session.g_unidades_permisos;	
			
			
		 $sql = `SELECT bre.id_empleado, bre.puesto_nivel, bre.nombre, tbl_ficha_2.descripcion_unidad_admin as desc_unidad , tbl_ficha_2.puesto_nivel as puesto_nivel2
				FROM tbl_brechas bre, tbl_ficha_2
				WHERE bre.id_empleado = tbl_ficha_2.num_empleado AND unidad_negocio IN(${$usr_ag}) ${$unidad_permisos} AND 
				bre.puesto_nivel='${$puesto_nivel}' AND ${$campo_competencia}=1`;


	console.log("SQL resultados_eidd_detalles_usr_vs: "+$sql); 
    connectionManager.getConnection()
        .then(function (connection) {

            connection.query($sql, function (error, results) {
                if (error) 
                    console.error(error);   
				
				numRows = results.length; 
				console.log(results[0]);
				if(numRows){
	                var proj = JSON.stringify(results);
	                console.log(proj); 
					res.json(proj);	
				}	
				connection.end(); 
			});
		});	
});

router.get('/grafica_rombo', function(req, res, next) {
	console.log('grafica_rombo1 ')
	//$nivel = $("#txt_perfil_final").val();
	//console.log('grafica_rombo2 '+ $nivel)
					                	update_r = '{"tipo":"grafica_rombo"}';
					                	res.json(update_r);		
});



