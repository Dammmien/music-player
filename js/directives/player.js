app.directive( 'player', function( PlayerService, Model ) {

    return {

        restrict: 'E',

        templateUrl: '/templates/player.html',

        scope: {},

        controller: function( $scope ) {},

        link: function( $scope, elements, attrs, ctrl ) {

            $scope.player = elements[ 0 ].children[ 0 ];

            PlayerService.player = $scope.player;

            $scope.model = Model;

            $scope.player.addEventListener( 'ended', function() {
                PlayerService.passToNextTrack();
                $scope.$digest();
            } );

            $scope.player.addEventListener( 'timeupdate', function() {
                $scope.$digest();
            } );

            $scope.onPause = function() {
                $scope.player.pause();
            };

            $scope.onPlay = function() {
                $scope.player.play();
            };

            $scope.onPrevious = function() {
                PlayerService.passToPreviousTrack();
            };

            $scope.onNext = function() {
                PlayerService.passToNextTrack();
            };

        }

    };

} );