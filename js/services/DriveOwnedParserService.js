app.service( 'DriveOwnedParserService', function( Model ) {

    var service = {

        init: function( folders, tracks ) {
            this.ownedFolders = folders.filter( function( item ) {
                console.log( item.item.sharingUser );
                return !item.shared || ( item.sharingUser && item.sharingUser.isAuthenticatedUser )
            } );
            this.ownedTracks = tracks.filter( function( item ) {
                return !item.shared || ( item.sharingUser && item.sharingUser.isAuthenticatedUser )
            } );
            this.setRootFolder();
            this.findTracksWithoutAlbumOrArtist();
            this.findArtistsAndAlbums();
        },

        setRootFolder: function() {
            this.ownedFolders.forEach( function( folder ) {
                if ( folder.title === 'Music' ) this.rootFolder = folder;
            }, this );
        },

        findTracksWithoutAlbumOrArtist: function() {
            this.findTracksForAFolder( this.rootFolder, null, null );
        },

        findArtistsAndAlbums: function() {
            this.ownedFolders.filter( function( artistFolder ) {
                if ( artistFolder.parents.length === 0 ) return false;
                return artistFolder.parents[ 0 ].id === this.rootFolder.id;
            }, this ).forEach( function( artist ) {
                this.findTracksForAFolder( artist, artist, null );
                this.ownedFolders.filter( function( albumfolder ) {
                    return albumfolder.parents[ 0 ].id === artist.id;
                }, this ).forEach( function( album ) {
                    this.findTracksForAFolder( album, artist, album );
                }, this );
            }, this );
        },

        findTracksForAFolder: function( parentFolder, artist, album ) {
            this.ownedTracks.filter( function( item ) {
                return item.parents[ 0 ].id === parentFolder.id;
            }, this ).forEach( function( track ) {
                artist = artist || {};
                album = album || {};
                Model.tracksList.push( {
                    title: track.title.replace( '.' + track.fileExtension, '' ),
                    id: track.id,
                    type: 'track',
                    shared: track.shared ? 1 : 0,
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