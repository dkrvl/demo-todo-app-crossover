mytodoApp.controller('todoController', [
	'$rootScope',
	'$scope',
	'$http',
	'$timeout',
	'$interval',
	'$log',
	'$window',
	'$sce',
	function ($rootScope, $scope, $http, $timeout, $interval, $log, $window, $sce) {
		$scope.pagetitle = "Todo List";
		$scope.isHome = false;
		$rootScope.sessionId = $window.sessionStorage.getItem('sessionId');
		$scope.$sce = $sce;

		// only for fun
		var styles = [
			'background: linear-gradient(#D33106, #571402)', 'border: 1px solid #3E0E02', 'color: white', 'display: block', 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)', 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset', 'line-height: 40px', 'text-align: center', 'font-weight: bold'
		].join(';');

		$scope.handleDrop = function (item, bin) {
			console.log('%c Item ' + item + ' has been dropped into ' + bin, styles);
		}

		$scope.cstodos = [];
		$scope.cstodos.items = {};
		$scope.thisButton = true;

		//READ*********************************************
		$http({
			method: "GET",
			url: '/todos',
			params: {
				sessionId: $rootScope.sessionId
			},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function success(response) {
			$scope.cstodos.items = response.data.data;
			$.each($scope.cstodos.items, function (e, v) {
				if (v.status == 'completed') {
					$scope.completed.push(v)
				} else if (v.status == 'notCompleted') {
					$scope.incompleted.push(v)
				}
			});
		}, function error(response) {
			console.log("ERROR : ", response.statusText);
		});

		//CREATE*********************************************
		$scope.addNewItem = function (t, desc, stat) {

			if (t == undefined || desc == undefined) {
				return true;
			}
			console.log(t, desc, stat);
			var todoStat = "";
			if (stat) {
				todoStat = "completed";
			} else {
				todoStat = "notCompleted";
			}
			$http({
				method: "PUT",
				url: '/todo',
				params: {
					sessionId: $rootScope.sessionId
				},
				data: $.param({
					title: t,
					description: desc,
					status: todoStat
				}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function success(response) {
				$('#myModal').modal('toggle');
				if (todoStat == 'completed') {
					$scope.completed.push(response.data.data)
				} else {
					$scope.incompleted.push(response.data.data)
				}

			}, function error(response) {
				console.log("ERROR : ", response.statusText);
			});
		}

		//EDIT*********************************************
		$scope.editRecord = function (el_id, title, desc, stat) {
			console.log(el_id, title, desc)
			$http({
				method: "PUT",
				url: '/todo',
				params: {
					sessionId: $rootScope.sessionId
				},
				data: $.param({
					id: el_id,
					title: title,
					description: desc,
					status: stat
				}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function success(response) {
				console.log(response);
			}, function error(response) {
				event.preventDefault();
				event.stopPropagation();
				alert('err: ' + response);
			});
		}

		//DELETE*********************************************
		$scope.deleteRecord = function (el_id, stat, index) {
			$http({
				method: "DELETE",
				url: '/todo',
				params: {
					sessionId: $rootScope.sessionId
				},
				data: $.param({
					id: el_id,
				}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function success(response) {

				if (stat == 'completed') {
					$scope.completed.splice(index, 1);
				} else {
					$scope.incompleted.splice(index, 1);
				}
				$scope.cstodos.items = response.data.data;
				$.each($scope.cstodos.items, function (e, v) {
					if (v._id == el_id) {

						$scope.cstodos.items.splice(v, 1);
					}
				});
				console.log($scope.cstodos.items);
			}, function error(response) {
				console.log("ERROR : ", response.statusText);
			});
		};
	}
]);

mytodoApp.directive('myTodo', function () {
		return {
			restrict: 'AE',
			//replace:false,
			templateUrl: 'directive/custom-directive-todoList.html'
		};
	})
	.directive('objectdataview', function () {
		return {
			replace: true,
			templateUrl: 'directive/object-data-view.html'
		};
	});