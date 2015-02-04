/**
*
*	FUNCTION: reset
*
*
*	DESCRIPTION:
*		- Resets chart elements.
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
* FUNCTION: reset()
*	Resets chart elements.
*
* @returns {Object} context
*/
function reset() {
	/* jslint validthis:true */
	this.resetBase()
		.resetAxes()
		.resetRows()
		.resetCols();
	return this;
} // end FUNCTION reset()


// EXPORTS //

module.exports = reset;
