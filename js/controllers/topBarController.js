app.controller( 'topBarCtrl', function( $scope, Model ) {

    $scope.model = Model;

    $scope.onSelectMode = function( mode ) {
        $scope.model.viewMode = mode;
        $scope.model.filter = '';
    };

} );