app.controller( 'tracksListCtrl', function( $scope, Service, Model ) {

    $scope.model = Model;

    $scope.listLimit = 100;

    $scope.onShowMore = function() {
        $scope.listLimit += 100;
    };

} );