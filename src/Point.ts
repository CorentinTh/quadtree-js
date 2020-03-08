/**
 * Point class.
 * @class Point
 */
export class Point {
    x: number;
    y: number;
    data: unknown;

    /**
     * Point constructor.
     * @constructs Point
     * @param {number} x - X coordinate of the point.
     * @param {number} y - Y coordinate of the point.
     * @param {*} [data] - Data to store along the point.
     */
    constructor(x: number, y: number, data?: unknown) {
        this.x = x;
        this.y = y;
        this.data = data;
    }

}