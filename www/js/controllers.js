var _controllers	=	angular.module('ionic_virtual.controllers',[]);

	_controllers.controller('InitPageCtrl', 
			function($scope, $ionicFilterBar,$ionicFilterBarConfig,$ionicConfig,$state) {
				
				$scope.addToCart = function() {
					console.log('dentro del carrito');
					 $state.go("tabs.event.comprar", {}, {location: "replace", reload: true});
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
			/*_self.sliderOptions = {
				//loop: (_self.isWeb ? ($scope.vacH.length > 1 ? true : false) : ($scope.vacV.length > 1 ? true : false)),
				effect: 'slide',
				speed: 500,
				//autoplay:(_self.company.compCarrouselInterval*1000),
				autoplayDisableOnInteraction: false,
				pagination: false
			}
			$scope.$on("$ionicSlides.sliderInitialized", function(event, data){
				// data.slider is the instance of Swiper
				$scope.slider = data.slider;
			});*/
			  
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
			
			_self.isLogged = Auth.isLogued;
			_self.authorize = Auth.authorize;
			
			console.log( _self.isLogged() );
				
	});
	
	_controllers.controller('LogInCtrl', 
		function($scope, $ionicLoading, $state, $ionicHistory, Auth,$cordovaOauth){
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
				Auth.logIn(_self.m_form).then(function(result){
					if(result.status==1){
						$ionicLoading.show({template:result.message, duration :2000  });
					}else{
						$ionicHistory.nextViewOptions({
							disableBack: true
						  });
						$state.go('tabs.home', {}); //second parameter is for $stateParams
					}
				});
			};
	});
	_controllers.controller('RegisterCtrl', 
		function($scope, $ionicLoading, $state, $ionicHistory, Auth){
			var _self	=	this;
			
			_self.m_form = {};
			
			//Auth.logOut();
			
			_self.form_process = function(){
				Auth.logIn(_self.m_form).then(function(result){
					if(result.status==1){
						$ionicLoading.show({template:result.message, duration :2000  });
					}else{
						$ionicHistory.nextViewOptions({
							disableBack: true
						  });
						$state.go('tabs.home', {}); //second parameter is for $stateParams
					}
				});
			};
	});
	_controllers.controller('LogoutCtrl', 
		function($scope, $ionicLoading, $state, $ionicHistory, Auth){
			var _self	=	this;
			
			_self.m_form = {};
			
			//Auth.logOut();
			
			_self.form_process = function(){
				Auth.logIn(_self.m_form).then(function(result){
					if(result.status==1){
						$ionicLoading.show({template:result.message, duration :2000  });
					}else{
						$ionicHistory.nextViewOptions({
							disableBack: true
						  });
						$state.go('tabs.home', {}); //second parameter is for $stateParams
					}
				});
			};
	});
	_controllers.controller('PerfilCtrl', 
		function($scope, $ionicLoading, $state, $ionicHistory, Auth){
			var _self	=	this;
			
			_self.m_form = {};
			
			//Auth.logOut();
			
			_self.form_process = function(){
				Auth.logIn(_self.m_form).then(function(result){
					if(result.status==1){
						$ionicLoading.show({template:result.message, duration :2000  });
					}else{
						$ionicHistory.nextViewOptions({
							disableBack: true
						  });
						$state.go('tabs.home', {}); //second parameter is for $stateParams
					}
				});
			};
	});
	_controllers.controller('CarritoCtrl', 
		function($scope,$ionicSlideBoxDelegate,$state) {
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
		function($scope) {
			
			  console.log('e-tickets');

		}
	);
	_controllers.controller('DetalleTickertsCtrl', 
		function($scope,$ionicModal) {
			
			$ionicModal.fromTemplateUrl('../templates/d-compra.html', {
			  scope: $scope,
			  animation: 'slide-in-up'
			}).then(function(modal) { $scope.modal = modal; });
  
			/*$scope.modal2 = $ionicModal.fromTemplateUrl('../templates/d-qr.html', {
			  scope: $scope,
			  animation: 'slide-in-up'
			});*/
			$scope.modal2 =$ionicModal.fromTemplateUrl('../templates/d-qr.html', {
			  scope: $scope,
			  animation: 'slide-in-up'
			}).then(function(modal) { $scope.modal2 = modal; });
			
			
		}
	);