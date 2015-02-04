TODO
====

1. data frame
	-	separate module
	-	bundle with component
	-	when data is set as an array of arrays, convert to DF
		- 	cannot do, as need colnames and rownames; users will need to use DFs
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
		-	use delayed callbacks to only update after brush
	- 	cScale brushable legend
		-	loop through all cells, pass through cScale fcn, gather unique color values, sort colors, create legend element
3. split into separate files
4. rowdragend/coldragend events
5. add `events` attribute to the README.
6. `config` method
7. update README regarding df
8. `on()` as an alias to `addEventListener()`?
	- could have it only accept the publicized events and do input validation
9. favicon
	-	needs work
10. Wiki (?)
11. update wct plugins
	-	istanbul
12. schema and validator
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
	-	`polymer-matrix-diagram-html` or vanilla
	-	use background-color with rgba
17. canvas
	-	`polymer-matrix-diagram-canvas`
18. drop new row
19. drag off row
	-	via rowname
20. x/y axis brushing
	-	e.g., effectively a zoom
	-	would allow for infinite x/y scrolling
	-	may need to bring back clipPath
	- 	may be an argument for separating axes (rownames) from cells
		-	maybe not
21. row/column modes
	-	sort (sortable)
	-	click (clickable)
	-	scroll (scrollable) --> or brush (brushable)
	- 	none
22. separate/independent example using, say, phylogenetic, FB, survey, or some other data
	- 	see #13
23. 


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
4. 



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
10. method to return dimensions
11. 



