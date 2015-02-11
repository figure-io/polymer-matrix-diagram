TODO
====

1. data frame
	-	separate module
	-	bundle with component
	-	when data is set as an array of arrays, convert to DF
		- 	cannot do, as need colnames and rownames at the same time as setting; users will need to use DFs
	- 	accept a data frame `View`
2. legend support
	-	place on bottom
	-	two items possible
		-	opacity
		-	color
	-	Symbols should be like colorbars
		-	one showing opacity with label
		-	another showing colors with label
	-	should be brushable elements
		-	snap to values (?)
		-	use delayed callbacks to only update chart after brush
	- 	cScale brushable legend
		-	loop through all cells (cScale empirically determined), pass through cScale fcn, gather unique color values, sort colors, create legend element
3. 
4. 
5. TESTS!!!!!
	- 	Makefile targets for running tests locally and remotely
	-	wct-istanbul
6. `config` method
	-	see #26
7. update README regarding df
8. `on()` as an alias to `addEventListener()`?
	- could have it only accept the publicized events and do input validation
9. favicon
	-	needs work
10. 
11. 
12. 
13. github pages demo
	- 	copy over example code and augment (datgui?)
	- 	other datasets (?)
14. 
15. media queries
	-	at small size, remove row/column names/labels? ala details on demand.
		-	would require keeping tabs on element size in JS --> if <, remove and reset the width; once > ensure present and reset the width. Would make the `getPadding` method more complex, as would need to know container dimensions
16. all html version
	-	use CSS
	-	drag-n-drop would be easier
	-	gpu for animation (classes)
	-	`polymer-matrix-diagram-html` or `vanilla` (:))
	-	use background-color with rgba
17. canvas
	-	`polymer-matrix-diagram-canvas`
18. drop new row
	-	see timeseries
	-	data in payload
	-	validate data conforms to df dimensions
	-	since modifying df, will not trigger `data` changed watcher; will have to repeat steps within that watcher elsewhere
19. drag off row
	-	via rowname
	-	key+drag ?? [modality](http://bl.ocks.org/mbostock/6123708)
		-	some way of differentiating between a normal drag which is bounded by graph area and a drag which is for removing a row
		- 	if `y` position outside of `y` bounds, then remove from df and update similar to the `data` changed watcher
20. x/y axis brushing
	-	e.g., effectively a zoom
	-	would allow for infinite x/y scrolling
	-	may need to bring back clipPath
		-	maybe not; may not want that; may want columns/rows flying in from the outside
	- 	may be an argument for separating axes (rownames) from cells
		-	maybe not
	- 	would require
		-	rowBrushData/colBrushData
			- 	1d array
			-	mapped to ordinal scales
		-	a brushable element above/left of the col/row names
		-	some sort of visual encoding for the brush data
			-	do we plot the names, just like we do the axes?
			-	what if we have too many names, such that text overlaps, what then?
			- 	may be no visual encoding, just a 1d brush
		- 	a rowBrushEnd/colBrushEnd event emitted
			-	extent payload
		-	left to user to map the brush extent to the main diagram data
			-	query a db; update the df; create a new view; etc
21. row/column modes
	-	sort (sortable)
	-	click (clickable)
	-	scroll (scrollable) --> or brush (brushable)
	- 	none
22. separate/independent example using, say, phylogenetic, FB, survey, or some other data
	- 	see #13
23. 
24**. `toJSON()` method
	-	generate configuration in accordance with specification
25. reference specification in README
26. how does specification fit in with the `config` attribute?
	-	stipulate that a partial object be merged with a spec template
	-	could handle this internally; always merge and then validate. +1
27. 
28. 
29. 



## Bugs

1. on resize/changes to chart dimensions, cell brush overlay should scale with the graph
	-	see `brushEnd.js`
2. ensure font-size is never negative
	-	probably want to set a flag, such that, if the font size is < X, then the names should not be shown



## Open Questions

Items moved from TODO, which are not actionable at the current time.

1. Axis orientation support?
	-	ability to choose left or right axis?
	-	ability to choose top or bottom axis?
	-	in my opinion, left and top are most appropriate given how the user will read the diagram. Further, left and top match notion of a table. No well designed table has the row names on the right and the headers on the bottom. (Left-to-right orientation.)
2. support for dual row/column labels (???)
	-	not sure how useful this is; why not just create two separate matrix diagrams (small multiples)? Better able to compare variable relationships.
	-	x1, x2
	-	y1, y2
	-	Not going to support due to reason above.
3. should the brushable version be its own separate (super) element, which extends the base ("simple") element?
	-	`polymer-matrix-diagram-brushable`
		- 	would probably prefer `polymer-matrix-diagram-static`; by default, the primary component is a swiss army knife; static conveys this is a one and done component
	- 	minimal matrix diagram
		-	no sorting
		-	no automatic padding calculation
		-	no brush
		-	no click/hover/drag listeners
		-	no attribute changed listeners
			-	assume everything configured from start and on the element
		- 	no validation
		-	no data frame; can provide an array of arrays when declaring element in HTML
		-	no event emitting
4. resetRowOrder/resetColOrder
	-	methods to reset rows and columns to their original order
	-	simply sort the row/col order and set, as initial order is a range array.
	-	no! this should be left to the user, as only they will know the proper way to "reset" the order
5. should a `resizable` attribute exist?
	-	if set to `true`, would
		-	add resize sprites
		-	mousedown/mousemove/mouseup listeners
		-	track mouse x,y coords
		-	provide visual feedback to user regarding resize dimensions
			- e.g., dotted outline, actually resizing the chart (not recommended, as expensive with each mousemove)
		- 	calculate the width/height of element
		-	set chart width/height
		- 	emit a resized event, with dimensions
6. 	 



## Tests

1. `clear()`


## DataFrame

1. see R/python
2. enforce type (?)
3. move to separate module
4. tests
5. observers (?)
	-	prevent side effects (e.g., col names length no longer corresponding to number of columns, data being externally mutated)
	- 	maybe copy to immutable arrays?
		- 	or just do a deep copy and store internally
	-	event emitter when does mutate (?)
	-	(1) deep copy input `array`; (2) wrap copied `array` in closure; (3) return a data frame which only references the enclosed `array`; (4) force updates via the API.
6. `toString()`
	- 	JSON blob with `rownames`, `colnames`, and `data` properties
7. add/remove row (+rowname)
8. add/remove column (+colname)
9. update row/colname
10. 
11. a data frame view (akin to go slice)	-	method which returns a new `View` instance
	-	`new View( [i,j], [i,j] )`
12. 



