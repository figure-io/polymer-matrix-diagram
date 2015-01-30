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
3. title
	-	positioning (left, center, right ??)
	-	auto-position similar to xlabel/ylabel below
4. xlabel, ylabel (??)
	-	requires positioning finagling
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



