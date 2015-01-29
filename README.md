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
		*	[config](#attr-config)
		*	[width](#attr-width)
		*	[height](#attr-height)
		*	[paddingLeft](#attr-paddingleft)
		*	[paddingRight](#attr-paddingright)
		*	[paddingTop](#attr-paddingtop)
		*	[paddingBottom](#attr-paddingbottom)
		*	[chartTitle](#attr-charttitle)
		*	[zValue](#attr-zvalue)
		*	[zMin](#attr-zmin)
		*	[zMax](#attr-zmax)
		*	[cScale](#attr-cscale)
		*	[duration](#attr-duration)
		*	[autoUpdate](#attr-autoupdate)
		*	[autoResize](#attr-autoresize)
	-	[Methods](#methods)
		*	[clear](#method-clear)
		*	[rowOrder](#method-roworder)
		*	[colOrder](#method-colorder)
	-	[Events](#events)
		*	[err](#evt-err)
		*	[changed](#evt-changed)
		*	[data](#evt-data)
		*	[width](#evt-width)
		*	[height](#evt-height)
		*	[zMin](#evt-zmin)
		* 	[zMax](#evt-zmax)
		*	[resized](#evt-resized)
		*	[clicked](#evt-clicked)
		*	[clicked.row](#evt-clicked-row)
		*	[clicked.col](#evt-clicked-col)
		*	[clicked.cell](#evt-clicked-cell)
		*	[hovered](#evt-hovered)
		*	[hovered.row](#evt-hovered-row)
		*	[hovered.col](#evt-hovered-col)
		*	[hovered.cell](#evt-hovered-cell)
		*	[hoverended](#evt-hoverended)
		*	[hoverended.row](#evt-hoverended-row)
		*	[hoverended.col](#evt-hoverended-col)
		*	[hoverended.cell](#evt-hoverended-cell)
		*	[transitionEnd](#evt-transition-end)
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

Chart canvas left padding; i.e., space between the left canvas edge and the left graph edge. Typically needed to create room for a left oriented y-axis. If set to `null`, the padding is automatically calculated based on the computed text length of rownames. Default is `null`.

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

Chart canvas top padding; i.e., space between the top canvas edge and the top graph edge. Typically needed to create room for a chart title or top positioned legend. If set to `null`, the padding is automatically calculated based on the computed text length of column names and chart title height. Default is `null`.

``` javascript
el.paddingTop = 200; // px
```

<a name="attr-paddingbottom"></a>
#### el.paddingBottom

Chart canvas bottom padding; i.e., space between the bottom canvas edge and the bottom graph edge. Typically needed to create room for a bottom oriented x-axis or bottom positioned legend. If set to `null`, the padding is internally calculated. Default is `null`.

``` javascript
el.paddingBottom = 100; // px
```

<a name="attr-charttitle"></a>
#### el.chartTitle

Chart title. Default is an empty `string`.

``` javascript
el.chartTitle = 'Awesome chart.';
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


<a name="attr-cscale"></a>
#### el.cScale

Maps a cell datum to a color.

``` javascript
el.cScale = function cScale( d, i ) {
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




### Methods

<a name="method-clear"></a>
#### el.clear()

Clears the chart.

``` javascript
el.clear();
```


<a name="method-roworder"></a>
#### el.rowOrder( arr )

Sets the row order. The input `array` should be a permutation of the row names.

``` javascript
el.rowOrder( [ 3, 1, 0, 2 ] );
```

Once the rows are reordered, the element emits a `transitionEnd` event.


<a name="method-colorder"></a>
#### el.colOrder( arr )

Sets the column order. The input `array` should be a permutation of the column names.


``` javascript
el.colOrder( [ 0, 1, 4, 3, 2,... ] );
```

Once the columns are reordered, the element emits a `transitionEnd` event.




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


<a name="evt-changed"></a>
#### 'changed'

The element emits a `changed` event whenever an attribute changes.

``` javascript
el.addEventListener( 'changed', function onChange( evt ) {
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
#### 'zMin'

The element emits a `zMin` event when the `zMin` attribute changes.

``` javascript
el.addEventListener( 'zMin', function onEvent( evt ) {
	console.log( this.zMin );
});
```

<a name="evt-zmax"></a>
#### 'zMax'

The element emits a `zMax` event when the `zMax` attribute changes.

``` javascript
el.addEventListener( 'zMax', function onEvent( evt ) {
	console.log( this.zMax );
});
```


<a name="evt-resized"></a>
#### 'resized'

The element emits a `resized` event when the element's resize listener is triggered.

``` javascript
el.addEventListener( 'resized', function onResize( evt ) {
	console.log( 'Chart received a resize event.' );
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


<a name="evt-hovered"></a>
#### 'hovered'

The element emits a `hovered` event when an element having a `mouseover` handler has a `mouseover` event.

``` javascript
el.addEventListener( 'hovered', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```


<a name="evt-hovered-row"></a>
#### 'hovered.row'

The element emits a `hovered.row` event when a row has a `mouseover` event.

``` javascript
el.addEventListener( 'hovered.row', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```


<a name="evt-hovered-col"></a>
#### 'hovered.col'

The element emits a `hovered.col` event when a column has a `mouseover` event.

``` javascript
el.addEventListener( 'hovered.col', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```


<a name="evt-hovered-cell"></a>
#### 'hovered.cell'

The element emits a `hovered.cell` event when a cell has a `mouseover` event.

``` javascript
el.addEventListener( 'hovered.cell', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.row, evt.detail.col );
});
```


<a name="evt-hoverended"></a>
#### 'hoverended'

The element emits a `hoverended` event when an element having a `mouseout` handler has a `mouseout` event.

``` javascript
el.addEventListener( 'hoverended', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```


<a name="evt-hoverended-row"></a>
#### 'hoverended.row'

The element emits a `hoverended.row` event when a row has a `mouseout` event.

``` javascript
el.addEventListener( 'hoverended.row', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```


<a name="evt-hoverended-col"></a>
#### 'hoverended.col'

The element emits a `hoverended.col` event when a column has a `mouseout` event.

``` javascript
el.addEventListener( 'hoverended.col', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```

<a name="evt-hoverended-cell"></a>
#### 'hoverended.cell'

The element emits a `hoverended.cell` event when a cell has a `mouseout` event.

``` javascript
el.addEventListener( 'hoverended.cell', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.row, evt.detail.col );
});
```

<a name="evt-transition-end"></a>
#### 'transitionEnd'

The element emits a `transitionEnd` event when a transition ends; e.g., as occurs after setting the row or column order.

``` javascript
el.addEventListener( 'transitionEnd', function onEnd() {
	console.log( '...transition ended...' );
});
```


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

