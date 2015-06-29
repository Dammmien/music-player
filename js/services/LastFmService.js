app.service( 'LastFmService', function( $http, GapiService, Model ) {

    var service = {

        key: '395e6ec6bb557382fc41fde867bce66f',

        baseUrl: 'http://ws.audioscrobbler.com/2.0',

        getAllArtworks: function() {
            this.getAlbumsArtworks( angular.copy( Model.albumsList ) );
        },

        getAlbumsArtworks: function( albums ) {
            var album = albums.shift();
            if ( album.albumArtwork === undefined ) {
                this.getAlbumArtwork( album.artist, album.title ).then( function( resp ) {
                    if ( resp.data.results[ 'opensearch:totalResults' ] > 0 ) {
                        var result = resp.data.results.albummatches.album[ 0 ] || resp.data.results.albummatches.album;
                        var images = result.image
                        this.setAlbumArtwork( {
                            tracks: album.tracks,
                            artworkUrl: images[ images.length - 1 ][ '#text' ],
                            callback: function() {
                                if ( albums.length > 0 ) this.getAlbumsArtworks( albums )
                            }.bind( this )
                        } );
                    } else {
                        if ( albums.length > 0 ) this.getAlbumsArtworks( albums )
                    }
                }.bind( this ) );
            } else {
                this.getAlbumsArtworks( albums );
            }
        },

        getAlbumArtwork: function( artist, album ) {
            return $http.get( this.baseUrl, {
                params: {
                    method: 'album.search',
                    api_key: this.key,
                    album: artist + ' ' + album,
                    format: 'json'
                }
            } );
        },

        setAlbumArtwork: function( o ) {
            var track = o.tracks.shift();
            GapiService.drive.properties.insert( {
                'fileId': track.id,
                'resource': {
                    'key': 'albumArtwork',
                    'value': o.artworkUrl,
                    'visibility': 'PRIVATE'
                }
            } ).execute( function( resp ) {
                if ( o.tracks.length > 0 ) {
                    this.setAlbumArtwork( o );
                } else {
                    o.callback();
                }
            }.bind( this ) );
        }

    };

    return service;

} );