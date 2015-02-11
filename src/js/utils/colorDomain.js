/**
*
*	FUNCTION: cDomain
*
*
*	DESCRIPTION:
*		- Computes a color scale domain.
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
* FUNCTION: asc( a, b )
*	Comparator for sorting an array in ascending order. (Note: non-stable sort order! e.g., when a === b )
*
* @private
* @param {Number|String} a - value
* @param {Number|String} b - value
* @returns {Number} sort value
*/
function asc( a, b ) {
	if ( a < b ) {
		return -1;
	}
	if ( a > b ) {
		return 1;
	}
	if ( a === b ) {
		return 0;
	}
	return NaN;
} // end FUNCTION asc()

/**
* FUNCTION: colorDomain()
*	Computes a color scale domain.
*
* @returns {Array} domain (sorted)
*/
function colorDomain() {
	/* jslint validthis:true */
	var size = this.data.size(),
		data = this.data.data(),
		cValue = this.cValue,
		cache = {},
		d, i, j;

	for ( i = 0; i < size[0]; i++ ) {
		for ( j = 0; j < size[1]; j++ ) {
			d = cValue( data[ i ][ j ], j );
			if ( !cache[ d ] ) {
				cache[ d ] = true;
			}
		}
	}
	return Object.keys( cache ).sort( asc );
} // end FUNCTION colorDomain()


// EXPORTS //

module.exports = colorDomain;
