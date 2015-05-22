app.controller( 'mainCtrl', function( $scope, $window, Service, DriveService ) {

    $scope.model = Service.model;

    $window.initGapi = function() {
        DriveService.checkAuth( function() {
            Service.getTracks();
        } );
    };

    $scope.onAddTrackToWaitingTracks = function( track ) {
        if ( $scope.model.currentTrack.url === undefined )
            $scope.model.currentTrack = track;
        else
            $scope.model.waitingTracks.push( track );
    };

    $scope.onPlayTrack = function( track ) {
        $scope.model.currentTrack = track;
    };

} ).filter( 'formatTime', function() {
    return function( time ) {
        var minutes = Math.floor( time / 60 );
        var seconds = Math.floor( time ) - minutes * 60;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return minutes + ':' + seconds
    };
} );