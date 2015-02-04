/**
*
*	FUNCTION: zMinChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to a minimum z-value.
*
*
*	NOTES:
*		[1]
*
*
*	TODO:
*		[1]
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2015. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com. 2015.
*
*/

'use strict';

/**
* FUNCTION: zMinChanged( oldVal, newVal )
*	Event handler for changes to a minimum z-value.
*
* @param {Null|Number} oldVal - old value
* @param {Null|Number} newVal - new value
*/
function zMinChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var zScale = this._zScale,
		domain = zScale.domain(),
		err;

	if ( newVal !== null && (typeof newVal !== 'number' || newVal !== newVal) ) {
		err = new TypeError( 'zMin::invalid assignment. Must be a numeric or `null`. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.zMin = oldVal;
		return;
	}
	domain = this.zDomain( newVal, domain[ 1 ] );

	zScale.domain( domain );

	if ( this.autoUpdate ) {
		this.$.cells.attr( 'fill-opacity', ( typeof this.zValue === 'function' ) ? this._z : this.zValue );
	}
	this.fire( 'zmin', {
		'type': 'change'
	});
	this.fire( 'change', {
		'attr': 'zMin',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION zMinChanged()


// EXPORTS //

module.exports = zMinChanged;
