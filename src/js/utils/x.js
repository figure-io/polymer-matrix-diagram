/**
*
*	FUNCTION: x
*
*
*	DESCRIPTION:
*		- Maps a column to a pixel value.
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
* FUNCTION: x( d, i )
*	Maps a column to a pixel value.
*
* @param {Array} d - datum
* @param {Number} i - index
* @returns {String} transform string
*/
function x( d, i ) {
	/* jslint validthis:true */
	return 'translate(' + this._xScale( i ) + ')rotate(-90)';
} // end METHOD x()


// EXPORTS //

module.exports = x;
