/**
*
*	FUNCTION: durationChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to a transition duration setting.
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
* FUNCTION: durationChanged( oldVal, newVal )
*	Event handler for changes to a transition duration setting.
*
* @param {Null|Number} oldVal - old value
* @param {Null|Number} newVal - new value
*/
function durationChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var err;
	if ( typeof newVal !== 'number' || newVal !== newVal ) {
		err = new TypeError( 'duration::invalid assignment. Must be a numeric. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.duration = oldVal;
		return;
	}
	this.fire( 'change', {
		'attr': 'duration',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION durationChanged()


// EXPORTS //

module.exports = durationChanged;
