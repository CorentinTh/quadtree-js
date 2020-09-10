# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 3.3.1
- Fix duplication of points on child borders when node get divided

## 3.3.0
- Insertion returns a boolean (true if inserted successfully, false otherwise) 

## 3.2.4
- No longer publishing on tag
- No longer creating a release on tag

## 3.2.2
- Now publishing on tag
- Publishing on npm and github repository
- Creating release on tag

## 3.2.1
- Improved performances by using `Math.min` and `Math.max` instead of custom functions.

## 3.2.0
- Added `arePointsEqual` option in the Quadtree config

## 3.1.1
- Added generic type `Shape` for the query method  ([#10](https://github.com/CorentinTh/quadtree-js/pull/10))

## 3.1.0
- Added `maximumDepth` option for the Quadtree

## 3.0.0
- Bundle for browser/umd/es using rollup
- Switched to typescript
- Added unit tests to improve coverage
- Switched from travis to github actions
- Added CHANGELOG
