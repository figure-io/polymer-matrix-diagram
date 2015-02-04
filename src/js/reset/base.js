/**
*
*	FUNCTION: resetBase
*
*
*	DESCRIPTION:
*		- Reset base chart elements.
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

/**
* FUNCTION: resetBase()
*	Resets base elements.
*
* @returns {Object} context
*/
function resetBase() {
	/* jslint validthis:true */
	var pLeft, pTop;

	pLeft = ( this.paddingLeft === null ) ? this._paddingLeft : this.paddingLeft;
	pTop = ( this.paddingTop === null ) ? this._paddingTop : this.paddingTop;

	this.$.graph
		.attr( 'transform', 'translate(' + pLeft + ',' + pTop + ')' );

	this.$.bkgd
		.attr( 'width', this.graphWidth() )
		.attr( 'height', this.graphHeight() );
	return this;
} // end FUNCTION resetBase()


// EXPORTS //

module.exports = resetBase;
