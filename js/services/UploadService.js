app.service( 'UploadService', function( GapiService ) {

    var service = {

        boundary: '-------314159265358979323846',

        uploadList: function( filesList ) {
            this.filesList = filesList;
            this.counter = 0;
        },

        recursiveUpload: function() {
            var file = this.filesList[ this.counter ];
            this.uploadFile( file, function( resp ) {
                console.log( resp );
                this.counter += 1;
                if ( this.counter < this.filesList.length ) this.recursiveUpload();
            }.bind( this ) );
        },

        arrayBufferToBase64: function( buffer ) {
            var binary = '';
            var bytes = new Uint8Array( buffer );
            var len = bytes.byteLength;
            for ( var i = 0; i < len; i++ ) {
                binary += String.fromCharCode( bytes[ i ] );
            }
            return btoa( binary );
        },

        buildPlaylistFileContent: function( file ) {

            var delimiter = "\r\n--" + this.boundary + "\r\n",
                close_delim = "\r\n--" + this.boundary + "--",
                contentType = 'audio/mpeg';

            var metadata = {
                title: file.filename,
                mimeType: contentType,
                properties: [ {
                    key: 'title',
                    value: file.title,
                    visibility: 'PRIVATE'
                }, {
                    key: 'album',
                    value: file.album,
                    visibility: 'PRIVATE'
                }, {
                    key: 'artist',
                    value: file.artist,
                    visibility: 'PRIVATE'
                }, {
                    key: 'year',
                    value: file.year,
                    visibility: 'PRIVATE'
                }, {
                    key: 'type',
                    value: 'track',
                    visibility: 'PRIVATE'
                } ]
            };

            var base64Data = this.arrayBufferToBase64( file.content );

            var content = delimiter + 'Content-Type: application/json\r\n\r\n';
            content += JSON.stringify( metadata ) + delimiter;
            content += 'Content-Type: ' + contentType + '\r\n' + 'Content-Transfer-Encoding: base64\r\n\r\n';
            content += base64Data + close_delim;

            return content;

        },

        uploadFile: function( file, callback ) {

            var body = this.buildPlaylistFileContent( file );

            GapiService.client.request( {
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
                callback( resp );
            } );

        }

    };

    return service;

} );