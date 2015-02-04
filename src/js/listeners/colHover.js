/**
*
*	FUNCTION: onColHover
*
*
*	DESCRIPTION:
*		- Event listener for column mouseover events.
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
* FUNCTION: onColHover( d, i )
*	Mouseover listener for columns.
*
* @param {String} d - row name
* @param {Number} i - row index
* @returns {Boolean} false
*/
function onColHover( d, i ) {
	/* jslint validthis:true */
	var evt = this._d3.event;

	this.$.cols[ 0 ][ i ].classList.add( 'active' );

	evt.datum = d;
	evt.index = i;
	this.fire( 'hover.col', evt );
	this.fire( 'hover', evt );
	return false;
} // end FUNCTION onColHover()


// EXPORTS //

module.exports = onColHover;
