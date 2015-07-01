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
            } else {
                Model.currentTrack = null;
                this.player.src = "";
            }
        },

        setWaitingTracks: function( tracks ) {
            Model.waitingTracks = tracks;
        },

        addToWaitingTracks: function( track ) {
            if ( Model.waitingTracks.indexOf( track ) === -1 ) {
                Model.waitingTracks.push( track );
            }
        },

        removeWaitingTracks: function() {
            Model.waitingTracks = [];
        },

        shuffleWaitingTracks: function() {
            Model.waitingTracks = _.shuffle( Model.waitingTracks );
        },

        playTracks: function( tracks ) {
            var tracksCopy = angular.copy( tracks );
            var first = tracksCopy.shift();
            this.setCurrentTrack( first );
            this.setWaitingTracks( tracksCopy );
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
                body: Model.currentTrack.artist,
                icon: Model.currentTrack.albumArtwork || './images/album-placeholder.png'
            } );
        },

        addToPlayedTracks: function( track ) {
            Model.playedTracks.push( track );
        }

    }

    return service;

} );