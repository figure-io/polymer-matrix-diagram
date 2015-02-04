/**
*
*	FUNCTION: create
*
*
*	DESCRIPTION:
*		- Creates a chart.
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
* FUNCTION: create()
*	Creates a chart.
*
* @returns {Object} context
*/
function create() {
	/* jslint validthis:true */
	// Ensure that the width and height are set before creating a chart...
	this.width = this.width || this.clientWidth || this.parentNode.clientWidth || 600;
	this.height = this.height || this.clientHeight || this.parentNode.clientHeight || 400;

	// Create the chart layers...
	this
		.createBase()
		.createBackground()
		.createMarks()
		.createAxes()
		.createBrush();

	return this;
} // end FUNCTION create()


// EXPORTS //

module.exports = create;
