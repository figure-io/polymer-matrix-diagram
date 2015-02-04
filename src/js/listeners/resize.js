/**
*
*	FUNCTION: onResize
*
*
*	DESCRIPTION:
*		- Resize event listener.
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
* FUNCTION: onResize()
*	Resize event listener.
*/
function onResize() {
	/* jslint validthis:true */
	this.fire( 'resized', {
		'el': 'polymer-matrix-diagram',
		'msg': 'Received a resize event.'
	});
	if ( !this.$.canvas ) {
		return;
	}
	this.width = this.clientWidth;
} // end FUNCTION onResize()


// EXPORTS //

module.exports = onResize;
