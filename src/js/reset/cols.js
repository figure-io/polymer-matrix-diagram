/**
*
*	FUNCTION: resetCols
*
*
*	DESCRIPTION:
*		- Resets chart column elements.
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
* FUNCTION: resetCols()
*	Resets column elements.
*
* @returns {Object} context
*/
function resetCols() {
	/* jslint validthis:true */
	var cols, gEnter;

	cols = this.$.marks.selectAll( '.col' )
		.data( this.data.colnames() )
		.attr( 'transform', this._x );

	// Remove any old columns:
	cols.exit().remove();

	// Add any new columns:
	gEnter = cols.enter().append( 'svg:g' )
		.attr( 'class', 'col' )
		.attr( 'transform', this._x )
		.on( 'mouseover', this._onColHover )
		.on( 'mouseout', this._onColHoverEnd );

	gEnter.append( 'svg:line' )
		.attr( 'class', 'grid y' )
		.attr( 'x1', -this.graphHeight() );

	gEnter.append( 'svg:text' )
		.attr( 'class', 'noselect name' )
		.attr( 'x', 6 )
		.attr( 'y', this._xScale.rangeBand() / 2 )
		.attr( 'dy', '.32em' )
		.attr( 'text-anchor', 'start' )
		.attr( 'font-size', this.fontSize() )
		.text( this._getColName )
		.on( 'click', this._onColClick );

	// Cache a reference to the columns:
	this.$.cols = cols;
	this.$.colGridlines = cols.selectAll( '.grid.y' );
	this.$.colnames = cols.selectAll( '.name' );

	return this;
} // end FUNCTION resetCols()


// EXPORTS //

module.exports = resetCols;
