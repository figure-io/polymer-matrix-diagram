/**
*
*	FUNCTION: colorOrderChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to the color scale domain.
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
* FUNCTION: colorOrderChanged( val[, newVal] )
*	Event handler for changes to the color scale domain.
*
* @param {Null|Array} val - change event value
* @param {Null|Array} [newVal] - new color scale domain
*/
function colorOrderChanged( val, newVal ) {
	/* jslint validthis:true */
	var err;
	if ( arguments.length > 1 ) {
		if ( !Array.isArray( newVal ) && newVal !== null ) {
			err = new TypeError( 'colorOrder::invalid assignment. Order must be an array or null. Value: `' + newVal + '`.' );
			this.fire( 'err', err );
			this.colorOrder = val;
			return;
		}
	}
	if ( this.colorOrder === null ) {
		this._colorOrder = this.colorDomain();
	} else {
		this._colorOrder = this.colorOrder.slice();
	}
	this._cScale.domain( this._colorOrder );

	if ( this.autoUpdate ) {
		this.$.cells.attr( 'fill', this._color );
	}
	this.fire( 'colorOrder', {
		'type': 'changed'
	});
	if ( newVal === void 0 ) {
		this.fire( 'change', {
			'attr': 'colorOrder',
			'data': val[ 0 ]
		});
	} else {
		this.fire( 'change', {
			'attr': 'colorOrder',
			'prev': val,
			'curr': newVal
		});
	}
} // end FUNCTION colorOrderChanged()


// EXPORTS //

module.exports = colorOrderChanged;
