/**
*
*	FUNCTION: graphHeight
*
*
*	DESCRIPTION:
*		- Computes the expected graph height.
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
* FUNCTION: graphHeight()
*	Computes the expected graph height.
*
* @returns {Number} graph height
*/
function graphHeight() {
	/* jshint validthis:true */
	var pTop, pBottom;

	pTop = ( this.paddingTop === null ) ? this._paddingTop : this.paddingTop;
	pBottom = ( this.paddingBottom === null ) ? this._paddingBottom : this.paddingBottom;

	return this.height - pTop - pBottom;
} // end FUNCTION graphHeight()


// EXPORTS //

module.exports = graphHeight;
