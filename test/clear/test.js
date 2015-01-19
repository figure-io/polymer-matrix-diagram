/* global describe, it, beforeEach, assert, expect */
'use strict';

// TESTS //

describe( 'clear', function tests() {

	var el = document.querySelector( '#fixture' );

	beforeEach( function before( done ) {
		el.data = [];
		setTimeout( done, 200 );
	});

	it( 'should provide a method to clear the chart', function test() {
		expect( el.clear ).to.be.a( 'function' );
	});

	it( 'should reset the chart data', function test() {
		el.clear();
		assert.notOk( el.data.length );
	});

	xit( 'should not display any marks', function test( done ) {
		var selection;

		selection = el.$.chart.querySelectorAll( '.marks' );

		assert.ok( selection.length );

		el.clear();

		setTimeout( onTimeout, 200 );

		function onTimeout() {
			selection = el.$.chart.querySelectorAll( '.marks' );

			assert.notOk( selection.length );
			done();
		}
	});

	it( 'should reset the chart title' );

});
