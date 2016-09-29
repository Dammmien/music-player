app.service( 'MainService', function( GapiService, NotificationsService, NotificationsService, PlaylistsService, DriveParserService, Database, Model ) {

    var service = {

        init: function() {
            GapiService.checkAuth( this.whenIsAuthenticated.bind( this ), true );
        },

        whenIsAuthenticated: function() {
            NotificationsService.checkPermission();
            PlaylistsService.checkPlaylists();
            DriveParserService.setRootFolder();
            this.initDatabase();
        },

        initDatabase: function() {
            Database.init( function() {
                Database.getAll( function( results ) {
                    if ( results.length > 0 ) this.startAppWithDatabase( results );
                    else this.startAppWithoutDatabase();
                }.bind( this ) );
            }.bind( this ) );
        },

        startAppWithDatabase: function( results ) {
            Model.tracksList = results;
            DriveParserService.setTracksByArtistAndAlbum();
        },

        startAppWithoutDatabase: function() {
            Model.tracksList = [];
            DriveParserService.items = [];
            DriveParserService.getDriveContent();
        },

        resetApp: function() {
            Database.deleteDatabase();
            this.startAppWithoutDatabase();
        }

    };

    return service;

} );