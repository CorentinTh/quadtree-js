
<p align="center">
    <img src=".github/logo.png" alt="logo">
</p>


<p align="center">
    <a href="https://www.npmjs.com/package/js-quadtree"><img src="https://img.shields.io/npm/dw/js-quadtree.svg" alt="Weekly Downloads" /></a>
    <a href="https://github.com/CorentinTh/quadtree-js/actions?query=workflow%3A%22Node+CI%22"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/CorentinTh/quadtree-js/Node CI"></a>
    <a href='https://coveralls.io/github/CorentinTh/quadtree-js?branch=master'><img src='https://coveralls.io/repos/github/CorentinTh/quadtree-js/badge.svg?branch=master' alt='Coverage Status' /></a>
    <a href="https://www.npmjs.com/package/js-quadtree"><img src="https://img.shields.io/bundlephobia/minzip/js-quadtree.svg" alt="npm bundle size" /></a>
    <a href="https://www.npmjs.com/package/js-quadtree"><img src="https://img.shields.io/github/package-json/v/CorentinTh/quadtree-js.svg" alt="GitHub package.json version" /></a>
    <a href='LICENCE'><img src="https://img.shields.io/github/license/CorentinTh/quadtree-js.svg" alt="Licence Badge" /></a>
</p>



A powerful quadtree implementation in javascript. It can be used for nodejs or directly in the browser.

## Installation

**Quadtree-js** can be installed using yarn or npm.

```bash
npm install js-quadtree
# or
yarn add js-quadtree
```

And import :

```javascript
const {QuadTree, Box, Point, Circle} = require('js-quadtree');

const quadtree = new QuadTree(new Box(0, 0, 1000, 1000));

quadtree.insert(new Point(100, 200, {custom: 'data'}));

const results = quadtree.query(new Circle(150, 150, 100));
```

## Usage
### Creation
```javascript
// Create the bounding area of the quadtree
const boundingArea = new Box(0, 0, 1000, 1000);

// Instantiate  the new quadtree
const quadtree = new QuadTree(boundingArea);
```

You can also specify the following optional parameters:
```javascript
// Create the bounding area of the quadtree
const boundingArea = new Box(0, 0, 1000, 1000);

const config = {
    capacity: 10,           // Specify the maximum amount of point per node (default: 4)
    removeEmptyNodes : true // Specify if the quadtree has to remove subnodes if they are empty (default: false).
};

// An array of point to insert directly (same as quadtree.insert(points) )
const points = [new Point(10, 10), new Point(52, 64)];

const quadtree = new QuadTree(boundingArea, config, points);
```

### Insert

You can insert a **Point** element, an array of **Point** element, your **own element** as long as it has an **x** and a **y** property or an array of custom element.

```javascript
const point = new Point(10, 25);

const pointArray = [
    new Point(45, 22),
    new Point(30, 60),
    new Point(14, 12)
];

const customPoint = {
    x: 94,
    y: 23,
    customField:{}
};

quadtree.insert(point);
quadtree.insert(pointArray);
quadtree.insert(customPoint);
```

You can add your data in a **Point** element:
```javascript
const myData = {
    foo: 'bar'
};

const point = new Point(50, 50, myData);

console.log(point.data.foo); // 'bar'
```

### Remove

As the **insert** method, you can remove a **Point** element, an array of **Point** element, your **own element** as long as it has an **x** and a **y** property or an array of custom element.

```javascript
const point = new Point(10, 25);

const pointArray = [
    new Point(45, 22),
    new Point(30, 60),
    new Point(14, 12)
];

const customPoint = {
    x: 94,
    y: 23
};

quadtree.remove(point);
quadtree.remove(pointArray);
quadtree.remove(customPoint);
```

**Note**: it doesn't have to be the same object, the test is done with the coordinates.

### Query

Use the **query** method to get all the point within a range.


```javascript
// This will return all the points in the given Box
const points = quadtree.query(new Box(10, 10, 100, 100));
```

```javascript
// This will return all the points in the given Circle
const points = quadtree.query(new Circle(10, 10, 100));
```

You can use a **Box** or a **Circle** as a range or even your own range element as long as it has the following methods:
* **contains**: return true if a point is within this range, false otherwise.
* **intersects**: return true if a **Box** intersects with this range, false otherwise.
See [the Box definition](src/Box.js) for a good example.

### Get all the point

If want to retrieve all the point, you can use this method:

```javascript
const points = quadtree.getAllPoints();
```

**Note**: you may want to store your points in a side array since, it have to look trough all the child nodes.

### Get Tree

You can get the amount of points by nodes with the `getTree()` method.

```javascript
const qt = new QuadTree(new Box(0, 0, 10, 10));

qt.insert(new Point(5, 5));
qt.insert(new Point(6, 5));
qt.insert(new Point(4, 5));
qt.insert(new Point(3, 5));
qt.insert(new Point(2, 5));
qt.insert(new Point(1, 5));

console.log(qt.getTree());

// {
//     ne: 2, 
//     nw: {
//         ne: 0, 
//         nw: 0, 
//         se: 3, 
//         sw: 2
//     }, 
//     se: 2,
//     sw: 3
// }
```

### Clear

Use this method to clear the quadtree. It remove all the points and sub-nodes.

```javascript
quadtree.clear();
```

## License

This project is under the [MIT license](LICENSE).
