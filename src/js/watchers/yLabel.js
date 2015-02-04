/**
*
*	FUNCTION: yLabelChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to a chart's y-label.
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
* FUNCTION: yLabelChanged( oldVal, newVal )
*	Event handler for changes to a chart's y-label.
*
* @param {String} oldVal - old value
* @param {String} newVal - new value
*/
function yLabelChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var width,
		fontSize,
		dx,
		err;
	if ( typeof newVal !== 'string' ) {
		err = new TypeError( 'yLabel::invalid assignment. Must be a string. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.yLabel = oldVal;
		return;
	}
	if ( this.autoUpdate ) {
		// [0] Set the label text:
		this.$.yLabel.text( newVal );

		// Only recompute the layout if label changed to or from an empty string...
		if ( !oldVal || !newVal ) {
			// [1] Compute the padding based on the row and column text lengths:
			this.calculatePadding();
			width = this.graphWidth();

			// [2] Update the x-scale:
			this._xScale.rangeBands( [ 0, width ] );

			dx = this._xScale.rangeBand();
			fontSize = this.fontSize();

			// [3] Compute the max row and column text lengths:
			this.maxTextLengths();

			// [4] Update the background:
			this.$.bkgd
				.attr( 'width', width );

			// [5] Update the graph:
			this.$.graph
				.attr( 'transform', 'translate(' + this._paddingLeft + ',' + this._paddingTop + ')' );

			// [6] Update the rows:
			this.$.rowGridlines
				.attr( 'x1', width );

			// [7] Update the columns:
			this.$.cols
				.attr( 'transform', this._x );

			// [8] Update the cells:
			this.$.cells
				.attr( 'x', this._cx )
				.attr( 'width', dx );

			// [9] Update the row and column names:
			this.$.rownames
				.attr( 'y', this._yScale.rangeBand() / 2 )
				.attr( 'font-size', fontSize );

			this.$.colnames
				.attr( 'y', dx / 2 )
				.attr( 'font-size', fontSize );

			// [10] Update the x- and y-labels:
			this.$.xLabel
				.attr( 'x', width / 2 )
				.attr( 'y', -(this._maxColTextLength+16) );

			this.$.yLabel
				.attr( 'y', -(this._maxRowTextLength+16) );
		}
	}
	this.fire( 'change', {
		'attr': 'yLabel',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION yLabelChanged()


// EXPORTS //

module.exports = yLabelChanged;
