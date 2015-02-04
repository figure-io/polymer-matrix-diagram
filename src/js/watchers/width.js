/**
*
*	FUNCTION: widthChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to chart width.
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
* FUNCTION: widthChanged( oldVal, newVal )
*	Event handler for changes to chart width.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
function widthChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var width,
		fontSize,
		dx,
		err;
	if ( typeof newVal !== 'number' || newVal !== newVal || newVal <= 0 ) {
		err = new TypeError( 'width::invalid assignment. Must be a number greater than 0. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.width = oldVal;
		return;
	}
	width = this.graphWidth();

	// [0] Update the x-scale:
	this._xScale.rangeBands( [ 0, width ] );

	// [1] Recompute the row and column name text lengths:
	this.maxTextLengths();

	if ( this.$.canvas && this.autoUpdate ) {
		dx = this._xScale.rangeBand();
		fontSize = this.fontSize();

		// [2] Update the SVG canvas:
		this.$.canvas
			.attr( 'width', newVal );

		// [3] Update the background:
		this.$.bkgd
			.attr( 'width', width );

		// [4] Update the rows:
		this.$.rowGridlines
			.attr( 'x1', width );

		// [5] Update the columns:
		this.$.cols
			.attr( 'transform', this._x );

		// [6] Update the cells:
		this.$.cells
			.attr( 'x', this._cx )
			.attr( 'width', dx );

		// [7] Update the row and column names:
		this.$.rownames
			.attr( 'y', this._yScale.rangeBand() / 2 )
			.attr( 'font-size', fontSize );

		this.$.colnames
			.attr( 'y', dx / 2 )
			.attr( 'font-size', fontSize );

		// [8] Update the x- and y-labels:
		this.$.xLabel
			.attr( 'x', width / 2 )
			.attr( 'y', -(this._maxColTextLength+16) );

		this.$.yLabel
			.attr( 'y', -(this._maxRowTextLength+16) );
	}
	this.fire( 'width', {
		'type': 'change'
	});
	this.fire( 'change', {
		'attr': 'width',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION widthChanged()


// EXPORTS //

module.exports = widthChanged;
