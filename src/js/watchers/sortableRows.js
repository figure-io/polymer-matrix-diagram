/**
*
*	FUNCTION: sortableRowsChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to a setting for row sorting.
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
* FUNCTION: sortableRowsChanged( oldVal, newVal )
*	Event handler for changes to a setting for sorting rows.
*
* @param {Boolean} oldVal - old value
* @param {Boolean} newVal - new value
*/
function sortableRowsChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var err;
	if ( typeof newVal !== 'boolean' ) {
		err = new TypeError( 'sortableRows::invalid assignment. Must be a boolean. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.sortableRows = oldVal;
		return;
	}
	if ( newVal ) {
		this.$.rows.call( this._rowDrag );
	} else {
		// Remove all listeners in the `drag` namespace:
		this.$.rows.on( '.drag', null );
	}
	this.fire( 'change', {
		'attr': 'sortableRows',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION sortableRowsChanged()


// EXPORTS //

module.exports = sortableRowsChanged;
