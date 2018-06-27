
[![GitHub license](https://img.shields.io/github/license/CorentinTh/quadtree-js.svg)](https://github.com/CorentinTh/quadtree-js/blob/master/LICENSE)
[![built with gulp](https://img.shields.io/badge/gulp-built_project-eb4a4b.svg?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAYAAAAOCAMAAAA7QZ0XAAAABlBMVEUAAAD%2F%2F%2F%2Bl2Z%2FdAAAAAXRSTlMAQObYZgAAABdJREFUeAFjAAFGRjSSEQzwUgwQkjAFAAtaAD0Ls2nMAAAAAElFTkSuQmCC)](http://gulpjs.com/)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
![npm](https://img.shields.io/npm/dw/js-quadtree.svg)

# quadtree-js
A powerful quadtree implementation in javascript. It can be used for nodejs or directly in the browser.

## Installation

**Quadtree-js** can be installed using yarn or npm.

```bash
npm install quadtree-js
```
```bash
yarn add quadtree-js
```

And import it using the ES6 syntax:

```javascript
import {QuadTree, Box, Point, Circle} from 'quadtree-js';

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

// Specify the maximum amount of point per node (default: 4)
const maxNodeCapacity = 4;

// An array of point to insert directly (same as quadtree.insert(points) )
const points = [new Point(10, 10), new Point(52, 64)];

const quadtree = new QuadTree(boundingArea, maxNodeCapacity, points);
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

### Clear

Use this method to clear the quadtree. It remove all the points and sub-nodes.

```javascript
quadtree.clear();
```


## Todo
* Create proper test for the Quadtree class.

Feel free to contribute or improve :)

## License

This project is under the [MIT license](LICENSE).