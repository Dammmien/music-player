app.service( 'TrackService', function( GapiService, Model, Database, $rootScope ) {

    var service = {

        shareTracks: function( data ) {

            var track = data.tracks.shift();

            GapiService.drive.permissions.insert( {
                'fileId': track.id,
                'resource': {
                    value: data.email,
                    type: 'user',
                    role: 'reader'
                }
            } ).execute( function( resp ) {
                if ( data.tracks.length > 0 ) this.shareTracks( data );
            }.bind( this ) );

        },

        deleteTracks: function( tracks ) {

            var track = tracks.shift();

            GapiService.drive.files.delete( {
                'fileId': track.id,
            } ).execute( function( resp ) {
                if ( tracks.length > 0 ) this.deleteTracks( tracks );
            }.bind( this ) );

        },

        addTrackToFavourites: function( track ) {
            GapiService.drive.files.patch( {
                'fileId': track.id,
                'resource': {
                    "labels": {
                        "starred": true
                    }
                }
            } ).execute( function( resp ) {
                track.starred = 1;
                Database.update( track );
                $rootScope.$apply();
            }.bind( this ) );
        },

        removeTrackFromFavourites: function( track ) {
            GapiService.drive.files.patch( {
                'fileId': track.id,
                'resource': {
                    "labels": {
                        "starred": false
                    }
                }
            } ).execute( function( resp ) {
                track.starred = 0;
                Database.update( track );
                $rootScope.$apply();
            }.bind( this ) );
        }

    };

    return service;

} );