_services.factory('EventServ', function($q, AjaxService, app_config, session){
	var api_call = {};
	return {
		event:function(){
			//console.log(credentials);
			var _defer = $q.defer();
				//api_call.email = credentials.username;
				//api_call.password = credentials.password;
			
			AjaxService.run_ajax( api_call ).then(function(result){
				/*if(result.data.status==0){
					session.setSession(result.data.user);
				}*/
				_defer.resolve(result.data);
			});
		return _defer.promise;
		},
		logOut:function(){
			session.destroy();
		},
		isLogued:function(){
			return (session.getSession().id>0)?true:false; 
		},
	}		
});