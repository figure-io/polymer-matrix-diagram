/**
*
*	FUNCTION: brushableChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to a `brushable` setting.
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
* FUNCTION: brushableChanged( oldVal, newVal )
*	Event handler for changes to a `brushable` setting.
*
* @param {Boolean} oldVal - old value
* @param {Boolean} newVal - new value
*/
function brushableChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var err;
	if ( typeof newVal !== 'boolean' ) {
		err = new TypeError( 'brushable::invalid assignment. Must be a boolean. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.brushable = oldVal;
		return;
	}
	if ( newVal ) {
		this.$.brush.call( this._brush );
	} else {
		this.$.brush.remove();
	}
	this.fire( 'change', {
		'attr': 'brushable',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION brushableChanged()


// EXPORTS //

module.exports = brushableChanged;
