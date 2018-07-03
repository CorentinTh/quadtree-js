
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
                console.log(point);
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
            //this._points.splice(this._points.findIndex(aPoint => aPoint.x === point.x && aPoint.y === point.y), 1);

            const len = this._points.length;
            for (let i = len-1; i >= 0; i--) {
                if(point.x === this._points[i].x && point.y === this._points[i].y){
                    this._points.splice(i,1);
                }
            }

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

        if(this._ne._insert(point)) return true;
        if(this._nw._insert(point)) return true;
        if(this._se._insert(point)) return true;
        if(this._sw._insert(point)) return true;

        return false;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJRdWFkVHJlZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IEJveCBmcm9tICcuL0JveCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWFkVHJlZSB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIG5ldyBRdWFkVHJlZVxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge0JveH0gY29udGFpbmVyIC0gVGhlIGJveCBvbiB3aGljaCB0aGUgUXVhZFRyZWUgd2lsbCBvcGVyYXRlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtub2RlQ2FwYWNpdHk9NF0gLSBUaGUgbWF4aW11bSBhbW91bnQgb2YgcG9pbnRzIGJ5IG5vZGUuXHJcbiAgICAgKiBAcGFyYW0geyhPYmplY3RbXXxQb2ludFtdKX0gW3BvaW50c10gLSBBbiBhcnJheSBvZiBpbml0aWFsIHBvaW50cyB0byBpbnNlcnQgaW4gdGhlIFF1YWRUcmVlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9pbnRzW10ueCAtIFggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb2ludHNbXS55IC0gWSBjb29yZGluYXRlIG9mIHRoZSBwb2ludFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIG5vZGVDYXBhY2l0eSA9IDQsIHBvaW50cyA9IFtdKSB7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMuX25vZGVDYXBhY2l0eSA9IG5vZGVDYXBhY2l0eTtcclxuICAgICAgICB0aGlzLl9pc0RpdmlkZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9wb2ludHMgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgcG9pbnQgb2YgcG9pbnRzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luc2VydChwb2ludCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFsbCB0aGUgcG9pbnRzIGluIHRoZSBRdWFkVHJlZVxyXG4gICAgICogQHJldHVybnMgeyhPYmplY3RbXXxQb2ludFtdKX0gLSBBbiBhcnJheSBjb250YWluaW5nIGFsbCB0aGUgcG9pbnRzLlxyXG4gICAgICovXHJcbiAgICBnZXRBbGxQb2ludHMoKXtcclxuICAgICAgICBjb25zdCBwb2ludHNMaXN0ID0gW107XHJcbiAgICAgICAgdGhpcy5fZ2V0QWxsUG9pbnRzKHBvaW50c0xpc3QpO1xyXG4gICAgICAgIHJldHVybiBwb2ludHNMaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFsbCB0aGUgcG9pbnRzIGluIHRoZSBRdWFkVHJlZVxyXG4gICAgICogQHBhcmFtIHsoT2JqZWN0W118UG9pbnRbXSl9IHBvaW50c0xpc3RcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9nZXRBbGxQb2ludHMocG9pbnRzTGlzdCl7XHJcbiAgICAgICAgaWYoIXRoaXMuX2lzRGl2aWRlZCl7XHJcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHBvaW50c0xpc3QsIHRoaXMuX3BvaW50cyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX25lLl9nZXRBbGxQb2ludHMocG9pbnRzTGlzdCk7XHJcbiAgICAgICAgdGhpcy5fbncuX2dldEFsbFBvaW50cyhwb2ludHNMaXN0KTtcclxuICAgICAgICB0aGlzLl9zZS5fZ2V0QWxsUG9pbnRzKHBvaW50c0xpc3QpO1xyXG4gICAgICAgIHRoaXMuX3N3Ll9nZXRBbGxQb2ludHMocG9pbnRzTGlzdCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gdGhlIGFtb3VudCBvZiBwb2ludHMgaW4gdGhpcyBub2RlLlxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gLSBUaGUgYW1vdW50IG9mIHBvaW50cyBpbiB0aGlzIG5vZGUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZ2V0Tm9kZVBvaW50QW1vdW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wb2ludHMubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGl2aWRlIHRoaXMgbm9kZSBpbnRvIDQgc3ViLW5vZGVzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZGl2aWRlKCkge1xyXG4gICAgICAgIHRoaXMuX2lzRGl2aWRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIGxldCB4ID0gdGhpcy5fY29udGFpbmVyLng7XHJcbiAgICAgICAgbGV0IHkgPSB0aGlzLl9jb250YWluZXIueTtcclxuICAgICAgICBsZXQgdyA9IHRoaXMuX2NvbnRhaW5lci53IC8gMjtcclxuICAgICAgICBsZXQgaCA9IHRoaXMuX2NvbnRhaW5lci5oIC8gMjtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRpb24gb2YgdGhlIHN1Yi1ub2RlcywgYW5kIGluc2VydGlvbiBvZiB0aGUgY3VycmVudCBwb2ludFxyXG4gICAgICAgIHRoaXMuX25lID0gbmV3IFF1YWRUcmVlKG5ldyBCb3goeCArIHcsIHksIHcsIGgpLCAgICAgdGhpcy5fbm9kZUNhcGFjaXR5LCB0aGlzLl9wb2ludHMuc2xpY2UoKSk7XHJcbiAgICAgICAgdGhpcy5fbncgPSBuZXcgUXVhZFRyZWUobmV3IEJveCh4LCB5LCB3LCBoKSwgICAgICAgICB0aGlzLl9ub2RlQ2FwYWNpdHksIHRoaXMuX3BvaW50cy5zbGljZSgpKTtcclxuICAgICAgICB0aGlzLl9zZSA9IG5ldyBRdWFkVHJlZShuZXcgQm94KHggKyB3LCB5ICsgaCwgdywgaCksIHRoaXMuX25vZGVDYXBhY2l0eSwgdGhpcy5fcG9pbnRzLnNsaWNlKCkpO1xyXG4gICAgICAgIHRoaXMuX3N3ID0gbmV3IFF1YWRUcmVlKG5ldyBCb3goeCwgeSArIGgsIHcsIGgpLCAgICAgdGhpcy5fbm9kZUNhcGFjaXR5LCB0aGlzLl9wb2ludHMuc2xpY2UoKSk7XHJcblxyXG4gICAgICAgIC8vIFdlIGVtcHR5IHRoaXMgbm9kZSBwb2ludHNcclxuICAgICAgICB0aGlzLl9wb2ludHMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZSBhIHBvaW50IGluIHRoZSBRdWFkVHJlZVxyXG4gICAgICogQHBhcmFtIHsoUG9pbnR8T2JqZWN0fFBvaW50W118T2JqZWN0W10pfSBwb2ludE9yQXJyYXkgLSBBIHBvaW50IG9yIGFuIGFycmF5IG9mIHBvaW50cyB0byByZW1vdmVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb2ludE9yQXJyYXkueCAtIFggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb2ludE9yQXJyYXkueSAtIFkgY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlKHBvaW50T3JBcnJheSl7XHJcbiAgICAgICAgaWYocG9pbnRPckFycmF5LmNvbnN0cnVjdG9yID09PSBBcnJheSl7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcG9pbnQgb2YgcG9pbnRPckFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwb2ludCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmUocG9pbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9yZW1vdmUocG9pbnRPckFycmF5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgYSBwb2ludCBpbiB0aGUgUXVhZFRyZWVcclxuICAgICAqIEBwYXJhbSB7KFBvaW50fE9iamVjdCl9IHBvaW50IC0gQSBwb2ludCB0byByZW1vdmVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb2ludC54IC0gWCBjb29yZGluYXRlIG9mIHRoZSBwb2ludFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvaW50LnkgLSBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfcmVtb3ZlKHBvaW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9jb250YWluZXIuY29udGFpbnMocG9pbnQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5faXNEaXZpZGVkKSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5fcG9pbnRzLnNwbGljZSh0aGlzLl9wb2ludHMuZmluZEluZGV4KGFQb2ludCA9PiBhUG9pbnQueCA9PT0gcG9pbnQueCAmJiBhUG9pbnQueSA9PT0gcG9pbnQueSksIDEpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbGVuID0gdGhpcy5fcG9pbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGxlbi0xOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICAgICAgaWYocG9pbnQueCA9PT0gdGhpcy5fcG9pbnRzW2ldLnggJiYgcG9pbnQueSA9PT0gdGhpcy5fcG9pbnRzW2ldLnkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BvaW50cy5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbmUuX3JlbW92ZShwb2ludCk7XHJcbiAgICAgICAgdGhpcy5fbncuX3JlbW92ZShwb2ludCk7XHJcbiAgICAgICAgdGhpcy5fc2UuX3JlbW92ZShwb2ludCk7XHJcbiAgICAgICAgdGhpcy5fc3cuX3JlbW92ZShwb2ludCk7XHJcblxyXG5cclxuICAgICAgICBpZiAodGhpcy5fbmUuX2dldE5vZGVQb2ludEFtb3VudCgpID09PSAwICYmXHJcbiAgICAgICAgICAgIHRoaXMuX253Ll9nZXROb2RlUG9pbnRBbW91bnQoKSA9PT0gMCAmJlxyXG4gICAgICAgICAgICB0aGlzLl9zZS5fZ2V0Tm9kZVBvaW50QW1vdW50KCkgPT09IDAgJiZcclxuICAgICAgICAgICAgdGhpcy5fc3cuX2dldE5vZGVQb2ludEFtb3VudCgpID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9pc0RpdmlkZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9uZTtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX253O1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fc2U7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9zdztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgYSBwb2ludCBpbiB0aGUgUXVhZFRyZWVcclxuICAgICAqIEBwYXJhbSB7KFBvaW50fE9iamVjdHxQb2ludFtdfE9iamVjdFtdKX0gcG9pbnRPckFycmF5IC0gQSBwb2ludCBvciBhbiBhcnJheSBvZiBwb2ludHMgdG8gaW5zZXJ0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9pbnRPckFycmF5LnggLSBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9pbnRPckFycmF5LnkgLSBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50XHJcbiAgICAgKi9cclxuICAgIGluc2VydChwb2ludE9yQXJyYXkpe1xyXG4gICAgICAgIGlmKHBvaW50T3JBcnJheS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpe1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBvaW50IG9mIHBvaW50T3JBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faW5zZXJ0KHBvaW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5faW5zZXJ0KHBvaW50T3JBcnJheSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc2VydCBhIHBvaW50IGluIHRoZSBRdWFkVHJlZVxyXG4gICAgICogQHBhcmFtIHsoUG9pbnR8T2JqZWN0KX0gcG9pbnQgLSBBIHBvaW50IHRvIGluc2VydFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvaW50LnggLSBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9pbnQueSAtIFkgY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2luc2VydChwb2ludCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fY29udGFpbmVyLmNvbnRhaW5zKHBvaW50KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fZ2V0Tm9kZVBvaW50QW1vdW50KCkgPD0gdGhpcy5fbm9kZUNhcGFjaXR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BvaW50cy5wdXNoKHBvaW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX2lzRGl2aWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXZpZGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuX25lLl9pbnNlcnQocG9pbnQpKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBpZih0aGlzLl9udy5faW5zZXJ0KHBvaW50KSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYodGhpcy5fc2UuX2luc2VydChwb2ludCkpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGlmKHRoaXMuX3N3Ll9pbnNlcnQocG9pbnQpKSByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUXVlcnkgYWxsIHRoZSBwb2ludCB3aXRoaW4gYSByYW5nZVxyXG4gICAgICogQHBhcmFtIHsoQm94fE9iamVjdHxDaXJjbGUpfSByYW5nZSAtIFRoZSByYW5nZSB0byB0ZXN0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFuZ2UueCAtIFggY29vcmRpbmF0ZSBvZiB0aGUgcmFuZ2UuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFuZ2UueSAtIFkgY29vcmRpbmF0ZSBvZiB0aGUgcmFuZ2UuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFuZ2UudyAtIFdpZHRoIG9mIHRoZSByYW5nZS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYW5nZS5oIC0gSGVpZ2h0IG9mIHRoZSByYW5nZS5cclxuICAgICAqIEByZXR1cm5zIHsoUG9pbnRbXXxPYmplY3RbXSl9IC0gVGhlIHBvaW50cyB3aXRoaW4gdGhlIHJhbmdlXHJcbiAgICAgKi9cclxuICAgIHF1ZXJ5KHJhbmdlKSB7XHJcbiAgICAgICAgbGV0IHBvaW50c0ZvdW5kID0gW107XHJcbiAgICAgICAgdGhpcy5fcXVlcnkocmFuZ2UsIHBvaW50c0ZvdW5kKTtcclxuICAgICAgICByZXR1cm4gcG9pbnRzRm91bmQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0geyhCb3h8T2JqZWN0KX0gcmFuZ2VcclxuICAgICAqIEBwYXJhbSB7KFBvaW50W118T2JqZWN0W10pfSBwb2ludHNGb3VuZFxyXG4gICAgICogQHJldHVybnMgeyhQb2ludFtdfE9iamVjdFtdKX1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9xdWVyeShyYW5nZSwgcG9pbnRzRm91bmQpIHtcclxuICAgICAgICBpZiAoIXJhbmdlLmludGVyc2VjdHModGhpcy5fY29udGFpbmVyKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcG9pbnRzRm91bmQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShwb2ludHNGb3VuZCwgdGhpcy5fcG9pbnRzLmZpbHRlcigocG9pbnQpID0+IHJhbmdlLmNvbnRhaW5zKHBvaW50KSkpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNEaXZpZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX25lLl9xdWVyeShyYW5nZSwgcG9pbnRzRm91bmQpO1xyXG4gICAgICAgICAgICB0aGlzLl9udy5fcXVlcnkocmFuZ2UsIHBvaW50c0ZvdW5kKTtcclxuICAgICAgICAgICAgdGhpcy5fc2UuX3F1ZXJ5KHJhbmdlLCBwb2ludHNGb3VuZCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3N3Ll9xdWVyeShyYW5nZSwgcG9pbnRzRm91bmQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBvaW50c0ZvdW5kO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXIgdGhlIFF1YWRUcmVlXHJcbiAgICAgKi9cclxuICAgIGNsZWFyKCl7XHJcbiAgICAgICAgdGhpcy5fcG9pbnRzID0gW107XHJcblxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9uZTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fbnc7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3NlO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9zdztcclxuICAgIH1cclxufSJdLCJmaWxlIjoiUXVhZFRyZWUuanMifQ==
