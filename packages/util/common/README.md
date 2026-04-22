# @alation/util

Kind of like lodash, but alationy

## What Belongs Here?

- Pure utility functions such as string manipulation functions

## What Doesn't Belong Here?

- Alation business logic ([@alation/core](https://github.com/Alation/alation-ui/tree/main/libs/core), ...)
- React Components ([@alation/core-ui](https://github.com/Alation/alation-ui/tree/main/libs/core-ui), [@alation/fabric](https://github.com/Alation/alation-ui/tree/main/libs/fabric), [@alation/icons](https://github.com/Alation/alation-ui/tree/main/libs/icons), ...)
- Peer Dependencies (don't use 3rd party libraries here)
- Methods that already exist in ES6

## Publishing

Package versioning, tagging and publishing happens automatically via the [Publish Github Action](https://github.com/Alation/alation-ui/blob/main/.github/workflows/publish.yaml)

## Methods

### isObject

Returns boolean true if subject is a boolean otherwise false

```javascript
isObject({}); // true
isObject(noop); // true
isObject([0, 1, 2]); // true
isObject(/abc/g); // true
isObject(new Number(0)); // true
isObject(new String('foo')); // true

isObject('foo'); // false
isObject(1); // false
isObject(undefined); // false
isObject(null); // false
isObject(NaN); // false
```

### noop

```javascript
noop(); // undefined
```

### uniqueId

Generates a unique ID. If prefix is given, the ID is appended to it.

```javascript
uniqueId('foo_'); // 'foo_1'
uniqueId('foo_'); // 'foo_2'
```

This method returns undefined.

## Building

Run `nx build util` to build the library.

## Running unit tests

Run `nx test util` to execute the unit tests via [Jest](https://jestjs.io).

This library was generated with [Nx](https://nx.dev).
