app.service( 'ArtworksService', function( $http, GapiService, Model, Database ) {

    var service = {

        baseUrl: 'https://api.spotify.com/v1/search',

        getAllArtworks: function() {
            this.albumCache = {};
            this.getAlbumsArtworks( Model.tracksList.filter( function( track ) {
                return track.albumArtwork === undefined;
            } ) );
            // this.artistCache = {};
            // this.getArtistsArtworks( Model.tracksList.filter( function( track ) {
            //     return track.artistArtwork === undefined;
            // } ) );
        },

        getArtistsArtworks: function( tracks ) {
            var track = tracks.shift();
            if ( this.artistCache[ track.artist ] === undefined ) {
                this.getArtistArtwork( track.artist ).then( function( resp ) {
                    if ( resp.data.artists.items.length > 0 ) {
                        var image = resp.data.artists.items[ 0 ].images[ 0 ];
                        if ( image ) {
                            image = image.url;
                            this.setArtistArtwork( {
                                track: track,
                                artworkUrl: image,
                                callback: function() {
                                    if ( tracks.length > 0 ) this.getArtistsArtworks( tracks );
                                }.bind( this )
                            } );
                            this.artistCache[ track.artist ] = image;
                        } else {
                            this.artistCache[ track.artist ] = 'No image';
                            if ( tracks.length > 0 ) this.getArtistsArtworks( tracks );
                        }
                    } else {
                        this.albumCache[ track.album ] = 'No image';
                        if ( tracks.length > 0 ) this.getArtistsArtworks( tracks );
                    }
                }.bind( this ) );
            } else if ( this.artistCache[ track.artist ] === 'No image' ) {
                if ( tracks.length > 0 ) this.getArtistsArtworks( tracks );
            } else {
                this.setArtistArtwork( {
                    track: track,
                    artworkUrl: this.artistCache[ track.artist ],
                    callback: function() {
                        if ( tracks.length > 0 ) this.getArtistsArtworks( tracks );
                    }.bind( this )
                } );
            }
        },

        getAlbumsArtworks: function( tracks ) {
            var track = tracks.shift();
            if ( this.albumCache[ track.album ] === undefined ) {
                this.getAlbumArtwork( track.artist, track.album ).then( function( resp ) {
                    if ( resp.data.albums.items.length > 0 ) {
                        var image = resp.data.albums.items[ 0 ].images[ 0 ];
                        if ( image ) {
                            image = image.url;
                            this.setAlbumArtwork( {
                                track: track,
                                artworkUrl: image,
                                callback: function() {
                                    if ( tracks.length > 0 ) this.getAlbumsArtworks( tracks );
                                }.bind( this )
                            } );
                            this.albumCache[ track.album ] = image;
                        } else {
                            this.albumCache[ track.album ] = 'No image';
                            if ( tracks.length > 0 ) this.getAlbumsArtworks( tracks );
                        }
                    } else {
                        this.albumCache[ track.album ] = 'No image';
                        if ( tracks.length > 0 ) this.getAlbumsArtworks( tracks );
                    }
                }.bind( this ) );
            } else if ( this.albumCache[ track.album ] === 'No image' ) {
                if ( tracks.length > 0 ) this.getAlbumsArtworks( tracks );
            } else {
                this.setArtistArtwork( {
                    track: track,
                    artworkUrl: this.albumCache[ track.album ],
                    callback: function() {
                        if ( tracks.length > 0 ) this.getAlbumsArtworks( tracks );
                    }.bind( this )
                } );
            }
        },

        getArtistArtwork: function( artist ) {
            return $http.get( this.baseUrl, {
                params: {
                    q: artist,
                    type: 'artist'
                }
            } );
        },

        getAlbumArtwork: function( artist, album ) {
            return $http.get( this.baseUrl, {
                params: {
                    q: artist + ' ' + album,
                    type: 'album'
                }
            } );
        },

        setAlbumArtwork: function( o ) {
            GapiService.drive.properties.insert( {
                'fileId': o.track.id,
                'resource': {
                    'key': 'albumArtwork',
                    'value': o.artworkUrl,
                    'visibility': 'PRIVATE'
                }
            } ).execute( function( resp ) {
                o.callback();
            }.bind( this ) );
        },

        setArtistArtwork: function( o ) {
            GapiService.drive.properties.insert( {
                'fileId': o.track.id,
                'resource': {
                    'key': 'artistArtwork',
                    'value': o.artworkUrl,
                    'visibility': 'PRIVATE'
                }
            } ).execute( function( resp ) {
                o.callback();
            }.bind( this ) );
        }

    };

    return service;

} );