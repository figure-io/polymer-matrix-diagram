/**
*
*	FUNCTION: maxTextLengths
*
*
*	DESCRIPTION:
*		- Calculates the maximum row and column name lengths.
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
* FUNCTION: maxTextLengths()
*	Calculates the maximum row and column name lengths.
*
* @returns {Object} context
*/
function maxTextLengths() {
	/* jslint validthis:true */
	var text = this.$.text,
		selection,
		names,
		max,
		len,
		i;

	if ( !this.data ) {
		return this;
	}
	selection = this._d3.select( text );

	// Base calculations on the actual name font-size:
	selection.attr( 'font-size', this.fontSize() );

	// Rows...
	names = this.data.rownames();

	max = 0;
	for ( i = 0; i < names.length; i++ ) {
		text.textContent = names[ i ];
		len = text.getComputedTextLength();
		if ( len > max ) {
			max = len;
		}
	}
	this._maxRowTextLength = Math.ceil( max );

	// Columns...
	names = this.data.colnames();

	max = 0;
	for ( i = 0; i < names.length; i++ ) {
		text.textContent = names[ i ];
		len = text.getComputedTextLength();
		if ( len > max ) {
			max = len;
		}
	}
	this._maxColTextLength = Math.ceil( max );

	// Restore the text font-size:
	selection.attr( 'font-size', this._maxFontSize );

	// Reset the text content:
	text.textContent = '';

	return this;
} // end FUNCTION maxTextLengths()


// EXPORTS //

module.exports = maxTextLengths;
