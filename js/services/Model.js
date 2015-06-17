app.service( 'Model', function() {

    var model = {
        tracks: [],
        currentTrack: null,
        playedTracks: [],
        waitingTracks: [],
        viewMode: 'tracks'
    };

    return model;

} );