/**
*
*	FUNCTION: colOrderChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to chart column order.
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
* FUNCTION: colOrderChanged( val[, newVal] )
*	Event handler for changes to chart column order.
*
* @param {Array} val - change event value
* @param {Array} [newVal] - new array of indices defining the column order
*/
function colOrderChanged( val, newVal ) {
	/* jslint validthis:true */
	var len = this.data.colnames().length,
		colOrder = this.colOrder,
		selection,
		err;

	// Determine if we have a new row order array...
	if ( arguments.length > 1 && !Array.isArray( newVal ) ) {
		err = new TypeError( 'colOrder::invalid assignment. Row order must be an array. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.colOrder = val;
		return;
	}
	if ( colOrder.length !== len ) {
		err = new Error( 'colOrder::invalid assignment. Array length must equal the number of columns. Number of columns: ' + len + '.' );
		this.fire( 'err', err );
		this.colOrder = this._colOrder.slice();
		return;
	}
	if ( !this.validateOrder( colOrder ) ) {
		err = new Error( 'colOrder::invalid assignment. Assigned array must be a permutation of column indices.' );
		this.fire( 'err', err );
		this.colOrder = this._colOrder.slice();
		return;
	}
	this._colOrder = colOrder.slice();
	this._xScale.domain( colOrder );

	if ( this.duration > 0 ) {
		selection = this.$.marks.transition()
			.duration( this.duration )
			.each( 'end', this._onTransitionEnd );

		selection.selectAll( '.col' )
			.delay( this.delay )
			.attr( 'transform', this._x );

		selection.selectAll( '.row' )
			.selectAll( '.cell' )
			.delay( this.delay )
			.attr( 'x', this._cx );
	} else {
		this.$.cols.attr( 'transform', this._x );

		this.$.cells.attr( 'x', this._cx );

		this.fire( 'transitionended', null );
	}
	this.fire( 'colorder', {
		'type': 'change'
	});
	if ( newVal === void 0 ) {
		this.fire( 'change', {
			'attr': 'colOrder',
			'data': val[ 0 ]
		});
	} else {
		this.fire( 'change', {
			'attr': 'colOrder',
			'prev': val,
			'curr': newVal
		});
	}
} // end FUNCTION colOrderChanged()


// EXPORTS //

module.exports = colOrderChanged;
