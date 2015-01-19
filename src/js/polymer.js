/**
*
*	COMPONENT: polymer-matrix-diagram
*
*
*	DESCRIPTION:
*		- Registers the polymer-matrix-diagram web-component.
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

/* global Polymer */
'use strict';

// MODULES //

var Chart = require( './chart.js' );


// POLYMER //

Polymer( 'polymer-matrix-diagram', Chart.prototype );
