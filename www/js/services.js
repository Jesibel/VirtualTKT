var _services	=	angular.module('ionic_virtual.services', []);

	_services.service('AjaxService',function($http, $httpParamSerializer, $cordovaFileTransfer, $q, app_config){
		return {
			run_ajax:function(prms_api){
				return $http({
					method: 'POST',url: app_config.apiUrl,
					data: $httpParamSerializer(prms_api),
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				});
			},
			send_form_1pic:function(extra_prms, local_image){
				var options = new FileUploadOptions(),
                 	ft = new FileTransfer();
                options.fileKey 	= "data_img";
                options.fileName 	= local_image.split("/").pop();
                options.mimeType	= "image/png";
                options.params		=	extra_prms; //PARAMS EXTRAS EN EL POST AL SERVER

                return $cordovaFileTransfer.upload( app_config.apiUrl, local_image, options);
            },//SUBE MULTI-IMAGENES A AWS Y DEVUELVE SU URL ASOCIADO A UN KEY
            upload_bunch_images:function(data){
            	var _tasks	=	[],
            		_self	=	this;
            	
            	angular.forEach(data.images , function(image) {
            		var _prms, promise;
            		if(image.url){
                		_prms	=	angular.extend({},data.api, {'key':image.key} );
                		
                		promise	=	_self.send_form_1pic(_prms, image.url);
                    	_tasks.push(promise);                			
            		}

                });
            	
                return $q.all(_tasks);
            }
		};
    });
	
	
	_services.factory('ShoppingCartService', function($q, AjaxService) {
    var shoppingCart = {},
        _version = 1,
        user = null;
    (function() {
		user = 12;
   
        if (window.localStorage.getItem('cartEvent') !== null && window.localStorage.getItem('cartEvent') !== 'null') {
            shoppingCart = JSON.parse(window.localStorage.cartEvent);
        }
        _integridad();
    })();
    /*
    REVISA LA INTEGRIDAD DE LA ESTRUCTURA, YA QUE EL JSON PARSE PUEDE DEVOLVER NULO
    O TENGAMOS UNA ESTRUCTURA VIEJA O MAL FORMADA
    */
    function _integridad() {
        //SECCION PARA LA COMPANIA AUN NO SE CREADO
        if ((typeof shoppingCart[user] === "undefined") || (typeof shoppingCart[user].length === "undefined")) {
            //JSON MALFORMADO O STRUCTURA ANTIGUA
            if (!shoppingCart || (typeof shoppingCart.version == "undefined") || shoppingCart.version != _version) shoppingCart = {};

            shoppingCart[user] = []; //CREAR

        }
        shoppingCart.version = _version;
        _escribir();
    }

    function _escribir() {
        window.localStorage.cartEvent = JSON.stringify(shoppingCart);
    }
	
    var service = {
        version: _version,
        cont: function() {
            return (shoppingCart[user].length);
        },
        // The interface you want to expose
        add: function(tickets) {
			console.log(tickets);
			tickets.forEach(function(val,ind){
				shoppingCart[user].push(val);
			})
            //shoppingCart[user].push(evento);
            _escribir();
        },
        listCart: function() {
            return shoppingCart[user];
        },
        update: function() {},
        deleteCart: function() {
            //shoppingCart[user].splice(evento, 1);
            shoppingCart[user] = [];
            _escribir();
        },
        deleteItemCart: function(evento) {            
            shoppingCart[user].splice(evento, 1);
           _escribir();
        },
		
    };
    return service;
});
		/*
		 * 
		 */
	_services.factory('ctrlPickImage',['$q','$ionicPlatform',  '$cordovaImagePicker',
			function($q, $ionicPlatform, $cordovaImagePicker) {
		
				return{
					sel_Image:function(MAX_ALLOWED){
						
						var _def	=	$q.defer();
						
						$ionicPlatform.ready(function(){
							
							if (window.imagePicker){
								var options = {	maximumImagesCount: MAX_ALLOWED || 4,
	  				  					width: 240,
	  				  					height: 240};
								$cordovaImagePicker.getPictures(options).then(function (results){
									if(results.length>0) {
										_def.resolve(results[0]);
									}
								});
							}else{
								_def.reject();
							}
							
						});
						
						return _def.promise;
						
					}
				};
		}]);
	/*
	 * 
	 */
	_services.factory('session', function(){
		var _self = this;
		
		_self._user = (window.localStorage['usr.data'])?JSON.parse(window.localStorage['usr.data']):{};
		return {
			setSession:function(data){
				_self._user = data;
				window.localStorage['usr.data'] = JSON.stringify(data);
			},
			getSession:function(){
				return _self._user;
			},
			destroy:function(){
				this.setSession({});
			}
		}
	});
	_services.service('truncateDecimal',
		function() {
			return {
				decimal: function (num, digits) {
					var numS = num.toString(),
						decPos = numS.indexOf('.'),
						substrLength = decPos == -1 ? numS.length : 1 + decPos + digits,
						trimmedResult = numS.substr(0, substrLength),
						finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;

					return parseFloat(finalResult);
				}
			};
		}
	);
	_services.filter('decimalcoma', function () {
		return function(input) {
				var ret=(input)?input.toString().replace(".",","):null;
				if(ret){
					var decArr=ret.split(",");
					if(decArr.length>1){
						var dec=decArr[1].length;
						if(dec===1){ret+="0";}
					}//this is to show prices like 12,20 and not 12,2
				}
				return ret;
			};
	});
