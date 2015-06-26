var express = require( 'express' ),
    gulp = require( 'gulp' ),
    less = require( 'gulp-less' ),
    minifyCSS = require( 'gulp-minify-css' ),
    gulp_concat = require( 'gulp-concat' ),
    gulp_uglify = require( 'gulp-uglify' ),
    path = require( 'path' );

gulp.task( 'less', function() {
    gulp.src( 'style/less/main.less' ).pipe( less() ).pipe( minifyCSS() ).pipe( gulp.dest( 'style/' ) );
} );

gulp.task( 'scripts', function() {
    return gulp.src( [
        './libs/lodash.min.js',
        './libs/angular.min.js',
        './libs/angular-route.js',
        './libs/ngDialog.min.js',
        './libs/ng-sortable.js',
        './libs/jdataview.min.js',
        './libs/id3.min.js',
        './js/app.js',
        './js/controllers/*.js',
        './js/directives/*.js',
        './js/services/*.js'
    ] ).pipe( gulp_concat( 'main.js' ) ).pipe( gulp.dest( './js/' ) );

    // OK mais trop long, à utiliser pour le build final
    // .pipe( gulp_uglify( {
    //     mangle: false
    // } ) )

} );

gulp.task( 'watchScripts', function() {
    gulp.watch( [
        './js/controllers/*.js',
        './js/directives/*.js',
        './js/services/*.js'
    ], [ 'scripts' ] );
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

gulp.task( 'default', [ 'start', 'watchLess', 'watchScripts' ] );