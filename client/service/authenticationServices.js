var app = angular.module('authenticationServices', []);
app.service('authService', ['$cookies', '$cookieStore', '$http', '$state', function($cookies, $cookieStore, $http, $state) {
    var authService = {};
    authService.isAuthenticated = function() {
        //console.log(authService.authToken)
        var authToken = $cookieStore.get('AuthToken');
        authService.authToken = authToken ? authToken : '';
        return authService.authToken;
    };
    authService.setAuthToken = function(token) {
        $cookieStore.put('AuthToken', "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    };
    authService.clearAuthentication = function() {
        $cookieStore.remove('AuthToken');
    };
    authService.clearAuthenticationBack = function(err) {
        if (err == 401) {
            $cookieStore.remove('AuthToken');
            $state.go('login');
        }
    };
    return authService;
}]);
