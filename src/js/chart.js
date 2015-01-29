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

	'width',
	'height',
	'zMin',
	'zMax',

	'changed',
	'err',

	'resized',

	'clicked',
	'clicked.row',
	'clicked.col',
	'clicked.cell',

	'hovered',
	'hovered.row',
	'hovered.col',
	'hovered.cell',

	'hoverended',
	'hoverended.row',
	'hoverended.col',
	'hoverended.cell',

	'transitionEnd'
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
* @type {Number}
* @default 40px
*/
Chart.prototype.paddingLeft = 40;

/**
* ATTRIBUTE: paddingRight
*	Chart canvas right padding.
*
* @type {Number}
* @default 40px
*/
Chart.prototype.paddingRight = 40;

/**
* ATTRIBUTE: paddingBottom
*	Chart canvas bottom padding.
*
* @type {Number}
* @default 40px
*/
Chart.prototype.paddingBottom = 40;

/**
* ATTRIBUTE: paddingTop
*	Chart canvas top padding.
*
* @type {Number}
* @default 40px
*/
Chart.prototype.paddingTop = 40;

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
* ATTRIBUTE: chartTitle
*	Chart title.
*
* @type {String}
* @default ''
*/
Chart.prototype.chartTitle = '';

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
* METHOD: cScale( d, i )
*	Maps a cell datum to a color.
*
* @param {*} d - datum
* @param {Number} i - index
* @returns {String} color string
*/
Chart.prototype.cScale = function(){
	return '#eee';
}; // end METHOD cScale()

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

	// Private methods...

	// Scales...
	this._xScale = d3.scale.ordinal()
		.rangeBands( [ 0, this.graphWidth() ] )
		.domain( [ 0 ] );
	this._yScale = d3.scale.ordinal()
		.rangeBands( [ this.graphHeight(), 0 ] )
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

	// Element cache...
	this.$ = $ = {};

	// Base elements...
	$.root = null;
	$.canvas = null;
	$.graph = null;
	$.bkgd = null;

	// Meta elements...
	$.meta = null;
	$.title = null;

	// Data elements...
	$.marks = null;
	$.rows = null;
	$.cols = null;

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
		.createRows()
		.createCols()
		.createTitle();

	return this;
}; // end METHOD create()

