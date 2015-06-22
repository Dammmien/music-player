var express = require( 'express' ),
    gulp = require( 'gulp' ),
    less = require( 'gulp-less' ),
    minifyCSS = require( 'gulp-minify-css' ),
    path = require( 'path' );

gulp.task( 'less', function() {
    gulp.src( 'style/less/main.less' ).pipe( less() ).pipe( minifyCSS() ).pipe( gulp.dest( 'style/' ) );
} );

gulp.task( 'watchLess', function() {
    gulp.watch( [
        './style/less/*.less'
    ], [ 'less' ] );
} );

gulp.task( 'start', function() {
    var app = express();
    app.use( express.static( __dirname ) );
    app.get( '/', function( req, res ) {
        res.sendfile( __dirname + '/index.html' );
    } );
    app.listen( 8000 );
} )

gulp.task( 'default', [ 'start', 'watchLess' ] );