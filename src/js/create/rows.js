/**
*
*	FUNCTION: createRows
*
*
*	DESCRIPTION:
*		- Creates row elements.
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
* FUNCTION: createRows()
*	Creates row elements.
*
* @returns {Object} context
*/
function createRows() {
	/* jslint validthis:true */
	var rows = this.$.marks.selectAll( '.row' )
		.data( (this.data) ? this.data.rownames() : [] )
		.enter()
		.append( 'svg:g' )
			.attr( 'class', 'row' )
			.attr( 'transform', this._y )
			.on( 'mouseover', this._onRowHover )
			.on( 'mouseout', this._onRowHoverEnd );

	rows.append( 'svg:line' )
		.attr( 'class', 'grid x' )
		.attr( 'x1', this.graphWidth() );

	rows.append( 'svg:text' )
		.attr( 'class', 'noselect name' )
		.attr( 'x', -6 )
		.attr( 'y', this._yScale.rangeBand() / 2 )
		.attr( 'dy', '.32em' )
		.attr( 'text-anchor', 'end' )
		.attr( 'font-size', this.fontSize() )
		.text( this._getRowName )
		.on( 'click', this._onRowClick );

	// Cache references to created elements:
	this.$.rows = rows;
	this.$.rowGridlines = rows.selectAll( '.grid.x' );
	this.$.rownames = rows.selectAll( '.name' );

	// Create the row cells:
	rows.each( this._createCells );

	this.$.cells = rows.selectAll( '.cell' );

	return this;
} // end FUNCTION createRows()


// EXPORTS //

module.exports = createRows;