/**
* METHOD: createBase()
*	Creates the chart base.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.createBase = function() {
	var width = this.width,
		height = this.height,
		pLeft = this.paddingLeft,
		pTop = this.paddingTop,
		canvas;

	// Only cache the root element once (should not change)...
	if ( !this.$.root ) {
		this.$.root = this._d3.select( this.$.chart );
	}
	// Remove any existing canvas...
	if ( this.$.canvas ) {
		this.$.canvas.remove();
	}
	// Create the SVG element:
	canvas = this.$.root.append( 'svg:svg' )
		.attr( 'property', 'canvas' )
		.attr( 'class', 'canvas' )
		.attr( 'width', width )
		.attr( 'height', height );
	this.$.canvas = canvas;

	// Create the graph element:
	this.$.graph = canvas.append( 'svg:g' )
		.attr( 'property', 'graph' )
		.attr( 'class', 'graph' )
		.attr( 'data-graph-type', 'matrix-diagram' )
		.attr( 'transform', 'translate(' + pLeft + ',' + pTop + ')' );

	// Create the meta element:
	this.$.meta = canvas.append( 'svg:g' )
		.attr( 'property', 'meta' )
		.attr( 'class', 'meta' )
		.attr( 'data-graph-type', 'matrix-diagram' )
		.attr( 'transform', 'translate(0,0)' );

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
*	Creates a graph marks element.
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
	return this;
}; // end METHOD createMarks()

/**
* METHOD: createRows()
*	Creates row elements.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.createRows = function() {
	this.$.rows = this.$.marks.selectAll( '.row' )
		.data( (this.data) ? this.data.rownames() : [] )
		.enter()
		.append( 'svg:g' )
			.attr( 'class', 'row' )
			.attr( 'transform', this._y )
			.on( 'mouseover', this._onRowHover )
			.on( 'mouseout', this._onRowHoverEnd );

	this.$.rows.append( 'svg:line' )
		.attr( 'class', 'grid x' )
		.attr( 'x1', this.graphWidth() );

	this.$.rows.append( 'svg:text' )
		.attr( 'class', 'noselect name' )
		.attr( 'x', -6 )
		.attr( 'y', this._yScale.rangeBand() / 2 )
		.attr( 'dy', '.32em' )
		.attr( 'text-anchor', 'end' )
		.text( this._getRowName )
		.on( 'click', this._onRowClick );

	this.$.rows.each( this._createCells );

	return this;
}; // end METHOD createRows()

/**
* METHOD: createCols()
*	Creates column elements.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.createCols = function() {
	this.$.cols = this.$.marks.selectAll( '.col' )
		.data( (this.data) ? this.data.colnames() :  [] )
		.enter()
		.append( 'svg:g' )
			.attr( 'class', 'col y' )
			.attr( 'transform', this._x )
			.on( 'mouseover', this._onColHover )
			.on( 'mouseout', this._onColHoverEnd );

	this.$.cols.append( 'svg:line' )
		.attr( 'class', 'grid' )
		.attr( 'x1', -this.graphHeight() );

	this.$.cols.append( 'svg:text' )
		.attr( 'class', 'noselect name' )
		.attr( 'x', 6 )
		.attr( 'y', this._xScale.rangeBand() / 2 )
		.attr( 'dy', '.32em' )
		.attr( 'text-anchor', 'start' )
		.text( this._getColName )
		.on( 'click', this._onColClick );

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
			.attr( 'fill', this.cScale )
			.on( 'mouseover', this._onCellHover )
			.on( 'mouseout', this._onCellHoverEnd )
			.on( 'click', this._onCellClick );

	return this;
}; // end METHOD createCells()

/**
* METHOD: createTitle()
*	Creates the chart title.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.createTitle = function() {
	if ( this.$.title ) {
		this.$.title.remove();
	}
	this.$.title = this.$.meta.append( 'svg:text' )
		.attr( 'property', 'chart.title' )
		.attr( 'class', 'title noselect' )
		.attr( 'x', 0 )
		.attr( 'y', 0 )
		.text( this.chartTitle );

	return this;
}; // end METHOD createTitle()

/**
* METHOD: clear()
*	Clears the chart.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.clear = function() {
	// TODO: should meta data (e.g., title) be cleared as well?

	// Remove the graph:
	this.$.rows.remove();
	this.$.cols.remove();

	return this;
}; // end METHOD clear()

/**
* METHOD: resetMarks()
*	Resets graph mark elements.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.resetMarks = function() {
	return this.resetRows().resetCols();
}; // end METHOD resetMarks()

/**
* METHOD: resetRows()
*	Resets row elements.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.resetRows = function() {
	// Bind the data and update existing rows:
	var rows = this.$.marks.selectAll( '.row' )
		.data( this.data.rownames() )
		.attr( 'transform', this._y );

	// Remove any old rows:
	rows.exit().remove();

	// Add any new rows:
	rows.enter().append( 'svg:g' )
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
		.text( this._getRowName )
		.on( 'click', this._onRowClick );

	this.$.rows = rows;

	rows.each( this._resetCells );

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
	var cols = this.$.marks.selectAll( '.col' )
		.data( this.data.colnames() )
		.attr( 'transform', this._x );

	// Remove any old columns:
	cols.exit().remove();

	// Add any new columns:
	cols.enter().append( 'svg:g' )
		.attr( 'class', 'col' )
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
		.text( this._getColName )
		.on( 'click', this._onColClick );

	// Cache a reference to the columns:
	this.$.cols = cols;

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
		.attr( 'fill', this.cScale );

	// Remove any old cells:
	cells.exit().remove();

	// Add any new cells:
	cells.enter().append( 'svg:rect' )
		.attr( 'class', 'cell' )
		.attr( 'x', this._cx )
		.attr( 'width', this._xScale.rangeBand() )
		.attr( 'height', this._yScale.rangeBand() )
		.attr( 'fill-opacity', ( typeof this.zValue === 'function' ) ? this._z : this.zValue )
		.attr( 'fill', this.cScale )
		.on( 'mouseover', this._onCellHover )
		.on( 'mouseout', this._onCellHoverEnd )
		.on( 'click', this._onCellClick );

	return this;
}; // end METHOD resetCells()

/**
* METHOD: rowOrder( arr )
*	Set the row order.
*
* @param {Array} arr - order
*/
Chart.prototype.rowOrder = function( arr ) {
	var len = this.data.rownames().length,
		selection;

	if ( !Array.isArray( arr ) ) {
		throw new TypeError( 'rowOrder()::invalid input argument. Must provide an array. Value' );
	}
	if ( arr.length !== len ) {
		throw new Error( 'rowOrder()::invalid input argument. Array length must equal the number of rows. Number of rows: ' + len + '.' );
	}
	this._yScale.domain( arr );

	if ( this.duration > 0 ) {
		selection = this.$.marks.transition()
			.duration( this.duration )
			.each( 'end', this._onTransitionEnd );

		selection.selectAll( '.row' )
			.delay( this.delay )
			.attr( 'transform', this._y );
	} else {
		this.$.rows.attr( 'transform', this._y );
		this.fire( 'transitionEnd', null );
	}
	return this;
}; // end METHOD rowOrder()

