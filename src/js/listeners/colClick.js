/**
*
*	FUNCTION: onColClick
*
*
*	DESCRIPTION:
*		- Event listener for column clicks.
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
* FUNCTION: onColClick( d, i )
*	Event listener for column clicks.
*
* @param {String} d - row name
* @param {Number} i - row index
* @returns {Boolean} false
*/
function onColClick( d, i ) {
	/* jslint validthis:true */
	var evt = this._d3.event;
	evt.datum = d;
	evt.index = i;
	this.fire( 'clicked.col', evt );
	this.fire( 'clicked', evt );
	return false;
} // end FUNCTION onColClick()


// EXPORTS //

module.exports = onColClick;
