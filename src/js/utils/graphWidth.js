/**
*
*	FUNCTION: graphWidth
*
*
*	DESCRIPTION:
*		- Computes the expected graph width.
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
* FUNCTION: graphWidth()
*	Computes the expected graph width.
*
* @returns {Number} graph width
*/
function graphWidth() {
	/* jslint validthis:true */
	var pLeft, pRight;

	pLeft = ( this.paddingLeft === null ) ? this._paddingLeft : this.paddingLeft;
	pRight = ( this.paddingRight === null ) ? this._paddingRight : this.paddingRight;

	return this.width - pLeft - pRight;
} // end FUNCTION graphWidth()


// EXPORTS //

module.exports = graphWidth;
