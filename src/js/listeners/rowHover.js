/**
*
*	FUNCTION: onRowHover
*
*
*	DESCRIPTION:
*		- Event listener for row mouseover events.
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
* FUNCTION: onRowHover( d, i )
*	Mouseover listener for rows.
*
* @param {String} d - row name
* @param {Number} i - row index
* @returns {Boolean} false
*/
function onRowHover( d, i ) {
	/* jslint validthis:true */
	var evt = this._d3.event;

	this.$.rows[ 0 ][ i ].classList.add( 'active' );

	evt.datum = d;
	evt.index = i;
	this.fire( 'hover.row', evt );
	this.fire( 'hover', evt );
	return false;
} // end FUNCTION onRowHover()


// EXPORTS //

module.exports = onRowHover;
