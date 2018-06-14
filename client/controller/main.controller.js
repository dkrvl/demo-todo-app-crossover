mytodoApp.controller('mainController', ['$scope', '$rootScope', '$window', '$http', '$location', function ($scope, $rootScope, $window, $http, $location) {
	$scope.projectTitle = "CrossOver Todo App";
	$scope.isHome = false;
	$rootScope.logoutbtnActive = false;
	$rootScope.logoutSession;
	$scope.completed = [];
	$scope.incompleted = [];





	$scope.logoutSession = function () {
		// http://localhost:3000/user/logout?sessionId=CLr7NWvDvdyy1h9Uhtce0CaO4lL09d0z
		// var sessionID = $rootScope.sessionId;
		$rootScope.sessionId = $window.sessionStorage.getItem('sessionId');
		console.log($rootScope.sessionId);
		$http({
			method: 'GET',
			url: '/user/logout',
			params: {
				sessionId: $rootScope.sessionId
			},
		}).then(function successCallback(response) {
			// this callback will be called asynchronously
			// when the response is available

			console.log(response)
			console.log('success');
			console.log(response.data);
			$window.sessionStorage.clear();
			$location.path('/logout');
		}, function errorCallback(response) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			console.log('ERR');
			console.log(response);


		});

	}
}]);