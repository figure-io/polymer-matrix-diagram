/**
*
*	FUNCTION: cx
*
*
*	DESCRIPTION:
*		- Maps a row cell to a pixel value.
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
* FUNCTION: cx( d, i )
*	Maps a row cell to a pixel value.
*
* @param {Array} d - datum
* @param {Number} i - index
* @returns {String} transform string
*/
function cx( d, i ) {
	/* jslint validthis:true */
	return this._xScale( i );
} // end FUNCTION cx()


// EXPORTS //

module.exports = cx;
