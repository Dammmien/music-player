app.service( 'Model', function() {

    var model = {
        tracksList: [],
        currentTrack: null,
        playedTracks: [],
        waitingTracks: [],
        viewMode: 'tracks'
    };

    return model;

} );