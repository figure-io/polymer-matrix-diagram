/**
*
*	FUNCTION: zDomain
*
*
*	DESCRIPTION:
*		- Computes the z-domain.
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
* FUNCTION: zDomain( min, max )
*	Computes the z-domain.
*
* @param {Null|Number} min - minimum value
* @param {Null|Number} max - maximum value
* @returns {Array} domain
*/
function zDomain( min, max ) {
	/* jslint validthis:true */
	var d3 = this._d3,
		data = this.data.data(),
		zValue = this.zValue,
		err;

	if ( typeof zValue !== 'function' ) {
		return [ this.zMin, this.zMax ];
	}
	if ( min !== null && ( typeof min !== 'number' || min !== min ) ) {
		err = new TypeError( 'zDomain()::invalid input argument. Minimum value must be numeric or `null`. Value: `' + min + '`.' );
		this.fire( 'err', err );
		return;
	}
	if ( max !== null && ( typeof max !== 'number' || max !== max ) ) {
		err = new TypeError( 'zDomain()::invalid input argument. Maximum value must be numeric or `null`. Value: `' + max + '`.' );
		this.fire( 'err', err );
		return;
	}
	if ( min === null ) {
		min = d3.min( data, function onRow( row ) {
			return d3.min( row, zValue );
		});
	}
	if ( max === null ) {
		max = d3.max( data, function onRow( row ) {
			return d3.max( row, zValue );
		});
	}
	return [ min, max ];
} // end FUNCTION zDomain()


// EXPORTS //

module.exports = zDomain;
