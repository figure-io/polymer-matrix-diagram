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

/* global document, window */
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
	this._active.row = this._d3.select( this.$.rows[ 0 ][ i ] );
}; // end METHOD onRowDragStart()

/**
* METHOD: onRowDrag( d, i )
*	Event handler invoked when a user drags a row.
*
* @param {*} d - datum
* @param {Number} i - row index
*/
Chart.prototype.onRowDrag = function() {
	var y = this._d3.event.y,
		h;

	this._active.dragging = true;

	// Ensure that the row does not venture outside the graph area...
	if ( y < 0 ) {
		y = 0;
	} else {
		h = this.graphHeight() - this._yScale.rangeBand();
		if ( y > h ) {
			y = h;
		}
	}
	this._active.row.attr( 'transform', 'translate(0,' + y + ')' );
	this._active.y = y;
}; // end METHOD onRowDrag()

/**
* METHOD: onRowDragEnd( d, idx )
*	Event handler invoked when a user stops dragging a row.
*
* @param {*} d - datum
* @param {Number} i - row index
*/
Chart.prototype.onRowDragEnd = function( d, i ) {
	var self = this,
		duration = this.duration,
		delay = this.delay,
		order,
		j, k,
		idx;

	if ( !this._active.dragging ) {
		return;
	}
	this._active.dragging = false;

	if ( this._rowOrder ) {
		order = this._rowOrder.slice();
	} else {
		order = this._yScale.domain().slice();
	}
	// Match the element index to its place in the y-domain (use linear search as array elements may be in random order)...
	for ( j = 0; j < order.length; j++ ) {
		if ( i === order[ j ] ) {
			i = j;
			break;
		}
	}
	// Determine the nearest row index:
	j = Math.round( this._active.y / this._yScale.rangeBand() );

	// Re-order the rows...
	idx = order[ i ];
	if ( i === j ) {
		this._active.row.attr( 'transform', this._y( d, idx ) );
	} else {
		if ( i < j ) {
			// Case 1: shift elements to the left...
			for ( k = i; k < j; k++ ) {
				order[ k ] = order[ k+1 ];
			}
		} else {
			// Case 2: shift elements to the right...
			for ( k = i; k > j; k-- ) {
				order[ k ] = order[ k-1 ];
			}
		}
		order[ j ] = idx;

		// Modify the transition properties when sorting...
		this.duration = 100;
		this.delay = 0;
		this.addEventListener( 'transitionended', onEnd );

		this.rowOrder = order;
	}
	this._active.row = null;
	this._active.y = null;

	function onEnd() {
		self.duration = duration;
		self.delay = delay;
		self.removeEventListener( 'transitionended', onEnd );
	}
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
		this.$.cols.call( this._colDrag );
	} else {
		// Remove all listeners in the `drag` namespace:
		this.$.cols.on( '.drag', null );
	}
	this.fire( 'change', {
		'attr': 'sortableCols',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD sortableColsChanged()

/**
* METHOD: onColDragStart( d, i )
*	Event handler invoked when a user initiates a column drag.
*
* @param {*} d - datum
* @param {Number} i - column index
*/
Chart.prototype.onColDragStart = function( d, i ) {
	var len = this.data.rownames().length,
		cells = this.$.cells,
		arr = new Array( len );

	this._active.col = this._d3.select( this.$.cols[ 0 ][ i ] );

	for ( var j = 0; j < len; j++ ) {
		arr[ j ] = cells[ j ][ i ];
	}
	this._active.cells = this._d3.selectAll( arr );
}; // end METHOD onColDragStart()

/**
* METHOD: onColDrag( d, i )
*	Event handler invoked when a user drags a column.
*
* @param {*} d - datum
* @param {Number} i - column index
*/
Chart.prototype.onColDrag = function() {
	var x = this._d3.event.x,
		w;

	this._active.dragging = true;

	// Ensure that the column does not venture outside the graph area...
	if ( x < 0 ) {
		x = 0;
	} else {
		w = this.graphWidth() - this._xScale.rangeBand();
		if ( x > w ) {
			x = w;
		}
	}
	this._active.col.attr( 'transform', 'translate(' + x + ')rotate(-90)' );
	this._active.cells.attr( 'x', x );
	this._active.x = x;
}; // end METHOD onColDrag()

/**
* METHOD: onColDragEnd( d, i )
*	Event handler invoked when a user stops dragging a column.
*
* @param {*} d - datum
* @param {Number} i - column index
*/
Chart.prototype.onColDragEnd = function( d, i ) {
	var self = this,
		duration = this.duration,
		delay = this.delay,
		order,
		j, k,
		idx;

	if ( !this._active.dragging ) {
		return;
	}
	this._active.dragging = false;

	if ( this._colOrder ) {
		order = this._colOrder.slice();
	} else {
		order = this._xScale.domain().slice();
	}
	// Match the element index to its place in the x-domain (use linear search as array elements may be in random order)...
	for ( j = 0; j < order.length; j++ ) {
		if ( i === order[ j ] ) {
			i = j;
			break;
		}
	}
	// Determine the nearest column index:
	j = Math.round( this._active.x / this._xScale.rangeBand() );

	// Re-order the columns...
	idx = order[ i ];
	if ( i === j ) {
		this._active.col.attr( 'transform', this._x( d, idx ) );
		this._active.cells.attr( 'x', this._cx( d, idx ) );
	} else {
		if ( i < j ) {
			// Case 1: shift elements to the left...
			for ( k = i; k < j; k++ ) {
				order[ k ] = order[ k+1 ];
			}
		} else {
			// Case 2: shift elements to the right...
			for ( k = i; k > j; k-- ) {
				order[ k ] = order[ k-1 ];
			}
		}
		order[ j ] = idx;

		// Modify the transition properties when sorting...
		this.duration = 100;
		this.delay = 0;
		this.addEventListener( 'transitionended', onEnd );

		this.colOrder = order;
	}
	this._active.col = null;
	this._active.x = null;

	function onEnd() {
		self.duration = duration;
		self.delay = delay;
		self.removeEventListener( 'transitionended', onEnd );
	}
}; // end METHOD onColDragEnd()

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
