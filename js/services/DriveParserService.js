app.service( 'DriveParserService', function( GapiService, Database, Model ) {

    var service = {

        items: [],

        setTracksByArtistAndAlbum: function() {
            Model.artistsList = _.map( _.groupBy( Model.tracksList, 'artist' ), function( tracks ) {
                return {
                    title: tracks[ 0 ].artist,
                    tracks: tracks
                }
            } );
            Model.albumsList = _.map( _.groupBy( Model.tracksList, 'album' ), function( tracks ) {
                return {
                    title: tracks[ 0 ].album,
                    tracks: tracks,
                    artist: tracks[ 0 ].artist,
                    year: tracks[ 0 ].year,
                }
            } );
        },

        getDriveContent: function( callback, nextPageToken ) {
            GapiService.drive.files.list( {
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
            this.setTracksByArtistAndAlbum();
            Database.addAll( Model.tracksList, callback );
        }

    }

    return service;

} );