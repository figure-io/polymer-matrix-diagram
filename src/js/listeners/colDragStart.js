/**
*
*	FUNCTION: onColDragStart
*
*
*	DESCRIPTION:
*		- Event listener for when a user initiates a column drag.
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
* FUNCTION: onColDragStart( d, i )
*	Event listener for when a user initiates a column drag.
*
* @param {*} d - datum
* @param {Number} i - column index
*/
function onColDragStart( d, i ) {
	/* jslint validthis:true */
	var len = this.data.rownames().length,
		cells = this.$.cells,
		arr = new Array( len );

	this._active.col = this._d3.select( this.$.cols[ 0 ][ i ] );

	for ( var j = 0; j < len; j++ ) {
		arr[ j ] = cells[ j ][ i ];
	}
	this._active.cells = this._d3.selectAll( arr );
} // end FUNCTION onColDragStart()


// EXPORTS //

module.exports = onColDragStart;
