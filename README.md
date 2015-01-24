Matrix Diagram
===
[![NPM version][npm-image]][npm-url] [![Bower version][bower-image]][bower-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> A [Polymer](https://www.polymer-project.org/) web component for displaying matrix diagrams.


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
		<link rel="import" href="path/to/polymer-matrix-diagram">
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

#### el.data

Chart data. The expected format is an `array` of `arrays`.

``` javascript
el.data = [
	[{'a':1},{'a':0},...],
	[{'a':0},{'a':0},...],
	[{'a':1},{'a':0},...],
	[{'a':1},{'a':1},...]
];
```

Each nested `array` is visually encoded as a row, and each nested `array` element is visually encoded as a row cell. The nested `array` elements may be of any type.


#### el.config

Configuration `object` containing parameters corresponding to known attributes, as defined below.

``` javascript
el.config = {};
```

TODO: implement and define. Vega reference. Specification.


#### el.width

Chart canvas width. If not explicitly set, defaults to the width of the parent node.

``` javascript
el.width = 600; // px
```


#### el.height

Chart canvas height. If not explicitly set, default to the height of the parent node.

``` javascript
el.height = 600; // px
```


#### el.paddingLeft

Chart canvas left padding; i.e., space between the left canvas edge and the left graph edge. Typically needed to create room for a left oriented y-axis. Default is 40 pixels.

``` javascript
el.paddingLeft = 120; // px
```

#### el.paddingRight

Chart canvas right padding; i.e., space between the right canvas edge and the right graph edge. Typically needed to create room for a right oriented y-axis. Default is 40 pixels.

``` javascript
el.paddingRight = 90; // px
```

#### el.paddingTop

Chart canvas top padding; i.e., space between the top canvas edge and the top graph edge. Typically needed to create room for a chart title or top positioned legend. Default is 40 pixels.

``` javascript
el.paddingTop = 200; // px
```

#### el.paddingBottom

Chart canvas bottom padding; i.e., space between the bottom canvas edge and the bottom graph edge. Typically needed to create room for a bottom oriented x-axis or bottom positioned legend. Default is 40 pixels.

``` javascript
el.paddingBottom = 100; // px
```

#### el.chartTitle

Chart title. Default is an empty `string`.

``` javascript
el.chartTitle = 'Awesome chart.';
```

#### el.zValue

Defines the z-value accessor. Each z-value is mapped to a value on the interval `[0,1]`, which then determines the `fill-opacity` for a cell. The default `fill-opacity` for all cells is `1`.

``` javascript
// Default:
el.zValue = function zValue( d, i ) {
	return 1;
};

// Example of an object based accessor:
el.zValue = function zValue( d, i ) {
	return d.z;
};
```


#### el.zMin

Defines the minimum value of the z-domain. Default is `null`.

``` javascript
el.zMin = -10;
```

If set to `null`, the `zMin` is dynamically calculated from the data.


#### el.zMax

Defines the maximum value of the z-domain. Default is `null`.

``` javascript
el.zMax = 10;
```

If set to `null`, the `zMax` is dynamically calculated from the data.


#### el.cScale

Maps a cell datum to a color.

``` javascript
el.cScale = function cScale( d, i ) {
	return ( d ) ? 'red' : 'blue';
};
```


#### el.autoUpdate

Specifies whether the element should auto update whenever an attribute changes. Default is `true`.

``` javascript
el.autoUpdate = false;
```


#### el.autoResize

Specifies whether the element should auto resize when the window resizes. Default is `true`.

``` javascript
el.autoResize = false;
```


### Methods

#### el.clear()

Clears the chart.

``` javascript
el.clear();
```


#### el.rowOrder( arr )

Sets the row order.

``` javascript
el.rowOrder( [ 3, 1, 0, 2 ] );
```

#### el.colOrder( arr )

Sets the column order.

``` javascript
el.colOrder( [ 0, 1, 4, 3, 2,... ] );
```


### Events

The component emits events during both chart configuration and interaction. The following events are emitted... 


#### 'err'

The element emits an `err` event whenever an error occurs; e.g., improper setting of attributes.

``` javascript
el.addEventListener( 'err', function onError( err ) {
	console.log( err );	
});
```

__NOTE__: the event name will change to `error` once issue [#138](https://github.com/webcomponents/webcomponentsjs/issues/138) is resolved. The preferred name is `error`.


#### 'changed'

The element emits a `changed` event whenever an attribute changes.

``` javascript
el.addEventListener( 'changed', function onChange( evt ) {
	console.log( evt.attr, evt.prev, evt.curr, evt.data );	
});
```

#### 'data'

The element emits a `data` event when the `data` attribute changes.

``` javascript
el.addEventListener( 'data', function onEvent( evt ) {
	console.log( this.data );
});
```

#### 'width'

The element emits a `width` event when the `width` attribute changes.

``` javascript
el.addEventListener( 'width', function onEvent( evt ) {
	console.log( this.width );
});
```

#### 'height'

The element emits a `height` event when the `height` attribute changes.

``` javascript
el.addEventListener( 'height', function onEvent( evt ) {
	console.log( this.height );
});
```


#### 'resized'

The element emits a `resized` event when the element's resize listener is triggered.

``` javascript
el.addEventListener( 'resized', function onResize( evt ) {
	console.log( 'Chart received a resize event.' );
});
```

#### 'clicked'

The element emits a `clicked` event when a chart element having a click handler is clicked.

``` javascript
el.addEventListener( 'clicked', function onClick( evt ) {
	console.log( evt );
});
```


#### 'clicked.row'

The element emits a `clicked.row` event when a row is clicked.

``` javascript
el.addEventListener( 'clicked.row', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```

#### 'clicked.col'

The element emits a `clicked.col` event when a column is clicked.

``` javascript
el.addEventListener( 'clicked.col', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```

#### 'clicked.cell'

The element emits a `clicked.cell` event when a cell is clicked.

``` javascript
el.addEventListener( 'clicked.cell', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.row, evt.detail.col );
});
```


#### 'hovered'

The element emits a `hovered` event when an element having a `mouseover` handler has a `mouseover` event.

``` javascript
el.addEventListener( 'hovered', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```


#### 'hovered.row'

The element emits a `hovered.row` event when a row has a `mouseover` event.

``` javascript
el.addEventListener( 'hovered.row', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```


#### 'hovered.col'

The element emits a `hovered.col` event when a column has a `mouseover` event.

``` javascript
el.addEventListener( 'hovered.col', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```


#### 'hovered.cell'

The element emits a `hovered.cell` event when a cell has a `mouseover` event.

``` javascript
el.addEventListener( 'hovered.cell', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.row, evt.detail.col );
});
```


#### 'hoverended'

The element emits a `hoverended` event when an element having a `mouseout` handler has a `mouseout` event.

``` javascript
el.addEventListener( 'hoverended', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```


#### 'hoverended.row'

The element emits a `hoverended.row` event when a row has a `mouseout` event.

``` javascript
el.addEventListener( 'hoverended.row', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```


#### 'hoverended.col'

The element emits a `hoverended.col` event when a column has a `mouseout` event.

``` javascript
el.addEventListener( 'hoverended.col', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.index );
});
```

#### 'hoverended.cell'

The element emits a `hoverended.cell` event when a cell has a `mouseout` event.

``` javascript
el.addEventListener( 'hoverended.cell', function onClick( evt ) {
	console.log( evt.detail.datum, evt.detail.row, evt.detail.col );
});
```

#### 'transitionEnd'

The element emits a `transitionEnd` event when a transition ends; e.g., when setting the row or column order.

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

