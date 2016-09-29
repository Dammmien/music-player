app.controller( 'topBarCtrl', function( $scope, Model, ngDialog, PlayerService ) {

    $scope.model = Model;

    $scope.onSelectMode = function( mode ) {
        $scope.model.viewMode = mode;
        $scope.model.filter = '';
    };

    $scope.onOpenUploadDialog = function() {
        $scope.openedDialog = ngDialog.open( {
            template: '/templates/uploadDialog.html',
            closeByDocument: false,
            closeByEscape: false,
            showClose: false,
            className: 'ngdialog-theme-default upload-dialog'
        } );
    };

    $scope.onRemoveWaitingTracks = function() {
        PlayerService.removeWaitingTracks();
    };

    $scope.onPlayRandomTracks = function() {
        var tracks = _.shuffle( Model.tracksList ).splice( 0, 100 );
        PlayerService.playTracks( tracks );
    };

    $scope.onShuffleWaitingTracks = function() {
        PlayerService.shuffleWaitingTracks();
    };

} );