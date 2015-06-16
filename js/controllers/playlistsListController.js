app.controller( 'playlistsListCtrl', function( $scope, Service, Model ) {

    $scope.model = Model;

    $scope.onEditPlaylist = function( playlist ) {
        console.log( playlist );
    };

} );