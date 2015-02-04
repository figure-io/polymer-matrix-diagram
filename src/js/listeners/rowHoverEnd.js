/**
*
*	FUNCTION: onRowHoverEnd
*
*
*	DESCRIPTION:
*		- Event listener for row mouseout events.
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
* FUNCTION: onRowHoverEnd( d, i )
*	Mouseout listener for rows.
*
* @param {String} d - row name
* @param {Number} i - row index
* @returns {Boolean} false
*/
function onRowHoverEnd( d, i ) {
	/* jslint validthis:true */
	var evt = this._d3.event;

	this.$.rows[ 0 ][ i ].classList.remove( 'active' );

	evt.datum = d;
	evt.index = i;
	this.fire( 'hoverend.row', evt );
	this.fire( 'hoverend', evt );
	return false;
} // end FUNCTION onRowHoverEnd()


// EXPORTS //

module.exports = onRowHoverEnd;
