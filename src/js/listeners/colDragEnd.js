/**
*
*	FUNCTION: onColDragEnd
*
*
*	DESCRIPTION:
*		- Event listener for when a user stops dragging a column.
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
* FUNCTION: onColDragEnd( d, i )
*	Event listener for when a user stops dragging a column.
*
* @param {*} d - datum
* @param {Number} i - column index
*/
function onColDragEnd( d, i ) {
	/* jslint validthis:true */
	var self = this,
		evt = this._d3.event,
		duration = this.duration,
		delay = this.delay,
		order,
		j, k,
		idx;

	if ( !this._active.dragging ) {
		return;
	}
	this._active.dragging = false;

	if ( this._colOrder ) {
		order = this._colOrder.slice();
	} else {
		order = this._xScale.domain().slice();
	}
	// Match the element index to its place in the x-domain (use linear search as array elements may be in random order)...
	for ( j = 0; j < order.length; j++ ) {
		if ( i === order[ j ] ) {
			i = j;
			break;
		}
	}
	// Determine the nearest column index:
	j = Math.round( this._active.x / this._xScale.rangeBand() );

	// Re-order the columns...
	idx = order[ i ];
	if ( i === j ) {
		this._active.col.attr( 'transform', this._x( d, idx ) );
		this._active.cells.attr( 'x', this._cx( d, idx ) );
	} else {
		if ( i < j ) {
			// Case 1: shift elements to the left...
			for ( k = i; k < j; k++ ) {
				order[ k ] = order[ k+1 ];
			}
		} else {
			// Case 2: shift elements to the right...
			for ( k = i; k > j; k-- ) {
				order[ k ] = order[ k-1 ];
			}
		}
		order[ j ] = idx;

		// Modify the transition properties when sorting...
		this.duration = 100;
		this.delay = 0;
		this.addEventListener( 'transitionended', onEnd );

		this.colOrder = order;
	}
	this._active.col = null;
	this._active.cells = null;
	this._active.x = null;

	evt.datum = d;
	evt.col = i;

	function onEnd() {
		self.duration = duration;
		self.delay = delay;

		self.removeEventListener( 'transitionended', onEnd );

		self.fire( 'sortend.col', evt );
		self.fire( 'sortend', evt );
	}
} // end FUNCTION onColDragEnd()


// EXPORTS //

module.exports = onColDragEnd;
