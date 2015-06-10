app.controller( 'mainCtrl', function( $scope, $window, Service, DriveService, Database ) {

    $scope.model = Service.model;

    $window.initGapi = function() {
        DriveService.checkAuth( function() {
            Database.init( function( dbExist ) {
                if ( !dbExist ) {
                    Service.getTracks();
                } else {
                    Database.getAll( function( results ) {
                        $scope.model.tracks = results;
                        Service.setTracksByArtistAndAlbum();
                        $scope.$apply();
                    }.bind( this ) );
                }
            } )
        } );
    };

    $scope.onViewDetails = function( tracks ) {
        $scope.model.detailsList = tracks;
        $scope.model.filter = '';
        $scope.model.viewMode = 'details';
    };

    $scope.onAddTrackToWaitingTracks = function( track ) {
        Service.addToWaitingTracks( track );
    };

    $scope.onAddTracksToWaitingTracks = function( tracks ) {
        tracks.forEach( function( track ) {
            Service.addToWaitingTracks( track );
        } );
    };

    $scope.onPlayTrack = function( track ) {
        Service.setCurrentTrack( track );
    };

    $scope.onPlayTracks = function( tracks ) {
        var tracksCopy = angular.copy( tracks );
        var first = tracksCopy.shift();
        Service.setCurrentTrack( first );
        Service.setWaitingTracks( tracksCopy );
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