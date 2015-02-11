/**
*
*	FUNCTION: createCells
*
*
*	DESCRIPTION:
*		- Creates cell elements.
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
* FUNCTION: createCells( d, i )
*	Create cell elements.
*
* @param {String} d - row name
* @param {Number} i - row index
* @returns {Object} context
*/
function createCells( d, i ) {
	/* jslint validthis:true */
	var row = this._d3.select( this.$.rows[0][i] );

	row.selectAll( '.cell' )
		.data( this.data.data()[i] )
		.enter()
		.append( 'svg:rect' )
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
} // end FUNCTION createCells()


// EXPORTS //

module.exports = createCells;
