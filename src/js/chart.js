/**
*
*	CHART
*
*
*	DESCRIPTION:
*		- Defines the chart prototype.
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

var // Utility to create delayed event listeners:
	delayed = require( './utils/delayed.js' );


// VARIABLES //

var EVENTS = [
	'data',
	'roworder',
	'colorder',

	'width',
	'height',
	'zmin',
	'zmax',

	'change',
	'err',

	'resized',

	'clicked',
	'clicked.row',
	'clicked.col',
	'clicked.cell',

	'hover',
	'hover.row',
	'hover.col',
	'hover.cell',

	'hoverend',
	'hoverend.row',
	'hoverend.col',
	'hoverend.cell',

	'transitionended',

	'brushend'
];


// CHART //

/**
* FUNCTION: Chart()
*	Chart constructor.
*
* @constructor
* @returns {Chart} Chart instance
*/
function Chart() {
	if ( !( this instanceof Chart ) ) {
		return new Chart();
	}
	return this;
} // end FUNCTION Chart()

/**
* ATTRIBUTE: paddingLeft
*	Chart canvas left padding.
*
* @type {Null|Number}
* @default null
*/
Chart.prototype.paddingLeft = null;

/**
* ATTRIBUTE: paddingRight
*	Chart canvas right padding.
*
* @type {Null|Number}
* @default null
*/
Chart.prototype.paddingRight = null;

/**
* ATTRIBUTE: paddingBottom
*	Chart canvas bottom padding.
*
* @type {Null|Number}
* @default null
*/
Chart.prototype.paddingBottom = null;

/**
* ATTRIBUTE: paddingTop
*	Chart canvas top padding.
*
* @type {Null|Number}
* @default null
*/
Chart.prototype.paddingTop = null;

/**
* ATTRIBUTE: width
*	Chart canvas width. If not explicitly set, defaults to the width of the parent node.
*
* @type {Number}
* @default null
*/
Chart.prototype.width = null;

/**
* ATTRIBUTE: height
*	Chart canvas height. If not explicitly set, defaults to the height of the parent node.
*
* @type {Number}
* @default null
*/
Chart.prototype.height = null;

/**
* ATTRIBUTE: xLabel
*	Column label.
*
* @type {String}
* @default ''
*/
Chart.prototype.xLabel = '';

/**
* ATTRIBUTE: yLabel
*	Row label.
*
* @type {String}
* @default ''
*/
Chart.prototype.yLabel = '';

/**
* ATTRIBUTE: zValue
*	z-value accessor. If set to a function, the accessor is used to map z-values to a linear scale for fill-opacity.
*
* @type {Number|Function}
* @default 1
*/
Chart.prototype.zValue = 1;

/**
* ATTRIBUTE: zMin
*	Minimum z-limit. If `null`, the limit is computed from the data.
*
* @type {Null|Number}
* @default null
*/
Chart.prototype.zMin = null;

/**
* ATTRIBUTE: zMax
*	Maximum z-limit. If `null`, the limit is computed from the data.
*
* @type {Null|Number}
* @default null
*/
Chart.prototype.zMax = null;

/**
* METHOD: colorScale( d, i )
*	Maps a cell datum to a color.
*
* @param {*} d - datum
* @param {Number} i - index
* @returns {String} color string
*/
Chart.prototype.colorScale = function(){
	return '#474747';
}; // end METHOD colorScale()

/**
* ATTRIBUTE: duration
*	Transition duration.
*
* @type {Number}
* @default 2500 milliseconds
*/
Chart.prototype.duration = 2500; // ms

/**
* ATTRIBUTE: autoUpdate
*	Boolean flag indicating whether a chart should auto update DOM elements whenever an attribute changes.
*
* @type {Boolean}
* @default true
*/
Chart.prototype.autoUpdate = true;

/**
* ATTRIBUTE: autoResize
*	Boolean flag indicating whether a chart should auto resize when the window resizes.
*
* @type {Boolean}
* @default true
*/
Chart.prototype.autoResize = true;

/**
* ATTRIBUTE: brushable
*	Boolean flag indicating whether a chart is brushable.
*
* @type {Boolean}
* @default false
*/
Chart.prototype.brushable = false;

/**
* ATTRIBUTE: sortableRows
*	Boolean flag indicating whether rows can be manually sorted.
*
* @type {Boolean}
* @default false
*/
Chart.prototype.sortableRows = false;

/**
* ATTRIBUTE: sortableCols
*	Boolean flag indicating whether columns can be manually sorted.
*
* @type {Boolean}
* @default false
*/
Chart.prototype.sortableCols = false;

/**
* METHOD: created()
*	Polymer hook that is called when an element is created.
*/
Chart.prototype.created = function() {
	this.init();
}; // end METHOD created()

/**
* METHOD: init()
*	Initialization.
*/
Chart.prototype.init = function() {
	var create = document.createElement.bind( document ),
		d3,
		el,
		$;

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

	// Events: (hint an array)
	this.events = EVENTS;

	// Data:
	this.data = null;
	this.rowOrder = [];
	this.colOrder = [];
	this._rowOrder = null;
	this._colOrder = null;

	// Private attributes...

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

	// Labels:
	this._getRowName = this.getRowName.bind( this );
	this._getColName = this.getColName.bind( this );

	// Marks...
	this._x = this.x.bind( this );
	this._y = this.y.bind( this );
	this._z = this.z.bind( this );

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

	// TODO: define
	this._colDrag = null;

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
}; // end METHOD init()

/**
* METHOD: attached()
*	Polymer hook that is called when the element is inserted in the DOM.
*/
Chart.prototype.attached = function() {
	this.create().addListeners();
}; // end METHOD attached()

/**
* METHOD: detached()
*	Polymer hook that is called when the element is removed from the DOM.
*/
Chart.prototype.detached = function() {
	this.removeListeners();
}; // end METHOD detached()

