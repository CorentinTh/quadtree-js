import Box from './Box';

export default class QuadTree {
    /**
     * Create a new QuadTree
     * @constructor
     * @param {Box} container - The box on which the QuadTree will operate.
     * @param {number} [nodeCapacity=4] - The maximum amount of points by node.
     * @param {(Object[]|Point[])} [points] - An array of initial points to insert in the QuadTree
     * @param {number} points[].x - X coordinate of the point
     * @param {number} points[].y - Y coordinate of the point
     */
    constructor(container, nodeCapacity = 4, points = []) {
        this._container = container;
        this._nodeCapacity = nodeCapacity;
        this._isDivided = false;
        this._points = [];

        for (let point of points) {
            this._insert(point);
        }
    }

    /**
     * Get all the points in the QuadTree
     * @returns {(Object[]|Point[])} - An array containing all the points.
     */
    getAllPoints(){
        const pointsList = [];
        this._getAllPoints(pointsList);
        return pointsList;
    }

    /**
     * Get all the points in the QuadTree
     * @param {(Object[]|Point[])} pointsList
     * @private
     */
    _getAllPoints(pointsList){
        if(!this._isDivided){
            Array.prototype.push.apply(pointsList, this._points);
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
        this._ne = new QuadTree(new Box(x + w, y, w, h),     this._nodeCapacity, this._points.slice());
        this._nw = new QuadTree(new Box(x, y, w, h),         this._nodeCapacity, this._points.slice());
        this._se = new QuadTree(new Box(x + w, y + h, w, h), this._nodeCapacity, this._points.slice());
        this._sw = new QuadTree(new Box(x, y + h, w, h),     this._nodeCapacity, this._points.slice());

        // We empty this node points
        this._points = [];
    }

    /**
     * Remove a point in the QuadTree
     * @param {(Point|Object|Point[]|Object[])} pointOrArray - A point or an array of points to remove
     * @param {number} pointOrArray.x - X coordinate of the point
     * @param {number} pointOrArray.y - Y coordinate of the point
     */
    remove(pointOrArray){
        if(pointOrArray.constructor === Array){
            for (const point of pointOrArray) {
                this._remove(point);
            }
        }else {
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
            this._points.splice(this._points.findIndex(aPoint => aPoint.x === point.x && aPoint.y === point.y), 1);

            return;
        }

        this._ne._remove(point);
        this._nw._remove(point);
        this._se._remove(point);
        this._sw._remove(point);


        if (this._ne._getNodePointAmount() === 0 &&
            this._nw._getNodePointAmount() === 0 &&
            this._se._getNodePointAmount() === 0 &&
            this._sw._getNodePointAmount() === 0) {

            this._isDivided = false;

            delete this._ne;
            delete this._nw;
            delete this._se;
            delete this._sw;
        }
    }

    /**
     * Insert a point in the QuadTree
     * @param {(Point|Object|Point[]|Object[])} pointOrArray - A point or an array of points to insert
     * @param {number} pointOrArray.x - X coordinate of the point
     * @param {number} pointOrArray.y - Y coordinate of the point
     */
    insert(pointOrArray){
        if(pointOrArray.constructor === Array){
            for (const point of pointOrArray) {
                this._insert(point);
            }
        }else {
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

        if (this._getNodePointAmount() <= this._nodeCapacity) {
            this._points.push(point);
            return true;
        }

        if (!this._isDivided) {
            this._divide();
        }

        return this._ne._insert(point)
            || this._nw._insert(point)
            || this._se._insert(point)
            || this._sw._insert(point);
    }

    /**
     * Query all the point within a range
     * @param {(Box|Object)} range - The range to test
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

        Array.prototype.push.apply(pointsFound, this._points.filter((point) => range.contains(point)));

        if (this._isDivided) {
            this._ne._query(range, pointsFound);
            this._nw._query(range, pointsFound);
            this._se._query(range, pointsFound);
            this._sw._query(range, pointsFound);
        }

        return pointsFound;
    }

    /**
     * Clear the QuadTree
     */
    clear(){
        this._points = [];

        delete this._ne;
        delete this._nw;
        delete this._se;
        delete this._sw;
    }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJRdWFkVHJlZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQm94IGZyb20gJy4vQm94JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1YWRUcmVlIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgbmV3IFF1YWRUcmVlXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7Qm94fSBjb250YWluZXIgLSBUaGUgYm94IG9uIHdoaWNoIHRoZSBRdWFkVHJlZSB3aWxsIG9wZXJhdGUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW25vZGVDYXBhY2l0eT00XSAtIFRoZSBtYXhpbXVtIGFtb3VudCBvZiBwb2ludHMgYnkgbm9kZS5cclxuICAgICAqIEBwYXJhbSB7KE9iamVjdFtdfFBvaW50W10pfSBbcG9pbnRzXSAtIEFuIGFycmF5IG9mIGluaXRpYWwgcG9pbnRzIHRvIGluc2VydCBpbiB0aGUgUXVhZFRyZWVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb2ludHNbXS54IC0gWCBjb29yZGluYXRlIG9mIHRoZSBwb2ludFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvaW50c1tdLnkgLSBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgbm9kZUNhcGFjaXR5ID0gNCwgcG9pbnRzID0gW10pIHtcclxuICAgICAgICB0aGlzLl9jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5fbm9kZUNhcGFjaXR5ID0gbm9kZUNhcGFjaXR5O1xyXG4gICAgICAgIHRoaXMuX2lzRGl2aWRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3BvaW50cyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBwb2ludCBvZiBwb2ludHMpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5zZXJ0KHBvaW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYWxsIHRoZSBwb2ludHMgaW4gdGhlIFF1YWRUcmVlXHJcbiAgICAgKiBAcmV0dXJucyB7KE9iamVjdFtdfFBvaW50W10pfSAtIEFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRoZSBwb2ludHMuXHJcbiAgICAgKi9cclxuICAgIGdldEFsbFBvaW50cygpe1xyXG4gICAgICAgIGNvbnN0IHBvaW50c0xpc3QgPSBbXTtcclxuICAgICAgICB0aGlzLl9nZXRBbGxQb2ludHMocG9pbnRzTGlzdCk7XHJcbiAgICAgICAgcmV0dXJuIHBvaW50c0xpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYWxsIHRoZSBwb2ludHMgaW4gdGhlIFF1YWRUcmVlXHJcbiAgICAgKiBAcGFyYW0geyhPYmplY3RbXXxQb2ludFtdKX0gcG9pbnRzTGlzdFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2dldEFsbFBvaW50cyhwb2ludHNMaXN0KXtcclxuICAgICAgICBpZighdGhpcy5faXNEaXZpZGVkKXtcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkocG9pbnRzTGlzdCwgdGhpcy5fcG9pbnRzKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbmUuX2dldEFsbFBvaW50cyhwb2ludHNMaXN0KTtcclxuICAgICAgICB0aGlzLl9udy5fZ2V0QWxsUG9pbnRzKHBvaW50c0xpc3QpO1xyXG4gICAgICAgIHRoaXMuX3NlLl9nZXRBbGxQb2ludHMocG9pbnRzTGlzdCk7XHJcbiAgICAgICAgdGhpcy5fc3cuX2dldEFsbFBvaW50cyhwb2ludHNMaXN0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiB0aGUgYW1vdW50IG9mIHBvaW50cyBpbiB0aGlzIG5vZGUuXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBhbW91bnQgb2YgcG9pbnRzIGluIHRoaXMgbm9kZS5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9nZXROb2RlUG9pbnRBbW91bnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BvaW50cy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXZpZGUgdGhpcyBub2RlIGludG8gNCBzdWItbm9kZXNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9kaXZpZGUoKSB7XHJcbiAgICAgICAgdGhpcy5faXNEaXZpZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgbGV0IHggPSB0aGlzLl9jb250YWluZXIueDtcclxuICAgICAgICBsZXQgeSA9IHRoaXMuX2NvbnRhaW5lci55O1xyXG4gICAgICAgIGxldCB3ID0gdGhpcy5fY29udGFpbmVyLncgLyAyO1xyXG4gICAgICAgIGxldCBoID0gdGhpcy5fY29udGFpbmVyLmggLyAyO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGlvbiBvZiB0aGUgc3ViLW5vZGVzLCBhbmQgaW5zZXJ0aW9uIG9mIHRoZSBjdXJyZW50IHBvaW50XHJcbiAgICAgICAgdGhpcy5fbmUgPSBuZXcgUXVhZFRyZWUobmV3IEJveCh4ICsgdywgeSwgdywgaCksICAgICB0aGlzLl9ub2RlQ2FwYWNpdHksIHRoaXMuX3BvaW50cy5zbGljZSgpKTtcclxuICAgICAgICB0aGlzLl9udyA9IG5ldyBRdWFkVHJlZShuZXcgQm94KHgsIHksIHcsIGgpLCAgICAgICAgIHRoaXMuX25vZGVDYXBhY2l0eSwgdGhpcy5fcG9pbnRzLnNsaWNlKCkpO1xyXG4gICAgICAgIHRoaXMuX3NlID0gbmV3IFF1YWRUcmVlKG5ldyBCb3goeCArIHcsIHkgKyBoLCB3LCBoKSwgdGhpcy5fbm9kZUNhcGFjaXR5LCB0aGlzLl9wb2ludHMuc2xpY2UoKSk7XHJcbiAgICAgICAgdGhpcy5fc3cgPSBuZXcgUXVhZFRyZWUobmV3IEJveCh4LCB5ICsgaCwgdywgaCksICAgICB0aGlzLl9ub2RlQ2FwYWNpdHksIHRoaXMuX3BvaW50cy5zbGljZSgpKTtcclxuXHJcbiAgICAgICAgLy8gV2UgZW1wdHkgdGhpcyBub2RlIHBvaW50c1xyXG4gICAgICAgIHRoaXMuX3BvaW50cyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGEgcG9pbnQgaW4gdGhlIFF1YWRUcmVlXHJcbiAgICAgKiBAcGFyYW0geyhQb2ludHxPYmplY3R8UG9pbnRbXXxPYmplY3RbXSl9IHBvaW50T3JBcnJheSAtIEEgcG9pbnQgb3IgYW4gYXJyYXkgb2YgcG9pbnRzIHRvIHJlbW92ZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvaW50T3JBcnJheS54IC0gWCBjb29yZGluYXRlIG9mIHRoZSBwb2ludFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvaW50T3JBcnJheS55IC0gWSBjb29yZGluYXRlIG9mIHRoZSBwb2ludFxyXG4gICAgICovXHJcbiAgICByZW1vdmUocG9pbnRPckFycmF5KXtcclxuICAgICAgICBpZihwb2ludE9yQXJyYXkuY29uc3RydWN0b3IgPT09IEFycmF5KXtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBwb2ludCBvZiBwb2ludE9yQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZShwb2ludCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZShwb2ludE9yQXJyYXkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZSBhIHBvaW50IGluIHRoZSBRdWFkVHJlZVxyXG4gICAgICogQHBhcmFtIHsoUG9pbnR8T2JqZWN0KX0gcG9pbnQgLSBBIHBvaW50IHRvIHJlbW92ZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvaW50LnggLSBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9pbnQueSAtIFkgY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9yZW1vdmUocG9pbnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2NvbnRhaW5lci5jb250YWlucyhwb2ludCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc0RpdmlkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fcG9pbnRzLnNwbGljZSh0aGlzLl9wb2ludHMuZmluZEluZGV4KGFQb2ludCA9PiBhUG9pbnQueCA9PT0gcG9pbnQueCAmJiBhUG9pbnQueSA9PT0gcG9pbnQueSksIDEpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbmUuX3JlbW92ZShwb2ludCk7XHJcbiAgICAgICAgdGhpcy5fbncuX3JlbW92ZShwb2ludCk7XHJcbiAgICAgICAgdGhpcy5fc2UuX3JlbW92ZShwb2ludCk7XHJcbiAgICAgICAgdGhpcy5fc3cuX3JlbW92ZShwb2ludCk7XHJcblxyXG5cclxuICAgICAgICBpZiAodGhpcy5fbmUuX2dldE5vZGVQb2ludEFtb3VudCgpID09PSAwICYmXHJcbiAgICAgICAgICAgIHRoaXMuX253Ll9nZXROb2RlUG9pbnRBbW91bnQoKSA9PT0gMCAmJlxyXG4gICAgICAgICAgICB0aGlzLl9zZS5fZ2V0Tm9kZVBvaW50QW1vdW50KCkgPT09IDAgJiZcclxuICAgICAgICAgICAgdGhpcy5fc3cuX2dldE5vZGVQb2ludEFtb3VudCgpID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9pc0RpdmlkZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9uZTtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX253O1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fc2U7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9zdztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgYSBwb2ludCBpbiB0aGUgUXVhZFRyZWVcclxuICAgICAqIEBwYXJhbSB7KFBvaW50fE9iamVjdHxQb2ludFtdfE9iamVjdFtdKX0gcG9pbnRPckFycmF5IC0gQSBwb2ludCBvciBhbiBhcnJheSBvZiBwb2ludHMgdG8gaW5zZXJ0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9pbnRPckFycmF5LnggLSBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9pbnRPckFycmF5LnkgLSBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50XHJcbiAgICAgKi9cclxuICAgIGluc2VydChwb2ludE9yQXJyYXkpe1xyXG4gICAgICAgIGlmKHBvaW50T3JBcnJheS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpe1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBvaW50IG9mIHBvaW50T3JBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faW5zZXJ0KHBvaW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5faW5zZXJ0KHBvaW50T3JBcnJheSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc2VydCBhIHBvaW50IGluIHRoZSBRdWFkVHJlZVxyXG4gICAgICogQHBhcmFtIHsoUG9pbnR8T2JqZWN0KX0gcG9pbnQgLSBBIHBvaW50IHRvIGluc2VydFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvaW50LnggLSBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9pbnQueSAtIFkgY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2luc2VydChwb2ludCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fY29udGFpbmVyLmNvbnRhaW5zKHBvaW50KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fZ2V0Tm9kZVBvaW50QW1vdW50KCkgPD0gdGhpcy5fbm9kZUNhcGFjaXR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BvaW50cy5wdXNoKHBvaW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX2lzRGl2aWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXZpZGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9uZS5faW5zZXJ0KHBvaW50KVxyXG4gICAgICAgICAgICB8fCB0aGlzLl9udy5faW5zZXJ0KHBvaW50KVxyXG4gICAgICAgICAgICB8fCB0aGlzLl9zZS5faW5zZXJ0KHBvaW50KVxyXG4gICAgICAgICAgICB8fCB0aGlzLl9zdy5faW5zZXJ0KHBvaW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFF1ZXJ5IGFsbCB0aGUgcG9pbnQgd2l0aGluIGEgcmFuZ2VcclxuICAgICAqIEBwYXJhbSB7KEJveHxPYmplY3QpfSByYW5nZSAtIFRoZSByYW5nZSB0byB0ZXN0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFuZ2UueCAtIFggY29vcmRpbmF0ZSBvZiB0aGUgcmFuZ2UuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFuZ2UueSAtIFkgY29vcmRpbmF0ZSBvZiB0aGUgcmFuZ2UuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFuZ2UudyAtIFdpZHRoIG9mIHRoZSByYW5nZS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYW5nZS5oIC0gSGVpZ2h0IG9mIHRoZSByYW5nZS5cclxuICAgICAqIEByZXR1cm5zIHsoUG9pbnRbXXxPYmplY3RbXSl9IC0gVGhlIHBvaW50cyB3aXRoaW4gdGhlIHJhbmdlXHJcbiAgICAgKi9cclxuICAgIHF1ZXJ5KHJhbmdlKSB7XHJcbiAgICAgICAgbGV0IHBvaW50c0ZvdW5kID0gW107XHJcbiAgICAgICAgdGhpcy5fcXVlcnkocmFuZ2UsIHBvaW50c0ZvdW5kKTtcclxuICAgICAgICByZXR1cm4gcG9pbnRzRm91bmQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0geyhCb3h8T2JqZWN0KX0gcmFuZ2VcclxuICAgICAqIEBwYXJhbSB7KFBvaW50W118T2JqZWN0W10pfSBwb2ludHNGb3VuZFxyXG4gICAgICogQHJldHVybnMgeyhQb2ludFtdfE9iamVjdFtdKX1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9xdWVyeShyYW5nZSwgcG9pbnRzRm91bmQpIHtcclxuICAgICAgICBpZiAoIXJhbmdlLmludGVyc2VjdHModGhpcy5fY29udGFpbmVyKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcG9pbnRzRm91bmQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShwb2ludHNGb3VuZCwgdGhpcy5fcG9pbnRzLmZpbHRlcigocG9pbnQpID0+IHJhbmdlLmNvbnRhaW5zKHBvaW50KSkpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNEaXZpZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX25lLl9xdWVyeShyYW5nZSwgcG9pbnRzRm91bmQpO1xyXG4gICAgICAgICAgICB0aGlzLl9udy5fcXVlcnkocmFuZ2UsIHBvaW50c0ZvdW5kKTtcclxuICAgICAgICAgICAgdGhpcy5fc2UuX3F1ZXJ5KHJhbmdlLCBwb2ludHNGb3VuZCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3N3Ll9xdWVyeShyYW5nZSwgcG9pbnRzRm91bmQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBvaW50c0ZvdW5kO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXIgdGhlIFF1YWRUcmVlXHJcbiAgICAgKi9cclxuICAgIGNsZWFyKCl7XHJcbiAgICAgICAgdGhpcy5fcG9pbnRzID0gW107XHJcblxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9uZTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fbnc7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3NlO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9zdztcclxuICAgIH1cclxufVxyXG4iXSwiZmlsZSI6IlF1YWRUcmVlLmpzIn0=
