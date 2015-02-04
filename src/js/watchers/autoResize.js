/**
*
*	FUNCTION: autoResizeChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to an `auotResize` setting.
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
* FUNCTION: autoResizeChanged( oldVal, newVal )
*	Event handler for changes to an `autoResize` setting.
*
* @param {Boolean} oldVal - old value
* @param {Boolean} newVal - new value
*/
function autoResizeChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var err;
	if ( typeof newVal !== 'boolean' ) {
		err = new TypeError( 'autoResize::invalid assignment. Must be a boolean. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.autoResize = oldVal;
		return;
	}
	if ( newVal ) {
		window.addEventListener( 'resize', this._onResize, false );
	} else {
		window.removeEventListener( 'resize', this._onResize );
	}
	this.fire( 'change', {
		'attr': 'autoResize',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION autoResizeChanged()


// EXPORTS //

module.exports = autoResizeChanged;
