app.controller( 'topBarCtrl', function( $scope, Service, Model ) {

    $scope.model = Model;

    $scope.onSelectMode = function( mode ) {
        $scope.model.viewMode = mode;
        $scope.model.filter = '';
    };

} );