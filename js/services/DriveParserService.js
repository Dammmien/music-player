app.service( 'DriveParserService', function( GapiService, ArtworksService, Database, Model, $rootScope ) {

    var service = {

        rootFolder: 'root',

        setRootFolder: function() {
            GapiService.drive.files.list( {
                maxResults: 500,
                fields: 'items(id)',
                q: 'trashed=false and "root" in parents and title="Music"'
            } ).execute( function( resp ) {
                if ( resp.items.length > 0 ) this.rootFolder = resp.items[ 0 ].id;
            }.bind( this ) );
        },

        setTracksByArtistAndAlbum: function() {
            Model.artistsList = _.map( _.groupBy( Model.tracksList, 'artist' ), function( tracks ) {
                return {
                    title: tracks[ 0 ].artist,
                    tracks: tracks,
                    artistArtwork: tracks[ 0 ].artistArtwork
                }
            } );
            Model.albumsList = _.map( _.groupBy( Model.tracksList, 'album' ), function( tracks ) {
                return {
                    title: tracks[ 0 ].album,
                    tracks: tracks,
                    artist: tracks[ 0 ].artist,
                    artistArtwork: tracks[ 0 ].artistArtwork,
                    albumArtwork: tracks[ 0 ].albumArtwork,
                    year: tracks[ 0 ].year
                }
            } );
            $rootScope.$apply();
        },

        getDriveContent: function( nextPageToken ) {
            GapiService.drive.files.list( {
                maxResults: 500,
                fields: 'nextPageToken,items(id,labels(starred),owners,properties(key,value))',
                q: 'trashed=false and properties has { key="type" and value="track" and visibility="PRIVATE" }',
                pageToken: nextPageToken
            } ).execute( function( resp ) {
                this.items = this.items.concat( resp.items );
                if ( resp.nextPageToken ) this.getDriveContent( resp.nextPageToken );
                else this.handleItems();
            }.bind( this ) );
        },

        handleItems: function() {
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
            this.setTracksByArtistAndAlbum();
            ArtworksService.getAllArtworks();
            Database.addAll( Model.tracksList );
        }

    }

    return service;

} );