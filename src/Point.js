
/**
 * Point class.
 * @class Point
 */
class Point {

    /**
     * Point constructor.
     * @constructs Point
     * @param {number} x - X coordinate of the point.
     * @param {number} y - Y coordinate of the point.
     * @param {*} [data] - Data to store along the point.
     */
    constructor(x, y, data) {
        this.x = x;
        this.y = y;
        if (data) this.data = data;
    }

}

module.exports = Point;
