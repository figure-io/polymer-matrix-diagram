/**
*
*	FUNCTION: isBrushableChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to a `isBrushable` setting.
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
* FUNCTION: isBrushableChanged( oldVal, newVal )
*	Event handler for changes to a `isBrushable` setting.
*
* @param {Boolean} oldVal - old value
* @param {Boolean} newVal - new value
*/
function isBrushableChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var err;
	if ( typeof newVal !== 'boolean' ) {
		err = new TypeError( 'isBrushable::invalid assignment. Must be a boolean. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.isBrushable = oldVal;
		return;
	}
	if ( newVal ) {
		this.$.brush.call( this._brush );
	} else {
		this.$.brush.remove();
	}
	this.fire( 'change', {
		'attr': 'isBrushable',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION isBrushableChanged()


// EXPORTS //

module.exports = isBrushableChanged;