/**
* METHOD: addListeners()
*	Adds event listeners.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.addListeners = function() {
	this.removeListeners();
	if ( this.autoResize ) {
		window.addEventListener( 'resize', this._onResize, false );
	}
	return this;
}; // end METHOD addListeners()

/**
* METHOD: removeListeners()
*	Removes event listeners.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.removeListeners = function() {
	window.removeEventListener( 'resize', this._onResize );
	return this;
}; // end METHOD removeListeners()

/**
* METHOD: create()
*	Creates a chart.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.create = function() {
	// Ensure that the width and height are set before creating a chart...
	this.width = this.width || this.clientWidth || this.parentNode.clientWidth || 600;
	this.height = this.height || this.clientHeight || this.parentNode.clientHeight || 400;

	// Create the chart layers...
	this
		.createBase()
		.createBackground()
		.createMarks()
		.createAxes()
		.createBrush();

	return this;
}; // end METHOD create()

/**
* METHOD: createBase()
*	Creates the chart base.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.createBase = function() {
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
}; // end METHOD createBase()

/**
* METHOD: createBackground()
*	Creates a background element.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.createBackground = function() {
	// Remove any existing background...
	if ( this.$.bkgd ) {
		this.$.bkgd.remove();
	}
	this.$.bkgd = this.$.graph.append( 'svg:rect' )
		.attr( 'class', 'background' )
		.attr( 'x', 0 )
		.attr( 'y', 0 )
		.attr( 'width', this.graphWidth() )
		.attr( 'height', this.graphHeight() );

	return this;
}; // end METHOD createBackground()

/**
* METHOD: createMarks()
*	Creates the graph marks.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.createMarks = function() {
	if ( this.$.marks ) {
		this.$.marks.remove();
	}
	this.$.marks = this.$.graph.append( 'svg:g' )
		.attr( 'property', 'marks' )
		.attr( 'class', 'marks' );

	this.createRows()
		.createCols();

	return this;
}; // end METHOD createMarks()

/**
* METHOD: createRows()
*	Creates row elements.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.createRows = function() {
	var rows = this.$.marks.selectAll( '.row' )
		.data( (this.data) ? this.data.rownames() : [] )
		.enter()
		.append( 'svg:g' )
			.attr( 'class', 'row' )
			.attr( 'transform', this._y )
			.on( 'mouseover', this._onRowHover )
			.on( 'mouseout', this._onRowHoverEnd );

	rows.append( 'svg:line' )
		.attr( 'class', 'grid x' )
		.attr( 'x1', this.graphWidth() );

	rows.append( 'svg:text' )
		.attr( 'class', 'noselect name' )
		.attr( 'x', -6 )
		.attr( 'y', this._yScale.rangeBand() / 2 )
		.attr( 'dy', '.32em' )
		.attr( 'text-anchor', 'end' )
		.attr( 'font-size', this.fontSize() )
		.text( this._getRowName )
		.on( 'click', this._onRowClick );

	// Cache references to created elements:
	this.$.rows = rows;
	this.$.rowGridlines = rows.selectAll( '.grid.x' );
	this.$.rownames = rows.selectAll( '.name' );

	// Create the row cells:
	rows.each( this._createCells );

	this.$.cells = rows.selectAll( '.cell' );

	return this;
}; // end METHOD createRows()

/**
* METHOD: createCols()
*	Creates column elements.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.createCols = function() {
	var cols = this.$.marks.selectAll( '.col' )
		.data( (this.data) ? this.data.colnames() :  [] )
		.enter()
		.append( 'svg:g' )
			.attr( 'class', 'col y' )
			.attr( 'transform', this._x )
			.on( 'mouseover', this._onColHover )
			.on( 'mouseout', this._onColHoverEnd );

	cols.append( 'svg:line' )
		.attr( 'class', 'grid y' )
		.attr( 'x1', -this.graphHeight() );

	cols.append( 'svg:text' )
		.attr( 'class', 'noselect name' )
		.attr( 'x', 6 )
		.attr( 'y', this._xScale.rangeBand() / 2 )
		.attr( 'dy', '.32em' )
		.attr( 'text-anchor', 'start' )
		.attr( 'font-size', this.fontSize() )
		.text( this._getColName )
		.on( 'click', this._onColClick );

	// Cache references to created elements:
	this.$.cols = cols;
	this.$.colGridlines = cols.selectAll( '.grid.y' );
	this.$.colnames = cols.selectAll( '.name' );

	return this;
}; // end METHOD createCols()

/**
* METHOD: createCells( d, i )
*	Create cell elements.
*
* @param {String} d - row name
* @param {Number} i - row index
* @returns {DOMElement} element instance
*/
Chart.prototype.createCells = function( d, i ) {
	var row = this._d3.select( this.$.rows[0][i] );

	row.selectAll( '.cell' )
		.data( this.data.data()[i] )
		.enter()
		.append( 'svg:rect' )
			.attr( 'class', 'cell' )
			.attr( 'x', this._cx )
			.attr( 'width', this._xScale.rangeBand() )
			.attr( 'height', this._yScale.rangeBand() )
			.attr( 'fill-opacity', ( typeof this.zValue === 'function' ) ? this._z : this.zValue )
			.attr( 'fill', this.colorScale )
			.on( 'mouseover', this._onCellHover )
			.on( 'mouseout', this._onCellHoverEnd )
			.on( 'click', this._onCellClick );

	return this;
}; // end METHOD createCells()

/**
* METHOD: createAxes()
*	Creates the chart axis elements.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.createAxes = function() {
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
}; // end METHOD createAxes()

/**
* METHOD: createBrush()
*	Creates a brush element which overlays the graph marks.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.createBrush = function() {
	this.$.brush = this.$.graph.append( 'svg:g' )
		.attr( 'property', 'brush' )
		.attr( 'class', 'brush' );

	return this;
}; // end METHOD createBrush()

/**
* METHOD: reset()
*	Resets chart elements.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.reset = function() {
	this.resetBase()
		.resetAxes()
		.resetRows()
		.resetCols();
	return this;
}; // end METHOD reset()

/**
* METHOD: resetBase()
*	Resets base elements.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.resetBase = function() {
	var pLeft, pTop;

	pLeft = ( this.paddingLeft === null ) ? this._paddingLeft : this.paddingLeft;
	pTop = ( this.paddingTop === null ) ? this._paddingTop : this.paddingTop;

	this.$.graph
		.attr( 'transform', 'translate(' + pLeft + ',' + pTop + ')' );

	this.$.bkgd
		.attr( 'width', this.graphWidth() )
		.attr( 'height', this.graphHeight() );
	return this;
}; // end METHOD resetBase()

/**
* METHOD: resetAxes()
*	Resets axis elements.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.resetAxes = function() {
	this.$.xLabel
		.attr( 'x', this.graphWidth() / 2 )
		.attr( 'y', -(this._maxColTextLength+16) );

	this.$.yLabel
		.attr( 'x', -this.graphHeight() / 2 )
		.attr( 'y', -(this._maxRowTextLength+16) );

	return this;
}; // end METHOD resetAxes()

/**
* METHOD: resetRows()
*	Resets row elements.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.resetRows = function() {
	// Bind the data and update existing rows:
	var rows, gEnter;

	rows = this.$.marks.selectAll( '.row' )
		.data( this.data.rownames() )
		.attr( 'transform', this._y );

	// Remove any old rows:
	rows.exit().remove();

	// Add any new rows:
	gEnter = rows.enter().append( 'svg:g' )
		.attr( 'class', 'row' )
		.attr( 'transform', this._y )
		.on( 'mouseover', this._onRowHover )
		.on( 'mouseout', this._onRowHoverEnd );

	gEnter.append( 'svg:line' )
		.attr( 'class', 'grid x' )
		.attr( 'x1', this.graphWidth() );

	gEnter.append( 'svg:text' )
		.attr( 'class', 'noselect name' )
		.attr( 'x', -6 )
		.attr( 'y', this._yScale.rangeBand() / 2 )
		.attr( 'dy', '.32em' )
		.attr( 'text-anchor', 'end' )
		.attr( 'font-size', this.fontSize() )
		.text( this._getRowName )
		.on( 'click', this._onRowClick );

	// Update the cache references to row elements:
	this.$.rows = rows;
	this.$.rowGridlines = rows.selectAll( '.grid.x' );
	this.$.rownames = rows.selectAll( '.name' );

	// Create the row cells:
	rows.each( this._resetCells );

	this.$.cells = rows.selectAll( '.cell' );

	return this;
}; // end METHOD resetRows()

/**
* METHOD: resetCols()
*	Resets column elements.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.resetCols = function() {
	// Bind the data and update existing columns:
	var cols, gEnter;

	cols = this.$.marks.selectAll( '.col' )
		.data( this.data.colnames() )
		.attr( 'transform', this._x );

	// Remove any old columns:
	cols.exit().remove();

	// Add any new columns:
	gEnter = cols.enter().append( 'svg:g' )
		.attr( 'class', 'col' )
		.attr( 'transform', this._x )
		.on( 'mouseover', this._onColHover )
		.on( 'mouseout', this._onColHoverEnd );

	gEnter.append( 'svg:line' )
		.attr( 'class', 'grid y' )
		.attr( 'x1', -this.graphHeight() );

	gEnter.append( 'svg:text' )
		.attr( 'class', 'noselect name' )
		.attr( 'x', 6 )
		.attr( 'y', this._xScale.rangeBand() / 2 )
		.attr( 'dy', '.32em' )
		.attr( 'text-anchor', 'start' )
		.attr( 'font-size', this.fontSize() )
		.text( this._getColName )
		.on( 'click', this._onColClick );

	// Cache a reference to the columns:
	this.$.cols = cols;
	this.$.colGridlines = cols.selectAll( '.grid.y' );
	this.$.colnames = cols.selectAll( '.name' );

	return this;
}; // end METHOD resetCols()

/**
* METHOD: resetCells( d, i )
*	Resets cell elements.
*
* @param {String} d - row name
* @param {Number} i - row index
* @returns {DOMElement} element instance
*/
Chart.prototype.resetCells = function( d, i ) {
	var row, cells;

	row = this._d3.select( this.$.rows[0][i] );

	cells = row.selectAll( '.cell' )
		.data( this.data.data()[i] )
		.attr( 'x', this._cx )
		.attr( 'fill-opacity', ( typeof this.zValue === 'function' ) ? this._z : this.zValue )
		.attr( 'fill', this.colorScale );

	// Remove any old cells:
	cells.exit().remove();

	// Add any new cells:
	cells.enter().append( 'svg:rect' )
		.attr( 'class', 'cell' )
		.attr( 'x', this._cx )
		.attr( 'width', this._xScale.rangeBand() )
		.attr( 'height', this._yScale.rangeBand() )
		.attr( 'fill-opacity', ( typeof this.zValue === 'function' ) ? this._z : this.zValue )
		.attr( 'fill', this.colorScale )
		.on( 'mouseover', this._onCellHover )
		.on( 'mouseout', this._onCellHoverEnd )
		.on( 'click', this._onCellClick );

	return this;
}; // end METHOD resetCells()

