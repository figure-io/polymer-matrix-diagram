/**
*
*	FUNCTION: resetCells
*
*
*	DESCRIPTION:
*		- Resets chart cell elements.
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
* FUNCTION: resetCells( d, i )
*	Resets cell elements.
*
* @param {String} d - row name
* @param {Number} i - row index
* @returns {Object} context
*/
function resetCells( d, i ) {
	/* jslint validthis:true */
	var row, cells;

	row = this._d3.select( this.$.rows[0][i] );

	cells = row.selectAll( '.cell' )
		.data( this.data.data()[i] )
		.attr( 'x', this._cx )
		.attr( 'fill-opacity', ( typeof this.zValue === 'function' ) ? this._z : this.zValue )
		.attr( 'fill', this._color );

	// Remove any old cells:
	cells.exit().remove();

	// Add any new cells:
	cells.enter().append( 'svg:rect' )
		.attr( 'class', 'cell' )
		.attr( 'x', this._cx )
		.attr( 'width', this._xScale.rangeBand() )
		.attr( 'height', this._yScale.rangeBand() )
		.attr( 'fill-opacity', ( typeof this.zValue === 'function' ) ? this._z : this.zValue )
		.attr( 'fill', this._color )
		.on( 'mouseover', this._onCellHover )
		.on( 'mouseout', this._onCellHoverEnd )
		.on( 'click', this._onCellClick );

	return this;
} // end FUNCTION resetCells()


// EXPORTS //

module.exports = resetCells;
