app.service( 'Database', [ '$http', function() {

    var service = {
        init: function( callback ) {
            var request = window.indexedDB.open( "tracks" );

            request.onsuccess = function( event ) {
                this.db = event.target.result;
                callback();
            }.bind( this );

            request.onupgradeneeded = function( event ) {
                this.db = event.target.result;
                this.buildDB();
            }.bind( this );
        },

        buildDB: function() {

            tracksStore = this.db.createObjectStore( "tracks", {
                keyPath: "id"
            } );

            var properties = [ "title", "starred", "artist", "artistId", "album", "albumId" ];

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
                tracksTransaction.onerror = function( err ) {
                    console.log( err );
                    console.log( index );
                    console.log( item );
                };
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