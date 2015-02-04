/**
*
*	FUNCTION: fontSize
*
*
*	DESCRIPTION:
*		- Computes row and column name font size based on cell dimensions.
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
* FUNCTION: fontSize()
*	Computes the row and column name font size based on cell dimensions.
*
* @returns {Number} font size in pixels
*/
function fontSize() {
	/* jslint validthis:true */
	var dx, dy;
	dx = this._xScale.rangeBand();
	dy = this._yScale.rangeBand();
	if ( dx > dy ) {
		dx = dy;
	}
	if ( dx > 18 ) {
		// Return the font-size upper bound:
		return this._maxFontSize;
	}
	return dx - 2;
} // end FUNCTION fontSize()


// EXPORTS //

module.exports = fontSize;
