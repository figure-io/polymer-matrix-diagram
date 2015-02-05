/**
*
*	FUNCTION: dataChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to chart data.
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
* FUNCTION: dataChanged( oldVal newVal )
*	Event handler for changes to chart data.
*
* @param {Array} oldVal - old value
* @param {Array} newVal - new value
*/
function dataChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var range = this._d3.range,
		len;

	// TODO: check if data frame.

	// [0] Set the domains:
	len = this.data.colnames().length;
	this._xScale.domain( range( len ) );

	len = this.data.rownames().length;
	this._yScale.domain( range( len ) );

	this._zScale.domain( this.zDomain( this.zMin, this.zMax ) );

	// [1] Compute padding values based on the row and column names:
	this.calculatePadding();

	// [2] Update the scales:
	this._xScale.rangeBands( [ 0, this.graphWidth() ] );
	this._yScale.rangeBands( [ 0, this.graphHeight() ] );

	// [3] Compute max text lengths based on the row and column names:
	this.maxTextLengths();

	if ( this.autoUpdate ) {
		// [4] Reset elements:
		this.reset();
	}
	this.fire( 'data', {
		'type': 'change'
	});
	// TODO: consider whether you want to actually publish the old and new data values (e.g., this could be sizable when logging)
	this.fire( 'change', {
		'attr': 'data',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION dataChanged()


// EXPORTS //

module.exports = dataChanged;
