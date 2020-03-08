/**
 * Point class.
 * @class Point
 */
import {UserCustomData} from "./types";

export class Point {
    readonly x: number;
    readonly y: number;
    readonly data: UserCustomData;

    /**
     * Point constructor.
     * @constructs Point
     * @param {number} x - X coordinate of the point.
     * @param {number} y - Y coordinate of the point.
     * @param {*} [data] - Data to store along the point.
     */
    constructor(x: number, y: number, data?: UserCustomData) {
        this.x = x;
        this.y = y;
        this.data = data;
    }

}