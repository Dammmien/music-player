app.controller( 'mainCtrl', function( $scope, $window, Service, PlaylistsService, FavouritesService, DriveService, Model, Database, ngDialog ) {

    $scope.model = Model;

    $window.initGapi = function() {
        DriveService.checkAuth( function() {
            PlaylistsService.checkPlaylists( function() {
                $scope.$apply();
            }.bind( this ) );
            Database.init( function( dbExist ) {
                if ( !dbExist ) {
                    Service.getTracks( function() {
                        $scope.$apply();
                    } );
                } else {
                    Database.getAll( function( results ) {
                        $scope.model.tracks = results;
                        Service.setTracksByArtistAndAlbum();
                        FavouritesService.setFavourites();
                        $scope.$apply();
                    }.bind( this ) );
                }
            } );
        } );
    };

    $scope.onViewDetails = function( tracks ) {
        $scope.model.detailsList = tracks;
        $scope.model.filter = '';
        $scope.model.viewMode = 'details';
    };

    $scope.onOpenPlaylistsList = function( track ) {
        $scope.openedDialog = ngDialog.open( {
            template: '/templates/playlistsListDialog.html',
            data: track,
            scope: $scope
        } );
    };

    $scope.addTrackToPlaylist = function( track, playlist ) {
        playlist.tracks.push( track );
        $scope.openedDialog.close();
        PlaylistsService.savePlaylistFile();
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

    $scope.onAddTrackToFavourites = function( track ) {
        FavouritesService.addTrackToFavourites( track, function() {
            $scope.$apply();
        } );
    };

    $scope.onRemoveTrackFromFavourites = function( track ) {
        FavouritesService.removeTrackFromFavourites( track, function() {
            $scope.$apply();
        } );
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