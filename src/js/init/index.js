/**
*
*	FUNCTION: init
*
*
*	DESCRIPTION:
*		- Performs element initialization.
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

/* global document */
'use strict';

// MODULES //

var delayed = require( './../utils/delayed.js' ),
	events = require( './../events' );


// VARIABLES //

var create = document.createElement.bind( document );


// INIT //

/**
* METHOD: init()
*	Initialization.
*
* @returns {Object} context
*/
function init() {
	/* jslint validthis:true */
	var d3, el, $;

	// Create a new D3 element to access the library dependency:
	el = create( 'polymer-d3' );
	d3 = el.d3;
	this._d3 = d3;

	// Create a new uuid element to access the library dependency for creating uuids:
	el = create( 'polymer-uuid' );
	this._uuid = el.uuid;

	// Assign the chart a private uuid:
	this.__uid__ = this._uuid.v4();

	// Initialize attributes...

	// Config: (hint an object)
	this.config = {};

	// Events:
	this.events = events.slice();

	// Data:
	this.data = null;
	this.rowOrder = [];
	this.colOrder = [];

	// Colors:
	this.colors = [ '#474747' ];
	this.colorOrder = null;

	// Private attributes...

	this._rowOrder = null;
	this._colOrder = null;

	this._colors = this.colors.slice();
	this._colorOrder = [];

	// Row and column name font size:
	this._maxFontSize = 16; // px

	// Max row and column name lengths...
	this._maxRowTextLength = 0;
	this._maxColTextLength = 0;

	// Padding...
	this._minPadding = 40; // px
	this._paddingLeft = this._minPadding;
	this._paddingRight = this._minPadding;
	this._paddingTop = this._minPadding;
	this._paddingBottom = this._minPadding;

	// Private methods...

	// Scales...
	this._xScale = d3.scale.ordinal()
		.rangeBands( [ 0, this.graphWidth() ] )
		.domain( [ 0 ] );
	this._yScale = d3.scale.ordinal()
		.rangeBands( [ 0, this.graphHeight() ] )
		.domain( [ 0 ] );
	this._zScale = d3.scale.linear()
		.domain( [ 0, 1 ] )
		.range( [ 0, 1 ] )
		.clamp( true );
	this._cScale = d3.scale.ordinal()
		.domain( this._colorOrder )
		.range( this._colors );

	// Labels:
	this._getRowName = this.getRowName.bind( this );
	this._getColName = this.getColName.bind( this );

	// Marks...
	this._x = this.x.bind( this );
	this._y = this.y.bind( this );
	this._z = this.z.bind( this );

	this._color = this.color.bind( this );

	this._cx = this.cx.bind( this );

	this._createCells = this.createCells.bind( this );
	this._resetCells = this.resetCells.bind( this );

	// Transitions...
	this._onTransitionEnd = this.onTransitionEnd.bind( this );

	// Interaction...
	this._onRowHover = this.onRowHover.bind( this );
	this._onColHover = this.onColHover.bind( this );
	this._onCellHover = this.onCellHover.bind( this );

	this._onRowHoverEnd = this.onRowHoverEnd.bind( this );
	this._onColHoverEnd = this.onColHoverEnd.bind( this );
	this._onCellHoverEnd = this.onCellHoverEnd.bind( this );

	this._onRowClick = this.onRowClick.bind( this );
	this._onColClick = this.onColClick.bind( this );
	this._onCellClick = this.onCellClick.bind( this );

	this._onResize = delayed( this.onResize.bind( this ), 400 );

	// Brush...
	this._brush = d3.svg.brush()
		.x( this._xScale )
		.y( this._yScale )
		.on( 'brushend', this.onBrushEnd.bind( this ) );

	// Drag...
	this._rowDrag = d3.behavior.drag()
		.on( 'dragstart', this.onRowDragStart.bind( this ) )
		.on( 'drag', this.onRowDrag.bind( this ) )
		.on( 'dragend', this.onRowDragEnd.bind( this ) );

	this._colDrag = d3.behavior.drag()
		.on( 'dragstart', this.onColDragStart.bind( this ) )
		.on( 'drag', this.onColDrag.bind( this ) )
		.on( 'dragend', this.onColDragEnd.bind( this ) );

	this._active = {
		'row': null,
		'col': null,
		'cells': null,
		'x': null,
		'y': null,
		'dragging': false
	};

	// Element cache...
	this.$ = $ = {};

	// Base elements...
	$.root = null;
	$.canvas = null;
	$.graph = null;
	$.bkgd = null;
	$.text = null;

	// Axis elements...
	$.xAxis = null;
	$.yAxis = null;
	$.xLabel = null;
	$.yLabel = null;

	// Data elements...
	$.marks = null;
	$.rows = null;
	$.cols = null;
	$.cells = null;

	// Grid lines...
	$.rowGridlines = null;
	$.colGridlines = null;

	// Names...
	$.rownames = null;
	$.colnames = null;

	// Brush...
	$.brush = null;

	return this;
} // end FUNCTION init()


// EXPORTS //

module.exports = init;
