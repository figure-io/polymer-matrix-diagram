Matrix Diagram
===
[![NPM version][npm-image]][npm-url] [![Bower version][bower-image]][bower-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> A [Polymer](https://www.polymer-project.org/) web component for displaying matrix diagrams.

[![Matrix Diagram][screenshot-image]][screenshot-url]

---
1. 	[Installation](#install)
1. 	[Usage](#usage)
	-	[Attributes](#attributes)
		* 	[data](#attr-data)
		*	[rowOrder](#attr-roworder)
		*	[colOrder](#attr-colorder)
		*	[config](#attr-config)
		*	[width](#attr-width)
		*	[height](#attr-height)
		*	[paddingLeft](#attr-paddingleft)
		*	[paddingRight](#attr-paddingright)
		*	[paddingTop](#attr-paddingtop)
		*	[paddingBottom](#attr-paddingbottom)
		*	[xLabel](#attr-xlabel)
		*	[yLabel](#attr-ylabel)
		*	[zValue](#attr-zvalue)
		*	[zMin](#attr-zmin)
		*	[zMax](#attr-zmax)
		*	[colorScale](#attr-colorscale)
		*	[duration](#attr-duration)
		*	[autoUpdate](#attr-autoupdate)
		*	[autoResize](#attr-autoresize)
		*	[isBrushable](#attr-isbrushable)
		*	[isSortableRows](#attr-issortablerows)
		*	[isSortableCols](#attr-issortablecols)
		*	[events](#attr-events)
	-	[Methods](#methods)
		*	[clear](#method-clear)
	-	[Events](#events)
		*	[err](#evt-err)
		*	[change](#evt-change)
		*	[data](#evt-data)
		*	[roworder](#evt-roworder)
		*	[colorder](#evt-colorder)
		*	[width](#evt-width)
		*	[height](#evt-height)
		*	[zmin](#evt-zmin)
		* 	[zmax](#evt-zmax)
		*	[resized](#evt-resized)
		*	[clicked](#evt-clicked)
		*	[clicked.row](#evt-clicked-row)
		*	[clicked.col](#evt-clicked-col)
		*	[clicked.cell](#evt-clicked-cell)
		*	[hover](#evt-hover)
		*	[hover.row](#evt-hover-row)
		*	[hover.col](#evt-hover-col)
		*	[hover.cell](#evt-hover-cell)
		*	[hoverend](#evt-hoverend)
		*	[hoverend.row](#evt-hoverend-row)
		*	[hoverend.col](#evt-hoverend-col)
		*	[hoverend.cell](#evt-hoverend-cell)
		*	[sortend](#evt-sortend)
		*	[sortend.row](#evt-sortend-row)
		*	[sortend.col](#evt-sortend-col)
		*	[transitionended](#evt-transition-ended)
		*	[brushend](#evt-brushend)
1. 	[Examples](#examples)
1. 	[Development](#development)
1. 	[Build](#build)
1. 	[Tests](#tests)
	-	[Unit](#unit)
	-	[Coverage](#test-coverage)
1. 	[License](#license)


---


## Install

``` bash
$ bower install figure-io/polymer-matrix-diagram
```


## Usage

To use the component,

``` html
<!DOCTYPE html>
<html>
	<head>
		<script src="path/to/webcomponentsjs/webcomponents.min.js"></script>
		<link rel="import" href="path/to/polymer-matrix-diagram.html">
	</head>
	<body>
		<polymer-matrix-diagram id="chart"></polymer-matrix-diagram>
	</body>
</html>
```

and

``` javascript
var el = document.querySelector( '#chart' );
```

The component has the following public attributes and methods...



### Attributes

<a name="attr-data"></a>
#### el.data

Chart data. 

TODO: data frame.

The expected format is an `array` of `arrays`.

``` javascript
el.data = [
	[{'a':1},{'a':0},...],
	[{'a':0},{'a':0},...],
	[{'a':1},{'a':0},...],
	[{'a':1},{'a':1},...]
];
```

Each nested `array` is visually encoded as a row, and each nested `array` element is visually encoded as a row cell. The nested `array` elements may be of any type.





<a name="attr-roworder"></a>
#### el.rowOrder

Defines the row order. The row order `array` should be a permutation of the row name __indices__.

``` javascript
el.rowOrder = [ 3, 1, 0, 2 ];
```

Once the rows are reordered, the element emits a `transitionEnd` event.


<a name="attr-colorder"></a>
#### el.colOrder

Defines the column order. The column order `array` should be a permutation of the column name __indices__.


``` javascript
el.colOrder = [ 0, 1, 4, 3, 2,...];
```

Once the columns are reordered, the element emits a `transitionEnd` event.



<a name="attr-config"></a>
#### el.config

Configuration `object` containing parameters corresponding to known attributes, as defined below.

``` javascript
el.config = {};
```

TODO: implement and define. Vega reference. Specification.


<a name="attr-width"></a>
#### el.width

Chart canvas width. If not explicitly set, defaults to the width of the parent node.

``` javascript
el.width = 600; // px
```


<a name="attr-height"></a>
#### el.height

Chart canvas height. If not explicitly set, defaults to the height of the parent node.

``` javascript
el.height = 600; // px
```


<a name="attr-paddingleft"></a>
#### el.paddingLeft

Chart canvas left padding; i.e., space between the left canvas edge and the left graph edge. Typically needed to create room for a left oriented y-axis. If set to `null`, the padding is automatically calculated based on the computed text length of row names. Default is `null`.

``` javascript
el.paddingLeft = 120; // px
```

<a name="attr-paddingright"></a>
#### el.paddingRight

Chart canvas right padding; i.e., space between the right canvas edge and the right graph edge. Typically needed to create room for a right oriented y-axis. If set to `null`, the padding is internally calculated. Default is `null`.

``` javascript
el.paddingRight = 90; // px
```

<a name="attr-paddingtop"></a>
#### el.paddingTop

Chart canvas top padding; i.e., space between the top canvas edge and the top graph edge. Typically needed to create room for a chart title or top positioned legend. If set to `null`, the padding is automatically calculated based on the computed text length of column names and the chart title height. Default is `null`.

``` javascript
el.paddingTop = 200; // px
```

<a name="attr-paddingbottom"></a>
#### el.paddingBottom

Chart canvas bottom padding; i.e., space between the bottom canvas edge and the bottom graph edge. Typically needed to create room for a bottom oriented x-axis or bottom positioned legend. If set to `null`, the padding is internally calculated. Default is `null`.

``` javascript
el.paddingBottom = 100; // px
```

<a name="attr-xlabel"></a>
#### el.xLabel

Column label. Default is an empty `string`.

``` javascript
el.xLabel = 'beep';
```


<a name="attr-ylabel"></a>
#### el.yLabel

Row label. Default is an empty `string`.

``` javascript
el.yLabel = 'boop';
```


<a name="attr-zvalue"></a>
#### el.zValue

Defines the z-value accessor. z-values determine the `fill-opacity` for a cell. If set to a constant on the interval `[0,1]`, the `fill-opacity` is the same for all cells. If set to a `function`, each z-value is mapped to a value on the interval `[0,1]`. The default `fill-opacity` for all cells is `1`.

``` javascript
// Default:
el.zValue = 1;

// Example of an object based accessor:
el.zValue = function zValue( d, i ) {
	return d.z;
};
```


<a name="attr-zmin"></a>
#### el.zMin

Defines the minimum value of the z-domain. Default is `null`.

``` javascript
el.zMin = -10;
```

If set to `null`, the `zMin` is dynamically calculated from the data. This attribute is only relevant when the z-value accessor is a `function`.


<a name="attr-zmax"></a>
#### el.zMax

Defines the maximum value of the z-domain. Default is `null`.

``` javascript
el.zMax = 10;
```

If set to `null`, the `zMax` is dynamically calculated from the data. This attribute is only relevant when the z-value accessor is a `function`.


<a name="attr-colorscale"></a>
#### el.colorScale

Maps a cell datum to a color.

``` javascript
el.colorScale = function colorScale( d, i ) {
	return ( d ) ? 'red' : 'blue';
};
```


<a name="attr-duration"></a>
#### el.duration

Transition duration when reordering rows or columns. Default is `2500` milliseconds.

``` javascript
el.duration = 1000; // ms
```

__NOTE__: only set this attribute should your situation absolutely warrant it. Setting the transition duration to a value less than or equal to `0` inhibits the user from understanding how a reordering has affected the diagram. And too long a duration will test a user's patience. `2500` milliseconds should be a decent setting for __most__ use cases. The only reason the attribute is exposed is for purposes of fine tuning, but only should the need arise. Otherwise, leave the value as is.


<a name="attr-autoupdate"></a>
#### el.autoUpdate

Specifies whether the element should automatically update whenever an attribute changes. Default is `true`.

``` javascript
el.autoUpdate = false;
```


<a name="attr-autoresize"></a>
#### el.autoResize

Specifies whether the element should automatically resize when the window resizes. Default is `true`.

``` javascript
el.autoResize = false;
```


<a name="attr-isbrushable"></a>
#### el.isBrushable

Specifies whether the element should be brushable. When enabled, a user may select matrix elements via a brush overlay. After selection, a `brushend` event is emitted, which contains the row and column indices of the selected elements. Default is `false`.

``` javascript
el.isBrushable = true;
```

__NOTE:__ when brushing is enabled, cell `click` events are __not__ triggered and cell `hover` events are unreliable. 


<a name="attr-issortablerows"></a>
#### el.isSortableRows

Specifies whether rows can be manually sorted. When enabled, a user may manually drag rows to change row order. Default is `false`.

``` javascript
el.isSortableRows = true;
```


<a name="attr-issortablecols"></a>
#### el.isSortableCols

Specifies whether columns can be manually sorted. When enabled, a user may manually drag columns to change column order. Default is `false`.

``` javascript
el.isSortableCols = true;
```


<a name="attr-events"></a>
#### el.events

List of [event](#events) names. The `events` attribute is intended to be __read-only__. One possible use case for the `events` attribute is for programmatically determining possible events to which you can subscribe; e.g., when logging.

``` javascript
var evts = el.events;
```



### Methods

<a name="method-clear"></a>
#### el.clear()

Clears the chart.

``` javascript
el.clear();
```



### Events

The component emits events during both chart configuration and interaction. The following events are emitted... 


<a name="evt-err"></a>
#### 'err'

The element emits an `err` event whenever an error occurs; e.g., improper setting of attributes.

``` javascript
el.addEventListener( 'err', function onError( err ) {
	console.log( err );	
});
```

__NOTE__: the event name will change to `error` once issue [#138](https://github.com/webcomponents/webcomponentsjs/issues/138) is resolved. The preferred name is `error`.


<a name="evt-change"></a>
#### 'change'

The element emits a `change` event whenever an attribute changes.

``` javascript
el.addEventListener( 'change', function onChange( evt ) {
	console.log( evt.attr, evt.prev, evt.curr, evt.data );	
});
```

<a name="evt-data"></a>
#### 'data'

The element emits a `data` event when the `data` attribute changes.

``` javascript
el.addEventListener( 'data', function onEvent( evt ) {
	console.log( this.data );
});
```

<a name="evt-roworder"></a>
#### 'roworder'

The element emits a `roworder` event when the `rowOrder` attribute changes.

``` javascript
el.addEventListener( 'roworder', function onEvent( evt ) {
	console.log( this.rowOrder );
});
```

<a name="evt-colorder"></a>
#### 'colorder'

The element emits a `colorder` event when the `colOrder` attribute changes.

``` javascript
el.addEventListener( 'colorder', function onEvent( evt ) {
	console.log( this.colOrder );
});
```

<a name="evt-width"></a>
#### 'width'

The element emits a `width` event when the `width` attribute changes.

``` javascript
el.addEventListener( 'width', function onEvent( evt ) {
	console.log( this.width );
});
```

<a name="evt-height"></a>
#### 'height'

The element emits a `height` event when the `height` attribute changes.

``` javascript
el.addEventListener( 'height', function onEvent( evt ) {
	console.log( this.height );
});
```

<a name="evt-zmin"></a>
#### 'zmin'

The element emits a `zmin` event when the `zMin` attribute changes.

``` javascript
el.addEventListener( 'zmin', function onEvent( evt ) {
	console.log( this.zMin );
});
```

<a name="evt-zmax"></a>
#### 'zmax'

The element emits a `zmax` event when the `zMax` attribute changes.

``` javascript
el.addEventListener( 'zmax', function onEvent( evt ) {
	console.log( this.zMax );
});
```


<a name="evt-resized"></a>
#### 'resized'

The element emits a `resized` event when the element's resize listener is triggered.

``` javascript
el.addEventListener( 'resized', function onResize( evt ) {
	console.log( evt.detail );
});
```

<a name="evt-clicked"></a>
#### 'clicked'

The element emits a `clicked` event when a chart element having a click handler is clicked.

``` javascript
el.addEventListener( 'clicked', function onClick( evt ) {
	console.log( evt );
});
```


<a name="evt-clicked-row"></a>
#### 'clicked.row'

The element emits a `clicked.row` event when a row is clicked.

``` javascript
el.addEventListener( 'clicked.row', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```

<a name="evt-clicked-col"></a>
#### 'clicked.col'

The element emits a `clicked.col` event when a column is clicked.

``` javascript
el.addEventListener( 'clicked.col', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```

<a name="evt-clicked-cell"></a>
#### 'clicked.cell'

The element emits a `clicked.cell` event when a cell is clicked.

``` javascript
el.addEventListener( 'clicked.cell', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.row, evt.detail.col );
});
```


<a name="evt-hover"></a>
#### 'hover'

The element emits a `hover` event when an element having a `mouseover` handler has a `mouseover` event.

``` javascript
el.addEventListener( 'hover', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```


<a name="evt-hover-row"></a>
#### 'hover.row'

The element emits a `hover.row` event when a row has a `mouseover` event.

``` javascript
el.addEventListener( 'hover.row', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```


<a name="evt-hover-col"></a>
#### 'hover.col'

The element emits a `hover.col` event when a column has a `mouseover` event.

``` javascript
el.addEventListener( 'hover.col', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```


<a name="evt-hover-cell"></a>
#### 'hover.cell'

The element emits a `hover.cell` event when a cell has a `mouseover` event.

``` javascript
el.addEventListener( 'hover.cell', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.row, evt.detail.col );
});
```


<a name="evt-hoverend"></a>
#### 'hoverend'

The element emits a `hoverend` event when an element having a `mouseout` handler has a `mouseout` event.

``` javascript
el.addEventListener( 'hoverend', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```


<a name="evt-hoverend-row"></a>
#### 'hoverend.row'

The element emits a `hoverend.row` event when a row has a `mouseout` event.

``` javascript
el.addEventListener( 'hoverend.row', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```


<a name="evt-hoverend-col"></a>
#### 'hoverend.col'

The element emits a `hoverend.col` event when a column has a `mouseout` event.

``` javascript
el.addEventListener( 'hoverend.col', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```

<a name="evt-hoverend-cell"></a>
#### 'hoverend.cell'

The element emits a `hoverend.cell` event when a cell has a `mouseout` event.

``` javascript
el.addEventListener( 'hoverend.cell', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.row, evt.detail.col );
});
```


<a name="evt-sortend"></a>
#### 'sortend'

The element emits a `sortend` event when a user finishes sorting a sortable element; e.g., a row or column.

``` javascript
el.addEventListener( 'sortend', function onEnd( evt ) {
	console.log( evt.detail.datum, evt.detail.row, evt.detail.col );
});
```


<a name="evt-sortend-row"></a>
#### 'sortend.row'

The element emits a `sortend.row` event when a user finishes sorting a row element.

``` javascript
el.addEventListener( 'sortend.row', function onEnd( evt ) {
	console.log( evt.detail.datum, evt.detail.row );
});
```


<a name="evt-sortend-col"></a>
#### 'sortend.col'

The element emits a `sortend.col` event when a user finishes sorting a column element.

``` javascript
el.addEventListener( 'sortend.col', function onEnd( evt ) {
	console.log( evt.detail.datum, evt.detail.col );
});
```


<a name="evt-transition-ended"></a>
#### 'transitionended'

The element emits a `transitionended` event when a transition ends; e.g., as occurs after setting the row or column order.

``` javascript
el.addEventListener( 'transitionended', function onEnd() {
	console.log( '...transition ended...' );
});
```

<a name="evt-brushend"></a>
#### 'brushend'

The element emits a `brushend` event when a brush interaction ends.

``` javascript
el.addEventListener( 'brushend', function onEnd( evt ) {
	var detail = evt.detail;
	console.log( detail.row1, detail.row2, detail.col1, detail.col2 );
});
```

The event `detail` contains the cell indices defining the brush extent; i.e., those cells which are selected.


## Examples

To run the example code, navigate to the parent directory and start a [simple python server](https://docs.python.org/2/library/simplehttpserver.html),

``` bash
$ cd ..
$ python -m SimpleHTTPServer 9090
```

Once the server is running, open the following URL in your browser

```
http://127.0.0.1:9090/polymer-matrix-diagram/examples
```


## Development

To install development dependencies,

``` bash
$ make install
```

which installs [node modules](https://www.npmjs.org/) and [bower components](http://bower.io/).

> WARNING: bower components are installed in the parent directory, __not__ the component directory.

By installing components in the parent directory, we mimic a production environment, in which bower components are siblings (needed for correct relative paths). Beware, however, that this may result in conflicts with existing components. Or worse, where existing sibling components are being developed (git repositories), completely overwriting siblings.

To avoid such issues, you may want to clone the repository into its own isolated directory. The downside of this approach is increased disk usage due to (possibly) duplicated dependencies.


## Build

The `src` directory contains the component source files. Source files must be [browserified](https://github.com/substack/node-browserify) and then [vulcanized](https://github.com/polymer/vulcanize) before creating a distributable component. To run the build,

``` bash
$ make build
```

which generates a `build` directory containing [browserified](https://github.com/substack/node-browserify) scripts and a [vulcanized](https://github.com/polymer/vulcanize) distributable in the top-level directory.


## Tests

### Unit

Unit tests are run via [web component tester](https://github.com/Polymer/web-component-tester), which in turn uses the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) to instrument code coverage. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT). 


## Copyright

Copyright &copy; 2015. Athan Reines.


[screenshot-image]: https://github.com/figure-io/polymer-matrix-diagram/blob/master/examples/img/matrix-diagram.png
[screenshot-url]: https://github.com/figure-io/polymer-matrix-diagram

[npm-image]: http://img.shields.io/npm/v/.svg
[npm-url]: https://npmjs.org/package/

[bower-image]: https://img.shields.io/bower/v/polymer-matrix-diagram.svg
[bower-url]: https://github.com/figure-io/polymer-matrix-diagram

[travis-image]: http://img.shields.io/travis/figure-io/polymer-matrix-diagram/master.svg
[travis-url]: https://travis-ci.org/figure-io/polymer-matrix-diagram

[coveralls-image]: https://img.shields.io/coveralls/figure-io/polymer-matrix-diagram/master.svg
[coveralls-url]: https://coveralls.io/r/figure-io/polymer-matrix-diagram?branch=master

[dependencies-image]: http://img.shields.io/david/figure-io/polymer-matrix-diagram.svg
[dependencies-url]: https://david-dm.org/figure-io/polymer-matrix-diagram

[dev-dependencies-image]: http://img.shields.io/david/dev/figure-io/polymer-matrix-diagram.svg
[dev-dependencies-url]: https://david-dm.org/dev/figure-io/polymer-matrix-diagram

[github-issues-image]: http://img.shields.io/github/issues/figure-io/polymer-matrix-diagram.svg
[github-issues-url]: https://github.com/figure-io/polymer-matrix-diagram/issues

