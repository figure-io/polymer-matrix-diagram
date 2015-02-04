/**
*
*	FUNCTION: onRowDrag
*
*
*	DESCRIPTION:
*		- Event listener for when a user drags a row.
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
* FUNCTION: onRowDrag( d, i )
*	Event listener for when a user drags a row.
*
* @param {*} d - datum
* @param {Number} i - row index
*/
function onRowDrag() {
	/* jslint validthis:true */
	var y = this._d3.event.y,
		h;

	this._active.dragging = true;

	// Ensure that the row does not venture outside the graph area...
	if ( y < 0 ) {
		y = 0;
	} else {
		h = this.graphHeight() - this._yScale.rangeBand();
		if ( y > h ) {
			y = h;
		}
	}
	this._active.row.attr( 'transform', 'translate(0,' + y + ')' );
	this._active.y = y;
} // end FUNCTION onRowDrag()


// EXPORTS //

module.exports = onRowDrag;
