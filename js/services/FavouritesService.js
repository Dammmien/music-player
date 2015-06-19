app.service( 'FavouritesService', function( GapiService, Model, Database, $http ) {

    var service = {

        setFavourites: function() {
            Model.favouritesList = Model.tracksList.filter( function( item ) {
                return item.starred === 1;
            } );
        },

        addTrackToFavourites: function( track, callback ) {
            GapiService.drive.files.patch( {
                'fileId': track.id,
                'resource': {
                    "labels": {
                        "starred": true
                    }
                }
            } ).execute( function( resp ) {
                track.starred = 1;
                Model.favouritesList.push( track );
                Database.update( track );
                callback();
            }.bind( this ) );
        },

        removeTrackFromFavourites: function( track, callback ) {
            GapiService.drive.files.patch( {
                'fileId': track.id,
                'resource': {
                    "labels": {
                        "starred": false
                    }
                }
            } ).execute( function( resp ) {
                track.starred = 0;
                Model.favouritesList.splice( Model.favouritesList.indexOf( track ), 1 );
                Database.update( track );
                callback();
            }.bind( this ) );
        }

    }

    return service;

} );