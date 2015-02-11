/**
*
*	FUNCTION: cValueChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to a color value accessor.
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
* FUNCTION: cValueChanged( oldVal, newVal )
*	Event handler for changes to a color value accessor.
*
* @param {Function} oldVal - old value
* @param {Function} newVal - new value
*/
function cValueChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var type = typeof newVal,
		err;
	if ( type !== 'function' ) {
		err = new TypeError( 'cValue::invalid assignment. Must be a function. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.cValue = oldVal;
		return;
	}
	if ( this.autoUpdate ) {
		this.$.cells.attr( 'fill', this._color );
	}
	this.fire( 'change', {
		'attr': 'cValue',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION cValueChanged()


// EXPORTS //

module.exports = cValueChanged;
