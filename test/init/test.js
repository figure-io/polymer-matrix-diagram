/* global describe, it, assert, expect */
'use strict';

// TESTS //

describe( 'init', function tests() {

	var el = document.querySelector( '#fixture' );

	it( 'should have an `init` method', function test() {
		assert.ok( el.init );
	});

	it( 'should initialize a data attribute as null', function test() {
		assert.isNull( el.data );
	});

	it( 'should expose an events attribute listing all publicly emitted events', function test() {
		assert.ok( el.events.length );
	});

});
