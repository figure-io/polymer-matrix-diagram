/**
*
*	FUNCTION: colorsChanged
*
*
*	DESCRIPTION:
*		- Event handler for changes to the color scale range.
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

// VARIABLES //

// See [D3 documentation]{@link https://github.com/mbostock/d3/wiki/Ordinal-Scales#category10}.
var OPTS = [
	'category10',
	'category20',
	'category20b',
	'category20c'
];


// WATCHER //

/**
* FUNCTION: colorsChanged( val[, newVal] )
*	Event handler for changes to the color scale range.
*
* @param {String|Array} val - change event value
* @param {String|Array} [newVal] - new color scale domain
*/
function colorsChanged( val, newVal ) {
	/* jslint validthis:true */
	var err;
	if ( arguments.length > 1 ) {
		if ( typeof newVal === 'string' ) {
			if ( OPTS.indexOf( newVal ) === -1 ) {
				err = new TypeError( 'colors::invalid assignment. Unrecognized color set. Value: `' + newVal + '`.' );
				this.fire( 'err', err );
				this.colors = val;
				return;
			}
		}
		else if ( !Array.isArray( newVal ) ) {
			err = new TypeError( 'colors::invalid assignment. Colors must be an `array` of strings or a recognized color set. Value: `' + newVal + '`.' );
			this.fire( 'err', err );
			this.colors = val;
			return;
		}
	}
	if ( typeof this.colors === 'string' ) {
		this._colors = this._d3.scale[ this.colors ]().range();
	} else {
		this._colors = this.colors.slice();
	}
	this._cScale.range( this._colors );

	if ( this.autoUpdate ) {
		this.$.cells.attr( 'fill', this._color );
	}
	this.fire( 'colors', {
		'type': 'changed'
	});
	if ( newVal === void 0 ) {
		this.fire( 'change', {
			'attr': 'colors',
			'data': val[ 0 ]
		});
	} else {
		this.fire( 'change', {
			'attr': 'colors',
			'prev': val,
			'curr': newVal
		});
	}
} // end FUNCTION colorsChanged()


// EXPORTS //

module.exports = colorsChanged;
