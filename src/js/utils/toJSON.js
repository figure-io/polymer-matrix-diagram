/**
*
*	FUNCTION: toJSON
*
*
*	DESCRIPTION:
*		- Returns a chart configuration object in accordance with the `matrix-diagram` specification.
*
*
*	NOTES:
*		[1] See [matrix-diagram-spec]{@link https://github.com/figure-io/matrix-diagram-spec}.
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

// MODULES //

var validate = require( 'matrix-diagram-spec' );


// TOJSON //

/**
* FUNCTION: toJSON()
*	Returns a matrix diagram configuration object in accordance with the `matrix-diagram` [specification]{@link https://github.com/figure-io/matrix-diagram-spec}.
*
* @returns {Object} configuration object
*/
function toJSON() {
	/* jslint validthis:true */
	var config = validate.template(),
		dname = '__dataframe__';

	// DATA //

	if ( !this.data ) {
		return config;
	}
	config.data = [];
	config.data[ 0 ] = {};
	config.data[ 0 ].name = dname;
	config.data[ 0 ].rownames = this.data.rownames().slice();
	config.data[ 0 ].colnames = this.data.colnames().slice();
	// FIXME: update to df.copy(). Need ability to deep copy.
	config.data[ 0 ].values = JSON.parse( JSON.stringify( this.data.data() ) );

	// CANVAS //

	config.canvas.width = this.width;
	config.canvas.height = this.height;
	config.canvas.padding.left = this.paddingLeft;
	config.canvas.padding.right = this.paddingRight;
	config.canvas.padding.top = this.paddingTop;
	config.canvas.padding.bottom = this.paddingBottom;

	// SCALES //

	config.scales.x.domain = this._xScale.domain().slice();
	config.scales.y.domain = this._yScale.domain().slice();
	config.scales.z.domain.min = this.zMin;
	config.scales.z.domain.max = this.zMax;
	// TODO: zRangeMin, zRangeMax
	config.scales.color.domain = this._cScale.domain().slice();
	config.scales.color.range = this._cScale.range().slice();

	// AXES //

	config.axes.x.label = this.xLabel;
	config.axes.y.label = this.yLabel;

	// MARKS //

	config.marks[ 0 ].data.name = dname;
	// TODO: need to fcn.toString() and regexp to get the field
	// config.marks[ 0 ].properties.fill.field = this.cValue;
	// TODO: need to fcn.toString() and regexp to get the field
	// config.marks[ 0 ].properties.fillOpacity.field = this.zValue;

	// LEGEND //

	// TODO: implement this once legends are implemented in the chart generator
	// config.legend.fill.label = this. ;
	// config.legend.fillOpacity.label = this. ;

	// BRUSHES //

	// TODO: implement this once brushes are implemented in the chart generator
	config.brushes = undefined;

	// SETTINGS //

	config.settings.autoResize = this.autoResize;
	config.settings.autoUpdate = this.autoUpdate;
	config.settings.transitions.duration = this.duration;
	config.settings.interactions.brushable = this.isBrushable;
	// TODO: once brushableRows lands
	// config.settings.interactions.brushableRows = this.isBrushableRows;
	// TODO: once brushableCols lands
	// config.settings.interactions.brushableCols = this.isBrushableCols;
	config.settings.interactions.sortableRows = this.isSortableRows;
	config.settings.interactions.sortableCols = this.isSortableCols;
	// TODO: once resizable lands
	// config.settings.interactions.resizable = this.isResizable;

	// VALIDATE //
	if ( !validate( config )  ) {
		console.dir( validate.errors );
		throw new Error( 'toJSON()::internal error. Invalid configuration. Please fill an issue, along with the errors printed to the console, @ https://github.com/figure-io/polymer-matrix-diagram/issues .' );
	}
	return config;
} // end METHOD toJSON()


// EXPORTS //

module.exports = toJSON;
