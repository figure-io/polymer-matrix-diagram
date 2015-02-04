/**
*
*	FUNCTION: xLabelChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to a chart's x-label.
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
* FUNCTION: xLabelChanged( oldVal, newVal )
*	Event handler for changes to a chart's x-label.
*
* @param {String} oldVal - old value
* @param {String} newVal - new value
*/
function xLabelChanged( oldVal, newVal ) {
	/* jslint validthis:true */
	var height,
		fontSize,
		dy,
		err;
	if ( typeof newVal !== 'string' ) {
		err = new TypeError( 'xLabel::invalid assignment. Must be a string. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.xLabel = oldVal;
		return;
	}
	if ( this.autoUpdate ) {
		// [0] Set the label text:
		this.$.xLabel.text( newVal );

		// Only recompute the layout if label changed to or from an empty string...
		if ( !oldVal || !newVal ) {
			// [1] Compute the padding based on the row and column text lengths:
			this.calculatePadding();
			height = this.graphHeight();

			// [2] Update the y-scale:
			this._yScale.rangeBands( [ 0, height ] );

			dy = this._yScale.rangeBand();
			fontSize = this.fontSize();

			// [3] Compute the max row and column text lengths:
			this.maxTextLengths();

			// [4] Update the background:
			this.$.bkgd
				.attr( 'height', height );

			// [5] Update the graph:
			this.$.graph
				.attr( 'transform', 'translate(' + this._paddingLeft + ',' + this._paddingTop + ')' );

			// [6] Update the rows:
			this.$.rows
				.attr( 'transform', this._y );

			// [7] Update the columns:
			this.$.colGridlines
				.attr( 'x1', -height );

			// [8] Update the cells:
			this.$.cells
				.attr( 'height', dy );

			// [9] Update the row and column labels:
			this.$.rownames
				.attr( 'y', dy / 2 )
				.attr( 'font-size', fontSize );

			this.$.colnames
				.attr( 'y', this._xScale.rangeBand() / 2 )
				.attr( 'font-size', fontSize );

			// [10] Update the x- and y-labels:
			this.$.xLabel
				.attr( 'y', -(this._maxColTextLength+16) );

			this.$.yLabel
				.attr( 'x', -height / 2 )
				.attr( 'y', -(this._maxRowTextLength+16) );
		}
	}
	this.fire( 'change', {
		'attr': 'xLabel',
		'prev': oldVal,
		'curr': newVal
	});
} // end FUNCTION xLabelChanged()


// EXPORTS //

module.exports = xLabelChanged;
