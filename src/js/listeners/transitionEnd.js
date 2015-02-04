/**
*
*	FUNCTION: onTransitionEnd
*
*
*	DESCRIPTION:
*		- Event listener for transition end events.
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
* FUNCTION: onTransitionEnd()
*	Event listener for transition `end` events.
*
* @returns {Boolean} false
*/
function onTransitionEnd() {
	/* jslint validthis:true */
	this.fire( 'transitionended', null );
	return false;
} // end FUNCTION onTransitionEnd()


// EXPORTS //

module.exports = onTransitionEnd;
