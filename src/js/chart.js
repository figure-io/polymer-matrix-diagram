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

'use strict';


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


// ATTRIBUTES //

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
* ATTRIBUTE: cValue( d, i )
*	color-value accessor.
*
* @param {*} d - datum
* @param {Number} i - index
* @returns {Number} 0
*/
Chart.prototype.cValue = function() {
	return 0;
};

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
* ATTRIBUTE: isBrushable
*	Boolean flag indicating whether a chart is brushable.
*
* @type {Boolean}
* @default false
*/
Chart.prototype.isBrushable = false;

/**
* ATTRIBUTE: isSortableRows
*	Boolean flag indicating whether rows can be manually sorted.
*
* @type {Boolean}
* @default false
*/
Chart.prototype.isSortableRows = false;

/**
* ATTRIBUTE: isSortableCols
*	Boolean flag indicating whether columns can be manually sorted.
*
* @type {Boolean}
* @default false
*/
Chart.prototype.isSortableCols = false;


// LIFECYCLE //

Chart.prototype.created = require( './lifecycle/created.js' );

Chart.prototype.attached = require( './lifecycle/attached.js' );

Chart.prototype.detached = require( './lifecycle/detached.js' );


// INIT //

Chart.prototype.init = require( './init' );


// CHART CREATION //

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

Chart.prototype.graphWidth = require( './utils/graphWidth.js' );

Chart.prototype.graphHeight = require( './utils/graphHeight.js' );

Chart.prototype.x = require( './utils/x.js' );

Chart.prototype.y = require( './utils/y.js' );

Chart.prototype.z = require( './utils/z.js' );

Chart.prototype.cx = require( './utils/cx.js' );

Chart.prototype.color = require( './utils/color.js' );

Chart.prototype.getRowName = require( './utils/getRowName.js' );

Chart.prototype.getColName = require( './utils/getColName.js' );

Chart.prototype.zDomain = require( './utils/zDomain.js' );

Chart.prototype.colorDomain = require( './utils/colorDomain.js' );

Chart.prototype.delay = require( './utils/delay.js' );

Chart.prototype.fontSize = require( './utils/fontSize.js' );

Chart.prototype.calculatePadding = require( './utils/calculatePadding.js' );

Chart.prototype.maxTextLengths = require( './utils/maxTextLengths.js' );

Chart.prototype.validateOrder = require( './utils/validateOrder.js' );


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

Chart.prototype.cValueChanged = require( './watchers/cValue.js' );

Chart.prototype.colorOrderChanged = require( './watchers/colorOrder.js' );

Chart.prototype.colorsChanged = require( './watchers/colors.js' );

Chart.prototype.xLabelChanged = require( './watchers/xLabel.js' );

Chart.prototype.yLabelChanged = require( './watchers/yLabel.js' );

Chart.prototype.durationChanged = require( './watchers/duration.js' );

Chart.prototype.autoUpdateChanged = require( './watchers/autoUpdate.js' );

Chart.prototype.autoResizeChanged = require( './watchers/autoResize.js' );

Chart.prototype.isBrushableChanged = require( './watchers/isBrushable.js' );

Chart.prototype.isSortableRowsChanged = require( './watchers/isSortableRows.js' );

Chart.prototype.isSortableColsChanged = require( './watchers/isSortableCols.js' );


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
