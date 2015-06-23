app.service( 'DriveParserService', function( GapiService, FavouritesService, Database, Model ) {

    var service = {

        items: [],

        setTracksByArtistAndAlbum: function() {
            var artistsDictionary = _.groupBy( Model.tracksList, 'artist' );
            var albumsDictionary = _.groupBy( Model.tracksList, 'album' );

            Model.artistsList = [];
            Model.albumsList = [];

            for ( var artist in artistsDictionary ) {
                Model.artistsList.push( {
                    title: artistsDictionary[ artist ][ 0 ].artist,
                    tracks: artistsDictionary[ artist ]
                } );
            }

            for ( var album in albumsDictionary ) {
                Model.albumsList.push( {
                    title: albumsDictionary[ album ][ 0 ].album,
                    tracks: albumsDictionary[ album ],
                    artist: albumsDictionary[ album ][ 0 ].artist
                } );
            }
        },

        getDriveContent: function( callback, nextPageToken ) {
            GapiService.drive.files.list( {
                'folderId': 'appfolder',
                maxResults: 500,
                fields: 'nextPageToken,items(id,labels(starred),owners,properties(key,value))',
                q: 'trashed=false and properties has { key="type" and value="track" and visibility="PRIVATE" }',
                pageToken: nextPageToken
            } ).execute( function( resp ) {
                this.items = this.items.concat( resp.items );
                if ( resp.nextPageToken ) this.getDriveContent( callback, resp.nextPageToken );
                else this.handleItems( callback );
            }.bind( this ) );
        },

        handleItems: function( callback ) {
            this.items.forEach( function( item ) {
                var track = {
                    id: item.id,
                    starred: item.labels.starred ? 1 : 0
                };
                item.properties.forEach( function( property ) {
                    track[ property.key ] = property.value;
                } );
                Model.tracksList.push( track );
            } );

            Database.addAll( Model.tracksList, function() {
                this.setTracksByArtistAndAlbum();
                FavouritesService.setFavourites();
                callback();
            }.bind( this ) );
        }

    }

    return service;

} );