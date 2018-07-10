
/**
 * Box Circle.
 * @class Circle
 */
export default class Circle {

    /**
     * Circle constructor;
     * @constructs Circle
     * @param {number} x - X coordinate of the circle.
     * @param {number} y - Y coordinate of the circle.
     * @param {number} r - Radius of the circle.
     * @param {*} [data] - Data to store along the circle.
     */
    constructor(x, y, r, data) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rPow2 = this.r * this.r; // To avoid square roots
        if (data) this.data = data;
    }

    _euclideanDistancePow2(point1, point2) {
        return Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2);
    }

    /**
     * Check if a point is contained in the circle.
     * @param {Point|Object} point - The point to test if it is contained in the circle.
     * @returns {boolean} - True if the point is contained in the circle, otherwise false.
     */
    contains(point) {
        return this._euclideanDistancePow2(point, this) <= this.rPow2;
    }

    /**
     * Check if a box intersects with this circle.
     * @param {Box|Object} range - The box to test the intersection with.
     * @returns {boolean} - True if it intersects, otherwise false.
     */
    intersects(range) {
        const Max = (a, b) => a >= b ? a : b;
        const Min = (a, b) => a <= b ? a : b;

        const dX = this.x - Max(range.x, Min(this.x, range.x + range.w));
        const dY = this.y - Max(range.y, Min(this.y, range.y + range.h));
        return (dX * dX + dY * dY) <= (this.rPow2);
    }
}