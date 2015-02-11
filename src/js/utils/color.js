/**
*
*	FUNCTION: color
*
*
*	DESCRIPTION:
*		- Maps a datum to a fill color.
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
* FUNCTION: color( d, i )
*	Maps a datum to a fill color.
*
* @param {Array} d - datum
* @param {Number} i - index
* @returns {String} fill color
*/
function color( d, i ) {
	/* jslint validthis:true */
	return this._cScale( this.cValue( d, i ) );
} // end METHOD color()


// EXPORTS //

module.exports = color;
