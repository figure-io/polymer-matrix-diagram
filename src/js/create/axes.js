/**
*
*	FUNCTION: createAxes
*
*
*	DESCRIPTION:
*		- Creates chart axis elements.
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
* FUNCTION: createAxes()
*	Creates the chart axis elements.
*
* @returns {Object} context
*/
function createAxes() {
	/* jslint validthis:true */
	var graph = this.$.graph,
		axis;

	// Remove any existing axes...
	if ( this.$.xAxis ) {
		this.$.xAxis.remove();
	}
	if ( this.$.yAxis ) {
		this.$.yAxis.remove();
	}
	axis = graph.append( 'svg:g' )
		.attr( 'property', 'axis' )
		.attr( 'class', 'x axis' );
	this.$.xAxis = axis;

	this.$.xLabel = axis.append( 'svg:text' )
		.attr( 'property', 'axis.label' )
		.attr( 'class', 'label noselect' )
		.attr( 'text-anchor', 'middle' )
		.attr( 'x', this.graphWidth() / 2 )
		.attr( 'y', -(this._maxColTextLength+16) )
		.text( this.xLabel );

	axis = graph.append( 'svg:g' )
		.attr( 'property', 'axis' )
		.attr( 'class', 'y axis' );

	this.$.yLabel = axis.append( 'svg:text' )
		.attr( 'property', 'axis.label' )
		.attr( 'class', 'label noselect' )
		.attr( 'text-anchor', 'middle' )
		.attr( 'transform', 'rotate(-90)' )
		.attr( 'x', -this.graphHeight() / 2 )
		.attr( 'y', -(this._maxRowTextLength+16) )
		.text( this.xLabel );

	return this;
} // end METHOD createAxes()


// EXPORTS //

module.exports = createAxes;
