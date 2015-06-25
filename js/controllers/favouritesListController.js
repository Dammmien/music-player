app.controller( 'favouritesListCtrl', function( $scope, Model ) {

    $scope.model = Model;

    $scope.listLimit = 100;

    $scope.onShowMore = function() {
        $scope.listLimit += 100;
    };

} ).filter( 'isFavourite', function() {
    return function( tracks ) {
        return tracks.filter( function( track ) {
            return track.starred === 1;
        } );
    };
} );