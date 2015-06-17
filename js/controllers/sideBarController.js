app.controller( 'sideBarCtrl', function( $scope, PlayerService, Model ) {

    $scope.model = Model;

    $scope.onRemoveWaitingTrack = function( index ) {
        Model.waitingTracks.splice( index, 1 );
    };

    $scope.onPlayWaitingTrack = function( index ) {
        var track = Model.waitingTracks.splice( index, 1 )[ 0 ];
        PlayerService.setCurrentTrack( track );
    };

    $scope.onRemoveWaitingTracks = function() {
        PlayerService.removeWaitingTracks();
    };

    $scope.onPlayRandomTracks = function() {
        var tracks = _.shuffle( Model.tracksList ).splice( 0, 100 );
        PlayerService.playTracks( tracks );
    };

    $scope.onShuffleWaitingTracks = function() {
        PlayerService.shuffleWaitingTracks();
    };

} );