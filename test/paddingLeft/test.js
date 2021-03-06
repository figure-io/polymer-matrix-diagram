/* global describe, it, assert, expect */
'use strict';

// TESTS //

describe( 'paddingLeft', function tests() {

	var el = document.querySelector( '#fixture' );

	it( 'should expose an attribute for specifying the left padding between the canvas edge and the graph area', function test() {
		assert.isNull( el.paddingLeft );
	});

	it( 'should emit an `error` if not set to a positive integer or null', function test( done ) {
		var num = el.paddingLeft,
			values;

		values = [
			function(){},
			'5',
			-1,
			3.14,
			NaN,
			// undefined, // TODO: enable once https://github.com/Polymer/polymer/issues/1053 is resolved
			true,
			[],
			{}
		];

		el.addEventListener( 'err', onError );

		next();

		function next() {
			el.paddingLeft = values.shift();
		}
		function onError( evt ) {
			assert.instanceOf( evt.detail, TypeError );
			if ( values.length ) {
				setTimeout( next, 0 );
				return;
			}
			setTimeout( end, 0 );
		}
		function end() {
			assert.strictEqual( el.paddingLeft, num );
			el.removeEventListener( 'err', onError );
			done();
		}
	});

	it( 'should emit a `change` event when set to a new value', function test( done ) {
		el.addEventListener( 'change', onChange );

		el.paddingLeft = 0;

		function onChange( evt ) {
			assert.isObject( evt.detail );
			assert.strictEqual( evt.detail.attr, 'paddingLeft' );
			el.removeEventListener( 'change', onChange );
			done();
		}
	});

	it( 'should update the background width' );

	it( 'should update the graph position' );

	it( 'should update the marks' );

});
