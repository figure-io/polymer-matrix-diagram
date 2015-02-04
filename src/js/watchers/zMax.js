/**
*
*	FUNCTION: zMaxChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to a maximum z-value.
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
* FUNCTION: zMaxChanged( oldVal, newVal )
*	Event handler for changes to a maximum z-value.
*
* @param {Null|Number} oldVal - old value
* @param {Null|Number} newVal - new value
*/
function zMaxChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var zScale = this._zScale,
		domain = zScale.domain(),
		err;

	if ( newVal !== null && (typeof newVal !== 'number' || newVal !== newVal) ) {
		err = new TypeError( 'zMax::invalid assignment. Must be a numeric or `null`. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.zMax = oldVal;
		return;
	}
	domain = this.zDomain( domain[ 0 ], newVal );

	zScale.domain( domain );

	if ( this.autoUpdate ) {
		this.$.cells.attr( 'fill-opacity', ( typeof this.zValue === 'function' ) ? this._z : this.zValue );
	}
	this.fire( 'zmax', {
		'type': 'change'
	});
	this.fire( 'change', {
		'attr': 'zMax',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION zMaxChanged()


// EXPORTS //

module.exports = zMaxChanged;
