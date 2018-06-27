/**
 * Box class.
 * @class Box
 */
export default class Box {

    /**
     * Box constructor;
     * @constructs Box
     * @param {number} x - X coordinate of the box.
     * @param {number} y - Y coordinate of the box.
     * @param {number} w - Width of the box.
     * @param {number} h - Height of the box.
     * @param {*} [data] - Data to store along the box.
     */
    constructor(x, y, w, h, data) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        if (data) this.data = data;
    }

    /**
     * Check if a point is contained in the box.
     * @param {Point|Object} point - The point to test if it is contained in the box.
     * @returns {boolean} - True if the point is contained in the box, otherwise false.
     */
    contains(point) {
        return point.x >= this.x &&
            point.x <= this.x + this.w &&
            point.y >= this.y &&
            point.y <= this.y + this.h;
    }

    /**
     * Check if a box intersects with this box.
     * @param {Box|Object} range - The box to test the intersection with.
     * @returns {boolean} - True if it intersects, otherwise false.
     */
    intersects(range) {
        return range.x <= this.x + this.w
            && range.x + range.w >= this.x
            && range.y <= this.y + this.h
            && range.y + range.h >= this.y;
    }

}