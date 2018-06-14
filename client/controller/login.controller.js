mytodoApp.controller('loginController', ['$rootScope', '$scope', '$http', '$location', '$cookies', 'md5' , '$window', function($scope, $rootScope, $http, $location, $cookies, md5, $window ){
	$scope.pagetitle = "Login";
	$scope.message = '';
	$scope.submitForm = function(logdata){
		$scope.logindata = logdata;
		console.log()
		if($scope.logindata == undefined){
			return $scope.message = "Please fill username or password fields";
		}else if($scope.logindata['username'] == undefined){
			return $scope.message = "Please fill username field";
		}else if($scope.logindata['password'] == undefined){
			return $scope.message = "Please fill password field";
		}

		var username = $scope.logindata['username'];
		var password = $scope.logindata['password'];
		$scope.logindata['password'] = md5.createHash(password);

		// Simple GET request example:
		$http({
			method: 'POST',
			url: '/user/auth',
			data: $scope.logindata,
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		}).then(function successCallback(response) {
			$scope.message= "";
			$scope.logindata['username'] = "";
			$scope.logindata['password'] = "";
    		// this callback will be called asynchronously
    		// when the response is available
    		console.log('success');
			console.log(response);
				if(response.data.sessionId){
					$window.sessionStorage.setItem('sessionId', response.data.sessionId);
					$rootScope.logoutbtnActive = true;

					console.log($rootScope.logoutbtnActive);
					$location.path('/todolist');
				}else if(response.data.status == 'error'){
						$scope.message = "Invalid username or password";
					console.log("not matched")
				}

    	}, function errorCallback(response) {
    		// called asynchronously if an error occurs
    		// or server returns response with an error status.
    		console.log('ERR - NOT FOUND');
    	});

	}
}]);
