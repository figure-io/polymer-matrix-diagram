/**
*
*	FUNCTION: paddingTopChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to a chart's top padding.
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
* FUNCTION: paddingTopChanged( oldVal, newVal )
*	Event handler for changes to a chart's top padding.
*
* @param {Null|Number} oldVal - old value
* @param {Null|Number} newVal - new value
*/
function paddingTopChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var height,
		pLeft,
		pTop,
		pBottom,
		fontSize,
		dy,
		err;
	if ( newVal !== null && (typeof newVal !== 'number' || newVal !== newVal || newVal%1 !== 0 || newVal < 0) ) {
		err = new TypeError( 'paddingTop::invalid assignment. Must be null or an integer greater than or equal to 0.  Value: `' + newVal + '.' );
		this.fire( 'err', err );
		this.paddingTop = oldVal;
		return;
	}
	pTop = ( newVal === null ) ? this._paddingTop : newVal;
	pBottom = ( this.paddingBottom === null ) ? this._paddingBottom : this.paddingBottom;
	pLeft = ( this.paddingLeft === null ) ? this._paddingLeft : this.paddingLeft;

	height = this.height - pTop - pBottom;

	// [0] Update the y-scale:
	this._yScale.rangeBands( [ 0, height ] );

	// [1] Recompute the row and column name text lengths:
	this.maxTextLengths();

	if ( this.autoUpdate ) {
		dy = this._yScale.rangeBand();
		fontSize = this.fontSize();

		// [2] Update the background:
		this.$.bkgd
			.attr( 'height', height );

		// [3] Update the graph:
		this.$.graph
			.attr( 'transform', 'translate(' + pLeft + ',' + pTop + ')' );

		// [4] Update the rows:
		this.$.rows
			.attr( 'transform', this._y );

		// [5] Update the columns:
		this.$.colGridlines
			.attr( 'x1', -height );

		// [6] Update the cells:
		this.$.cells
			.attr( 'height', dy );

		// [7] Update the row and column labels:
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
	this.fire( 'change', {
		'attr': 'paddingTop',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION paddingTopChanged()


// EXPORTS //

module.exports = paddingTopChanged;
