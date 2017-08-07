_services.factory('Auth', function($q, AjaxService, app_config, session){
	var api_call = {'method':'session.login', 'email':null, 'password':null, 'app_ns': 'virtual.service.api'};
	return {
		logIn:function(credentials){
			console.log(credentials);
			var _defer = $q.defer();
				api_call.email = credentials.username;
				api_call.password = credentials.password;
			
			AjaxService.run_ajax( api_call ).then(function(result){
				if(result.data.status==0){
					session.setSession(result.data.user);
				}
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