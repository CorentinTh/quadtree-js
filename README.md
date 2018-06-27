# quadtree-js
A powerful quadtree implementation in javascript. It can be used for nodejs or directly in the browser.

## Installation

**Quadtree-js** can be installed using yarn or npm.

```bash
npm install quadtree-js
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

## License

This project is under the [MIT license](LICENSE).