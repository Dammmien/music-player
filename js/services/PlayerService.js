app.service( 'PlayerService', function( NotificationsService, Model, $document ) {

    var service = {

        passToPreviousTrack: function() {
            if ( Model.playedTracks.length > 0 ) {
                Model.waitingTracks.unshift( Model.currentTrack );
                Model.currentTrack = Model.playedTracks.pop();
                this.player.src = "https://googledrive.com/host/" + Model.currentTrack.id;
                this.player.play();
                this.notifyCurrentTrack();
            }
        },

        passToNextTrack: function() {
            if ( Model.waitingTracks.length > 0 ) {
                this.setCurrentTrack( Model.waitingTracks.shift() );
            }
        },

        setWaitingTracks: function( tracks ) {
            Model.waitingTracks = tracks;
        },

        addToWaitingTracks: function( track ) {
            Model.waitingTracks.push( track );
        },

        setCurrentTrack: function( track ) {
            if ( Model.currentTrack ) this.addToPlayedTracks( Model.currentTrack );
            Model.currentTrack = track;
            this.player.src = "https://googledrive.com/host/" + Model.currentTrack.id;
            this.player.play();
            this.notifyCurrentTrack();
        },

        notifyCurrentTrack: function() {
            $document[ 0 ].title = Model.currentTrack.title + ' - ' + Model.currentTrack.artist;
            NotificationsService.show( Model.currentTrack.title, {
                body: 'by ' + Model.currentTrack.artist,
                icon: 'images/cd.png'
            } );
        },

        addToPlayedTracks: function( track ) {
            Model.playedTracks.push( track );
        }

    }

    return service;

} );