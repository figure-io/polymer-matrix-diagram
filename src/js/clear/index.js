/**
*
*	FUNCTION: clear
*
*
*	DESCRIPTION:
*		- Clears a chart.
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
* FUNCTION: clear()
*	Clears a chart.
*
* @returns {Object} context
*/
function clear() {
	/* jslint validthis:true */
	this.$.rows.remove();
	this.$.cols.remove();
	this._brush.clear();
	return this;
} // end FUNCTION clear()


// EXPORTS //

module.exports = clear;
