/**
*
*	FUNCTION: autoUpdateChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to an `autoUpdate` setting.
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
* FUNCTION: autoUpdateChanged( oldVal, newVal )
*	Event handler for changes to an `autoUpdate` setting.
*
* @param {Boolean} oldVal - old value
* @param {Boolean} newVal - new value
*/
function autoUpdateChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var err;
	if ( typeof newVal !== 'boolean' ) {
		err = new TypeError( 'autoUpdate::invalid assignment. Must be a boolean. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.autoUpdate = oldVal;
		return;
	}
	this.fire( 'change', {
		'attr': 'autoUpdate',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION autoUpdateChanged()


// EXPORTS //

module.exports = autoUpdateChanged;
