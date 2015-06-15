app.service( 'Service', [ 'DriveService', 'Database', 'Model', '$http', function( DriveService, Database, Model, $http ) {

    var service = {

        items: [],

        rootFolders: [],

        findFolders: function() {
            this.folders = this.items.filter( function( item ) {
                if ( item.title === 'Music' ) this.rootFolders.push( item.id );
                return item.mimeType === 'application/vnd.google-apps.folder';
            }, this );
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
                        return track.parents.length > 0 && track.parents[ 0 ].id === albumFolder.id && track.fileExtension === 'mp3';
                    } );

                    albumTracks.forEach( function( track ) {
                        Model.tracks.push( {
                            title: track.title.replace( '.' + track.fileExtension, '' ),
                            id: track.id,
                            shared: track.shared ? 1 : 0,
                            starred: track.labels.starred ? 1 : 0,
                            artist: artistFolder.title,
                            artistId: artistFolder.id,
                            album: albumFolder.title,
                            albumId: albumFolder.id
                        } );
                    }, this );

                }, this );

            }, this );

            Database.addAll( Model.tracks, function() {
                this.setTracksByArtistAndAlbum();
                this.setFavourites();
            }.bind( this ) );
        },

        setFavourites: function() {
            Model.favouritesList = Model.tracks.filter( function( item ) {
                return item.starred === 1;
            } );
        },

        setTracksByArtistAndAlbum: function() {
            var artistsDictionary = _.groupBy( Model.tracks, 'artist' );
            var albumsDictionary = _.groupBy( Model.tracks, 'album' );

            Model.artistsList = [];
            Model.albumsList = [];

            for ( var artistName in artistsDictionary ) {
                Model.artistsList.push( {
                    name: artistName,
                    tracks: artistsDictionary[ artistName ]
                } );
            }

            for ( var albumName in albumsDictionary ) {
                Model.albumsList.push( {
                    name: albumName,
                    tracks: albumsDictionary[ albumName ],
                    artist: albumsDictionary[ albumName ][ 0 ].artist
                } );
            }
        },

        passToPreviousTrack: function() {
            if ( Model.playedTracks.length > 0 ) {
                Model.waitingTracks.unshift( Model.currentTrack );
                Model.currentTrack = Model.playedTracks.pop();
            }
        },

        passToNextTrack: function() {
            if ( Model.waitingTracks.length > 0 ) {
                this.setCurrentTrack( Model.waitingTracks.shift() );
            }
        },

        setWaitingTracks: function( tracks ) {
            Model.waitingTracks = tracks;
        },

        addToWaitingTracks: function( track ) {
            Model.waitingTracks.push( track );
        },

        setCurrentTrack: function( track ) {
            if ( Model.currentTrack ) this.addToPlayedTracks( Model.currentTrack );
            Model.currentTrack = track;
        },

        starTrack: function( track, callback ) {
            var request = DriveService.drive.files.update( {
                fileId: track.id
            }, {
                "labels": {
                    "starred": true
                }
            } );

            request.execute( function( resp ) {
                track.starred = 1;
                Model.favouritesList.push( track );
                Database.update( track );
                callback();
            }.bind( this ) );
        },

        unstarTrack: function( track, callback ) {
            var request = DriveService.drive.files.update( {
                fileId: track.id
            }, {
                "labels": {
                    "starred": false
                }
            } );

            request.execute( function( resp ) {
                track.starred = 0;
                Model.favouritesList.splice( Model.favouritesList.indexOf( track ), 1 );
                Database.update( track );
                callback();
            }.bind( this ) );
        },

        addToPlayedTracks: function( track ) {
            Model.playedTracks.push( track );
        },

        handleItems: function( callback ) {
            this.findFolders();
            this.findArtistFolders();
            this.buildTracksData();
            callback();
        },

        // getUserInfo: function( calback ) {
        //     var request = DriveService.drive.about.get()
        //     request.execute( function( resp ) {
        //         Model.user = resp.user;
        //         Model.user.quotaBytesTotal = resp.quotaBytesTotal;
        //         Model.user.quotaBytesUsedAggregate = resp.quotaBytesUsedAggregate;
        //         calback();
        //     } );
        // },

        getTracks: function( callback, nextPageToken ) {
            var request = DriveService.drive.files.list( {
                maxResults: 500,
                fields: 'nextPageToken,items(title,id,parents,labels(starred),shared,fileExtension,mimeType)',
                q: 'trashed=false',
                pageToken: nextPageToken
            } );

            request.execute( function( resp ) {
                this.items = this.items.concat( resp.items );
                if ( resp.nextPageToken ) this.getTracks( callback, resp.nextPageToken );
                else this.handleItems( callback );
            }.bind( this ) );
        }

    }

    return service;

} ] );