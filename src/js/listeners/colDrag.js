/**
*
*	FUNCTION: onColDrag
*
*
*	DESCRIPTION:
*		- Event listener for when a user drags a column.
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
* FUNCTION: onColDrag( d, i )
*	Event listener for when a user drags a column.
*
* @param {*} d - datum
* @param {Number} i - column index
*/
function onColDrag() {
	/* jslint validthis:true */
	var x = this._d3.event.x,
		w;

	this._active.dragging = true;

	// Ensure that the column does not venture outside the graph area...
	if ( x < 0 ) {
		x = 0;
	} else {
		w = this.graphWidth() - this._xScale.rangeBand();
		if ( x > w ) {
			x = w;
		}
	}
	this._active.col.attr( 'transform', 'translate(' + x + ')rotate(-90)' );
	this._active.cells.attr( 'x', x );
	this._active.x = x;
} // end FUNCTION onColDrag()


// EXPORTS //

module.exports = onColDrag;
