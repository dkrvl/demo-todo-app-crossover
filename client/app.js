var mytodoApp = angular.module('mytodoApp', ['ui.router', 'ui.router.state.events', 'ngCookies', 'ngResource', 'angular-md5', 'uiRouterStyles']);




mytodoApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("login")
    $stateProvider
        .state('route1', {
            url: "/route1",
            templateUrl: "route1.html"
        })
        .state('route1.list', {
            url: "/list",
            templateUrl: "route1.list.html",
            controller: function ($scope) {
                $scope.items = ["A", "List", "Of", "Items"];
            }
        })
        .state('route2', {
            url: "/route2",
            templateUrl: "route2.html",
        })
        .state('route2.list', {
            url: "/list",
            templateUrl: "route2.list.html",
            controller: function ($scope) {
                $scope.things = ["A", "Set", "Of", "Things"];
            },
        })
        .state('login', {
            url: "/",
            templateUrl: "views/login/login.html",
            controller: 'loginController',
        })
        .state('logout', {
            url: "/logout",
            templateUrl: "views/logout.html",
            controller: 'logoutController',
        })
        .state('todolist', {
            url: "/todolist",
            templateUrl: "views/todolist.html",
            controller: 'todoController',
        });
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');

});





mytodoApp.run(['$rootScope', '$state', '$stateParams', '$window', '$http', '$location', '$window',
    function ($rootScope, $state, $stateParams, $window, $http, $location, $window) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            var isLogin = toState.name === "login";
            if (isLogin) {
                return; // no need to redirect
            }
            // now, redirect only not authenticated
            var userInfo = $window.sessionStorage.sessionId;
            if (!userInfo) {
                event.preventDefault(); // stop current execution
                $state.go('login'); // go to login
            }
        });
    }
]);