/**
* METHOD: colOrder( arr )
*	Set the column order.
*
* @param {Array} arr - order
*/
Chart.prototype.colOrder = function( arr ) {
	var len = this.data.colnames().length,
		selection;

	if ( !Array.isArray( arr ) ) {
		throw new TypeError( 'colOrder()::invalid input argument. Must provide an array. Value: `' + arr + '`.' );
	}
	if ( arr.length !== len ) {
		throw new Error( 'colOrder()::invalid input argument. Array length must equal the number of columns. Number of columns: ' + len + '.' );
	}
	this._xScale.domain( arr );

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

		this.$.rows.selectAll( '.cell' )
			.attr( 'x', this._cx );

		this.fire( 'transitionEnd', null );
	}
	return this;
}; // end METHOD colOrder()

/**
* METHOD: graphWidth()
*	Returns the graph width.
*
* @returns {Number} graph width
*/
Chart.prototype.graphWidth = function() {
	return this.width - this.paddingLeft - this.paddingRight;
}; // end METHOD graphWidth()

/**
* METHOD: graphHeight()
*	Returns the graph height.
*
* @returns {Number} graph height
*/
Chart.prototype.graphHeight = function() {
	return this.height - this.paddingTop - this.paddingBottom;
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
* METHOD: dataChanged( oldVal newVal )
*	Event handler invoked when the `data` attribute changes.
*
* @param {Array} oldVal - old value
* @param {Array} newVal - new value
*/
Chart.prototype.dataChanged = function( oldVal, newVal ) {
	// TODO: take an array of arrays; attempt to convert to data frame (separate function; wrap in try/catch); if unable, emit error; else proceed.

	this._xScale.domain( this.data.colnames() );
	this._yScale.domain( this.data.rownames() );
	this._zScale.domain( this.zDomain( this.zMin, this.zMax ) );

	if ( this.autoUpdate ) {
		this.resetMarks();
	}
	this.fire( 'data', {
		'type': 'changed'
	});
	this.fire( 'changed', {
		'attr': 'data',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD dataChanged()

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

	// FIXME: title should not be part of annotations, but meta. The config should be standardized. Put in repo. Version it. Create an associated validator. NPM.
	// this.chartTitle = newConfig.annotations.title;

	this.fire( 'changed', {
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
		err;
	if ( typeof newVal !== 'number' || newVal !== newVal || newVal <= 0 ) {
		err = new TypeError( 'width::invalid assignment. Must be a number greater than 0. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.width = oldVal;
		return;
	}
	width = newVal - this.paddingLeft - this.paddingRight;

	// [0] Update the x-scale:
	this._xScale.rangeBands( [ 0, width ] );

	if ( this.$.canvas && this.autoUpdate ) {
		// [1] Update the SVG canvas:
		this.$.canvas.attr( 'width', newVal );

		// [2] Update the background:
		this.$.bkgd.attr( 'width', width );

		// [3] Update the rows:
		this.$.rows.selectAll( '.grid' )
			.attr( 'x1', width );

		// [4] Update the columns:
		this.$.cols.attr( 'transform', this._x );

		// [5] Update the cells:
		this.$.rows.selectAll( '.cell' )
			.attr( 'x', this._cx )
			.attr( 'width', this._xScale.rangeBand() );
	}
	this.fire( 'width', {
		'type': 'changed'
	});
	this.fire( 'changed', {
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
		err;
	if ( typeof newVal !== 'number' || newVal !== newVal || newVal <= 0 ) {
		err = new TypeError( 'height::invalid assignment. Must be a number greater than 0. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.height = oldVal;
		return;
	}
	height = newVal - this.paddingTop - this.paddingBottom;

	// [0] Update the y-scale:
	this._yScale.rangeBands( [ 0, height ] );

	if ( this.$.canvas && this.autoUpdate ) {
		// [1] Update the SVG canvas:
		this.$.canvas.attr( 'height', newVal );

		// [2] Update the background:
		this.$.bkgd.attr( 'height', height );

		// [3] Update the rows:
		this.$.rows.attr( 'transform', this._y );

		// [4] Update the columns:
		this.$.cols.selectAll( '.grid' )
			.attr( 'x1', -height );

		// [5] Update the cells:
		this.$.rows.selectAll( '.cell' )
			.attr( 'height', this._yScale.rangeBand() );
	}
	this.fire( 'height', {
		'type': 'changed'
	});
	this.fire( 'changed', {
		'attr': 'height',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD heightChanged()

/**
* METHOD: chartTitleChanged( oldVal, newVal )
*	Event handler invoked when the `chartTitle` attribute changes.
*
* @param {String} oldVal - old value
* @param {String} newVal - new value
*/
Chart.prototype.chartTitleChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'string' ) {
		err = new TypeError( 'charTitle::invalid assignment. Must be a string. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.chartTitle = oldVal;
		return;
	}
	if ( this.autoUpdate ) {
		this.$.title.text( newVal );
	}
	this.fire( 'changed', {
		'attr': 'chartTitle',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD chartTitleChanged()

/**
* METHOD: paddingLeftChanged( oldVal, newVal )
*	Event handler invoked when the `paddingLeft` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.paddingLeftChanged = function( oldVal, newVal ) {
	var width,
		err;
	if ( typeof newVal !== 'number' || newVal !== newVal || newVal%1 !== 0 || newVal < 0 ) {
		err = new TypeError( 'paddingLeft::invalid assignment. Must be an integer greater than or equal to 0. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.paddingLeft = oldVal;
		return;
	}
	width = this.width - newVal - this.paddingRight;

	// [0] Update the x-scale:
	this._xScale.rangeBands( [ 0, width ] );

	if ( this.autoUpdate ) {
		// [1] Update the background:
		this.$.bkgd.attr( 'width', width );

		// [2] Update the graph:
		this.$.graph.attr( 'transform', 'translate(' + newVal + ',' + this.paddingTop + ')' );

		// [3] Update the rows:
		this.$.rows.selectAll( '.grid' )
			.attr( 'x1', width );

		// [4] Update the columns:
		this.$.cols.attr( 'transform', this._x );

		// [5] Update the cells:
		this.$.rows.selectAll( '.cell' )
			.attr( 'x', this._cx )
			.attr( 'width', this._xScale.rangeBand() );
	}
	this.fire( 'changed', {
		'attr': 'paddingLeft',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD paddingLeftChanged()

/**
* METHOD: paddingRightChanged( oldVal, newVal )
*	Event handler invoked when the `padding` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.paddingRightChanged = function( oldVal, newVal ) {
	var width,
		err;
	if ( typeof newVal !== 'number' || newVal !== newVal || newVal%1 !== 0 || newVal < 0 ) {
		err = new TypeError( 'paddingRight::invalid assignment. Must be an integer greater than or equal to 0. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.paddingRight = oldVal;
		return;
	}
	width = this.width - this.paddingLeft - newVal;

	// [0] Update the x-scale:
	this._xScale.rangeBands( [ 0, width ] );

	if ( this.autoUpdate ) {
		// [1] Update the background:
		this.$.bkgd.attr( 'width', width );

		// [2] Update the rows:
		this.$.rows.selectAll( '.grid' )
			.attr( 'x1', width );

		// [3] Update the columns:
		this.$.cols.attr( 'transform', this._x );

		// [4] Update the cells:
		this.$.rows.selectAll( '.cell' )
			.attr( 'x', this._cx )
			.attr( 'width', this._xScale.rangeBand() );
	}
	this.fire( 'changed', {
		'attr': 'paddingRight',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD paddingRightChanged()

/**
* METHOD: paddingBottomChanged( oldVal, newVal )
*	Event handler invoked when the `paddingBottom` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.paddingBottomChanged = function( oldVal, newVal ) {
	var height,
		err;
	if ( typeof newVal !== 'number' || newVal !== newVal || newVal%1 !== 0 || newVal < 0 ) {
		err = new TypeError( 'paddingBottom::invalid assignment. Must be an integer greater than or equal to 0. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.paddingBottom = oldVal;
		return;
	}
	height = this.height - this.paddingTop - newVal;

	// [0] Update the y-scale:
	this._yScale.rangeBands( [ 0, height ] );

	if ( this.autoUpdate ) {
		// [1] Update the background:
		this.$.bkgd.attr( 'height', height );

		// [2] Update the rows:
		this.$.rows.attr( 'transform', this._y );

		// [3] Update the columns:
		this.$.cols.selectAll( '.grid' )
			.attr( 'x1', -height );

		// [4] Update the cells:
		this.$.rows.selectAll( '.cell' )
			.attr( 'height', this._yScale.rangeBand() );
	}
	this.fire( 'changed', {
		'attr': 'paddingBottom',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD paddingBottomChanged()

/**
* METHOD: paddingTopChanged( oldVal, newVal )
*	Event handler invoked when the `paddingTop` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.paddingTopChanged = function( oldVal, newVal ) {
	var height,
		err;
	if ( typeof newVal !== 'number' || newVal !== newVal || newVal%1 !== 0 || newVal < 0 ) {
		err = new TypeError( 'paddingTop::invalid assignment. Must be an integer greater than or equal to 0.  Value: `' + newVal + '.' );
		this.fire( 'err', err );
		this.paddingTop = oldVal;
		return;
	}
	height = this.height - newVal - this.paddingBottom;

	// [0] Update the y-scale:
	this._yScale.rangeBands( [ 0, height ] );

	if ( this.autoUpdate ) {
		// [1] Update the background:
		this.$.bkgd.attr( 'height', height );

		// [2] Update the graph:
		this.$.graph.attr( 'transform', 'translate(' + this.paddingLeft + ',' + newVal + ')' );

		// [3] Update the rows:
		this.$.rows.attr( 'transform', this._y );

		// [4] Update the columns:
		this.$.cols.selectAll( '.grid' )
			.attr( 'x1', -height );

		// [5] Update the cells:
		this.$.rows.selectAll( '.cell' )
			.attr( 'height', this._yScale.rangeBand() );
	}
	this.fire( 'changed', {
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

		this.$.marks.selectAll( '.cell' )
			.attr( 'fill-opacity', ( typeof this.zValue === 'function' ) ? this._z : this.zValue );
	}
	this.fire( 'changed', {
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
		this.$.marks.selectAll( '.cell' )
			.attr( 'fill-opacity', ( typeof this.zValue === 'function' ) ? this._z : this.zValue );
	}
	this.fire( 'zMin', {
		'type': 'changed'
	});
	this.fire( 'changed', {
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
		this.$.marks.selectAll( '.cell' )
			.attr( 'fill-opacity', ( typeof this.zValue === 'function' ) ? this._z : this.zValue );
	}
	this.fire( 'zMax', {
		'type': 'changed'
	});
	this.fire( 'changed', {
		'attr': 'zMax',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD zMaxChanged()

/**
* METHOD: cScaleChanged( oldVal, newVal )
*	Event handler invoked when the `cScale` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.cScaleChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'function' ) {
		err = new TypeError( 'cScale::invalid assignment. Must be a function.  Value: `' + newVal + '.' );
		this.fire( 'err', err );
		this.cScale = oldVal;
		return;
	}
	if ( this.autoUpdate ) {
		this.$.rows.selectAll( '.cell' )
			.attr( 'fill', newVal );
	}
	this.fire( 'changed', {
		'attr': 'cScale',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD cScaleChanged()

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
	this.fire( 'changed', {
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
		err = new TypeError( 'autoUpdate::invalid assignment. Must be a boolean.  Value: `' + newVal + '.' );
		this.fire( 'err', err );
		this.autoUpdate = oldVal;
		return;
	}
	this.fire( 'changed', {
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
		err = new TypeError( 'autoResize::invalid assignment. Must be a boolean.  Value: `' + newVal + '.' );
		this.fire( 'err', err );
		this.autoResize = oldVal;
		return;
	}
	if ( newVal ) {
		window.addEventListener( 'resize', this._onResize, false );
	} else {
		window.removeEventListener( 'resize', this._onResize );
	}
	this.fire( 'changed', {
		'attr': 'autoResize',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD autoResizeChanged()

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
	this.fire( 'hovered.row', evt );
	this.fire( 'hovered', evt );
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
	this.fire( 'hovered.col', evt );
	this.fire( 'hovered', evt );
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

	this.fire( 'hovered.cell', evt );
	this.fire( 'hovered', evt );
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
	this.fire( 'hoverended.row', evt );
	this.fire( 'hoverended', evt );
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
	this.fire( 'hoverended.col', evt );
	this.fire( 'hoverended', evt );
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

	this.fire( 'hoverended.cell', evt );
	this.fire( 'hoverended', evt );
	return false;
}; // end METHOD onCellHoverEnd()

/**
* METHOD: onTransitionEnd()
*	Event listener for transition `end` events.
*
* @returns {Boolean} false
*/
Chart.prototype.onTransitionEnd = function() {
	this.fire( 'transitionEnd', null );
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
