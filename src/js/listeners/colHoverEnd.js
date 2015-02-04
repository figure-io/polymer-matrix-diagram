/**
*
*	FUNCTION: onColHoverEnd
*
*
*	DESCRIPTION:
*		- Event listener for column mouseout events.
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
* FUNCTION: onColHoverEnd( d, i )
*	Mouseout listener for columns.
*
* @param {String} d - row name
* @param {Number} i - row index
* @returns {Boolean} false
*/
function onColHoverEnd( d, i ) {
	/* jslint validthis:true */
	var evt = this._d3.event;

	this.$.cols[ 0 ][ i ].classList.remove( 'active' );

	evt.datum = d;
	evt.index = i;
	this.fire( 'hoverend.col', evt );
	this.fire( 'hoverend', evt );
	return false;
} // end FUNCTION onColHoverEnd()


// EXPORTS //

module.exports = onColHoverEnd;
