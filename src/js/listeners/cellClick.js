/**
*
*	FUNCTION: onCellClick
*
*
*	DESCRIPTION:
*		- Event listener for cell clicks.
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
* FUNCTION: onCellClick( d, i )
*	Event listener for cell clicks.
*
* @param {String} d - cell data
* @param {Number} i - cell index
* @returns {Boolean} false
*/
function onCellClick( d, i ) {
	/* jslint validthis:true */
	var evt = this._d3.event,
		rows = this.$.rows[ 0 ],
		row,
		j;

	evt.datum = d;
	evt.col = i;

	// Determine the row index...
	row = evt.path[ 1 ];
	for ( j = 0; j < rows.length; j++ ) {
		if ( rows[ j ] === row ) {
			break;
		}
	}
	evt.row = j;

	this.fire( 'clicked.cell', evt );
	this.fire( 'clicked', evt );
	return false;
} // end FUNCTION onCellClick()


// EXPORTS //

module.exports = onCellClick;
