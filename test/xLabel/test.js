/* global describe, it, assert, expect */
'use strict';

// TESTS //

describe( 'xLabel', function tests() {

	var el = document.querySelector( '#fixture' );

	it( 'should expose an x-label attribute', function test() {
		expect( el.xLabel ).to.be.a( 'string' );
	});

	it( 'should emit an `error` if set to a non-string', function test( done ) {
		var label = el.xLabel,
			values;

		values = [
			function(){},
			5,
			NaN,
			null,
			undefined,
			true,
			[],
			{}
		];

		el.addEventListener( 'err', onError );

		next();

		function next() {
			el.xLabel = values.shift();
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
			assert.strictEqual( el.xLabel, label );
			el.removeEventListener( 'err', onError );
			done();
		}
	});

	it( 'should emit a `change` event when set to a new value', function test( done ) {
		el.addEventListener( 'change', onChange );

		el.xLabel = 'beep';

		function onChange( evt ) {
			assert.isObject( evt.detail );
			assert.strictEqual( evt.detail.attr, 'xLabel' );
			el.removeEventListener( 'change', onChange );
			done();
		}
	});

	it( 'should update the x-label', function test( done ) {
		var label, content;

		el.addEventListener( 'change', onChange );

		label = el.$.chart.querySelector( '.x.axis .label' );

		content = label.textContent;

		el.xLabel = 'beep boop';

		function onChange( evt ) {
			if ( evt.detail.attr !== 'xLabel' ) {
				return;
			}
			assert.strictEqual( el.xLabel, 'beep boop' );
			assert.strictEqual( label.textContent, 'beep boop' );
			el.removeEventListener( 'change', onChange );
			done();
		}
	});

});
