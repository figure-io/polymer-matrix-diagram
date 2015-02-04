/**
*
*	FUNCTION: createBrush
*
*
*	DESCRIPTION:
*		- Creates a brush element which overlays graph marks.
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
* FUNCTION: createBrush()
*	Creates a brush element which overlays the graph marks.
*
* @returns {Object} context
*/
function createBrush() {
	/* jslint validthis:true */
	this.$.brush = this.$.graph.append( 'svg:g' )
		.attr( 'property', 'brush' )
		.attr( 'class', 'brush' );

	return this;
} // end FUNCTION createBrush()


// EXPORTS //

module.exports = createBrush;
