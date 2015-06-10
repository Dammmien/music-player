app.controller( 'topBarCtrl', function( $scope, Service ) {

    $scope.model = Service.model;

    $scope.onSelectMode = function( mode ) {
        $scope.model.viewMode = mode;
        $scope.model.filter = '';
    };

} );