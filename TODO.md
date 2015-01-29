TODO
====

1. data frame
	-	separate module
	-	bundle with component
	-	when data is set as an array of arrays, convert to DF
2. 
3. title
	-	positioning
4. xlabel, ylabel (??)
	-	requires positioning finagling
	-	could auto position, as long as padding values are `null`. Once set, we abide by set values
5. transition parameters
	- 	transition duration
	- 	only transition if duration is a positive number; otherwise, just update
	- 	if duration is allowed, need to update 'transitionEnd' documentation
6. 
7. update README regarding df
8. `on()` as an alias to `addEventListener()`?
	- could have it only accept the publicized events and do input validation
9. favicon
	-	needs work
10. Wiki



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



