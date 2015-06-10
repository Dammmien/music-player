app.service( 'Service', [ 'DriveService', 'Database', '$http', function( DriveService, Database, $http ) {

    var service = {

        model: {
            tracks: [],
            currentTrack: null,
            playedTracks: [],
            waitingTracks: [],
            viewMode: 'tracks'
        },

        filterItems: function( items ) {
            this.items = items.filter( function( item ) {
                return item.labels.trashed === false;
            } );
        },

        findFolders: function() {
            this.folders = this.items.filter( function( item ) {
                return item.fileSize === undefined;
            } );
        },

        findArtistFolders: function() {
            this.artistFolders = this.folders.filter( function( item ) {
                return item.parents.length > 0 && this.rootFolders.indexOf( item.parents[ 0 ].id ) > -1;
            }, this );
        },

        buildTracksData: function() {

            this.artistFolders.forEach( function( artistFolder ) {

                this.folders.filter( function( folder ) {
                    return folder.parents.length > 0 && folder.parents[ 0 ].id === artistFolder.id;
                } ).forEach( function( albumFolder ) {

                    var albumTracks = this.items.filter( function( track ) {
                        return track.parents.length > 0 && track.parents[ 0 ].id === albumFolder.id && [ 'mp3', 'flac', 'm3u' ].indexOf( track.fileExtension ) > -1;
                    } );

                    albumTracks.forEach( function( track ) {
                        this.model.tracks.push( {
                            title: track.title.replace( '.' + track.fileExtension, '' ),
                            id: track.id,
                            starred: track.labels.starred,
                            artist: artistFolder.title,
                            artistId: artistFolder.id,
                            album: albumFolder.title,
                            albumId: albumFolder.id,
                            url: track.downloadUrl.replace( '?e=download&gd=true', '' )
                        } );
                    }, this );

                }, this );

            }, this );

            Database.addAll( this.model.tracks, this.setTracksByArtistAndAlbum.bind( this ) );
        },

        setTracksByArtistAndAlbum: function() {
            this.model.artistsList = _.groupBy( this.model.tracks, 'artist' );
            this.model.albumsList = _.groupBy( this.model.tracks, 'album' );
        },

        setRootfolders: function() {
            this.rootFolders = this.folders.filter( function( item ) {
                return item.title === 'Music';
            } ).map( function( item ) {
                return item.id
            } );
        },

        passToPreviousTrack: function() {
            if ( this.model.playedTracks.length > 0 ) {
                this.model.waitingTracks.unshift( this.model.currentTrack );
                this.model.currentTrack = this.model.playedTracks.pop();
            }
        },

        passToNextTrack: function() {
            if ( this.model.waitingTracks.length > 0 ) {
                this.setCurrentTrack( this.model.waitingTracks.shift() );
            }
        },

        setWaitingTracks: function( tracks ) {
            this.model.waitingTracks = tracks;
        },

        addToWaitingTracks: function( track ) {
            this.model.waitingTracks.push( track );
        },

        setCurrentTrack: function( track ) {
            if ( this.model.currentTrack ) this.addToPlayedTracks( this.model.currentTrack );
            this.model.currentTrack = track;
        },

        addToPlayedTracks: function( track ) {
            this.model.playedTracks.push( track );
        },

        getTracks: function() {

            var temp = [];

            var recursive = function( nextPageToken ) {

                var configs = {
                    headers: {
                        'Authorization': DriveService.authResult.token_type + ' ' + DriveService.authResult.access_token
                    },
                    params: {
                        'key': 'AIzaSyAgQ7N0Tv0k80OU3XpA3ltup5RgZxKhWrI',
                        'maxResults': 1000,
                        'pageToken': nextPageToken
                    }
                };


                $http.get( 'https://www.googleapis.com/drive/v2/files', configs ).then( function( resp ) {
                    temp = temp.concat( resp.data.items );
                    if ( resp.data.nextPageToken ) {
                        recursive( resp.data.nextPageToken )
                    } else {
                        this.filterItems( temp );
                        this.findFolders();
                        this.setRootfolders();
                        this.findArtistFolders();
                        this.buildTracksData();
                    }
                }.bind( this ) );

            }.bind( this );

            recursive();

        }

    }

    return service;

} ] );