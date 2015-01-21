TODO
====

1. data frame
2. 
3. 
4. 
5. transition parameters
	- 	transition duration
	- 	only transition if duration is a positive number; otherwise, just update
	- 	if duration is allowed, need to update 'transitionEnd' documentation
6. formalize hover interaction
7. update README regarding df
8. `on()` as an alias to `addEventListener()`?
	- could have it only accept the publicized events and do input validation


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
6. `toString()`



