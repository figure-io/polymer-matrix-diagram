/**
*
*	FUNCTION: onRowDragEnd
*
*
*	DESCRIPTION:
*		- Event listener for when a user stops dragging a row.
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
* FUNCTION: onRowDragEnd( d, idx )
*	Event listener for when a user stops dragging a row.
*
* @param {*} d - datum
* @param {Number} i - row index
*/
function onRowDragEnd( d, i ) {
	/* jslint validthis:true */
	var self = this,
		duration = this.duration,
		delay = this.delay,
		order,
		j, k,
		idx;

	if ( !this._active.dragging ) {
		return;
	}
	this._active.dragging = false;

	if ( this._rowOrder ) {
		order = this._rowOrder.slice();
	} else {
		order = this._yScale.domain().slice();
	}
	// Match the element index to its place in the y-domain (use linear search as array elements may be in random order)...
	for ( j = 0; j < order.length; j++ ) {
		if ( i === order[ j ] ) {
			i = j;
			break;
		}
	}
	// Determine the nearest row index:
	j = Math.round( this._active.y / this._yScale.rangeBand() );

	// Re-order the rows...
	idx = order[ i ];
	if ( i === j ) {
		this._active.row.attr( 'transform', this._y( d, idx ) );
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

		this.rowOrder = order;
	}
	this._active.row = null;
	this._active.y = null;

	function onEnd() {
		self.duration = duration;
		self.delay = delay;
		self.removeEventListener( 'transitionended', onEnd );
	}
} // end FUNCTION onRowDragEnd()


// EXPORTS //

module.exports = onRowDragEnd;
