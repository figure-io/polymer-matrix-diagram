/**
*
*	EVENTS
*
*
*	DESCRIPTION:
*		- List of public broadcast events to which clients may subscribe.
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

// EXPORTS //

module.exports = [
	'data',
	'roworder',
	'colorder',
	'colors',
	'colorOrder',

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

	'sortend',
	'sortend.row',
	'sortend.col',

	'transitionended',

	'brushend'
];
