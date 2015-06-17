app.service( 'NotificationsService', function( $timeout ) {

    var service = {

        authorized: false,

        checkPermission: function() {
            if ( Notification.permission === 'granted' ) this.authorized = true;
            else if ( Notification.permission !== 'denied' ) this.requestPermission();
        },

        requestPermission: function() {
            Notification.requestPermission( function( result ) {
                if ( result === 'granted' ) this.authorized = true;
            } );
        },

        show: function( title, options ) {
            if ( this.authorized ) {
                var notification = new Notification( title, options );
                notification.onclick = notification.close;
                $timeout( function() {
                    notification.close();
                }, 4000 )
            }
        }

    };

    return service;

} );