app.controller( 'mainCtrl', function(
    $scope,
    $window,
    DriveParserService,
    PlaylistsService,
    PlayerService,
    SharingService,
    FavouritesService,
    NotificationsService,
    GapiService,
    Model,
    Database,
    ngDialog
) {

    $scope.model = Model;

    $window.initGapi = function() {
        GapiService.checkAuth( function() {
            NotificationsService.checkPermission();
            PlaylistsService.checkPlaylists( function() {
                $scope.$apply();
            }.bind( this ) );
            Database.init( function( dbExist ) {
                if ( !dbExist ) {
                    DriveParserService.getDriveContent( function() {
                        $scope.$apply();
                    } );
                } else {
                    Database.getAll( function( results ) {
                        $scope.model.tracksList = results;
                        DriveParserService.setTracksByArtistAndAlbum();
                        FavouritesService.setFavourites();
                        $scope.$apply();
                    }.bind( this ) );
                }
            } );
        } );
    };

    $scope.onOpenShareDialog = function( item ) {
        $scope.model.sharingItem = item;
        $scope.openedDialog = ngDialog.open( {
            template: '/templates/shareDialog.html',
            scope: $scope
        } );
    };

    $scope.onShare = function() {
        SharingService.shareItem( $scope.model.sharingItem, $scope.model.sharingMail, function() {
            $scope.openedDialog.close();
        } );
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
        PlayerService.addToWaitingTracks( track );
    };

    $scope.onAddTracksToWaitingTracks = function( tracks ) {
        tracks.forEach( function( track ) {
            PlayerService.addToWaitingTracks( track );
        } );
    };

    $scope.onPlayTrack = function( track ) {
        PlayerService.setCurrentTrack( track );
    };

    $scope.onPlayTracks = function( tracks ) {
        PlayerService.playTracks( tracks );
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