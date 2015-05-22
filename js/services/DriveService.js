app.service( 'DriveService', function() {

    var service = {

        CLIENT_ID: '292670498572-slj0238os50pg006h7t0fb872pdvip7l.apps.googleusercontent.com',

        SCOPES: [
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive.metadata',
            'email',
            'profile'
        ],

        checkAuth: function( callback ) {
            this.callback = callback;
            gapi.auth.authorize( {
                    'client_id': this.CLIENT_ID,
                    'scope': this.SCOPES,
                    'immediate': false
                },
                this.handleAuthResult.bind( this )
            );
        },

        handleAuthResult: function( authResult ) {
            if ( authResult ) {
                this.authResult = authResult;
                gapi.client.load( 'drive', 'v2', function() {
                    this.drive = gapi.client.drive;
                    this.callback();
                }.bind( this ) );
            } else {
                gapi.auth.authorize( {
                        'client_id': this.CLIENT_ID,
                        'scope': this.SCOPES,
                        'immediate': false
                    },
                    this.handleAuthResult.bind( this )
                );
            }
        }

    };

    return service;

} );