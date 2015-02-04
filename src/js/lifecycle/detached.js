/**
*
*	FUNCTION: detached
*
*
*	DESCRIPTION:
*		- Event listener for when an element is removed from the DOM.
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
* FUNCTION: detached()
*	Event listener for when an element is removed from the DOM.
*/
function detached() {
	/* jslint validthis:true */
	this.removeListeners();
} // end FUNCTION detached()


// EXPORTS //

module.exports = detached;
