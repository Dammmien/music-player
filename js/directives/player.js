app.directive( 'player', function( Service ) {

    return {

        restrict: 'E',

        templateUrl: '/templates/player.html',

        scope: {},

        controller: function( $scope ) {},

        link: function( $scope, elements, attrs, ctrl ) {

            $scope.player = elements[ 0 ].children[ 0 ];

            $scope.model = Service.model;

            $scope.$watch( function() {
                return $scope.model.currentTrack
            }, function() {
                if ( $scope.model.currentTrack ) {
                    $scope.player.src = $scope.model.currentTrack.url;
                    $scope.player.play();
                }
            } );

            $scope.player.addEventListener( 'ended', function() {
                $scope.$apply( function() {
                    Service.passToNextTrack();
                } );
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
                Service.passToPreviousTrack();
            };

            $scope.onNext = function() {
                Service.passToNextTrack();
            };

        }

    };

} );