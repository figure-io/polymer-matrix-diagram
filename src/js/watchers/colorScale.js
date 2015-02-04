/**
*
*	FUNCTION: colorScaleChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to a chart color scale.
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
* FUNCTION: colorScaleChanged( oldVal, newVal )
*	Event handler for changes to a chart color scale.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
function colorScaleChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var err;
	if ( typeof newVal !== 'function' ) {
		err = new TypeError( 'colorScale::invalid assignment. Must be a function.  Value: `' + newVal + '.' );
		this.fire( 'err', err );
		this.colorScale = oldVal;
		return;
	}
	if ( this.autoUpdate ) {
		this.$.cells.attr( 'fill', newVal );
	}
	this.fire( 'change', {
		'attr': 'colorScale',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION colorScaleChanged()


// EXPORTS //

module.exports = colorScaleChanged;
