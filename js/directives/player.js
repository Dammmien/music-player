app.directive( 'player', function( Service ) {

    return {

        restrict: 'E',

        templateUrl: '/templates/player.html',

        scope: {},

        controller: function( $scope ) {},

        link: function( $scope, elements, attrs, ctrl ) {

            console.log( elements );

            $scope.player = elements[ 0 ].children[ 0 ];

            $scope.model = Service.model;

            $scope.$watch( function() {
                return $scope.model.currentTrack
            }, function() {
                $scope.player.src = $scope.model.currentTrack.url;
                $scope.player.play();
            } );

            $scope.player.addEventListener( 'ended', function() {
                $scope.$apply( function() {
                    $scope.model.currentTrack = $scope.model.waitingTracks.shift();
                } );
            } );

            $scope.player.addEventListener( 'timeupdate', function() {
                $scope.$digest();
            } );

        }

    };

} );