/**
* METHOD: clear()
*	Clears the chart.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.clear = function() {
	this.$.rows.remove();
	this.$.cols.remove();
	this._brush.clear();
	return this;
}; // end METHOD clear()

/**
* METHOD: graphWidth()
*	Returns the graph width.
*
* @returns {Number} graph width
*/
Chart.prototype.graphWidth = function() {
	var pLeft, pRight;

	pLeft = ( this.paddingLeft === null ) ? this._paddingLeft : this.paddingLeft;
	pRight = ( this.paddingRight === null ) ? this._paddingRight : this.paddingRight;

	return this.width - pLeft - pRight;
}; // end METHOD graphWidth()

/**
* METHOD: graphHeight()
*	Returns the graph height.
*
* @returns {Number} graph height
*/
Chart.prototype.graphHeight = function() {
	var pTop, pBottom;

	pTop = ( this.paddingTop === null ) ? this._paddingTop : this.paddingTop;
	pBottom = ( this.paddingBottom === null ) ? this._paddingBottom : this.paddingBottom;

	return this.height - pTop - pBottom;
}; // end METHOD graphHeight()

/**
* METHOD: x( d, i )
*	Maps a column to a pixel value.
*
* @param {Array} d - datum
* @param {Number} i - index
* @returns {String} transform string
*/
Chart.prototype.x = function( d, i ) {
	return 'translate(' + this._xScale( i ) + ')rotate(-90)';
}; // end METHOD x()

/**
* METHOD: y( d, i )
*	Maps a row to a pixel value.
*
* @param {Array} d - datum
* @param {Number} i - index
* @returns {String} transform string
*/
Chart.prototype.y = function( d, i ) {
	return 'translate(0,' + this._yScale( i ) + ')';
}; // end METHOD y()

/**
* METHOD: z( d, i )
*	Maps a datum to a fill-opacity value.
*
* @param {Array} d - datum
* @param {Number} i - index
* @returns {Number} fill opacity
*/
Chart.prototype.z = function( d, i ) {
	return this._zScale( this.zValue( d, i ) );
}; // end METHOD z()

/**
* METHOD: cx( d, i )
*	Maps a row cell to a pixel value.
*
* @param {Array} d - datum
* @param {Number} i - index
* @returns {String} transform string
*/
Chart.prototype.cx = function( d, i ) {
	return this._xScale( i );
}; // end METHOD cx()

/**
* METHOD: getRowName( d, i )
*	Returns a row name.
*
* @param {Array} d - datum
* @param {Number} i - index
* @returns {String} row name
*/
Chart.prototype.getRowName = function( d ) {
	return d;
}; // end METHOD getRowName()

/**
* METHOD: getColName( d, i )
*	Returns a column name.
*
* @param {Array} d - datum
* @param {Number} i - index
* @returns {String} column name
*/
Chart.prototype.getColName = function( d ) {
	return d;
}; // end METHOD getColName()

/**
* METHOD: zDomain( min, max )
*	Computes the z-domain.
*
* @param {Null|Number} min - minimum value
* @param {Null|Number} max - maximum value
* @returns {Array} domain
*/
Chart.prototype.zDomain = function( min, max ) {
	var d3 = this._d3,
		data = this.data.data(),
		zValue = this.zValue,
		err;

	if ( typeof zValue !== 'function' ) {
		return [ this.zMin, this.zMax ];
	}
	if ( min !== null && ( typeof min !== 'number' || min !== min ) ) {
		err = new TypeError( 'zDomain()::invalid input argument. Minimum value must be numeric or `null`. Value: `' + min + '`.' );
		this.fire( 'err', err );
		return;
	}
	if ( max !== null && ( typeof max !== 'number' || max !== max ) ) {
		err = new TypeError( 'zDomain()::invalid input argument. Maximum value must be numeric or `null`. Value: `' + max + '`.' );
		this.fire( 'err', err );
		return;
	}
	if ( min === null ) {
		min = d3.min( data, function onRow( row ) {
			return d3.min( row, zValue );
		});
	}
	if ( max === null ) {
		max = d3.max( data, function onRow( row ) {
			return d3.max( row, zValue );
		});
	}
	return [ min, max ];
}; // end METHOD zDomain()

/**
* METHOD: delay( d, i )
*	Computes the transition delay based on the element index.
*
* @param {*} d - datum
* @param {Number} i - index
* @returns {Number} transition delay in milliseconds
*/
Chart.prototype.delay = function( d, i ) {
	// NOTE: the scalar offset (e.g., 20) is something of a magic number, based more on feel than science.
	return i * 20;
}; // end METHOD delay()

/**
* METHOD: fontSize()
*	Computes the row and column label font size based on cell dimensions.
*
* @returns {Number} font size in pixels
*/
Chart.prototype.fontSize = function() {
	var dx, dy;
	dx = this._xScale.rangeBand();
	dy = this._yScale.rangeBand();
	if ( dx > dy ) {
		dx = dy;
	}
	if ( dx > 18 ) {
		// Return the font-size upper bound:
		return this._maxFontSize;
	}
	return dx - 2;
}; // end METHOD fontSize()

