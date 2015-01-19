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

	'changed',
	'err',

	'resized',

	'clicked'
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
* METHOD: zScale( d, i )
*	Maps a datum to a color value.
*
* @param {*} d - datum
* @param {Number} i - index
* @returns {String} color string
*/
Chart.prototype.zScale = function(){
	return '#eee';
}; // end METHOD zScale()

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

	// Labels:
	this._getRowName = this.getRowName.bind( this );
	this._getColName = this.getColName.bind( this );

	// Marks...
	this._x = this.x.bind( this );
	this._y = this.y.bind( this );

	this._cx = this.cx.bind( this );

	this._createCells = this.createCells.bind( this );
	this._resetCells = this.resetCells.bind( this );

	// Interaction...
	this._onRowClick = this.onRowClick.bind( this );
	this._onColClick = this.onColClick.bind( this );
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

	// Clip path...
	this._clipPathID = this._uuid.v4();
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
			.attr( 'transform', this._y );

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
			.attr( 'transform', this._x );

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
			.attr( 'fill', this.zScale );

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
		.attr( 'transform', this._y );

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
		.attr( 'transform', this._x );

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
	var row,
		cells;

	row = this._d3.select( this.$.rows[0][i] );

	cells = row.selectAll( '.cell' )
		.data( this.data.data()[i] )
		.attr( 'x', this._cx )
		.attr( 'fill', this.zScale );

	// Remove any old cells:
	cells.exit().remove();

	// Add any new cells:
	cells.enter().append( 'svg:rect' )
		.attr( 'class', 'cell' )
		.attr( 'x', this._cx )
		.attr( 'width', this._xScale.rangeBand() )
		.attr( 'height', this._yScale.rangeBand() )
		.attr( 'fill', this.zScale );

	return this;
}; // end METHOD resetCells()

/**
* METHOD: rowOrder( arr )
*	Update the row order.
*
* @param {Array} arr - order
*/
Chart.prototype.rowOrder = function( arr ) {
	var yScale = this._yScale,
		selection;

	yScale.domain( arr );

	selection = this.$.marks.transition()
		.duration( 2500 );

    selection.selectAll( '.row' )
		.delay( function ( d, i ) {
			return yScale( i ) * 4;
		})
		.attr( 'transform', this._y );

	return this;
}; // end METHOD rowOrder()

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
*	Returns a row name based on a provided index.
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
*	Returns a column name based on a provided index.
*
* @param {Array} d - datum
* @param {Number} i - index
* @returns {String} column name
*/
Chart.prototype.getColName = function( d ) {
	return d;
}; // end METHOD getColName()

/**
* METHOD: dataChanged( oldVal newVal )
*	Event handler invoked when the `data` attribute changes.
*
* @param {Array} oldVal - old value
* @param {Array} newVal - new value
*/
Chart.prototype.dataChanged = function( oldVal, newVal ) {
	this._xScale.domain( this.data.colnames() );
	this._yScale.domain( this.data.rownames() );

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

		// TODO: update marks
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

		// TODO: update marks
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

		// TODO: update marks
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

		// TODO: update marks
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

		// TODO: update marks
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

		// TODO: update marks
	}
	this.fire( 'changed', {
		'attr': 'paddingTop',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD paddingTopChanged()

/**
* METHOD: zScaleChanged( oldVal, newVal )
*	Event handler invoked when the `zScale` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.zScaleChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'function' ) {
		err = new TypeError( 'zScale::invalid assignment. Must be a function.  Value: `' + newVal + '.' );
		this.fire( 'err', err );
		this.zScale = oldVal;
		return;
	}
	if ( this.autoUpdate ) {
		this.$.rows.selectAll( '.cell' )
			.attr( 'fill', newVal );
	}
	this.fire( 'changed', {
		'attr': 'zScale',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD zScaleChanged()

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
	return false;
}; // end METHOD onColClick()

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
