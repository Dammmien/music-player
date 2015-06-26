app.service( 'UploadService', function( GapiService, DriveParserService ) {

    var service = {

        boundary: '-------314159265358979323846',

        buildFileContent: function( file ) {

            var delimiter = "\r\n--" + this.boundary + "\r\n",
                close_delim = "\r\n--" + this.boundary + "--",
                contentType = 'audio/mpeg';

            var metadata = {
                title: file.filename,
                mimeType: contentType,
                parents: [ {
                    "id": DriveParserService.rootFolder
                } ],
                properties: [ {
                    key: 'type',
                    value: 'track',
                    visibility: 'PRIVATE'
                } ]
            };

            [ 'title', 'album', 'artist', 'year' ].forEach( function( property ) {
                metadata.properties.push( {
                    key: property,
                    value: file[ property ],
                    visibility: 'PRIVATE'
                } );
            } );

            var content = delimiter + 'Content-Type: application/json\r\n\r\n';
            content += JSON.stringify( metadata ) + delimiter;
            content += 'Content-Type: ' + contentType + '\r\n' + 'Content-Transfer-Encoding: base64\r\n\r\n';
            content += file.content + close_delim;

            return content;

        },

        uploadFile: function( file, callback ) {

            var body = this.buildFileContent( file );

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