# JS Specific Improvements
- Using the ES6 syntax, we can define private methods directly. Methods like `scanToken()` should be private. To make them private just add a hashtag (#) before the function name and wherever it is called.


# Major Improvements
- Extending the `Lox Standard Library` can be a really useful improvement. Consider implementing the features listed in _Standard Library Improvements_ section.

- Implementing a `try-catch-finally` construct would drastically help the language, especially if you implement the type casting methods I suggested in the _Standard Library Improvements_ section. Pairing it with the `raiseException()` function won't hurt too. In that case, raiseException method shall throw an error other than just exiting the process.

- Adding a modulus operation would also increase the arithmetic capabilities of our language. It would allow us to use `x % 2` for finding out if x is an even number or odd number. We can also implement it ourselves if we add the `int()` method as discussed in the _Standard Library Improvements_ section.

- Adding an array functionality in our language would be by far one of the most important improvements for the Lox language. Alternatively, you can review the Array class idea I provided in the _Standard Library Improvements_ section.


# Standard Library Improvements
- `input(prompt)`: This method would call `window.prompt()` and return the input provided by the user as a string.

- `int(object)`, `float(object)`, `bool(object)`, and `string(object)`: These methods would type cast the given _object_ into the desired type. There can also be errors triggered in certain situations like for `int(object)` method, when the passed object is an invalid string like _abc123_.

- `raiseException(message)`: This method would stop the execution at that moment signalling that something went wrong. It is similar to `exit(code)` but as we don't need to return exit codes, we simply display an error message and stop.

- `Array class` and `HashMap class`: Instead of methods, adding entire classes can we extremely beneficial, especially if the class is like `Array`, `HashMap` or `Math`. We can basically have an array as a variable inside our JS implementation and for every call to methods like `push(element)` or `append(element)` or `add(element)`, we would add that element to our list. There can be methods like `length()`, `insert(element, pos)`, `find(element)`, `delete(element)`, `display()`, etc.

- `Math class`: Why not add an entire math class instead of methods as we can then access useful methods like: `sqrt(num)`, `cbrt(num)`, `pow(num, power)`, `hypot(a, b)`, `sin(radian)`, `cos(radian)`, `tan(radian)`, `asin(value)`, `acos(value)`, `atan(value)`, and `random()`. Not to mention, you can also implement different methods for calculating volume and area for different shapes. `Math.PI` as a constant would also be good.

- `A GUI class`: It's more complex, why not discuss it in a different section?


## A GUI class
...