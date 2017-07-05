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
	})