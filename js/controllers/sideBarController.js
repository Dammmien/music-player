app.controller( 'sideBarCtrl', function( $scope, PlayerService, Model ) {

    $scope.model = Model;

    $scope.onRemoveWaitingTrack = function( index ) {
        Model.waitingTracks.splice( index, 1 );
    };

    $scope.onPlayWaitingTrack = function( index ) {
        var track = Model.waitingTracks.splice( index, 1 )[ 0 ];
        PlayerService.setCurrentTrack( track );
    };

} );