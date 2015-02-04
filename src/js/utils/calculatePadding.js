/**
*
*	FUNCTION: calculatePadding
*
*
*	DESCRIPTION:
*		- Computes padding values based on row and column name computed text length.
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
* FUNCTION: calculatePadding()
*	Computes padding values based on row and column name computed text length.
*
* @returns {Object} context
*/
function calculatePadding() {
	/* jslint validthis:true */
	var text = this.$.text,
		min = this._minPadding,
		scalar = 16,
		names,
		max,
		len,
		h,
		i;

	if ( !this.data ) {
		return this;
	}
	// NOTE: the `scalar` is something of a magic number to avoid pushing up against the canvas edge and crowding axis labels.

	// Rows...
	names = this.data.rownames();

	max = min;
	for ( i = 0; i < names.length; i++ ) {
		text.textContent = names[ i ];
		len = text.getComputedTextLength();
		if ( len > max ) {
			max = len;
		}
	}
	h = this.$.yLabel.node().getBBox().height;
	if ( h ) {
		h += 10;
	}
	this._paddingLeft = Math.ceil( max+scalar+h );

	// Columns...
	names = this.data.colnames();

	max = min;
	for ( i = 0; i < names.length; i++ ) {
		text.textContent = names[ i ];
		len = text.getComputedTextLength();
		if ( len > max ) {
			max = len;
		}
	}
	h = this.$.xLabel.node().getBBox().height;
	if ( h ) {
		h += 10;
	}
	this._paddingTop = Math.ceil( max+scalar+h );

	// Reset the text content:
	text.textContent = '';

	return this;
} // end FUNCTION calculatePadding()


// EXPORTS //

module.exports = calculatePadding;
