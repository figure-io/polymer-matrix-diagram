/**
*
*	FUNCTION: onRowClick
*
*
*	DESCRIPTION:
*		- Event listener for row clicks.
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
* FUNCTION: onRowClick( d, i )
*	Event listener for row clicks.
*
* @param {String} d - row name
* @param {Number} i - row index
* @returns {Boolean} false
*/
function onRowClick( d, i ) {
	/* jslint validthis:true */
	var evt = this._d3.event;
	evt.datum = d;
	evt.index = i;
	this.fire( 'clicked.row', evt );
	this.fire( 'clicked', evt );
	return false;
} // end FUNCTION onRowClick()


// EXPORTS //

module.exports = onRowClick;
