app.service( 'SharingService', function( GapiService ) {

    var service = {

        shareItem: function( item, mail, callback ) {
            GapiService.drive.permissions.insert( {
                'fileId': item.id,
                'resource': {
                    value: mail,
                    type: 'user',
                    role: 'reader'
                }
            } ).execute( function( resp ) {
                this.insertItemProperty( item, callback );
            }.bind( this ) );
        },

        insertItemProperty: function( item, callback ) {
            var type = item.type,
                artist = item.artist || "",
                album = item.album || "";

            GapiService.drive.properties.insert( {
                'fileId': item.id,
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
                callback();
            }.bind( this ) );
        }

    };

    return service;

} );