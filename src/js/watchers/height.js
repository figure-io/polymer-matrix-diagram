/**
*
*	FUNCTION: heightChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to chart height.
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
* FUNCTION: heightChanged( oldVal, newVal )
*	Event handler for changes to chart height.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
function heightChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var height,
		fontSize,
		dy,
		err;
	if ( typeof newVal !== 'number' || newVal !== newVal || newVal <= 0 ) {
		err = new TypeError( 'height::invalid assignment. Must be a number greater than 0. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.height = oldVal;
		return;
	}
	height = this.graphHeight();

	// [0] Update the y-scale:
	this._yScale.rangeBands( [ 0, height ] );

	// [1] Recompute the row and column name text lengths:
	this.maxTextLengths();

	if ( this.$.canvas && this.autoUpdate ) {
		dy = this._yScale.rangeBand();
		fontSize = this.fontSize();

		// [2] Update the SVG canvas:
		this.$.canvas
			.attr( 'height', newVal );

		// [3] Update the background:
		this.$.bkgd
			.attr( 'height', height );

		// [4] Update the rows:
		this.$.rows
			.attr( 'transform', this._y );

		// [5] Update the columns:
		this.$.colGridlines
			.attr( 'x1', -height );

		// [6] Update the cells:
		this.$.cells
			.attr( 'height', dy );

		// [7] Update the row and column names:
		this.$.rownames
			.attr( 'y', dy / 2 )
			.attr( 'font-size', fontSize );

		this.$.colnames
			.attr( 'y', this._xScale.rangeBand() / 2 )
			.attr( 'font-size', fontSize );

		// [8] Update the x- and y-labels:
		this.$.xLabel
			.attr( 'y', -(this._maxColTextLength+16) );

		this.$.yLabel
			.attr( 'x', -height / 2 )
			.attr( 'y', -(this._maxRowTextLength+16) );
	}
	this.fire( 'height', {
		'type': 'change'
	});
	this.fire( 'change', {
		'attr': 'height',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION heightChanged()


// EXPORTS //

module.exports = heightChanged;
