app.directive( 'upload', function( UploadService ) {

    return {
        restrict: "E",
        templateUrl: '/templates/uploadDirective.html',
        scope: {},
        controller: function( $scope ) {

            $scope.onUpload = function() {
                UploadService.uploadList( $scope.filesList )
            };

            $scope.recursiveRead = function( list ) {

                var file = list.shift();
                var reader = new FileReader();

                reader.onload = function( e ) {
                    var dv = new jDataView( this.result );
                    if ( dv.getString( 3, dv.byteLength - 128 ) === 'TAG' ) {
                        $scope.filesList.push( {
                            filename: file.name,
                            title: dv.getString( 30, dv.tell() ),
                            artist: dv.getString( 30, dv.tell() ),
                            album: dv.getString( 30, dv.tell() ),
                            year: dv.getString( 4, dv.tell() ),
                            content: this.result,
                            status: undefined
                        } );
                        if ( list.length > 0 ) $scope.recursiveRead( list );
                        $scope.$digest();
                    }
                };

                reader.readAsArrayBuffer( file );

            };

        },
        link: function( $scope, elements, attrs, ctrl ) {
            elements.on( 'change', function( evt ) {
                $scope.filesList = [];
                var list = [];
                for ( var i = 0; i < evt.target.files.length; i++ ) {
                    list.push( evt.target.files[ i ] );
                }
                $scope.recursiveRead( list );
            } );
        }
    };

} );