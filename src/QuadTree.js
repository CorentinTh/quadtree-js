const Box = require('./Box');

/**
 * QuadTree class.
 * @class QuadTree
 */
class QuadTree {
    /**
     * Create a new QuadTree
     * @constructor
     * @param {Box} container - The box on which the QuadTree will operate.
     * @param {Object} [config] - The configuration of the quadtree.
     * @param {number} [config.capacity] - The maximum amount of points per node.
     * @param {boolean} [config.removeEmptyNodes] - Specify if the quadtree has to remove subnodes if they are empty.
     * @param {(Object[]|Point[])} [points] - An array of initial points to insert in the QuadTree.
     * @param {number} points[].x - X coordinate of the point.
     * @param {number} points[].y - Y coordinate of the point.
     */
    constructor(container, config, points = []) {
        this._container = container;
        this._config = this._parseConfig(config);

        this._isDivided = false;
        this._points = [];

        for (let point of points) {
            this._insert(point);
        }
    }

    /**
     * Parses the configuration and assigns the default values
     * @param {Object} config - The user configuration
     * @returns {Object}
     * @private
     */
    _parseConfig(config) {
        const defaultConfig = {
            capacity: 4,
            removeEmptyNodes: false
        };

        return Object.assign({}, defaultConfig, config);
    }


    getTree() {
        let tree;

        if (this._isDivided) {
            tree = {
                ne: this._ne.getTree(),
                nw: this._nw.getTree(),
                se: this._se.getTree(),
                sw: this._sw.getTree()
            };

        } else {
            tree = this._getNodePointAmount();
        }

        return tree;
    }

    /**
     * Get all the points in the QuadTree
     * @returns {(Object[]|Point[])} - An array containing all the points.
     */
    getAllPoints() {
        const pointsList = [];
        this._getAllPoints(pointsList);
        return pointsList;
    }

    /**
     * Get all the points in the QuadTree
     * @param {(Object[]|Point[])} pointsList
     * @private
     */
    _getAllPoints(pointsList) {
        if (!this._isDivided) {
            Array.prototype.push.apply(pointsList, this._points.slice());
            return;
        }

        this._ne._getAllPoints(pointsList);
        this._nw._getAllPoints(pointsList);
        this._se._getAllPoints(pointsList);
        this._sw._getAllPoints(pointsList);
    }

    /**
     * Return the amount of points in this node.
     * @returns {number} - The amount of points in this node.
     * @private
     */
    _getNodePointAmount() {
        return this._points.length;
    }

    /**
     * Divide this node into 4 sub-nodes
     * @private
     */
    _divide() {
        this._isDivided = true;

        let x = this._container.x;
        let y = this._container.y;
        let w = this._container.w / 2;
        let h = this._container.h / 2;

        // Creation of the sub-nodes, and insertion of the current point
        this._ne = new QuadTree(new Box(x + w, y, w, h), this._config, this._points.slice());
        this._nw = new QuadTree(new Box(x, y, w, h), this._config, this._points.slice());
        this._se = new QuadTree(new Box(x + w, y + h, w, h), this._config, this._points.slice());
        this._sw = new QuadTree(new Box(x, y + h, w, h), this._config, this._points.slice());

        // We empty this node points
        this._points.length = 0;
        this._points = [];
    }

    /**
     * Remove a point in the QuadTree
     * @param {(Point|Object|Point[]|Object[])} pointOrArray - A point or an array of points to remove
     * @param {number} pointOrArray.x - X coordinate of the point
     * @param {number} pointOrArray.y - Y coordinate of the point
     */
    remove(pointOrArray) {
        if (pointOrArray.constructor === Array) {
            for (const point of pointOrArray) {
                this._remove(point);
            }
        } else {
            this._remove(pointOrArray);
        }
    }

    /**
     * Remove a point in the QuadTree
     * @param {(Point|Object)} point - A point to remove
     * @param {number} point.x - X coordinate of the point
     * @param {number} point.y - Y coordinate of the point
     * @private
     */
    _remove(point) {
        if (!this._container.contains(point)) {
            return;
        }

        if (!this._isDivided) {
            //this._points.splice(this._points.findIndex(aPoint => aPoint.x === point.x && aPoint.y === point.y), 1);

            const len = this._points.length;
            for (let i = len - 1; i >= 0; i--) {
                if (point.x === this._points[i].x && point.y === this._points[i].y) {
                    this._points.splice(i, 1);
                }
            }

            return;
        }

        this._ne._remove(point);
        this._nw._remove(point);
        this._se._remove(point);
        this._sw._remove(point);

        if (this._config.removeEmptyNodes) {
            if (this._ne._getNodePointAmount() === 0 && !this._ne._isDivided &&
                this._nw._getNodePointAmount() === 0 && !this._nw._isDivided &&
                this._se._getNodePointAmount() === 0 && !this._se._isDivided &&
                this._sw._getNodePointAmount() === 0 && !this._sw._isDivided) {

                this._isDivided = false;

                delete this._ne;
                delete this._nw;
                delete this._se;
                delete this._sw;
            }
        }
    }

    /**
     * Insert a point in the QuadTree
     * @param {(Point|Object|Point[]|Object[])} pointOrArray - A point or an array of points to insert
     * @param {number} pointOrArray.x - X coordinate of the point
     * @param {number} pointOrArray.y - Y coordinate of the point
     */
    insert(pointOrArray) {
        if (pointOrArray.constructor === Array) {
            for (const point of pointOrArray) {
                this._insert(point);
            }
        } else {
            this._insert(pointOrArray);
        }
    }


    /**
     * Insert a point in the QuadTree
     * @param {(Point|Object)} point - A point to insert
     * @param {number} point.x - X coordinate of the point
     * @param {number} point.y - Y coordinate of the point
     * @returns {boolean}
     * @private
     */
    _insert(point) {
        if (!this._container.contains(point)) {
            return false;
        }

        if (!this._isDivided) {
            if (this._getNodePointAmount() < this._config.capacity) {
                this._points.push(point);
                return true;
            }

            this._divide();
        }

        if (this._ne._insert(point)) return true;
        if (this._nw._insert(point)) return true;
        if (this._se._insert(point)) return true;
        return this._sw._insert(point);
    }

    /**
     * Query all the point within a range
     * @param {(Box|Object|Circle)} range - The range to test
     * @param {number} range.x - X coordinate of the range.
     * @param {number} range.y - Y coordinate of the range.
     * @param {number} range.w - Width of the range.
     * @param {number} range.h - Height of the range.
     * @returns {(Point[]|Object[])} - The points within the range
     */
    query(range) {
        let pointsFound = [];
        this._query(range, pointsFound);
        return pointsFound;
    }

    /**
     * @param {(Box|Object)} range
     * @param {(Point[]|Object[])} pointsFound
     * @returns {(Point[]|Object[])}
     * @private
     */
    _query(range, pointsFound) {
        if (!range.intersects(this._container)) {
            return pointsFound;
        }

        if (this._isDivided) {
            this._ne._query(range, pointsFound);
            this._nw._query(range, pointsFound);
            this._se._query(range, pointsFound);
            this._sw._query(range, pointsFound);
        } else {
            const p = this._points.filter((point) => range.contains(point));

            Array.prototype.push.apply(pointsFound, p);
        }

        return pointsFound;
    }

    /**
     * Clear the QuadTree
     */
    clear() {
        this._points = [];

        delete this._ne;
        delete this._nw;
        delete this._se;
        delete this._sw;
    }
}

module.exports = QuadTree;
