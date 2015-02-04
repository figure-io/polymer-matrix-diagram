/**
*
*	FUNCTION: createBase
*
*
*	DESCRIPTION:
*		- Creates a chart base.
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
* FUNCTION: createBase()
*	Creates the chart base.
*
* @returns {Object} context
*/
function createBase() {
	/* jslint validthis:true */
	var pLeft,
		pTop,
		canvas;

	// Only cache the root element once (should not change)...
	if ( !this.$.root ) {
		this.$.root = this._d3.select( this.$.chart );
	}
	// Remove any existing canvas...
	if ( this.$.canvas ) {
		this.$.canvas.remove();
	}
	// Get the padding values:
	pLeft = ( this.paddingLeft === null ) ? this._paddingLeft : this.paddingLeft;
	pTop = ( this.paddingTop === null ) ? this._paddingTop : this.paddingTop;

	// Create the SVG element:
	canvas = this.$.root.append( 'svg:svg' )
		.attr( 'property', 'canvas' )
		.attr( 'class', 'canvas' )
		.attr( 'width', this.width )
		.attr( 'height', this.height );
	this.$.canvas = canvas;

	// Create a text element for auto-computing padding based on row and column names:
	this.$.text = canvas.append( 'svg:text' )
		.attr( 'class', 'noselect' )
		.attr( 'font-size', this._maxFontSize )
		.attr( 'x', 6 )
		.attr( 'y', 0 )
		.attr( 'dy', '.32em' )
		.attr( 'text-anchor', 'start' )
		.attr( 'opacity', 0 );

	this.$.text = this.$.text.node();

	// Create the graph element:
	this.$.graph = canvas.append( 'svg:g' )
		.attr( 'property', 'graph' )
		.attr( 'class', 'graph' )
		.attr( 'data-graph-type', 'matrix-diagram' )
		.attr( 'transform', 'translate(' + pLeft + ',' + pTop + ')' );

	return this;
} // end FUNCTION createBase()


// EXPORTS //

module.exports = createBase;
