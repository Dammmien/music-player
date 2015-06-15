app.service( 'Database', [ '$http', function() {

    var service = {
        init: function( callback ) {

            var request = window.indexedDB.open( "tracks" );

            request.onsuccess = function( event ) {
                // db exists
                this.setDB( event );
                callback( true );
            }.bind( this );

            request.onupgradeneeded = function( event ) {
                // db doesn't exists
                this.buildDB( event );
                callback( false );
            }.bind( this );
        },

        setDB: function( event ) {
            this.db = event.target.result;
        },

        buildDB: function( event ) {
            this.setDB( event );

            tracksStore = this.db.createObjectStore( "tracks", {
                keyPath: "id"
            } );

            var properties = [ "title", "shared", "starred", "artist", "artistId", "album", "albumId" ];

            properties.forEach( function( property ) {
                tracksStore.createIndex( property, property, {
                    unique: false
                } );
            }, this );
        },

        getAll: function( success ) {
            var out = [],
                request = this.db.transaction( [ "tracks" ], "readwrite" ).objectStore( "tracks" ).openCursor();

            request.onsuccess = function( evt ) {
                var cursor = evt.target.result;
                if ( cursor ) {
                    out.push( cursor.value );
                    cursor.continue();
                } else {
                    success( out );
                }
            };
        },

        add: function( item, success, error ) {
            var tracksTransaction = this.db.transaction( [ "tracks" ], "readwrite" ),
                tracksStore = tracksTransaction.objectStore( "tracks" );

            tracksStore.add( item );

            tracksTransaction.oncomplete = success();
        },

        addAll: function( items, success ) {
            var tracksTransaction = this.db.transaction( [ "tracks" ], "readwrite" ),
                tracksStore = tracksTransaction.objectStore( "tracks" );

            items.forEach( function( item, index ) {
                tracksStore.add( item );
            } );

            tracksTransaction.oncomplete = success();
        },

        update: function( item ) {
            var tracksTransaction = this.db.transaction( [ "tracks" ], "readwrite" ),
                tracksStore = tracksTransaction.objectStore( "tracks" );
            tracksStore.put( JSON.parse( angular.toJson( item ) ) ); // remove $$hashkey before update item
        }

    };

    return service;

} ] );