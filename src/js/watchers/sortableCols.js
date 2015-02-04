/**
*
*	FUNCTION: sortableCols
*
*
*	DESCRIPTION:
*		- Event handler for changes to a setting for sorting columns.
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
* FUNCTION: sortableColsChanged( oldVal, newVal )
*	Event handler for changes to a setting for sorting columns.
*
* @param {Boolean} oldVal - old value
* @param {Boolean} newVal - new value
*/
function sortableColsChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var err;
	if ( typeof newVal !== 'boolean' ) {
		err = new TypeError( 'sortableCols::invalid assignment. Must be a boolean. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.sortableCols = oldVal;
		return;
	}
	if ( newVal ) {
		this.$.cols.call( this._colDrag );
	} else {
		// Remove all listeners in the `drag` namespace:
		this.$.cols.on( '.drag', null );
	}
	this.fire( 'change', {
		'attr': 'sortableCols',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION sortableColsChanged()


// EXPORTS //

module.exports = sortableColsChanged;
