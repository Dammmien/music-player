var app = angular.module( 'Application', [ 'ngRoute', 'ngDialog' ] );

var readyGapi = function() {
    window.initGapi();
}

// app.config( function( $routeProvider ) {
//     $routeProvider.when( '/', {
//         templateUrl: 'templates/main.html',
//         controller: 'mainCtrl'
//     } ).otherwise( {
//         redirectTo: '/'
//     } );
// } );