/**
* METHOD: calculatePadding()
*	Computes padding values based on row and column name computed text length.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.calculatePadding = function() {
	var text = this.$.text,
		min = this._minPadding,
		scalar = 16,
		names,
		max,
		len,
		h,
		i;

	if ( !this.data ) {
		return this;
	}
	// NOTE: the `scalar` is something of a magic number to avoid pushing up against the canvas edge and crowding axis labels.

	// Rows...
	names = this.data.rownames();

	max = min;
	for ( i = 0; i < names.length; i++ ) {
		text.textContent = names[ i ];
		len = text.getComputedTextLength();
		if ( len > max ) {
			max = len;
		}
	}
	h = this.$.yLabel.node().getBBox().height;
	if ( h ) {
		h += 10;
	}
	this._paddingLeft = Math.ceil( max+scalar+h );

	// Columns...
	names = this.data.colnames();

	max = min;
	for ( i = 0; i < names.length; i++ ) {
		text.textContent = names[ i ];
		len = text.getComputedTextLength();
		if ( len > max ) {
			max = len;
		}
	}
	h = this.$.xLabel.node().getBBox().height;
	if ( h ) {
		h += 10;
	}
	this._paddingTop = Math.ceil( max+scalar+h );

	// Reset the text content:
	text.textContent = '';

	return this;
}; // end METHOD calculatePadding()

/**
* METHOD: maxTextLengths()
*	Calculates the maximum row and column name lengths.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.maxTextLengths = function() {
	var text = this.$.text,
		selection,
		names,
		max,
		len,
		i;

	if ( !this.data ) {
		return this;
	}
	selection = this._d3.select( text );

	// Base calculations on the actual name font-size:
	selection.attr( 'font-size', this.fontSize() );

	// Rows...
	names = this.data.rownames();

	max = 0;
	for ( i = 0; i < names.length; i++ ) {
		text.textContent = names[ i ];
		len = text.getComputedTextLength();
		if ( len > max ) {
			max = len;
		}
	}
	this._maxRowTextLength = Math.ceil( max );

	// Columns...
	names = this.data.colnames();

	max = 0;
	for ( i = 0; i < names.length; i++ ) {
		text.textContent = names[ i ];
		len = text.getComputedTextLength();
		if ( len > max ) {
			max = len;
		}
	}
	this._maxColTextLength = Math.ceil( max );

	// Restore the text font-size:
	selection.attr( 'font-size', this._maxFontSize );

	// Reset the text content:
	text.textContent = '';

	return this;
}; // end METHOD maxTextLengths()

/**
* METHOD: validateOrder( arr )
*	Validates that an array of indices is a permutation.
*
* @param {Array} arr - array of indices
* @returns {Boolean} boolean indicating if valid
*/
Chart.prototype.validateOrder = function( arr ) {
	var len = arr.length,
		hash = {},
		range,
		key,
		i;

	// Build a hash of all indices, ensuring uniqueness...
	for ( i = 0; i < len; i++ ) {
		key = arr[ i ];
		if ( hash[ key ] ) {
			return false;
		}
		hash[ key ] = true;
	}
	// Create a unique ordered array of all possible indices:
	range = this._d3.range( len );

	// Confirm that the hash has every possible index...
	for ( i = 0; i < len; i++ ) {
		if ( !hash[ range[i] ] ) {
			return false;
		}
	}
	return true;
}; // end METHOD validateOrder()

