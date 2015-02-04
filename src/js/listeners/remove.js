/**
*
*	FUNCTION: removeListeners
*
*
*	DESCRIPTION:
*		- Removes event listeners.
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

/* global window */
'use strict';

/**
* FUNCTION: removeListeners()
*	Removes event listeners.
*
* @returns {Object} context
*/
function removeListeners() {
	/* jslint validthis:true */
	window.removeEventListener( 'resize', this._onResize );
	return this;
} // end FUNCTION removeListeners()


// EXPORTS //

module.exports = removeListeners;
