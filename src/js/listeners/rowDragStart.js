/**
*
*	FUNCTION: onRowDragStart
*
*
*	DESCRIPTION:
*		- Event listener for when a user initializes a row drag.
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
* FUNCTION: onRowDragStart( d, i )
*	Event listener for when a user initiates a row drag.
*
* @param {*} d - datum
* @param {Number} i - row index
*/
function onRowDragStart( d, i ) {
	/* jslint validthis:true */
	this._active.row = this._d3.select( this.$.rows[ 0 ][ i ] );
} // end FUNCTION onRowDragStart()


// EXPORTS //

module.exports = onRowDragStart;
