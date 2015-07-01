app.controller( 'sideBarCtrl', function( $scope, PlayerService, Model, ngDialog, MainService ) {

    $scope.model = Model;

    $scope.sortableOptions = {
        containment: '#side-bar'
    };

    $scope.onRemoveWaitingTrack = function( index ) {
        Model.waitingTracks.splice( index, 1 );
    };

    $scope.onResetApp = function() {
        MainService.resetApp();
    };

    $scope.onPlayWaitingTrack = function( index ) {
        var track = Model.waitingTracks.splice( index, 1 )[ 0 ];
        PlayerService.setCurrentTrack( track );
    };

} );