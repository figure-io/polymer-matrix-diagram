/**
*
*	FUNCTION: onBrushEnd
*
*
*	DESCRIPTION:
*		- Event listener for when a brush interaction ends.
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
* FUNCTION: onBrushEnd()
*	Event listener for when a brush interaction ends. Adjusts the brush extent in order to snap to nearest cell boundaries.
*/
function onBrushEnd() {
	/* jslint validthis:true */
	var brush = this._brush,
		extent = brush.extent(),
		xScale = this._xScale,
		yScale = this._yScale,
		idx = {},
		xDomain,
		yDomain,
		x1, x2,
		y1, y2,
		dx, dy;

	x1 = extent[ 0 ][ 0 ];
	x2 = extent[ 1 ][ 0 ];
	y1 = extent[ 0 ][ 1 ];
	y2 = extent[ 1 ][ 1 ];

	dx = xScale.rangeBand();
	dy = yScale.rangeBand();

	x1 = Math.round( x1 / dx );
	x2 = Math.round( x2 / dx );
	y1 = Math.round( y1 / dy );
	y2 = Math.round( y2 / dy );

	idx.col1 = x1;
	idx.row1 = y1;

	xDomain = xScale.domain();
	yDomain = yScale.domain();

	x1 = xScale( xDomain[ x1 ] );
	y1 = yScale( yDomain[ y1 ] );

	// Check if upper bounds exceeded scale domains...
	if ( x2 === xDomain.length ) {
		idx.col2 = x2 - 1;
		x2 = this.graphWidth();
	} else {
		idx.col2 = x2;
		x2 = xScale( xDomain[ x2 ] );
	}
	if ( y2 === yDomain.length ) {
		idx.row2 = y2 - 1;
		y2 = this.graphHeight();
	} else {
		idx.row2 = y2;
		y2 = yScale( yDomain[ y2 ] );
	}
	extent = [
		[ x1, y1 ],
		[ x2, y2 ]
	];

	this.$.brush.transition()
		.call( brush.extent( extent ) );

	this.fire( 'brushend', idx );
} // end FUNCTION onBrushEnd()


// EXPORTS //

module.exports = onBrushEnd;
