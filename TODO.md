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
3. 
4. 
5. Axis orientation support?
	-	ability to choose left or right axis?
	-	ability to choose top or bottom axis?
	-	in my opinion, left and top are most appropriate given how the user will read the diagram. Further, left and top match notion of a table. No well designed table has the row names on the right and the headers on the bottom. (Left-to-right orientation.)
6. support for dual row/column labels (???)
	-	not sure how useful this is; why not just create two separate matrix diagrams (small multiples)? Better able to compare variable relationships.
	-	x1, x2
	-	y1, y2
	-	Not going to support due to reason above.
7. update README regarding df
8. `on()` as an alias to `addEventListener()`?
	- could have it only accept the publicized events and do input validation
9. favicon
	-	needs work
10. Wiki
11. update wct plugins
	-	istanbul
12. lasso support
	-	ability to brush over the cells
	-	emit an array of [i,j] values
13. manual sorting (via names)
	- 	drag
	-	mousedown
	-	translate column/row
	-	will need to disambiguate listeners; e.g., from normal click listeners
	-	translate in direction of mouse movement, constrained either vertically or laterally, depending on if column or row name being dragged, respectively
	-	find nearest column or row
	-	get col/row index
	-	insert new index into domain array and shift all other indices down the array by 1
	-	reset cols/rows (animation)
14. should the brushable version be its own separate (super) element, which extends the base ("simple") element?
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
18. 



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



