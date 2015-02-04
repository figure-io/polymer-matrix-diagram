/**
*
*	FUNCTION: paddingRight
*
*
*	DESCRIPTION:
*		- Event handler for changes to a chart's right padding.
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
* FUNCTION: paddingRightChanged( oldVal, newVal )
*	Event handler for changes to a chart's right padding.
*
* @param {Null|Number} oldVal - old value
* @param {Null|Number} newVal - new value
*/
function paddingRightChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var width,
		fontSize,
		dx,
		err;
	if ( newVal !== null && (typeof newVal !== 'number' || newVal !== newVal || newVal%1 !== 0 || newVal < 0) ) {
		err = new TypeError( 'paddingRight::invalid assignment. Must be null or an integer greater than or equal to 0. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.paddingRight = oldVal;
		return;
	}
	width = this.graphWidth();

	// [0] Update the x-scale:
	this._xScale.rangeBands( [ 0, width ] );

	// [1] Recompute the row and column name text lengths:
	this.maxTextLengths();

	if ( this.autoUpdate ) {
		dx = this._xScale.rangeBand();
		fontSize = this.fontSize();

		// [2] Update the background:
		this.$.bkgd
			.attr( 'width', width );

		// [3] Update the rows:
		this.$.rowGridlines
			.attr( 'x1', width );

		// [4] Update the columns:
		this.$.cols
			.attr( 'transform', this._x );

		// [5] Update the cells:
		this.$.cells
			.attr( 'x', this._cx )
			.attr( 'width', dx );

		// [6] Update the row and column names:
		this.$.rownames
			.attr( 'y', this._yScale.rangeBand() / 2 )
			.attr( 'font-size', fontSize );

		this.$.colnames
			.attr( 'y', dx / 2 )
			.attr( 'font-size', fontSize );

		// [7] Update the x- and y-labels:
		this.$.xLabel
			.attr( 'x', width / 2 )
			.attr( 'y', -(this._maxColTextLength+16) );

		this.$.yLabel
			.attr( 'y', -(this._maxRowTextLength+16) );
	}
	this.fire( 'change', {
		'attr': 'paddingRight',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION paddingRightChanged()


// EXPORTS //

module.exports = paddingRightChanged;
