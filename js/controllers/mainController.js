app.controller( 'mainCtrl', function(
    $scope,
    $window,
    PlaylistsService,
    MainService,
    PlayerService,
    TrackService,
    Model,
    ngDialog
) {

    $scope.model = Model;

    $window.initGapi = MainService.init.bind( MainService )

    $scope.onOpenShareDialog = function( tracks ) {
        $scope.openedDialog = ngDialog.open( {
            template: '/templates/shareDialog.html',
            scope: $scope,
            className: 'ngdialog-theme-default share-dialog',
            data: {
                tracks: tracks,
                email: null
            }
        } );
    };

    $scope.onShare = function( data ) {
        TrackService.shareTracks( data );
        $scope.openedDialog.close();
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
        TrackService.addTrackToFavourites( track );
    };

    $scope.onRemoveTrackFromFavourites = function( track ) {
        TrackService.removeTrackFromFavourites( track );
    };

    $scope.onDeleteTracks = function( tracks ) {
        TrackService.deleteTracks( tracks );
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