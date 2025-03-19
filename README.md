# Lambda Function Refactor

Allows for refactoring a function and all of its function calls to a local lambda expressions instead. The lambda expression can be a one shot or can be stored as a local variable.


## Why make this extension?

I really enjoy lambda expressions in C++. I believe they are a modern alternative to traditional functions that maintain encapsulation while also providing code locality. In my opinion this benefit of code locality allows for easier reading of a codebase.

### Lambda functions are perfect for:
* Single use functions, especially those that create a host of temporary variables only to generate a single necessary object
* Simple reusable functions with local scope

### Lambda functions are not great for:
* Well defined functionality that is reused in multiple contexts
* Complex code that requires distinct unit tests


## Features

- None yet!

### Planned Features

- Replace single function calls with a lambda one shot expression, and remove the original function
- Replace several function calls with a single reusable `std::function` lambda expressions variable, and remove the original function
- Add checks and warnings when any action breaks the current codebase
  - Ex: When a single function call replace is used but more than one call exists
  - Ex: When a function being replaced is called in multiple contexts
- Allow for interactive closure parameter refactoring
- Add support for configuring the code generation based on the project's C++ standard
- Support the lambda expression equivalent in other languages
