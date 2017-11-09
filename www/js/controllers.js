var _controllers	=	angular.module('ionic_virtual.controllers',[]);
	
	_controllers.controller('InitPageCtrl', 
		function($scope, $ionicFilterBar,$ionicFilterBarConfig,$ionicConfig, $http, $state,EventServ,ShoppingCartService ) {
			$scope.countBadge = ShoppingCartService.cont();
			$scope.addToCart = function(evento) {
				$state.go("tabs.event.comprar", {"eventoDetails": evento}, {location: "replace", reload: true});
			}
			$scope.cart = function(evento) {
				$state.go("carrito", {"eventoDetails": evento}, {location: "replace", reload: true});
			}
			$scope.evento = [];
			$scope.ourCategories=[];
			$http({
				method:'GET',
				url:'http://dev.virtualtkt.com/api/events/',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function(result){
				//success do something with the result
				//console.log(result);
				$scope.id=[];
				if(result.data.status=='success'){
					$scope.evento = result.data.data;
					$scope.stringOLD=[];
					$scope.string=[];
					angular.forEach($scope.evento, function(val,indice) {												
						$scope.stringOLD = val.id_category						
						$scope.stringNew = $scope.stringOLD.split('|')[1];
						$scope.stringNew2 = $scope.stringOLD.split('|')[2];
						$scope.stringNew3 = $scope.stringOLD.split('|')[3];
						
						$scope.string.push($scope.stringNew);
						
					});	
						console.log($scope.string);
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
				return moment.utc(lafecha).format('HH:mm');
			}
			$scope.filter = {};
			// reset the filter
			$scope.resetFilter = function() {
			  // set filter object as blank
			  $scope.filter = {}; 
			}
			$scope.ourCategories = [
				{"id_categories":1,"name":'MÚSICA'},
				{"id_categories":2,"name":'FIESTA'},
				{"id_categories":3,"name":'CULTURA'},
				{"id_categories":4,"name":'DEPORTE'},
				{"id_categories":5,"name":'DISCOTECAS'},
				{"id_categories":6,"name":'FAMILIA'},
				{"id_categories":7,"name":'FERIAS'},
				{"id_categories":8,"name":'TURISMO'},
				{"id_categories":9,"name":'GASTRONOMIA'},
				{"id_categories":10,"name":'TEATRO'},
			];			
			$scope.filter = {id_categories: "!!"};
			$scope.categories = [
				{id: 1},
				{id: 2},
				{id: 3}
			];
			
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
		function($scope, $http, $httpParamSerializer){
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
			var usuario = JSON.parse(window.localStorage.usuario);
			
			$scope.username=usuario.username;
			$scope.password=usuario.password;
			
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
					console.log(result.data.data.user_uname);
					$scope.userWelcome= result.data.data.user_uname;			
				}
			});
				
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
					if(result.data.status=='success'){
						$scope.evento      = result.data.data;
						$scope.user_name   = result.data.data.user_uname;
						var usuario        = {};
						usuario.username   = $scope.user_name;
						usuario.password   = _self.m_form.password;
						// etc.. y luego
						$rootScope.usuario = usuario;
						//TRANSFORMO A STRING Y GUARDO
						var usuarioAGuardar = JSON.stringify(usuario);
						localStorage.setItem("usuario", usuarioAGuardar);
						//RECUPERO LA INFORMACIÓN
						var usuarioGuardada = localStorage.getItem("usuario");
						var usuarioGuardada = JSON.parse(usuarioGuardada);
						$ionicLoading.show({
							template: result.data.message,
							duration: 1500
						});
						$state.go('tabs.etickets', {location: "replace", reload: true}); //second parameter is for $stateParams
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
				$http({
					method: 'POST',
					data: $httpParamSerializer(data),
					url:'http://dev.virtualtkt.com/api/register_user',
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).then(function(result){
					//success do something with the result
					if(result.data.status=='success'){
						$ionicLoading.show({
							template: result.data.message,
							duration: 1500
						});
						$state.go('login', {location: "replace", reload: true}); //second parameter is for $stateParams
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
						$state.go('login', {location: "replace", reload: true}); //second parameter is for $stateParams
					}else{
						$ionicLoading.show({
							template: result.data.message,
							duration: 1500
						});
					}
				});
			};
	});
	_controllers.controller('CuentaCtrl', 
		function($scope, $ionicLoading, $state, $http, $httpParamSerializer, $ionicHistory, Auth){
			var _self	=	this;
			
			_self.m_form = {};
			
			
	});
	_controllers.controller('PerfilCtrl', 
		function($scope, $ionicLoading, $state, $ionicHistory, $http, $httpParamSerializer){
			var _self	=	this;
			
			_self.m_form = {};
			
			$scope.goBack = function(){
				$state.go("tabs.event", {location: "replace", reload: true});
				//$ionicHistory.goBack();
			};
			
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
		function($scope,$ionicSlideBoxDelegate,$state,$ionicHistory,$stateParams,ShoppingCartService,$ionicPopup,$ionicListDelegate) {
			
			$scope.cart = ShoppingCartService;
			$scope.countBadge = ShoppingCartService.cont();
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
			$scope.goBack = function()  {				
				var backview = '';
				angular.forEach($ionicHistory.viewHistory().views, function(view, index){
					if (view.stateName == "tabs.event.comprar"){
						backview = "tabs.event";
					}
					
				});
				$state.go(backview, {}, {location: "replace", reload: true});
			}
		
			
			$scope.details = $stateParams.eventoDetails;
			$scope.procesarPago = function() {
				console.log('dentro del carrito');
				$state.go("carrito", {}, {location: "replace", reload: true});
			}
			
			$scope.showDeleteEvento = function(evento) {
				var confirmPopup = $ionicPopup.confirm({
					title:('Borrar'),
					template: ('Esta seguro que desea elimnar evento del carrito'),
					cancelText: ('cancelar'),
					okText: ('ok')
				}).then(function(remove) {
					if (remove) {
						ShoppingCartService.deleteItemCart(evento);
					}
					$ionicListDelegate.closeOptionButtons();
				});
			};
			  
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
	_controllers.controller('ComprarCtrl', 
		function($scope,$ionicSlideBoxDelegate,$state,$ionicHistory,$stateParams,$http,$httpParamSerializer,ShoppingCartService) {
			$scope.detalle = [];
			$scope.countBadge = ShoppingCartService.cont();
			$scope.carrito = {
				event: {
					qty: 1,
					id_event: '',
					event_name: '',
					venue_address: '',
					price_string: '',
					venue_name: '',
					image_url: ''
				}
			};
			var user = JSON.parse(window.localStorage.usuario);
			console.log($stateParams.eventoDetails.id_event);
			$scope.id_event = $stateParams.eventoDetails.id_event;
			$scope.username=user.username;
			$scope.password=user.password;
			
			var data = {
				username : $scope.username,
				password : $scope.password,
				id_event : $scope.id_event
			};
			$http({
				method:'POST',
				data : $httpParamSerializer(data),
				url:'http://dev.virtualtkt.com/api/tickets_available_event/',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function(result){
				if(result.data.status=='success'){
					$scope.details = $stateParams.eventoDetails;
					$scope.detalleTicket = result.data.data;
	
					console.log($scope.detalleTicket);
					$scope.detalleTicket.forEach(function(e){
						console.log(e);
						$scope.cantidad = e.ticket_limit;
						$scope.carrito.event.id_event = e.id_event;
						$scope.carrito.event.event_name = e.event_name;
						$scope.carrito.event.venue_address = e.venue_address;
						$scope.carrito.event.price_string = e.price_string;
						$scope.carrito.event.venue_name = e.venue_name;
						$scope.carrito.event.image_url = e.image_url;
					});
					$scope.longList  = [];
					for(var i=1;i<=$scope.cantidad; i++){
						$scope.longList.push(i);
					}
					console.log($scope.longList);
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
				}
			});
			
			
			$scope.procesarCarrito = function() {
				console.log('dentro del carrito');
				ShoppingCartService.add($scope.carrito, user);
				$scope.countBadge = ShoppingCartService.cont() + 1;
				$state.go("carrito", {}, {location: "replace", reload: true});
			}
			
			$scope.goBack = function()  {				
				var backview = '';
				angular.forEach($ionicHistory.viewHistory().views, function(view, index){
					if (view.stateName == "tabs.event.comprar"){
						backview = "tabs.event";
					}
					
				});
				$state.go(backview, {}, {location: "replace", reload: true});
			}
			/*$scope.item = {
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
			$scope.goBack = function()  {				
				var backview = '';
				angular.forEach($ionicHistory.viewHistory().views, function(view, index){
					if (view.stateName == "tabs.event.comprar"){
						backview = "tabs.event";
					}
					
				});
				$state.go(backview, {}, {location: "replace", reload: true});
			}
		
			
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
			};*/

		}
	);
	_controllers.controller('eticketsCtrl', 
		function($scope,$http,$httpParamSerializer,$state,$ionicHistory,$ionicModal) {
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
					console.log($scope.e_ticket);
				}
			});
			//detalle QR
			$scope.qr = '';
			$scope.reference = '';
			$scope.title = '';
			$ionicModal.fromTemplateUrl('./templates/d-qr.html', function($ionicModal) {
				$scope.modal2 = $ionicModal;
			}, {
				scope: $scope,
				animation: 'slide-in-up'
			});
			$scope.openModal2 = function(detalle) {	
				console.log(detalle);
				$scope.qr = detalle.qr_eticket;
				$scope.reference = detalle.reference;
				$scope.title = detalle.title;
				$scope.modal2.show();
			}
			$scope.closeModal2 = function() {
				console.log('closed');
				$scope.modal2.hide();
			};
			
			$scope.detalle = function(etickets) {
				$state.go("tabs.etickets.detalle", {"ticketDetails": etickets}, {location: "replace", reload: true});
			}
			
		}
	);
	_controllers.controller('DetalleTickertsCtrl', 
		function($scope,$ionicModal,$http,$ionicHistory,$state,$httpParamSerializer,$stateParams,$ionicLoading) {
			var _self	=	this;
			$scope.detalle=[];
			_self.m_form = {};			
			
			$scope.detalle = $stateParams.ticketDetails;
			console.log($scope.detalle.qr_eticket);
			_self.m_form = $scope.detalle;
			_self.m_form.email = $scope.detalle.user_email;
			_self.m_form.name  = $scope.detalle.user_fname+' '+$scope.detalle.user_lname;
			$scope.goBack = function()  {				
				var backview = '';
				angular.forEach($ionicHistory.viewHistory().views, function(view, index){
					if (view.stateName == "tabs.etickets.detalle"){
						backview = "tabs.etickets";
					}
					
				});
				$state.go(backview, {}, {location: "replace", reload: true});
			}
			$scope.day_format = function(lafecha){
				return moment.utc(lafecha).local().format('DDMMMMY');
			}
			
			$scope.hours_format = function(lafecha){
				return moment.utc(lafecha).local().format('h:mm a');
			}
								
			//reenvio ticket
			$ionicModal.fromTemplateUrl('./templates/reenvio-ticket.html', function($ionicModal) {
				$scope.modal3 = $ionicModal;
			}, {
				scope: $scope,
				animation: 'slide-in-up'
			});
			$scope.openModal3 = function(detalle) {
				$scope.reenvio = [];				
				$scope.reenvio = detalle;
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
			$ionicModal.fromTemplateUrl('./templates/d-qr.html', function($ionicModal) {
				$scope.modal2 = $ionicModal;
			}, {
				scope: $scope,
				animation: 'slide-in-up'
			});
			$scope.openModal2 = function(detalle) {	
				console.log(detalle);
				$scope.qr = detalle.qr_eticket;
				$scope.reference = detalle.reference;
				$scope.title = detalle.title;
				$scope.modal2.show();
			}
			$scope.closeModal2 = function() {				
				$scope.modal2.hide();
			};
			
			//detalle ticket
			$ionicModal.fromTemplateUrl('./templates/d-compra.html', function($ionicModal) {
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
	_controllers.controller('changePassCtrl', 
		function($scope, $ionicLoading, $state, $ionicHistory, $http, $httpParamSerializer){
			var _self	=	this;
			
			_self.m_form = {};
			
			$scope.goBack = function(){
				$state.go("tabs.event", {location: "replace", reload: true});
				//$ionicHistory.goBack();
			};
			
			_self.form_process = function(){
				var user = JSON.parse(window.localStorage.usuario);
				var data = {
					username     : user.username,
					old_password : user.password,
					new_password : _self.m_form.new_password
					
				};
				$http({
					method:'POST',
					data : $httpParamSerializer(data),
					url:'http://dev.virtualtkt.com/api/change_password/',
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).then(function(result){
					if(result.status=='success'){	
						//$scope.cuenta = result.data.data;
						_self.m_form.new_password ='';
						_self.m_form.repeat_password ='';
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