/**
*
*	FUNCTION: createCols
*
*
*	DESCRIPTION:
*		- Creates column elements.
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
* FUNCTION: createCols()
*	Creates column elements.
*
* @returns {Object} context
*/
function createCols() {
	/* jslint validthis:true */
	var cols = this.$.marks.selectAll( '.col' )
		.data( (this.data) ? this.data.colnames() :  [] )
		.enter()
		.append( 'svg:g' )
			.attr( 'class', 'col y' )
			.attr( 'transform', this._x )
			.on( 'mouseover', this._onColHover )
			.on( 'mouseout', this._onColHoverEnd );

	cols.append( 'svg:line' )
		.attr( 'class', 'grid y' )
		.attr( 'x1', -this.graphHeight() );

	cols.append( 'svg:text' )
		.attr( 'class', 'noselect name' )
		.attr( 'x', 6 )
		.attr( 'y', this._xScale.rangeBand() / 2 )
		.attr( 'dy', '.32em' )
		.attr( 'text-anchor', 'start' )
		.attr( 'font-size', this.fontSize() )
		.text( this._getColName )
		.on( 'click', this._onColClick );

	// Cache references to created elements:
	this.$.cols = cols;
	this.$.colGridlines = cols.selectAll( '.grid.y' );
	this.$.colnames = cols.selectAll( '.name' );

	return this;
} // end FUNCTION createCols()


// EXPORTS //

module.exports = createCols;
