/**
*
*	FUNCTION: rowOrderChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to chart row order.
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
* FUNCTION: rowOrderChanged( val[, newVal] )
*	Event handler for changes to chart row order.
*
* @param {Array} val - change event value
* @param {Array} [newVal] - new array of indices defining the row order
*/
function rowOrderChanged( val, newVal ) {
	/* jslint validthis:true */
	var len = this.data.rownames().length,
		rowOrder = this.rowOrder,
		selection,
		err;

	// Determine if we have a new row order array...
	if ( arguments.length > 1 && !Array.isArray( newVal ) ) {
		err = new TypeError( 'rowOrder::invalid assignment. Row order must be an array. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.rowOrder = val;
		return;
	}
	if ( rowOrder.length !== len ) {
		err = new Error( 'rowOrder::invalid assignment. Array length must equal the number of rows. Number of rows: ' + len + '.' );
		this.fire( 'err', err );
		this.rowOrder = this._rowOrder.slice();
		return;
	}
	if ( !this.validateOrder( rowOrder ) ) {
		err = new Error( 'rowOrder::invalid assignment. Assigned array must be a permutation of row indices.' );
		this.fire( 'err', err );
		this.rowOrder = this._rowOrder.slice();
		return;
	}
	this._rowOrder = rowOrder.slice();
	this._yScale.domain( rowOrder );

	if ( this.duration > 0 ) {
		selection = this.$.marks.transition()
			.duration( this.duration )
			.each( 'end', this._onTransitionEnd );

		selection.selectAll( '.row' )
			.delay( this.delay )
			.attr( 'transform', this._y );
	} else {
		this.$.rows.attr( 'transform', this._y );
		this.fire( 'transitionended', null );
	}
	this.fire( 'roworder', {
		'type': 'change'
	});
	if ( newVal === void 0 ) {
		this.fire( 'change', {
			'attr': 'rowOrder',
			'data': val[ 0 ]
		});
	} else {
		this.fire( 'change', {
			'attr': 'rowOrder',
			'prev': val,
			'curr': newVal
		});
	}
} // end FUNCTION rowOrderChanged()


// EXPORTS //

module.exports = rowOrderChanged;
