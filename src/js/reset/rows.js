/**
*
*	FUNCTION: resetRows
*
*
*	DESCRIPTION:
*		- Resets chart row elements.
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
* FUNCTION: resetRows()
*	Resets row elements.
*
* @returns {Object} this
*/
function resetRows() {
	/* jslint validthis:true */
	var rows, gEnter;

	rows = this.$.marks.selectAll( '.row' )
		.data( this.data.rownames() )
		.attr( 'transform', this._y );

	// Remove any old rows:
	rows.exit().remove();

	// Add any new rows:
	gEnter = rows.enter().append( 'svg:g' )
		.attr( 'class', 'row' )
		.attr( 'transform', this._y )
		.on( 'mouseover', this._onRowHover )
		.on( 'mouseout', this._onRowHoverEnd );

	gEnter.append( 'svg:line' )
		.attr( 'class', 'grid x' )
		.attr( 'x1', this.graphWidth() );

	gEnter.append( 'svg:text' )
		.attr( 'class', 'noselect name' )
		.attr( 'x', -6 )
		.attr( 'y', this._yScale.rangeBand() / 2 )
		.attr( 'dy', '.32em' )
		.attr( 'text-anchor', 'end' )
		.attr( 'font-size', this.fontSize() )
		.text( this._getRowName )
		.on( 'click', this._onRowClick );

	// Update the cache references to row elements:
	this.$.rows = rows;
	this.$.rowGridlines = rows.selectAll( '.grid.x' );
	this.$.rownames = rows.selectAll( '.name' );

	// Create the row cells:
	rows.each( this._resetCells );

	this.$.cells = rows.selectAll( '.cell' );

	return this;
} // end FUNCTION resetRows()


// EXPORTS //

module.exports = resetRows;
