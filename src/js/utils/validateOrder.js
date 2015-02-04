/**
*
*	FUNCTION: validateOrder
*
*
*	DESCRIPTION:
*		- Validates that an array of indices is a permutation.
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
* FUNCTION: validateOrder( arr )
*	Validates that an array of indices is a permutation.
*
* @param {Array} arr - array of indices
* @returns {Boolean} boolean indicating if valid
*/
function validateOrder( arr ) {
	/* jslint validthis:true */
	var len = arr.length,
		hash = {},
		range,
		key,
		i;

	// Build a hash of all indices, ensuring uniqueness...
	for ( i = 0; i < len; i++ ) {
		key = arr[ i ];
		if ( hash[ key ] ) {
			return false;
		}
		hash[ key ] = true;
	}
	// Create a unique ordered array of all possible indices:
	range = this._d3.range( len );

	// Confirm that the hash has every possible index...
	for ( i = 0; i < len; i++ ) {
		if ( !hash[ range[i] ] ) {
			return false;
		}
	}
	return true;
} // end FUNCTION validateOrder()


// EXPORTS //

module.exports = validateOrder;
