/**
*
*	FUNCTION: createMarks
*
*
*	DESCRIPTION:
*		- Creates graph marks.
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
* FUNCTION: createMarks()
*	Creates the graph marks.
*
* @returns {Object} context
*/
function createMarks() {
	/* jslint validthis:true */
	if ( this.$.marks ) {
		this.$.marks.remove();
	}
	this.$.marks = this.$.graph.append( 'svg:g' )
		.attr( 'property', 'marks' )
		.attr( 'class', 'marks' );

	this.createRows()
		.createCols();

	return this;
} // end FUNCTION createMarks()


// EXPORTS //

module.exports = createMarks;
