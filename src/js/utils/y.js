/**
*
*	FUNCTION: y
*
*
*	DESCRIPTION:
*		- Maps a row to a pixel value.
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
* FUNCTION: y( d, i )
*	Maps a row to a pixel value.
*
* @param {Array} d - datum
* @param {Number} i - index
* @returns {String} transform string
*/
function y( d, i ) {
	/* jslint validthis:true */
	return 'translate(0,' + this._yScale( i ) + ')';
} // end FUNCTION y()


// EXPORTS //

module.exports = y;
