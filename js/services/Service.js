app.service( 'Service', [ 'DriveService', '$http', function( DriveService, $http ) {

    var service = {

        model: {
            tracks: [],
            currentTrack: {},
            waitingTracks: []
        },

        filterItems: function( items ) {
            this.items = items.filter( function( item ) {
                return item.labels.trashed === false;
            }, this );
        },

        findFolders: function() {
            this.folders = this.items.filter( function( item ) {
                return item.fileSize === undefined;
            }, this );
        },

        findArtistFolders: function() {
            this.artistFolders = this.folders.filter( function( item ) {
                return item.parents[ 0 ].id === this.rootFolder.id;
            }, this );
        },

        buildTracksData: function() {
            this.artistFolders.forEach( function( artistFolder ) {

                this.folders.filter( function( albumFolder ) {
                    return albumFolder.parents[ 0 ].id === artistFolder.id;
                } ).forEach( function( albumFolder ) {

                    var albumTracks = this.items.filter( function( track ) {
                        return track.parents[ 0 ].id === albumFolder.id && track.fileExtension === "mp3";
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
        },

        setRootfolder: function() {
            this.rootFolder = this.folders.filter( function( item ) {
                return item.parents[ 0 ].isRoot && item.title === 'Music';
            }, this )[ 0 ];
        },

        getTracks: function() {

            var configs = {
                headers: {
                    'Authorization': DriveService.authResult.token_type + ' ' + DriveService.authResult.access_token
                }
            };

            $http.get( 'https://www.googleapis.com/drive/v2/files?key=AIzaSyAgQ7N0Tv0k80OU3XpA3ltup5RgZxKhWrI', configs ).then( function( resp ) {
                this.filterItems( resp.data.items );
                this.findFolders();
                this.setRootfolder();
                this.findArtistFolders();
                this.buildTracksData();
            }.bind( this ) );
        }
    }

    return service;

} ] );