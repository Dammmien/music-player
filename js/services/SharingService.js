app.service( 'SharingService', function( GapiService ) {

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

        }

    };

    return service;

} );