
(function() {
	'use strict';

	// FUNCTIONS //

	/**
	* FUNCTION: getResource( url, clbk )
	*   Fetches a resource from a provided URL and returns the result to a provided callback.
	*
	* @param {String} url - resource location
	* @param {Function} clbk - callback to invoke upon resource receipt. Function should accept one input argument: [ result ]
	*/
	function getResource( url, clbk ) {
		var xhr;

		// Create a new request object:
		xhr = new XMLHttpRequest();

		// Open the request connection:
		xhr.open( 'GET', url, true );

		// Define the state change callback:
		xhr.onreadystatechange = function () {
			if ( xhr.readyState !== 4 || xhr.status !== 200 ){
				return;
			}
			clbk( xhr.responseText );
		};

		// Send the request:
		xhr.send();
	} // end FUNCTION getResource()

	/**
	* FUNCTION: onData( body )
	*	Response handler for an HTTP request. Parses the returned data.
	*
	* @param {String} body - HTTP response body
	*/
	function onData( body ) {
		var data = JSON.parse( body ),
			rowOrders,
			figs,
			len,
			charts,
			el;

		// [0] Grab chart elements...
		figs = document.querySelectorAll( '.figure' );

		len = figs.length;
		charts = new Array( len );
		for ( var i = 0; i < len; i++ ) {
			charts[ i ] = figs[ i ].querySelector( '.chart' );
		}

		// [1] Configure the figure...
		el = charts[ 0 ];

		el.zScale = zScale;
		el.data = new DataFrame( data );

		el.addEventListener( 'clicked.row', function onClick( evt ) {
			var idx = evt.detail.index;
			el.rowOrder( rowOrders[ idx ] );
		});

		el.addEventListener( 'clicked.col', function onClick( evt ) {
			el.colOrder( colOrder( data[ 0 ].length ) );
		});

		el.addEventListener( 'clicked.cell', function onClick( evt ) {
			// console.log( evt.detail.col, evt.detail.row );
		});

		el.addEventListener( 'transitionEnd', function onEnd() {
			// console.log( '...transition ended...' );
		});

		rowOrders = rowOrderings( data );

	} // end FUNCTION onData()

	/**
	* FUNCTION: zScale( d, i )
	*	Maps a z-value to a color string.
	*
	* @param {Number} d - datum
	* @param {Number} i - index
	* @returns {String} color string
	*/
	function zScale( d ) {
		return ( d ) ? '#474747' : '#eee';
	} // end FUNCTION zScale()

	/**
	* FUNCTION: rowOrderings( arr )
	*	Computes row orderings based on Hamming distance.
	*
	* @param {Array} arr - data array
	* @returns {Array} ordering array
	*/
	function rowOrderings( arr ) {
		var len = arr.length,
			N = arr[ 0 ].length,
			tmp,
			out,
			sum,
			x, y,
			i, j, k;

		out = new Array( len );
		for ( i = 0; i < len; i++ ) {
			x = arr[ i ];
			tmp = new Array( len );
			for ( j = 0; j < len; j++ ) {
				y = arr[ j ];
				sum = 0;
				for ( k = 0; k < N; k++ ) {
					if ( x[k] === y[k] ) {
						sum += 1;
					}
				}
				tmp[ j ] = {
					'idx': j,
					'sum': sum
				};
			}
			tmp.sort( sort );
			for ( j = 0; j < len; j++ ) {
				tmp[ j ] = tmp[ j ].idx;
			}
			out[ i ] = tmp;
		}
		return out;
	} // end FUNCTION rowOrderings()

	/**
	* FUNCTION: colOrder( N )
	*	Computes random column orderings.
	*
	* @param {Number} N - array length
	* @returns {Array} ordering array
	*/
	function colOrder( N ) {
		var out = new Array( N ),
			i,
			j,
			tmp;

		for ( i = 0; i < N; i++ ) {
			out[ i ] = i;
		}
		for ( i = N - 1; i > 0; i-- ) {
			j = Math.floor( Math.random() * (i+1) );
			tmp = out[ i ];
			out[ i ] = out[ j ];
			out[ j ] = tmp;
		}
		return out;
	} // end FUNCTION colOrder()

	/**
	* FUNCTION: sort( a, b )
	*
	*/
	function sort( a, b ) {
		return b.sum - a.sum;
	} // end FUNCTION sort()

	/**
	* FUNCTION: DataFrame( arr[, opts] )
	*	Data frame constructor.
	*
	* @constructor
	* @param {Array} arr - array of arrays
	* @param {Object} [opts] - data frame options
	* @returns {DataFrame} DataFrame instance
	*/
	function DataFrame( arr, options ) {
		var args = arguments,
			nArgs = args.length,
			opts = {},
			len,
			N,
			i;
		if ( !nArgs ) {
			throw new Error( 'DataFrame()::insufficient input arguments. Must provide a data array.' );
		} else if ( nArgs === 2 ) {
			opts = options;
		}
		if ( !(this instanceof DataFrame) ) {
			return new DataFrame( arr, opts );
		}
		if ( !Array.isArray( arr ) ) {
			throw new TypeError( 'DataFrame()::invalid input argument. Must provide a data array.' );
		}
		len = arr.length;
		for ( i = 0; i < len; i++ ) {
			if ( !Array.isArray( arr[i] ) ) {
				throw new TypeError( 'DataFrame()::invalid input argument. Data array must be an array of arrays.' );
			}
		}
		N = arr[ 0 ].length;
		for ( i = 1; i < len; i++ ) {
			if ( arr[ i ].length !== N ) {
				throw new Error( 'DataFrame()::invalid input argument. Data array must contain equal length arrays.' );
			}
		}
		if ( !opts.rownames ) {
			this._rownames = new Array( len );
			for ( i = 0; i < len; i++ ) {
				this._rownames[ i ] = i;
			}
		} else {
			if ( !Array.isArray( opts.rownames ) ) {
				throw new TypeError( 'DataFrame()::invalid input argument. Row names must be an array.' );
			}
			if ( opts.rownames.length !== len ) {
				throw new Error( 'DataFrame()::invalid input argument. Number of row names does not equal the number of rows.' );
			}
			this._rownames = opts.rownames;
		}
		if ( !opts.colnames ) {
			this._colnames = new Array( N );
			for ( i = 0; i < N; i++ ) {
				this._colnames[ i ] = i;
			}
		} else {
			if ( !Array.isArray( opts.colnames ) ) {
				throw new TypeError( 'DataFrame()::invalid input argument. Column names must be an array.' );
			}
			if ( opts.colnames.length !== N ) {
				throw new Error( 'DataFrame()::invalid input argument. Number of column names does not equal the number of columns.' );
			}
			this._colnames = opts.colnames;
		}
		this._data = arr;
		this._nRows = len;
		this._nCols = N;
		return this;
	} // end FUNCTION dataFrame()

	/**
	* METHOD: data()
	*	Returns the data frame data.
	*
	* @returns {Array} data - data frame data
	*/
	DataFrame.prototype.data = function() {
		return this._data;
	}; // end METHOD data()

	/**
	* METHOD: rownames( [names] )
	*	Data frame row names setter and getter. If provided names, set the data frame row names. If not provided names, returns the data frame row names.
	*
	* @param {Array} [names] - row names
	* @returns {DataFrame|Array} DataFrame instance or row names
	*/
	DataFrame.prototype.rownames = function( names ) {
		if ( !arguments.length ) {
			return this._rownames.slice( 0 );
		}
		if ( !Array.isArray( names ) ) {
			throw new TypeError( 'rownames()::invalid input argument. Must provide an array.' );
		}
		if ( names.length !== this._nRows ) {
			throw new Error( 'rownames()::invalid input argument. Number of names must equal the number of rows.' );
		}
		this._rownames = names;
		return this;
	}; // end METHOD rownames()

	/**
	* METHOD: colnames( [names] )
	*	Data frame columns names setter and getter. If provided names, set the data frame column names. If not provided names, returns the data frame column names.
	*
	* @param {Array} [names] - column names
	* @returns {DataFrame|Array} DataFrame instance or column names
	*/
	DataFrame.prototype.colnames = function( names ) {
		if ( !arguments.length ) {
			return this._colnames.slice( 0 );
		}
		if ( !Array.isArray( names ) ) {
			throw new TypeError( 'colnames()::invalid input argument. Must provide an array.' );
		}
		if ( names.length !== this._nCols ) {
			throw new Error( 'colnames()::invalid input argument. Number of names must equal the number of columns.' );
		}
		this._colnames = names;
		return this;
	}; // end METHOD colnames()


	// SCRIPT //

	// Get the template for a figure configuration:
	getResource( './../examples/data/data.json', onData );

})();
