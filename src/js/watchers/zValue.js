/**
*
*	FUNCTION: zValueChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to a z-value accessor.
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
* FUNCTION: zValueChanged( oldVal, newVal )
*	Event handler for changes to a z-value accessor.
*
* @param {Function|Number} oldVal - old value
* @param {Function|Number} newVal - new value
*/
function zValueChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var type = typeof newVal,
		err;
	if ( type !== 'function' && ( type !== 'number' || newVal !== newVal || newVal < 0 || newVal > 1 ) ) {
		err = new TypeError( 'zValue::invalid assignment. Must be either a function or a numeric value between 0 and 1. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.zValue = oldVal;
		return;
	}
	if ( type === 'function' ) {
		this._zScale.domain( this.zDomain( this.zMin, this.zMax ) );
	}
	if ( this.autoUpdate ) {
		this.$.cells.attr( 'fill-opacity', ( typeof this.zValue === 'function' ) ? this._z : this.zValue );
	}
	this.fire( 'change', {
		'attr': 'zValue',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION zValueChanged()


// EXPORTS //

module.exports = zValueChanged;
