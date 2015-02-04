/**
*
*	FUNCTION: configChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to a chart configuration object.
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
* FUNCTION: configChanged( oldConfig, newConfig )
*	Event handler for changes to a chart configuration object.
*
* @param {Object} oldConfig - old config
* @param {Object} newConfig - new config
*/
function configChanged( oldConfig, newConfig ) {
	/* jslint validthis:true */
	var bool,
		err;

	if ( typeof newConfig !== 'object' || newConfig === null || Array.isArray( newConfig) ) {
		err = new TypeError( 'config::invalid assignment. Must be an `object`. Value: `' + newConfig + '`.' );
		this.fire( 'err', err );
		this.config = oldConfig;
		return;
	}
	// TODO: schema validator

	// Turn off auto-update:
	bool = this.autoUpdate;
	this.autoUpdate = false;

	// this.width = newConfig.canvas.width;
	// this.height = newConfig.canvas.height;

	// FIXME: The config should be standardized. Put in repo. Version it. Create an associated validator. NPM.

	this.fire( 'change', {
		'attr': 'config',
		'prev': oldConfig,
		'curr': newConfig
	});

	// Reset the auto update flag to its original value:
	this.autoUpdate = bool;

	// Only if auto update is enabled, redraw the chart...
	if ( bool ) {
		this.create();
	}
} // end FUNCTION configChanged()


// EXPORTS //

module.exports = configChanged;