/**
* METHOD: dataChanged( oldVal newVal )
*	Event handler invoked when the `data` attribute changes.
*
* @param {Array} oldVal - old value
* @param {Array} newVal - new value
*/
Chart.prototype.dataChanged = function( oldVal, newVal ) {
	var range = this._d3.range,
		len;

	// TODO: check if data frame.

	// [0] Set the domains:
	len = this.data.colnames().length;
	this._xScale.domain( range( len ) );

	len = this.data.rownames().length;
	this._yScale.domain( range( len ) );

	this._zScale.domain( this.zDomain( this.zMin, this.zMax ) );

	// [1] Compute padding values based on the row and column names:
	this.calculatePadding();

	// [2] Update the scales:
	this._xScale.rangeBands( [ 0, this.graphWidth() ] );
	this._yScale.rangeBands( [ 0, this.graphHeight() ] );

	// [3] Compute max text lengths based on the row and column names:
	this.maxTextLengths();

	if ( this.autoUpdate ) {
		// [4] Reset elements:
		this.reset();
	}
	this.fire( 'data', {
		'type': 'change'
	});
	this.fire( 'change', {
		'attr': 'data',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD dataChanged()

/**
* METHOD: rowOrderChanged( val[, newVal] )
*	Event handler invoked when the `rowOrder` attribute changes.
*
* @param {Array} val - change event value
* @param {Array} [newVal] - new array of indices defining the row order
*/
Chart.prototype.rowOrderChanged = function( val, newVal ) {
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
}; // end METHOD rowOrderChanged()

/**
* METHOD: colOrderChanged( val[, newVal] )
*	Event handler invoked when the `colOrder` attribute changes.
*
* @param {Array} val - change event value
* @param {Array} [newVal] - new array of indices defining the column order
*/
Chart.prototype.colOrderChanged = function( val, newVal ) {
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
}; // end METHOD colOrderChanged()

/**
* METHOD: configChanged( oldConfig, newConfig )
*	Event handler invoked when the `config` attribute changes.
*
* @param {Object} oldConfig - old config
* @param {Object} newConfig - new config
*/
Chart.prototype.configChanged = function( oldConfig, newConfig ) {
	var bool,
		err;

	if ( typeof newConfig !== 'object' || newConfig === null || Array.isArray( newConfig) ) {
		err = new TypeError( 'config::invalid assignment. Must be an `object`. Value: `' + newConfig + '`.' );
		this.fire( 'err', err );
		this.config = oldConfig;
		return;
	}
	// TODO: schema validator

	// Turn off auto-update:
	bool = this.autoUpdate;
	this.autoUpdate = false;

	// this.width = newConfig.canvas.width;
	// this.height = newConfig.canvas.height;

	// FIXME: The config should be standardized. Put in repo. Version it. Create an associated validator. NPM.

	this.fire( 'change', {
		'attr': 'config',
		'prev': oldConfig,
		'curr': newConfig
	});

	// Reset the auto update flag to its original value:
	this.autoUpdate = bool;

	// Only if auto update is enabled, redraw the chart...
	if ( bool ) {
		this.create();
	}
}; // end METHOD configChanged()

/**
* METHOD: widthChanged( oldVal, newVal )
*	Event handler invoked when the `width` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.widthChanged = function( oldVal, newVal ) {
	var width,
		fontSize,
		dx,
		err;
	if ( typeof newVal !== 'number' || newVal !== newVal || newVal <= 0 ) {
		err = new TypeError( 'width::invalid assignment. Must be a number greater than 0. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.width = oldVal;
		return;
	}
	width = this.graphWidth();

	// [0] Update the x-scale:
	this._xScale.rangeBands( [ 0, width ] );

	// [1] Recompute the row and column name text lengths:
	this.maxTextLengths();

	if ( this.$.canvas && this.autoUpdate ) {
		dx = this._xScale.rangeBand();
		fontSize = this.fontSize();

		// [2] Update the SVG canvas:
		this.$.canvas
			.attr( 'width', newVal );

		// [3] Update the background:
		this.$.bkgd
			.attr( 'width', width );

		// [4] Update the rows:
		this.$.rowGridlines
			.attr( 'x1', width );

		// [5] Update the columns:
		this.$.cols
			.attr( 'transform', this._x );

		// [6] Update the cells:
		this.$.cells
			.attr( 'x', this._cx )
			.attr( 'width', dx );

		// [7] Update the row and column names:
		this.$.rownames
			.attr( 'y', this._yScale.rangeBand() / 2 )
			.attr( 'font-size', fontSize );

		this.$.colnames
			.attr( 'y', dx / 2 )
			.attr( 'font-size', fontSize );

		// [8] Update the x- and y-labels:
		this.$.xLabel
			.attr( 'x', width / 2 )
			.attr( 'y', -(this._maxColTextLength+16) );

		this.$.yLabel
			.attr( 'y', -(this._maxRowTextLength+16) );
	}
	this.fire( 'width', {
		'type': 'change'
	});
	this.fire( 'change', {
		'attr': 'width',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD widthChanged()

/**
* METHOD: heightChanged( oldVal, newVal )
*	Event handler invoked when the `height` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.heightChanged = function( oldVal, newVal ) {
	var height,
		fontSize,
		dy,
		err;
	if ( typeof newVal !== 'number' || newVal !== newVal || newVal <= 0 ) {
		err = new TypeError( 'height::invalid assignment. Must be a number greater than 0. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.height = oldVal;
		return;
	}
	height = this.graphHeight();

	// [0] Update the y-scale:
	this._yScale.rangeBands( [ 0, height ] );

	// [1] Recompute the row and column name text lengths:
	this.maxTextLengths();

	if ( this.$.canvas && this.autoUpdate ) {
		dy = this._yScale.rangeBand();
		fontSize = this.fontSize();

		// [2] Update the SVG canvas:
		this.$.canvas
			.attr( 'height', newVal );

		// [3] Update the background:
		this.$.bkgd
			.attr( 'height', height );

		// [4] Update the rows:
		this.$.rows
			.attr( 'transform', this._y );

		// [5] Update the columns:
		this.$.colGridlines
			.attr( 'x1', -height );

		// [6] Update the cells:
		this.$.cells
			.attr( 'height', dy );

		// [7] Update the row and column names:
		this.$.rownames
			.attr( 'y', dy / 2 )
			.attr( 'font-size', fontSize );

		this.$.colnames
			.attr( 'y', this._xScale.rangeBand() / 2 )
			.attr( 'font-size', fontSize );

		// [8] Update the x- and y-labels:
		this.$.xLabel
			.attr( 'y', -(this._maxColTextLength+16) );

		this.$.yLabel
			.attr( 'x', -height / 2 )
			.attr( 'y', -(this._maxRowTextLength+16) );
	}
	this.fire( 'height', {
		'type': 'change'
	});
	this.fire( 'change', {
		'attr': 'height',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD heightChanged()

/**
* METHOD: paddingLeftChanged( oldVal, newVal )
*	Event handler invoked when the `paddingLeft` attribute changes.
*
* @param {Null|Number} oldVal - old value
* @param {Null|Number} newVal - new value
*/
Chart.prototype.paddingLeftChanged = function( oldVal, newVal ) {
	var width,
		pLeft,
		pRight,
		pTop,
		fontSize,
		dx,
		err;
	if ( newVal !== null && (typeof newVal !== 'number' || newVal !== newVal || newVal%1 !== 0 || newVal < 0) ) {
		err = new TypeError( 'paddingLeft::invalid assignment. Must be null or an integer greater than or equal to 0. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.paddingLeft = oldVal;
		return;
	}
	pLeft = ( newVal === null ) ? this._paddingLeft : newVal;
	pRight = ( this.paddingRight === null ) ? this._paddingRight : this.paddingRight;
	pTop = ( this.paddingTop === null ) ? this._paddingTop : this.paddingTop;

	width = this.width - pLeft - pRight;

	// [0] Update the x-scale:
	this._xScale.rangeBands( [ 0, width ] );

	// [1] Recompute the row and column name text lengths:
	this.maxTextLengths();

	if ( this.autoUpdate ) {
		dx = this._xScale.rangeBand();
		fontSize = this.fontSize();

		// [2] Update the background:
		this.$.bkgd
			.attr( 'width', width );

		// [3] Update the graph:
		this.$.graph
			.attr( 'transform', 'translate(' + pLeft + ',' + pTop + ')' );

		// [4] Update the rows:
		this.$.rowGridlines
			.attr( 'x1', width );

		// [5] Update the columns:
		this.$.cols
			.attr( 'transform', this._x );

		// [6] Update the cells:
		this.$.cells
			.attr( 'x', this._cx )
			.attr( 'width', dx );

		// [7] Update the row and column names:
		this.$.rownames
			.attr( 'y', this._yScale.rangeBand() / 2 )
			.attr( 'font-size', fontSize );

		this.$.colnames
			.attr( 'y', dx / 2 )
			.attr( 'font-size', fontSize );

		// [8] Update the x- and y-labels:
		this.$.xLabel
			.attr( 'x', width / 2 )
			.attr( 'y', -(this._maxColTextLength+16) );

		this.$.yLabel
			.attr( 'y', -(this._maxRowTextLength+16) );
	}
	this.fire( 'change', {
		'attr': 'paddingLeft',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD paddingLeftChanged()

/**
* METHOD: paddingRightChanged( oldVal, newVal )
*	Event handler invoked when the `padding` attribute changes.
*
* @param {Null|Number} oldVal - old value
* @param {Null|Number} newVal - new value
*/
Chart.prototype.paddingRightChanged = function( oldVal, newVal ) {
	var width,
		fontSize,
		dx,
		err;
	if ( newVal !== null && (typeof newVal !== 'number' || newVal !== newVal || newVal%1 !== 0 || newVal < 0) ) {
		err = new TypeError( 'paddingRight::invalid assignment. Must be null or an integer greater than or equal to 0. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.paddingRight = oldVal;
		return;
	}
	width = this.graphWidth();

	// [0] Update the x-scale:
	this._xScale.rangeBands( [ 0, width ] );

	// [1] Recompute the row and column name text lengths:
	this.maxTextLengths();

	if ( this.autoUpdate ) {
		dx = this._xScale.rangeBand();
		fontSize = this.fontSize();

		// [2] Update the background:
		this.$.bkgd
			.attr( 'width', width );

		// [3] Update the rows:
		this.$.rowGridlines
			.attr( 'x1', width );

		// [4] Update the columns:
		this.$.cols
			.attr( 'transform', this._x );

		// [5] Update the cells:
		this.$.cells
			.attr( 'x', this._cx )
			.attr( 'width', dx );

		// [6] Update the row and column names:
		this.$.rownames
			.attr( 'y', this._yScale.rangeBand() / 2 )
			.attr( 'font-size', fontSize );

		this.$.colnames
			.attr( 'y', dx / 2 )
			.attr( 'font-size', fontSize );

		// [7] Update the x- and y-labels:
		this.$.xLabel
			.attr( 'x', width / 2 )
			.attr( 'y', -(this._maxColTextLength+16) );

		this.$.yLabel
			.attr( 'y', -(this._maxRowTextLength+16) );
	}
	this.fire( 'change', {
		'attr': 'paddingRight',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD paddingRightChanged()

/**
* METHOD: paddingBottomChanged( oldVal, newVal )
*	Event handler invoked when the `paddingBottom` attribute changes.
*
* @param {Null|Number} oldVal - old value
* @param {Null|Number} newVal - new value
*/
Chart.prototype.paddingBottomChanged = function( oldVal, newVal ) {
	var height,
		fontSize,
		dy,
		err;
	if ( newVal !== null && (typeof newVal !== 'number' || newVal !== newVal || newVal%1 !== 0 || newVal < 0) ) {
		err = new TypeError( 'paddingBottom::invalid assignment. Must be null or an integer greater than or equal to 0. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.paddingBottom = oldVal;
		return;
	}
	height = this.graphHeight();

	// [0] Update the y-scale:
	this._yScale.rangeBands( [ 0, height ] );

	// [1] Recompute the row and column name text lengths:
	this.maxTextLengths();

	if ( this.autoUpdate ) {
		dy = this._yScale.rangeBand();
		fontSize = this.fontSize();

		// [2] Update the background:
		this.$.bkgd
			.attr( 'height', height );

		// [3] Update the rows:
		this.$.rows
			.attr( 'transform', this._y );

		// [4] Update the columns:
		this.$.colGridlines
			.attr( 'x1', -height );

		// [5] Update the cells:
		this.$.cells
			.attr( 'height', dy );

		// [6] Update the row and column names:
		this.$.rownames
			.attr( 'y', dy / 2 )
			.attr( 'font-size', fontSize );

		this.$.colnames
			.attr( 'y', this._xScale.rangeBand() / 2 )
			.attr( 'font-size', fontSize );

		// [7] Update the x- and y-labels:
		this.$.xLabel
			.attr( 'y', -(this._maxColTextLength+16) );

		this.$.yLabel
			.attr( 'x', -height / 2 )
			.attr( 'y', -(this._maxRowTextLength+16) );
	}
	this.fire( 'change', {
		'attr': 'paddingBottom',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD paddingBottomChanged()

/**
* METHOD: paddingTopChanged( oldVal, newVal )
*	Event handler invoked when the `paddingTop` attribute changes.
*
* @param {Null|Number} oldVal - old value
* @param {Null|Number} newVal - new value
*/
Chart.prototype.paddingTopChanged = function( oldVal, newVal ) {
	var height,
		pLeft,
		pTop,
		pBottom,
		fontSize,
		dy,
		err;
	if ( newVal !== null && (typeof newVal !== 'number' || newVal !== newVal || newVal%1 !== 0 || newVal < 0) ) {
		err = new TypeError( 'paddingTop::invalid assignment. Must be null or an integer greater than or equal to 0.  Value: `' + newVal + '.' );
		this.fire( 'err', err );
		this.paddingTop = oldVal;
		return;
	}
	pTop = ( newVal === null ) ? this._paddingTop : newVal;
	pBottom = ( this.paddingBottom === null ) ? this._paddingBottom : this.paddingBottom;
	pLeft = ( this.paddingLeft === null ) ? this._paddingLeft : this.paddingLeft;

	height = this.height - pTop - pBottom;

	// [0] Update the y-scale:
	this._yScale.rangeBands( [ 0, height ] );

	// [1] Recompute the row and column name text lengths:
	this.maxTextLengths();

	if ( this.autoUpdate ) {
		dy = this._yScale.rangeBand();
		fontSize = this.fontSize();

		// [2] Update the background:
		this.$.bkgd
			.attr( 'height', height );

		// [3] Update the graph:
		this.$.graph
			.attr( 'transform', 'translate(' + pLeft + ',' + pTop + ')' );

		// [4] Update the rows:
		this.$.rows
			.attr( 'transform', this._y );

		// [5] Update the columns:
		this.$.colGridlines
			.attr( 'x1', -height );

		// [6] Update the cells:
		this.$.cells
			.attr( 'height', dy );

		// [7] Update the row and column labels:
		this.$.rownames
			.attr( 'y', dy / 2 )
			.attr( 'font-size', fontSize );

		this.$.colnames
			.attr( 'y', this._xScale.rangeBand() / 2 )
			.attr( 'font-size', fontSize );

		// [8] Update the x- and y-labels:
		this.$.xLabel
			.attr( 'y', -(this._maxColTextLength+16) );

		this.$.yLabel
			.attr( 'x', -height / 2 )
			.attr( 'y', -(this._maxRowTextLength+16) );
	}
	this.fire( 'change', {
		'attr': 'paddingTop',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD paddingTopChanged()

/**
* METHOD: zValueChanged( oldVal, newVal )
*	Event handler invoked when the `zValue` attribute changes.
*
* @param {Function|Number} oldVal - old value
* @param {Function|Number} newVal - new value
*/
Chart.prototype.zValueChanged = function( oldVal, newVal ) {
	var type = typeof newVal,
		err;
	if ( type !== 'function' && ( type !== 'number' || newVal !== newVal || newVal < 0 || newVal > 1 ) ) {
		err = new TypeError( 'zValue::invalid assignment. Must be either a function or a numeric value between 0 and 1. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.zValue = oldVal;
		return;
	}
	if ( type === 'function' ) {
		this._zScale.domain( this.zDomain( this.zMin, this.zMax ) );
	}
	if ( this.autoUpdate ) {
		this.$.cells.attr( 'fill-opacity', ( typeof this.zValue === 'function' ) ? this._z : this.zValue );
	}
	this.fire( 'change', {
		'attr': 'zValue',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD zValueChanged()

/**
* METHOD: zMinChanged( oldVal, newVal )
*	Event handler invoked when the `zMin` attribute changes.
*
* @param {Null|Number} oldVal - old value
* @param {Null|Number} newVal - new value
*/
Chart.prototype.zMinChanged = function( oldVal, newVal ) {
	var zScale = this._zScale,
		domain = zScale.domain(),
		err;

	if ( newVal !== null && (typeof newVal !== 'number' || newVal !== newVal) ) {
		err = new TypeError( 'zMin::invalid assignment. Must be a numeric or `null`. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.zMin = oldVal;
		return;
	}
	domain = this.zDomain( newVal, domain[ 1 ] );

	zScale.domain( domain );

	if ( this.autoUpdate ) {
		this.$.cells.attr( 'fill-opacity', ( typeof this.zValue === 'function' ) ? this._z : this.zValue );
	}
	this.fire( 'zmin', {
		'type': 'change'
	});
	this.fire( 'change', {
		'attr': 'zMin',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD zMinChanged()

/**
* METHOD: zMaxChanged( oldVal, newVal )
*	Event handler invoked when the `zMax` attribute changes.
*
* @param {Null|Number} oldVal - old value
* @param {Null|Number} newVal - new value
*/
Chart.prototype.zMaxChanged = function( oldVal, newVal ) {
	var zScale = this._zScale,
		domain = zScale.domain(),
		err;

	if ( newVal !== null && (typeof newVal !== 'number' || newVal !== newVal) ) {
		err = new TypeError( 'zMax::invalid assignment. Must be a numeric or `null`. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.zMax = oldVal;
		return;
	}
	domain = this.zDomain( domain[ 0 ], newVal );

	zScale.domain( domain );

	if ( this.autoUpdate ) {
		this.$.cells.attr( 'fill-opacity', ( typeof this.zValue === 'function' ) ? this._z : this.zValue );
	}
	this.fire( 'zmax', {
		'type': 'change'
	});
	this.fire( 'change', {
		'attr': 'zMax',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD zMaxChanged()

/**
* METHOD: colorScaleChanged( oldVal, newVal )
*	Event handler invoked when the `colorScale` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.colorScaleChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'function' ) {
		err = new TypeError( 'colorScale::invalid assignment. Must be a function.  Value: `' + newVal + '.' );
		this.fire( 'err', err );
		this.colorScale = oldVal;
		return;
	}
	if ( this.autoUpdate ) {
		this.$.cells.attr( 'fill', newVal );
	}
	this.fire( 'change', {
		'attr': 'colorScale',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD colorScaleChanged()

/**
* METHOD: xLabelChanged( oldVal, newVal )
*	Event handler invoked when the `xLabel` attribute changes.
*
* @param {String} oldVal - old value
* @param {String} newVal - new value
*/
Chart.prototype.xLabelChanged = function( oldVal, newVal ) {
	var height,
		fontSize,
		dy,
		err;
	if ( typeof newVal !== 'string' ) {
		err = new TypeError( 'xLabel::invalid assignment. Must be a string. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.xLabel = oldVal;
		return;
	}
	if ( this.autoUpdate ) {
		// [0] Set the label text:
		this.$.xLabel.text( newVal );

		// Only recompute the layout if label changed to or from an empty string...
		if ( !oldVal || !newVal ) {
			// [1] Compute the padding based on the row and column text lengths:
			this.calculatePadding();
			height = this.graphHeight();

			// [2] Update the y-scale:
			this._yScale.rangeBands( [ 0, height ] );

			dy = this._yScale.rangeBand();
			fontSize = this.fontSize();

			// [3] Compute the max row and column text lengths:
			this.maxTextLengths();

			// [4] Update the background:
			this.$.bkgd
				.attr( 'height', height );

			// [5] Update the graph:
			this.$.graph
				.attr( 'transform', 'translate(' + this._paddingLeft + ',' + this._paddingTop + ')' );

			// [6] Update the rows:
			this.$.rows
				.attr( 'transform', this._y );

			// [7] Update the columns:
			this.$.colGridlines
				.attr( 'x1', -height );

			// [8] Update the cells:
			this.$.cells
				.attr( 'height', dy );

			// [9] Update the row and column labels:
			this.$.rownames
				.attr( 'y', dy / 2 )
				.attr( 'font-size', fontSize );

			this.$.colnames
				.attr( 'y', this._xScale.rangeBand() / 2 )
				.attr( 'font-size', fontSize );

			// [10] Update the x- and y-labels:
			this.$.xLabel
				.attr( 'y', -(this._maxColTextLength+16) );

			this.$.yLabel
				.attr( 'x', -height / 2 )
				.attr( 'y', -(this._maxRowTextLength+16) );
		}
	}
	this.fire( 'change', {
		'attr': 'xLabel',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD xLabelChanged()

/**
* METHOD: yLabelChanged( oldVal, newVal )
*	Event handler invoked when the `yLabel` attribute changes.
*
* @param {String} oldVal - old value
* @param {String} newVal - new value
*/
Chart.prototype.yLabelChanged = function( oldVal, newVal ) {
	var width,
		fontSize,
		dx,
		err;
	if ( typeof newVal !== 'string' ) {
		err = new TypeError( 'yLabel::invalid assignment. Must be a string. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.yLabel = oldVal;
		return;
	}
	if ( this.autoUpdate ) {
		// [0] Set the label text:
		this.$.yLabel.text( newVal );

		// Only recompute the layout if label changed to or from an empty string...
		if ( !oldVal || !newVal ) {
			// [1] Compute the padding based on the row and column text lengths:
			this.calculatePadding();
			width = this.graphWidth();

			// [2] Update the x-scale:
			this._xScale.rangeBands( [ 0, width ] );

			dx = this._xScale.rangeBand();
			fontSize = this.fontSize();

			// [3] Compute the max row and column text lengths:
			this.maxTextLengths();

			// [4] Update the background:
			this.$.bkgd
				.attr( 'width', width );

			// [5] Update the graph:
			this.$.graph
				.attr( 'transform', 'translate(' + this._paddingLeft + ',' + this._paddingTop + ')' );

			// [6] Update the rows:
			this.$.rowGridlines
				.attr( 'x1', width );

			// [7] Update the columns:
			this.$.cols
				.attr( 'transform', this._x );

			// [8] Update the cells:
			this.$.cells
				.attr( 'x', this._cx )
				.attr( 'width', dx );

			// [9] Update the row and column names:
			this.$.rownames
				.attr( 'y', this._yScale.rangeBand() / 2 )
				.attr( 'font-size', fontSize );

			this.$.colnames
				.attr( 'y', dx / 2 )
				.attr( 'font-size', fontSize );

			// [10] Update the x- and y-labels:
			this.$.xLabel
				.attr( 'x', width / 2 )
				.attr( 'y', -(this._maxColTextLength+16) );

			this.$.yLabel
				.attr( 'y', -(this._maxRowTextLength+16) );
		}
	}
	this.fire( 'change', {
		'attr': 'yLabel',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD yLabelChanged()

/**
* METHOD: durationChanged( oldVal, newVal )
*	Event handler invoked when the `duration` attribute changes.
*
* @param {Null|Number} oldVal - old value
* @param {Null|Number} newVal - new value
*/
Chart.prototype.durationChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'number' || newVal !== newVal ) {
		err = new TypeError( 'duration::invalid assignment. Must be a numeric. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.duration = oldVal;
		return;
	}
	this.fire( 'change', {
		'attr': 'duration',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD durationChanged()

/**
* METHOD: autoUpdateChanged( oldVal, newVal )
*	Event handler invoked when the `autoUpdate` attribute changes.
*
* @param {Boolean} oldVal - old value
* @param {Boolean} newVal - new value
*/
Chart.prototype.autoUpdateChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'boolean' ) {
		err = new TypeError( 'autoUpdate::invalid assignment. Must be a boolean. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.autoUpdate = oldVal;
		return;
	}
	this.fire( 'change', {
		'attr': 'autoUpdate',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD autoUpdateChanged()

/**
* METHOD: autoResizeChanged( oldVal, newVal )
*	Event handler invoked when the `autoResize` attribute changes.
*
* @param {Boolean} oldVal - old value
* @param {Boolean} newVal - new value
*/
Chart.prototype.autoResizeChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'boolean' ) {
		err = new TypeError( 'autoResize::invalid assignment. Must be a boolean. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.autoResize = oldVal;
		return;
	}
	if ( newVal ) {
		window.addEventListener( 'resize', this._onResize, false );
	} else {
		window.removeEventListener( 'resize', this._onResize );
	}
	this.fire( 'change', {
		'attr': 'autoResize',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD autoResizeChanged()

/**
* METHOD: brushableChanged( oldVal, newVal )
*	Event handler invoked when the `brushable` attribute changes.
*
* @param {Boolean} oldVal - old value
* @param {Boolean} newVal - new value
*/
Chart.prototype.brushableChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'boolean' ) {
		err = new TypeError( 'brushable::invalid assignment. Must be a boolean. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.brushable = oldVal;
		return;
	}
	if ( newVal ) {
		this.$.brush.call( this._brush );
	} else {
		this.$.brush.remove();
	}
	this.fire( 'change', {
		'attr': 'brushable',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD brushableChanged()

/**
* METHOD: onBrushEnd()
*	Event listener invoked when brush interaction ends. Adjusts the brush extent in order to snap to nearest cell boundaries.
*/
Chart.prototype.onBrushEnd = function() {
	var brush = this._brush,
		extent = brush.extent(),
		xScale = this._xScale,
		yScale = this._yScale,
		idx = {},
		xDomain,
		yDomain,
		x1, x2,
		y1, y2,
		dx, dy;

	x1 = extent[ 0 ][ 0 ];
	x2 = extent[ 1 ][ 0 ];
	y1 = extent[ 0 ][ 1 ];
	y2 = extent[ 1 ][ 1 ];

	dx = xScale.rangeBand();
	dy = yScale.rangeBand();

	x1 = Math.round( x1 / dx );
	x2 = Math.round( x2 / dx );
	y1 = Math.round( y1 / dy );
	y2 = Math.round( y2 / dy );

	idx.col1 = x1;
	idx.row1 = y1;

	xDomain = xScale.domain();
	yDomain = yScale.domain();

	x1 = xScale( xDomain[ x1 ] );
	y1 = yScale( yDomain[ y1 ] );

	// Check if upper bounds exceeded scale domains...
	if ( x2 === xDomain.length ) {
		idx.col2 = x2 - 1;
		x2 = this.graphWidth();
	} else {
		idx.col2 = x2;
		x2 = xScale( xDomain[ x2 ] );
	}
	if ( y2 === yDomain.length ) {
		idx.row2 = y2 - 1;
		y2 = this.graphHeight();
	} else {
		idx.row2 = y2;
		y2 = yScale( yDomain[ y2 ] );
	}
	extent = [
		[ x1, y1 ],
		[ x2, y2 ]
	];

	this.$.brush.transition()
		.call( brush.extent( extent ) );

	this.fire( 'brushend', idx );
}; // end METHOD onBrushEnd()

/**
* METHOD: sortableRowsChanged( oldVal, newVal )
*	Event handler invoked when the `sortableRows` attribute changes.
*
* @param {Boolean} oldVal - old value
* @param {Boolean} newVal - new value
*/
Chart.prototype.sortableRowsChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'boolean' ) {
		err = new TypeError( 'sortableRows::invalid assignment. Must be a boolean. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.sortableRows = oldVal;
		return;
	}
	if ( newVal ) {
		this.$.rows.call( this._rowDrag );
	} else {
		// Remove all listeners in the `drag` namespace:
		this.$.rows.on( '.drag', null );
	}
	this.fire( 'change', {
		'attr': 'sortableRows',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD sortableRowsChanged()

/**
* METHOD: onRowDragStart( d, i )
*	Event handler invoked when a user initiates a row drag.
*
* @param {*} d - datum
* @param {Number} i - row index
*/
Chart.prototype.onRowDragStart = function( d, i ) {
	this._d3.event.__selection__ = this._d3.select( this.$.rows[ 0 ][ i ] );
}; // end METHOD onRowDragStart()

/**
* METHOD: onRowDrag( d, i )
*	Event handler invoked when a user drags a row.
*
* @param {*} d - datum
* @param {Number} i - row index
*/
Chart.prototype.onRowDrag = function() {
	var evt = this._d3.event;
	evt.__selection__
		.attr( 'transform', 'translate(0,' + evt.y + ')' );
}; // end METHOD onRowDrag()

/**
* METHOD: onRowDragEnd( d, i )
*	Event handler invoked when a user stops dragging a row.
*
* @param {*} d - datum
* @param {Number} i - row index
*/
Chart.prototype.onRowDragEnd = function() {
	this._d3.event.__selection__.attr( 'transform', this._y );
}; // end METHOD onRowDragEnd()

/**
* METHOD: sortableColsChanged( oldVal, newVal )
*	Event handler invoked when the `sortableCols` attribute changes.
*
* @param {Boolean} oldVal - old value
* @param {Boolean} newVal - new value
*/
Chart.prototype.sortableColsChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'boolean' ) {
		err = new TypeError( 'sortableCols::invalid assignment. Must be a boolean. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.sortableCols = oldVal;
		return;
	}
	if ( newVal ) {
		// TODO: something
	} else {
		// TODO: something
	}
	this.fire( 'change', {
		'attr': 'sortableCols',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD sortableColsChanged()

/**
* METHOD: onRowClick( d, i )
*	Click listener for rows.
*
* @param {String} d - row name
* @param {Number} i - row index
* @returns {Boolean} false
*/
Chart.prototype.onRowClick = function( d, i ) {
	var evt = this._d3.event;
	evt.datum = d;
	evt.index = i;
	this.fire( 'clicked.row', evt );
	this.fire( 'clicked', evt );
	return false;
}; // end METHOD onRowClick()

/**
* METHOD: onColClick( d, i )
*	Click listener for columns.
*
* @param {String} d - row name
* @param {Number} i - row index
* @returns {Boolean} false
*/
Chart.prototype.onColClick = function( d, i ) {
	var evt = this._d3.event;
	evt.datum = d;
	evt.index = i;
	this.fire( 'clicked.col', evt );
	this.fire( 'clicked', evt );
	return false;
}; // end METHOD onColClick()

/**
* METHOD: onCellClick( d, i )
*	Click listener for cells.
*
* @param {String} d - cell data
* @param {Number} i - cell index
* @returns {Boolean} false
*/
Chart.prototype.onCellClick = function( d, i ) {
	var evt = this._d3.event,
		rows = this.$.rows[ 0 ],
		row,
		j;

	evt.datum = d;
	evt.col = i;

	// Determine the row index...
	row = evt.path[ 1 ];
	for ( j = 0; j < rows.length; j++ ) {
		if ( rows[ j ] === row ) {
			break;
		}
	}
	evt.row = j;

	this.fire( 'clicked.cell', evt );
	this.fire( 'clicked', evt );
	return false;
}; // end METHOD onCellClick()

/**
* METHOD: onRowHover( d, i )
*	Mouseover listener for rows.
*
* @param {String} d - row name
* @param {Number} i - row index
* @returns {Boolean} false
*/
Chart.prototype.onRowHover = function( d, i ) {
	var evt = this._d3.event;

	this.$.rows[ 0 ][ i ].classList.add( 'active' );

	evt.datum = d;
	evt.index = i;
	this.fire( 'hover.row', evt );
	this.fire( 'hover', evt );
	return false;
}; // end METHOD onRowHover()

/**
* METHOD: onColHover( d, i )
*	Mouseover listener for columns.
*
* @param {String} d - row name
* @param {Number} i - row index
* @returns {Boolean} false
*/
Chart.prototype.onColHover = function( d, i ) {
	var evt = this._d3.event;

	this.$.cols[ 0 ][ i ].classList.add( 'active' );

	evt.datum = d;
	evt.index = i;
	this.fire( 'hover.col', evt );
	this.fire( 'hover', evt );
	return false;
}; // end METHOD onColHover()

/**
* METHOD: onCellHover( d, i )
*	Mouseover listener for cells.
*
* @param {String} d - cell data
* @param {Number} i - cell index
* @returns {Boolean} false
*/
Chart.prototype.onCellHover = function( d, i ) {
	var evt = this._d3.event,
		rows = this.$.rows[ 0 ],
		row,
		j;

	this.$.cols[ 0 ][ i ].classList.add( 'active' );

	evt.datum = d;
	evt.col = i;

	// Determine the row index...
	row = evt.path[ 1 ];
	for ( j = 0; j < rows.length; j++ ) {
		if ( rows[ j ] === row ) {
			break;
		}
	}
	evt.row = j;

	this.fire( 'hover.cell', evt );
	this.fire( 'hover', evt );
	return false;
}; // end METHOD onCellHover()

/**
* METHOD: onRowHoverEnd( d, i )
*	Mouseout listener for rows.
*
* @param {String} d - row name
* @param {Number} i - row index
* @returns {Boolean} false
*/
Chart.prototype.onRowHoverEnd = function( d, i ) {
	var evt = this._d3.event;

	this.$.rows[ 0 ][ i ].classList.remove( 'active' );

	evt.datum = d;
	evt.index = i;
	this.fire( 'hoverend.row', evt );
	this.fire( 'hoverend', evt );
	return false;
}; // end METHOD onRowHoverEnd()

/**
* METHOD: onColHoverEnd( d, i )
*	Mouseout listener for columns.
*
* @param {String} d - row name
* @param {Number} i - row index
* @returns {Boolean} false
*/
Chart.prototype.onColHoverEnd = function( d, i ) {
	var evt = this._d3.event;

	this.$.cols[ 0 ][ i ].classList.remove( 'active' );

	evt.datum = d;
	evt.index = i;
	this.fire( 'hoverend.col', evt );
	this.fire( 'hoverend', evt );
	return false;
}; // end METHOD onColHoverEnd()

/**
* METHOD: onCellHoverEnd( d, i )
*	Mouseout listener for cells.
*
* @param {String} d - cell data
* @param {Number} i - cell index
* @returns {Boolean} false
*/
Chart.prototype.onCellHoverEnd = function( d, i ) {
	var evt = this._d3.event,
		rows = this.$.rows[ 0 ],
		row,
		j;

	this.$.cols[ 0 ][ i ].classList.remove( 'active' );

	evt.datum = d;
	evt.col = i;

	// Determine the row index...
	row = evt.path[ 1 ];
	for ( j = 0; j < rows.length; j++ ) {
		if ( rows[ j ] === row ) {
			break;
		}
	}
	evt.row = j;

	this.fire( 'hoverend.cell', evt );
	this.fire( 'hoverend', evt );
	return false;
}; // end METHOD onCellHoverEnd()

/**
* METHOD: onTransitionEnd()
*	Event listener for transition `end` events.
*
* @returns {Boolean} false
*/
Chart.prototype.onTransitionEnd = function() {
	this.fire( 'transitionended', null );
	return false;
}; // end METHOD onTransitionEnd()

/**
* METHOD: onResize()
*	Resize listener.
*/
Chart.prototype.onResize = function() {
	this.fire( 'resized', {
		'el': 'polymer-matrix-diagram',
		'msg': 'Received a resize event.'
	});
	if ( !this.$.canvas ) {
		return;
	}
	this.width = this.clientWidth;
}; // end METHOD onResize()


// EXPORTS //

module.exports = Chart;
