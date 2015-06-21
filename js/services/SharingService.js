app.service( 'SharingService', function( GapiService ) {

    var service = {

        shareItem: function( data ) {
            GapiService.drive.permissions.insert( {
                'fileId': data.item.id,
                'resource': {
                    value: data.email,
                    type: 'user',
                    role: 'reader'
                }
            } ).execute( function( resp ) {
                this.insertItemProperty( data );
            }.bind( this ) );
        },

        insertItemProperty: function( data ) {
            var type = data.type,
                artist = data.item.artist || "",
                album = data.item.album || "";

            GapiService.drive.properties.insert( {
                'fileId': data.item.id,
                'resource': {
                    'key': 'mpitem',
                    'value': JSON.stringify( {
                        type: type,
                        album: album.substring( 0, 35 ),
                        artist: artist.substring( 0, 35 )
                    } ),
                    'visibility': 'PRIVATE'
                }
            } ).execute( function( resp ) {

            }.bind( this ) );
        }

    };

    return service;

} );