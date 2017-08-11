		// Ionic Starter App
		
		// angular.module is a global place for creating, registering and retrieving Angular modules
		// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
		// the 2nd parameter is an array of 'requires'
		// 'ionic_rewards.services' is found in services.js
		// 'ionic_rewards.controllers' is found in controllers.js
var app_main =	angular.module('ionic_virtual', ['ionic', 'ngCordovaOauth', 'jett.ionic.filter.bar','angular.filter', 'ngCordova', 'ngColorPicker', 'ionic-datepicker', 'ionic-timepicker', 'ionic-ratings', 'ionic_virtual.services', 'ionic_virtual.controllers']);


		app_main.run(function($ionicPlatform, $cordovaSplashscreen, $timeout, $rootScope, Auth){
			
			$ionicPlatform.ready(function() {
				// Wait 2secs before hiding splash screen
			    $timeout(function() {
					console.log('splash:hide');
					$cordovaSplashscreen.hide();
			    }, 2000);
				
				
				
				
			});
			
	        $rootScope.$on('$stateChangeStart', function (event, toState) {
	        	/*if(!Auth.authorize(toState.roles)){
	        		 event.preventDefault();
	        	}*/
	        });
			
		});

		app_main.constant('app_config', {
		    appName: 'Virtual',
		    appVersion: 1.0,
		    companyID:'bf8d559e62cb766887cb3e7442d623cb',//DEFINE LA COMPANIA CON LA QUE EL APK FINAL TRABAJARA
		    ROLES:[],
		    //apiUrl: 'http://52.10.82.93/rewards/api/v1/reward_api.php',
		    apiUrl: 'http://dev.virtualtkt.com/api/',			
		    weekdays:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
		});
		
		app_main.config(
			function($stateProvider, $urlRouterProvider, ionicDatePickerProvider, ionicTimePickerProvider, app_config ) {

				var datePickerObj = {
			    	inputDate: new Date(),
			    	monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
			    	from:  new Date(),
			    	dateFormat: 'yyyy-MM-dd',
			    	closeOnSelect: false,
			    	templateType:'modal'
			    };
					  
				var timePickerObj = {
					inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
					format: 24,
					step: 30
				};
			    ionicDatePickerProvider.configDatePicker(datePickerObj);
				ionicTimePickerProvider.configTimePicker(timePickerObj);

							
			  $stateProvider
				/*.state("tabs", {
					url: "/tabs",
					abstract: true,
					cache: true,
					templateUrl: "templates/main.html"
				})*/
				.state('tabs', {
					url: "/tab",
					abstract: true,
					templateUrl: "templates/app-menu.html"
			    })
				.state("tabs.event", {
                url: "/event",
                cache: true,/*NO TOCAR POR FAVOR, GRACIAS*/
					views: {
						"tab-event": {
							templateUrl: "clients/evento/evento.html",
							controller: "InitPageCtrl as event"
						}
					}
				})				
				.state("tabs.comenzar", {
                url: "/comenzar",
                cache: true,
				views: {
					"tab-populares": {
						templateUrl: "templates/crear_evento_comenzar.html",
						controller: "ComenzarCtrl as comenzar"
					}
				}
				})
				.state("tabs.crear", {
                url: "/crear",
                cache: true,
				views: {
					"tab-crear": {
						templateUrl: "templates/crear_evento.html",
						controller: "CrearEventoCtrl as crearE"
					}
				}
				})
				.state("tabs.perfil", {
					url: "/perfil",
					cache: false,
					views: {
					"tab-event@tabs": {
						templateUrl: "templates/perfil.html",
						controller: "PerfilCtrl as perfil"
					}
					}
					
				})	
				.state("tabs.etickets", {
                url: "/etickets",
                cache: true,
				views: {
					"tab-tickets": {
						templateUrl: "templates/e-tickets.html",
						controller: "eticketsCtrl as etickets"
					}
				}
				})
				/*.state("tabs.etickets", {
                url: "/etickets",
                cache: true,						
				views: {
					"tab-event@tabs": {
						templateUrl: "templates/e-tickets.html",
						controller: "eticketsCtrl as etickets"
					}
				}
				})*/
				.state("tabs.etickets.detalle", {
                url: "/detalle",
                cache: true,
				params: {
                    ticketDetails:null
                },	
				views: {
					"tab-tickets@tabs": {
						templateUrl: "templates/detalle_tickets.html",
						controller: "DetalleTickertsCtrl as detalletickets"
					}
				}
				})
				.state("tabs.event.comprar", {
                url: "/comprar",				
                cache: true,
				params: {
                    eventoDetails:null
                },
				views: {
					"tab-event@tabs": {
						templateUrl: "clients/evento/detalle_orden.html",
						controller: "CarritoCtrl"
					}
				}
				})
				.state("carrito", {
					url: "/carrito",
					cache: true,
					views: {
						"tab-event@tabs": {
							templateUrl: "clients/evento/carrito.html",
							controller: "CarritoCtrl as car"
						}
					}
					
				})	
				 /*MODULO AUTH*/
				.state("login", {
					url: "/login",
					cache: false,
					templateUrl: "templates/login.html",
					controller: "LogInCtrl as login"
				})
				.state("register", {
					url: "/register",
					cache: false,
					templateUrl: "templates/register.html",
					controller: "RegisterCtrl as register"
				})
				.state("forgot", {
					url: "/forgot",
					cache: false,
					templateUrl: "templates/forgot.html",
					controller: "ForgotCtrl as forgot"
				});
		  
				// if none of the above states are matched, use this as the fallback
				//$urlRouterProvider.otherwise('/tab/categories');
				if (window.localStorage.getItem("usuario") != null) {
					//Hay una sesión iniciada
					console.log('Hay una sesión iniciada');
					$urlRouterProvider.otherwise("/tab/event");
					//Dirige a la pantalla principal ya logueada.
				} else {
					console.log('Manda la pantalla de inicio de sesión o autentificación');
					$urlRouterProvider.otherwise("/login");
					//Manda la pantalla de inicio de sesión o autentificación
				}
			  
		
		});
