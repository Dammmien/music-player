app.service( 'DriveSharedParserService', function( Model ) {

    var service = {

        init: function( folders, tracks ) {
            this.sharedFolders = folders.filter( function( item ) {
                return _.pluck( item.owners, 'isAuthenticatedUser' ).indexOf( true ) === -1;
            } );
            this.sharedTracks = tracks.filter( function( item ) {
                return _.pluck( item.owners, 'isAuthenticatedUser' ).indexOf( true ) === -1;
            } );
            this.findTracksWithoutAlbumOrArtist();
            this.findArtistsAndAlbums();
        },

        findTracksWithoutAlbumOrArtist: function() {
            this.sharedTracks.filter( function( track ) {
                if ( !track.properties ) return false;
                return _.result( _.findWhere( track.properties, {
                    'key': 'mpitem'
                } ), 'value' );
            } ).forEach( function( track ) {
                var properties = JSON.parse( _.result( _.findWhere( track.properties, {
                    'key': 'mpitem'
                } ), 'value' ) );
                Model.tracksList.push( {
                    title: track.title.replace( '.' + track.fileExtension, '' ),
                    id: track.id,
                    starred: track.labels.starred ? 1 : 0,
                    artist: properties.artist || 'Unknow',
                    artistId: null,
                    album: properties.album || 'Unknow',
                    albumId: null
                } );
            } );
        },

        findArtistsAndAlbums: function() {
            this.sharedFolders.filter( function( folder ) {
                if ( !folder.properties ) return false;
                return _.result( _.findWhere( folder.properties, {
                    'key': 'mpitem'
                } ), 'value' );
            }, this ).forEach( function( folder ) {
                var properties = JSON.parse( _.result( _.findWhere( folder.properties, {
                    'key': 'mpitem'
                } ), 'value' ) );
                if ( properties.type === 'artist' ) {
                    this.findTracksForAFolder( folder, folder, null );
                    this.sharedFolders.filter( function( albumFolder ) {
                        return albumFolder.parents.length > 0 && albumFolder.parents[ 0 ].id === folder.id;
                    }, this ).forEach( function( album ) {
                        this.findTracksForAFolder( album, folder, album );
                    }, this );
                } else if ( properties.type === 'album' ) {
                    this.findTracksForAFolder( folder, {
                        title: properties.artist
                    }, folder );
                }
            }, this );
        },

        findTracksForAFolder: function( parentFolder, artist, album ) {
            this.sharedTracks.filter( function( item ) {
                return item.parents.length > 0 && item.parents[ 0 ].id === parentFolder.id;
            }, this ).forEach( function( track ) {
                artist = artist || {};
                album = album || {};
                Model.tracksList.push( {
                    title: track.title.replace( '.' + track.fileExtension, '' ),
                    id: track.id,
                    starred: track.labels.starred ? 1 : 0,
                    artist: artist.title || 'Unknow',
                    artistId: artist.id,
                    album: album.title || 'Unknow',
                    albumId: album.id
                } );
            }, this );
        }

    };

    return service;

} );