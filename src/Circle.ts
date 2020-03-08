/**
 * Box Circle.
 * @class Circle
 */
import {Point} from "./Point";
import {Box} from "./Box";
import {Shape, UserCustomData} from "./types";

export class Circle  implements Shape{
    readonly x: number;
    readonly y: number;
    readonly r: number;
    readonly rPow2: number;
    readonly data: UserCustomData;

    /**
     * Circle constructor;
     * @constructs Circle
     * @param {number} x - X coordinate of the circle.
     * @param {number} y - Y coordinate of the circle.
     * @param {number} r - Radius of the circle.
     * @param {*} [data] - Data to store along the circle.
     */
    constructor(x: number, y: number, r: number, data?: UserCustomData) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rPow2 = this.r * this.r; // To avoid square roots
        this.data = data;
    }

    private euclideanDistancePow2(point1: Point, point2: Point): number {
        return Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2);
    }

    /**
     * Check if a point is contained in the circle.
     * @param {Point|Object} point - The point to test if it is contained in the circle.
     * @returns {boolean} - True if the point is contained in the circle, otherwise false.
     */
    contains(point: Point): boolean {
        return this.euclideanDistancePow2(point, this) <= this.rPow2;
    }

    /**
     * Check if a box intersects with this circle.
     * @param {Box|Object} range - The box to test the intersection with.
     * @returns {boolean} - True if it intersects, otherwise false.
     */
    intersects(range: Box): boolean {
        const Max = (a: number, b: number): number => a >= b ? a : b;
        const Min = (a: number, b: number): number => a <= b ? a : b;

        const dX = this.x - Max(range.x, Min(this.x, range.x + range.w));
        const dY = this.y - Max(range.y, Min(this.y, range.y + range.h));
        return (dX * dX + dY * dY) <= (this.rPow2);
    }
}
