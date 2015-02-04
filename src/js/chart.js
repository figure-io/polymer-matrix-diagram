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
	this.events = EVENTS.slice();

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


// ELEMENT CREATION //

Chart.prototype.create = require( './create' );

Chart.prototype.createBase = require( './create/base.js' );

Chart.prototype.createBackground = require( './create/background.js' );

Chart.prototype.createMarks = require( './create/marks.js' );

Chart.prototype.createRows = require( './create/rows.js' );

Chart.prototype.createCols = require( './create/cols.js' );

Chart.prototype.createCells = require( './create/cells.js' );

Chart.prototype.createAxes = require( './create/axes.js' );

Chart.prototype.createBrush = require( './create/brush.js' );


// RESET ELEMENTS //

Chart.prototype.reset = require( './reset' );

Chart.prototype.resetBase = require( './reset/base.js' );

Chart.prototype.resetAxes = require( './reset/axes.js' );

Chart.prototype.resetRows = require( './reset/rows.js' );

Chart.prototype.resetCols = require( './reset/cols.js' );

Chart.prototype.resetCells = require( './reset/cells.js' );


// CLEAR //

Chart.prototype.clear = require( './clear' );


// UTILITY METHODS //

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


// WATCHERS //

Chart.prototype.dataChanged = require( './watchers/data.js' );

Chart.prototype.rowOrderChanged = require( './watchers/rowOrder.js' );

Chart.prototype.colOrderChanged = require( './watchers/colOrder.js' );

Chart.prototype.configChanged = require( './watchers/config.js' );

Chart.prototype.widthChanged = require( './watchers/width.js' );

Chart.prototype.heightChanged = require( './watchers/height.js' );

Chart.prototype.paddingLeftChanged = require( './watchers/paddingLeft.js' );

Chart.prototype.paddingRightChanged = require( './watchers/paddingRight.js' );

Chart.prototype.paddingBottomChanged = require( './watchers/paddingBottom.js' );

Chart.prototype.paddingTopChanged = require( './watchers/paddingTop.js' );

Chart.prototype.zValueChanged = require( './watchers/zValue.js' );

Chart.prototype.zMinChanged = require( './watchers/zMin.js' );

Chart.prototype.zMaxChanged = require( './watchers/zMax.js' );

Chart.prototype.colorScaleChanged = require( './watchers/colorScale.js' );

Chart.prototype.xLabelChanged = require( './watchers/xLabel.js' );

Chart.prototype.yLabelChanged = require( './watchers/yLabel.js' );

Chart.prototype.durationChanged = require( './watchers/duration.js' );

Chart.prototype.autoUpdateChanged = require( './watchers/autoUpdate.js' );

Chart.prototype.autoResizeChanged = require( './watchers/autoResize.js' );

Chart.prototype.brushableChanged = require( './watchers/brushable.js' );

Chart.prototype.sortableRowsChanged = require( './watchers/sortableRows.js' );

Chart.prototype.sortableColsChanged = require( './watchers/sortableCols.js' );


// LISTENERS //

Chart.prototype.addListeners = require( './listeners/add.js' );

Chart.prototype.removeListeners = require( './listeners/remove.js' );

Chart.prototype.onRowClick = require( './listeners/rowClick.js' );

Chart.prototype.onColClick = require( './listeners/colClick.js' );

Chart.prototype.onCellClick = require( './listeners/cellClick.js' );

Chart.prototype.onRowHover = require( './listeners/rowHover.js' );

Chart.prototype.onRowHoverEnd = require( './listeners/rowHoverEnd.js' );

Chart.prototype.onColHover = require( './listeners/colHover.js' );

Chart.prototype.onColHoverEnd = require( './listeners/colHoverEnd.js' );

Chart.prototype.onCellHover = require( './listeners/cellHover.js' );

Chart.prototype.onCellHoverEnd = require( './listeners/cellHoverEnd.js' );

Chart.prototype.onRowDragStart = require( './listeners/rowDragStart.js' );

Chart.prototype.onRowDrag = require( './listeners/rowDrag.js' );

Chart.prototype.onRowDragEnd = require( './listeners/rowDragEnd.js' );

Chart.prototype.onColDragStart = require( './listeners/colDragStart.js' );

Chart.prototype.onColDrag = require( './listeners/colDrag.js' );

Chart.prototype.onColDragEnd = require( './listeners/colDragEnd.js' );

Chart.prototype.onTransitionEnd = require( './listeners/transitionEnd.js' );

Chart.prototype.onBrushEnd = require( './listeners/brushEnd.js' );

Chart.prototype.onResize = require( './listeners/resize.js' );


// EXPORTS //

module.exports = Chart;
