app.service( 'DriveParserService', function( GapiService, FavouritesService, DriveOwnedParserService, DriveSharedParserService, Database, Model ) {

    var service = {

        items: [],

        setTracksByArtistAndAlbum: function() {
            var artistsDictionary = _.groupBy( Model.tracksList, 'artistId' );
            var albumsDictionary = _.groupBy( Model.tracksList, 'albumId' );

            Model.artistsList = [];
            Model.albumsList = [];

            for ( var artistId in artistsDictionary ) {
                Model.artistsList.push( {
                    title: artistsDictionary[ artistId ][ 0 ].artist,
                    id: artistId,
                    tracks: artistsDictionary[ artistId ]
                } );
            }

            for ( var albumId in albumsDictionary ) {
                Model.albumsList.push( {
                    title: albumsDictionary[ albumId ][ 0 ].album,
                    id: albumId,
                    tracks: albumsDictionary[ albumId ],
                    artist: albumsDictionary[ albumId ][ 0 ].artist
                } );
            }
        },

        getDriveContent: function( callback, nextPageToken ) {
            GapiService.drive.files.list( {
                maxResults: 500,
                fields: 'nextPageToken,items(title,id,parents,labels(starred),fileExtension,mimeType,owners,properties)',
                q: 'trashed=false and ( mimeType = "application/vnd.google-apps.folder" or mimeType = "audio/mpeg" )',
                pageToken: nextPageToken
            } ).execute( function( resp ) {
                this.items = this.items.concat( resp.items );
                if ( resp.nextPageToken ) this.getDriveContent( callback, resp.nextPageToken );
                else this.handleItems( callback );
            }.bind( this ) );
        },

        handleItems: function( callback ) {
            this.separateFoldersAndTracks();
            DriveOwnedParserService.init( this.folders, this.tracks );
            DriveSharedParserService.init( this.folders, this.tracks );
            Database.addAll( Model.tracksList, function() {
                this.setTracksByArtistAndAlbum();
                FavouritesService.setFavourites();
                callback();
            }.bind( this ) );
        },

        separateFoldersAndTracks: function() {
            this.folders = this.items.filter( function( item ) {
                return item.mimeType === 'application/vnd.google-apps.folder';
            }, this );
            this.tracks = this.items.filter( function( item ) {
                return item.mimeType === 'audio/mpeg';
            }, this );
        }

    }

    return service;

} );