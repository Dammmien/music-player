app.directive( 'upload', function( UploadService, Database, Model, $rootScope, DriveParserService ) {

    return {

        restrict: "E",

        templateUrl: '/templates/uploadDirective.html',

        controller: function( $scope ) {

            $scope.onClose = function() {
                $scope.closeThisDialog();
                DriveParserService.setTracksByArtistAndAlbum();
                $rootScope.$digest();
            };

            $scope.uploadFile = function( file ) {
                UploadService.uploadFile( file, function( resp ) {
                    $scope.progress.current += 1;
                    if ( resp && !resp.error ) {
                        file.status = true;
                        var track = {
                            id: resp.id,
                            starred: 0,
                            title: file.title,
                            artist: file.artist,
                            album: file.album,
                            year: file.year
                        }
                        Database.add( track );
                        Model.tracksList.push( track );
                    } else {
                        file.status = false;
                    }
                    $scope.$digest();
                    if ( $scope.selectedList.length > 0 ) $scope.recursiveRead();
                    else $scope.onClose();
                    $scope.uploadedList.push( file );
                } );
            };

            $scope.recursiveRead = function() {

                var file = $scope.selectedList.shift();
                var reader = new FileReader();

                reader.onload = function( e ) {

                    ID3.loadTags( file.name, function() {
                        var tags = ID3.getAllTags( file.name );

                        $scope.uploadFile( {
                            filename: file.name,
                            title: tags.title || file.name.replace( '.mp3', '' ),
                            artist: tags.artist,
                            album: tags.album,
                            year: tags.year,
                            content: e.target.result.split( ',' )[ 1 ]
                        } );

                    }, {
                        tags: [ 'title', 'artist', 'album', 'year' ],
                        dataReader: FileAPIReader( file )
                    } );

                };

                reader.readAsDataURL( file );

            };

        },

        link: function( $scope, elements, attrs, ctrl ) {
            elements.on( 'change', function( evt ) {
                $scope.progress = null;
                $scope.uploadedList = [];
                $scope.selectedList = [];
                for ( var i = 0; i < evt.target.files.length; i++ ) {
                    $scope.selectedList.push( evt.target.files[ i ] );
                }
                $scope.selectedList = $scope.selectedList.filter( function( file ) {
                    return file.type === "audio/mp3"
                } );
                if ( $scope.selectedList.length > 0 ) {
                    $scope.progress = {
                        end: $scope.selectedList.length,
                        current: 0
                    };
                    $scope.recursiveRead();
                }
            } );
        }

    };

} );