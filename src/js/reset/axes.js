/**
*
*	FUNCTION: resetAxes
*
*
*	DESCRIPTION:
*		- Resets chart axis elements.
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
* FUNCTION: resetAxes()
*	Resets axis elements.
*
* @returns {Object} context
*/
function resetAxes() {
	/* jslint validthis:true */
	this.$.xLabel
		.attr( 'x', this.graphWidth() / 2 )
		.attr( 'y', -(this._maxColTextLength+16) );

	this.$.yLabel
		.attr( 'x', -this.graphHeight() / 2 )
		.attr( 'y', -(this._maxRowTextLength+16) );

	return this;
} // end FUNCTION resetAxes()


// EXPORTS //

module.exports = resetAxes;
