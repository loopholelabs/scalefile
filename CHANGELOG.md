# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v0.1.8] - 2023-03-11

### Changes

- Moving the `webpack` loader plugin into this repository 
- Modified the `scalefunc` dependency so that while treeshaking if the `fs` dependency is not required it will not be loaded
- The Go `scalefile` package has also been modified to reuse the `Language` types and definitions from the `scalefunc` package

## [v0.1.7] - 2023-02-17

### Changes

- Fixing CI/CD Pipeline to properly test `Typescript` code
- Updating the `ValidName` function to allow `-` and `.` characters in the name, but not `_`. 
- `ValidName` is now called `ValidString` and is used to validate the name, tag, and organization of a scale function.

## [v0.1.6] - 2023-02-16

### Features

- Updating `README.md` with a Discord badge
- Streamlining `package.json` to only include the necessary dependencies
- Adding `ValidName` functions to the `Go` and `Typescript` implementations of the `scalefunc` library

## [v0.1.5] - 2023-02-06

### Features

- Adding support for a TypeScript Host
- Adding functions to the scalefunc library to read and write scale functions to files

## [v0.1.0] - 2022-11-25

### Features

- Initial release of the Scalefile library.

[unreleased]: https://github.com/loopholelabs/scalefile/compare/v0.1.8...HEAD
[v0.1.8]: https://github.com/loopholelabs/scalefile/compare/v0.1.8
[v0.1.7]: https://github.com/loopholelabs/scalefile/compare/v0.1.7
[v0.1.6]: https://github.com/loopholelabs/scalefile/compare/v0.1.6
[v0.1.5]: https://github.com/loopholelabs/scalefile/compare/v0.1.5
[v0.1.0]: https://github.com/loopholelabs/scalefile/compare/v0.1.0
