app.service( 'Service', function( DriveService, FavouritesService, Database, Model, $http ) {

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
                FavouritesService.setFavourites();
            }.bind( this ) );
        },

        setTracksByArtistAndAlbum: function() {
            var artistsDictionary = _.groupBy( Model.tracks, 'artistId' );
            var albumsDictionary = _.groupBy( Model.tracks, 'albumId' );

            Model.artistsList = [];
            Model.albumsList = [];

            for ( var artistId in artistsDictionary ) {
                Model.artistsList.push( {
                    name: artistsDictionary[ artistId ][ 0 ].artist,
                    tracks: artistsDictionary[ artistId ]
                } );
            }

            for ( var albumId in albumsDictionary ) {
                Model.albumsList.push( {
                    name: albumsDictionary[ albumId ][ 0 ].album,
                    tracks: albumsDictionary[ albumId ],
                    artist: albumsDictionary[ albumId ][ 0 ].artist
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

} );