/**
*
*	FUNCTION: addListeners
*
*
*	DESCRIPTION:
*		- Adds events listeners.
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
* FUNCTION: addListeners()
*	Adds event listeners.
*
* @returns {Object} context
*/
function addListeners() {
	/* jslint validthis:true */
	this.removeListeners();
	if ( this.autoResize ) {
		window.addEventListener( 'resize', this._onResize, false );
	}
	return this;
} // end FUNCTION addListeners()


// EXPORTS //

module.exports = addListeners;
