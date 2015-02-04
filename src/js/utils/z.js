/**
*
*	FUNCTION: z
*
*
*	DESCRIPTION:
*		- Maps a datum to a fill-opacity value.
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
* FUNCTION: z( d, i )
*	Maps a datum to a fill-opacity value.
*
* @param {Array} d - datum
* @param {Number} i - index
* @returns {Number} fill opacity
*/
function z( d, i ) {
	/* jslint validthis:true */
	return this._zScale( this.zValue( d, i ) );
} // end METHOD z()


// EXPORTS //

module.exports = z;
