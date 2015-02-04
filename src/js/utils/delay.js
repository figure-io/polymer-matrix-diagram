/**
*
*	FUNCTION: delay
*
*
*	DESCRIPTION:
*		- Computes a transition delay based on an element index.
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
* FUNCTION: delay( d, i )
*	Computes a transition delay based on an element index.
*
* @param {*} d - datum
* @param {Number} i - index
* @returns {Number} transition delay in milliseconds
*/
function delay( d, i ) {
	// NOTE: the scalar offset (e.g., 20) is something of a magic number, based more on feel than science.
	return i * 20;
} // end FUNCTION delay()


// EXPORTS //

module.exports = delay;
