var _controllers	=	angular.module('ionic_virtual.controllers',[]);
	
	_controllers.controller('InitPageCtrl', 
		function($scope, $ionicFilterBar,$ionicFilterBarConfig,$ionicConfig, $http, $state,EventServ ) {
			$scope.addToCart = function(evento) {
				$state.go("tabs.event.comprar", {"eventoDetails": evento}, {location: "replace", reload: true});
			}
			$scope.evento = [];
			
			$http({
				method:'GET',
				url:'http://dev.virtualtkt.com/api/events/',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function(result){
				//success do something with the result
				//console.log(result);
				if(result.data.status=='success'){
					$scope.evento = result.data.data;
				}
			}, function(response){
				console.log('error'+response);
				//error show an appropriate message
			});
			$scope.day_format = function(lafecha){
				return moment.utc(lafecha).local().format('DD');
			}
			$scope.mounth_format = function(lafecha){
				return moment.utc(lafecha).local().format('MMM');
			}
			$scope.hours_format = function(lafecha){
				return moment.utc(lafecha).local().format('h:mm a');
			}
			
			$scope.showFilterBar = function() {
				$scope.noMoreItemsAvailableCurrent = $scope.noMoreItemsAvailable;
				$scope.noMoreItemsAvailable = true;

				cFB=$ionicFilterBar.show({
					items : $scope.categories,
					
					update: function(filteredItems) {
						
					},
					config: {
					  theme: $ionicFilterBarConfig.theme(),
					  transition: $ionicFilterBarConfig.transition(),
					  back: $ionicConfig.backButton.icon(),
					  clear: $ionicFilterBarConfig.clear(),
					  favorite: $ionicFilterBarConfig.favorite(),
					  search: $ionicFilterBarConfig.search(),
					  backdrop: $ionicFilterBarConfig.backdrop(),
					  placeholder: 'Buscar',
					  close: $ionicFilterBarConfig.close(),
					  done: $ionicFilterBarConfig.done(),
					  reorder: $ionicFilterBarConfig.reorder(),
					  remove: $ionicFilterBarConfig.remove(),
					  add: $ionicFilterBarConfig.add()
					},
					cancel: function(filteredItems) {
						$scope.noMoreItemsAvailable = $scope.noMoreItemsAvailableCurrent;
						$scope.result = [];
						$scope.$apply();
					},
					done: function(filteredItems) {
					}
				});
			};
			
		}
	);

	_controllers.controller('PopularesCtrl', 
		function($scope,$ionicSlideBoxDelegate) {
						  
			  $scope.next = function() {
				$ionicSlideBoxDelegate.next();
			  };
			  $scope.previous = function() {
				$ionicSlideBoxDelegate.previous();
			  };

			  // Called each time the slide changes
			  $scope.slideChanged = function(index) {
				console.log(index);
				$scope.slideIndex = index;
			  };

		}
	);
	_controllers.controller('CrearEventoCtrl', 
			function($scope) {
				//JsBarcode("#barcode","454545450000",{format:"EAN", height: 30,displayValue:true, fontSize:20});

				$scope.ratingsObject = {
		    	   iconOn: 'ion-ios-star',    //Optional
		    	   iconOff: 'ion-ios-star-outline',   //Optional
		    	   iconOnColor: 'rgb(200, 200, 100)',  //Optional
		    	   iconOffColor:  'rgb(200, 100, 100)',    //Optional
		    	   rating:  3, //Optional
		    	   minRating:1,    //Optional
		    	   readOnly: true, //Optional
		    	   callback: null
		    	};
			}
	);
	
	_controllers.controller('menuCtrl', 
		function($scope, Auth){
			var _self	=	this;
			_self.isLogged={};
			var user = localStorage.getItem("usuario");
			_self.isLogged = user;
			
			$scope.log_in = function() {
				console.log('log-in');
			}
			
			$scope.log_out = function() {
				console.log('log-out');
				localStorage.removeItem("usuario");
			}
			console.log(_self.isLogged );
				
	});
	
	_controllers.controller('LogInCtrl', 
		function($scope, $ionicLoading, $state, $rootScope, $httpParamSerializer, $ionicHistory, Auth,$cordovaOauth,$http){
			var _self	=	this;
			
			_self.m_form = {};
			//Auth.logOut();
			$scope.loginFacebook = function() {
				$cordovaOauth.facebook("0000000000", ["email"]).then(function(result) {
				   localStorage.setItem("loginExitoso", result.access_token);
				   $location.path("/bienvenido");
				}, function(error) {
					console.log(error);
				});
			};
			$scope.loginGoogle = function() {
				$cordovaOauth.google("000000000000000000000", ["email"]).then(function(result) {
				   localStorage.setItem("loginExitoso", result.access_token);
				   $location.path("/bienvenido");
				}, function(error) {
					console.log(error);
				});
			};
			
			_self.form_process = function(){
				
				var usuario = {};
				usuario.username = _self.m_form.username;
				usuario.password = _self.m_form.password;
				// etc.. y luego
				$rootScope.usuario = usuario;
				//TRANSFORMO A STRING Y GUARDO
				var usuarioAGuardar = JSON.stringify(usuario);
				localStorage.setItem("usuario", usuarioAGuardar);
				 
				//RECUPERO LA INFORMACIÓN
				var usuarioGuardada = localStorage.getItem("usuario");
				var usuarioGuardada = JSON.parse(usuarioGuardada);
				console.log(usuarioGuardada.region); //Galicia
				
				var data = {
						username : _self.m_form.username,
						password : _self.m_form.password
				};
				/*$http.post("http://dev.virtualtkt.com/api/check_credentials", _self.m_form).success(function(res){
					console.log(res);
				});  */				
				$http({
					method: 'POST',
					data: $httpParamSerializer(data),
					url:'http://dev.virtualtkt.com/api/check_credentials',
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).then(function(result){
					//success do something with the result
					console.log(result);
					if(result.data.status=='success'){
						$scope.evento = result.data.data;
						$ionicLoading.show({
							template: result.data.message,
							duration: 1500
						});
						$state.go('tabs.etickets', {}); //second parameter is for $stateParams
					}else if(result.data.status=='error'){
						$ionicLoading.show({
							template: result.data.message,
							duration: 1500
						});
					}
				});
				
				
			};
	});
	_controllers.controller('RegisterCtrl', 
		function($scope, $ionicLoading, $state, $httpParamSerializer, $ionicHistory, Auth,$http){
			var _self	=	this;
			
			_self.m_form = {};
			
			//Auth.logOut();
			
			_self.form_process = function(){
				var data = {
						username  : _self.m_form.username,
						password  : _self.m_form.password,
						firstname : _self.m_form.firstname,
						lastname  : _self.m_form.lastname,
						email     : _self.m_form.email,
						phone     : _self.m_form.phone
				};
				console.log(data);
				$http({
					method: 'POST',
					data: $httpParamSerializer(data),
					url:'http://dev.virtualtkt.com/api/register_user',
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).then(function(result){
					//success do something with the result
					if(result.data.status=='success'){
						$scope.evento = result.data.data;
						$ionicLoading.show({
							template: result.data.message,
							duration: 1500
						});
						$state.go('login', {}); //second parameter is for $stateParams
					}else{
						$ionicLoading.show({
							template: result.data.message,
							duration: 1500
						});
					}
				});
			};
	});
	_controllers.controller('ForgotCtrl', 
		function($scope, $ionicLoading, $state, $http, $httpParamSerializer, $ionicHistory, Auth){
			var _self	=	this;
			
			_self.m_form = {};
			
			//Auth.logOut();
			
			_self.form_process = function(){
				var data = {
						username  : _self.m_form.username
				};
				
				$http({
					method: 'POST',
					data: $httpParamSerializer(data),
					url:'http://dev.virtualtkt.com/api/forgot_password',
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).then(function(result){
					//success do something with the result
					if(result.data.status=='success'){						
						$ionicLoading.show({
							template: result.data.message,
							duration: 1500
						});
						$state.go('login', {}); //second parameter is for $stateParams
					}else{
						$ionicLoading.show({
							template: result.data.message,
							duration: 1500
						});
					}
				});
			};
	});
	_controllers.controller('PerfilCtrl', 
		function($scope, $ionicLoading, $state, $ionicHistory, Auth,$http,$httpParamSerializer){
			var _self	=	this;
			
			_self.m_form = {};
			/*var datos = {
				username  : 'manuel',
				password  : 'Aim3$uPR',
				email     : 'empc1982@hotmail.com',
				firstname : 'Manuel',
				lastname  : 'Cordero',
				phone     : '04145165948',
				address   : '',
				country   : '',
				state     : '',
				city      : '',
				zip       : ''
			};*/
			var user = JSON.parse(window.localStorage.usuario);
			
			$scope.username=user.username;
			$scope.password=user.password;
			
			var data1 = {
				username : $scope.username,
				password : $scope.password
			};
			$http({
				method: 'POST',
				data: $httpParamSerializer(data1),
				url:'http://dev.virtualtkt.com/api/check_credentials',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function(result){
				//success do something with the result
				
				if(result.data.status=='success'){
					_self.m_form = result.data.data;
					console.log(_self.m_form );				
				}else if(result.data.status=='error'){
					/*$ionicLoading.show({
						template: result.data.message,
						duration: 1500
					});*/
				}
			});
		
			
			_self.form_process = function(){
				var data = {
					username  : _self.m_form.user_uname,
					password  : $scope.password,
					firstname : _self.m_form.user_fname,
					lastname  : _self.m_form.user_lname,
					phone     : _self.m_form.user_mobile,
					address   : _self.m_form.user_address,
					country   : _self.m_form.user_country,
					state     : _self.m_form.user_state,
					city      : _self.m_form.user_city,
					zip       : _self.m_form.user_zip
				};
				$http({
					method:'POST',
					data : $httpParamSerializer(data),
					url:'http://dev.virtualtkt.com/api/update_user_data/',
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).then(function(result){
					if(result.status=='success'){	
						$scope.cuenta = result.data.data;
						$ionicLoading.show({
							template: result.message,
							duration: 1500
						});
						
					}else{
						$ionicLoading.show({
							template: result.data.message,
							duration: 1500
						});
					}
				});
			};
			
			//country			
			$http({
				method:'POST',
				url:'http://dev.virtualtkt.com/api/countries/',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function(result){
				$scope.country = result.data.data;					
			});
			
			
	});
	_controllers.controller('CarritoCtrl', 
		function($scope,$ionicSlideBoxDelegate,$state,$stateParams) {
			$scope.item = {
				qty: 0
			};
			$scope.increaseItemCount = function(qty,index) {
				qty++;
				$scope.item.qty = qty++;
			};
			$scope.decreaseItemCount = function(qty,index) {
			   if (qty > 1){
					qty--;
					$scope.item.qty = qty--;				 
				}else{
					qty = 1;
				}
			};
		
			
			$scope.details = $stateParams.eventoDetails;
			$scope.procesarPago = function() {
				console.log('dentro del carrito');
				$state.go("carrito", {}, {location: "replace", reload: true});
			}
			  
			$scope.next = function() {
				$ionicSlideBoxDelegate.next();
			};
			$scope.previous = function() {
				$ionicSlideBoxDelegate.previous();
			};

			// Called each time the slide changes
			$scope.slideChanged = function(index) {
				console.log(index);
				$scope.slideIndex = index;
			};

		}
	);
	_controllers.controller('eticketsCtrl', 
		function($scope,$http,$httpParamSerializer,$state) {
			$scope.detalle = [];
			var user = JSON.parse(window.localStorage.usuario);
			
			$scope.username=user.username;
			$scope.password=user.password;
			
			var data = {
				username : $scope.username,
				password : $scope.password
			};
			$http({
				method:'POST',
				data : $httpParamSerializer(data),
				url:'http://dev.virtualtkt.com/api/etickets/',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function(result){
				if(result.data.status=='success'){
					$scope.e_ticket = result.data.data;
				}
			});
			
			$scope.detalle = function(etickets) {
				$state.go("tabs.etickets.detalle", {"ticketDetails": etickets}, {location: "replace", reload: true});
			}

		}
	);
	_controllers.controller('DetalleTickertsCtrl', 
		function($scope,$ionicModal,$http,$httpParamSerializer,$stateParams,$ionicLoading) {
			var _self	=	this;
			$scope.detalle=[];
			_self.m_form = {};			
			
			$scope.detalle = $stateParams.ticketDetails;
			_self.m_form = $scope.detalle;
			_self.m_form.email = $scope.detalle.user_email;
			_self.m_form.name  = $scope.detalle.user_fname+' '+$scope.detalle.user_lname;
			
			$scope.day_format = function(lafecha){
				return moment.utc(lafecha).local().format('DDMMMMY');
			}
			
			$scope.hours_format = function(lafecha){
				return moment.utc(lafecha).local().format('h:mm a');
			}
								
			//reenvio ticket
			$ionicModal.fromTemplateUrl('../templates/reenvio-ticket.html', function($ionicModal) {
				$scope.modal3 = $ionicModal;
			}, {
				scope: $scope,
				animation: 'slide-in-up'
			});
			$scope.openModal3 = function(detalle) {
				$scope.reenvio = [];
				
				$scope.reenvio = detalle;
				console.log($scope.reenvio);
				$scope.modal3.show();
			}
			$scope.closeModal3 = function() {				
				$scope.modal3.hide();
			};
			
			
			$scope.enviar = function (detalle){
				var user = JSON.parse(window.localStorage.usuario);
				$scope.username=user.username;
				$scope.password=user.password;
				var data = {
					username  : $scope.username,
					password  : $scope.password,
					eticket_id: detalle.id_ticket,
					eticket_reference: detalle.reference,
					assistant_email: _self.m_form.email,
					assistant_name: _self.m_form.name
				};
				$http({
					method:'POST',
					data : $httpParamSerializer(data),
					url:'http://dev.virtualtkt.com/api/eticket_resend/',
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).then(function(result){
					if(result.status=='success'){						
						$ionicLoading.show({
							template: result.message,
							duration: 1500
						});
						$scope.modal3.hide();
					}else{
						$ionicLoading.show({
							template: result.data.message,
							duration: 1500
						});
					}
				});
			};
			
			//detalle QR
			$scope.modal2 =$ionicModal.fromTemplateUrl('../templates/d-qr.html', {
			  scope: $scope,
			  animation: 'slide-in-up'
			}).then(function(modal) { $scope.modal2 = modal; });
			
			//detalle ticket
			$ionicModal.fromTemplateUrl('../templates/d-compra.html', function($ionicModal) {
				$scope.modal = $ionicModal;
			}, {
				// Use our scope for the scope of the modal to keep it simple
				scope: $scope,
				// The animation we want to use for the modal entrance
				animation: 'slide-in-up'
			});
			$scope.openModal = function(payment_uniqid) {
				$scope.dCompra = [];
				var user = JSON.parse(window.localStorage.usuario);
				$scope.username=user.username;
				$scope.password=user.password;
				
				var data = {
					username  : $scope.username,
					password  : $scope.password,
					payment_uniqid: payment_uniqid
				};
				$http({
					method:'POST',
					data : $httpParamSerializer(data),
					url:'http://dev.virtualtkt.com/api/purchase_details/',
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).then(function(result){
					//success do something with the result
					//console.log(result);
					if(result.data.status=='success'){
						$scope.dCompra = result.data.data;
					}
				}, function(response){
					console.log('error'+response);
					//error show an appropriate message
				});
				$scope.modal.show();
			}
			$scope.closeModal = function() {				
				$scope.modal.hide();
				//$scope.modal = false;
			};
			
		}
	);