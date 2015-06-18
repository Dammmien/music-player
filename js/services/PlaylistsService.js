app.service( 'PlaylistsService', function( DriveService, Model, $http ) {

    var service = {

        boundary: '-------314159265358979323846',

        checkPlaylists: function( callback ) {
            DriveService.drive.children.list( {
                'folderId': 'appfolder',
            } ).execute( function( appFolder ) {
                if ( appFolder.items.length === 0 ) {
                    this.createPlaylistFile( callback );
                } else {
                    this.playlistsFile = appFolder.items[ 0 ];
                    this.getPlaylists( callback );
                }
            }.bind( this ) );
        },

        getPlaylists: function( callback ) {
            DriveService.drive.files.get( {
                'fileId': this.playlistsFile.id,
                alt: 'media'
            } ).execute( function( resp ) {
                Model.playlistsList = resp.result;
                callback();
            }.bind( this ) );
        },

        buildPlaylistFileContent: function( content ) {

            var delimiter = "\r\n--" + this.boundary + "\r\n",
                close_delim = "\r\n--" + this.boundary + "--",
                contentType = 'application/json';

            var metadata = {
                title: 'playlist.json',
                mimeType: 'application/json',
                parents: [ {
                    'id': 'appfolder'
                } ]
            };

            var base64Data = btoa( content );

            var content = delimiter + 'Content-Type: application/json\r\n\r\n';
            content += JSON.stringify( metadata ) + delimiter;
            content += 'Content-Type: ' + contentType + '\r\n' + 'Content-Transfer-Encoding: base64\r\n\r\n';
            content += base64Data + close_delim;

            return content;

        },

        createPlaylistFile: function( callback ) {

            var obj = [ {
                name: "My first playlist",
                tracks: []
            } ];

            var body = this.buildPlaylistFileContent( JSON.stringify( obj ) );

            DriveService.client.request( {
                path: '/upload/drive/v2/files',
                method: 'POST',
                params: {
                    'uploadType': 'multipart'
                },
                headers: {
                    'Content-Type': 'multipart/mixed; boundary="' + this.boundary + '"'
                },
                body: body
            } ).execute( function( resp ) {
                Model.playlistsList = obj;
                callback();
            } );

        },

        savePlaylistFile: function() {

            var body = this.buildPlaylistFileContent( angular.toJson( Model.playlistsList ) );

            DriveService.client.request( {
                path: '/upload/drive/v2/files/' + this.playlistsFile.id,
                method: 'PUT',
                params: {
                    'uploadType': 'multipart'
                },
                headers: {
                    'Content-Type': 'multipart/mixed; boundary="' + this.boundary + '"'
                },
                body: body
            } ).execute( function( resp ) {
                console.log( resp );
            } );

        }

    }

    return service;

} );