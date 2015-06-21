app.service( 'GapiService', function() {

    var service = {

        CLIENT_ID: '292670498572-slj0238os50pg006h7t0fb872pdvip7l.apps.googleusercontent.com',

        SCOPES: [
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive.metadata',
            'https://www.googleapis.com/auth/drive.appfolder',
            'https://www.googleapis.com/auth/drive.appdata'
        ],

        checkAuth: function( callback ) {
            this.callback = callback;
            gapi.auth.authorize( {
                    'client_id': this.CLIENT_ID,
                    'scope': this.SCOPES,
                    'immediate': true
                },
                this.handleAuthResult.bind( this )
            );
        },

        handleAuthResult: function( authResult ) {
            if ( authResult.status.signed_in ) {
                this.authResult = authResult;
                gapi.client.load( 'drive', 'v2', function() {
                    this.drive = gapi.client.drive;
                    this.client = gapi.client;
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