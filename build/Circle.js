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

        let xDist = Math.abs(range.x - this.x);
        let yDist = Math.abs(range.y - this.y);

        let r = this.r;
        let w = range.w / 2;
        let h = range.h / 2;

        if (xDist > (w + r)) return false;
        if (yDist > (h + r)) return false;

        if (xDist <= (w)) return true;
        if (yDist <= (h)) return true;

        return (this._euclideanDistancePow2(xDist, w) <= this.rPow2);
    }
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJDaXJjbGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEJveCBDaXJjbGUuXHJcbiAqIEBjbGFzcyBDaXJjbGVcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENpcmNsZSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaXJjbGUgY29uc3RydWN0b3I7XHJcbiAgICAgKiBAY29uc3RydWN0cyBDaXJjbGVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gWCBjb29yZGluYXRlIG9mIHRoZSBjaXJjbGUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFkgY29vcmRpbmF0ZSBvZiB0aGUgY2lyY2xlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHIgLSBSYWRpdXMgb2YgdGhlIGNpcmNsZS5cclxuICAgICAqIEBwYXJhbSB7Kn0gW2RhdGFdIC0gRGF0YSB0byBzdG9yZSBhbG9uZyB0aGUgY2lyY2xlLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCByLCBkYXRhKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMuciA9IHI7XHJcbiAgICAgICAgdGhpcy5yUG93MiA9IHRoaXMuciAqIHRoaXMucjsgLy8gVG8gYXZvaWQgc3F1YXJlIHJvb3RzXHJcbiAgICAgICAgaWYgKGRhdGEpIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgX2V1Y2xpZGVhbkRpc3RhbmNlUG93Mihwb2ludDEsIHBvaW50Mikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnBvdygocG9pbnQxLnggLSBwb2ludDIueCksIDIpICsgTWF0aC5wb3coKHBvaW50MS55IC0gcG9pbnQyLnkpLCAyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIGEgcG9pbnQgaXMgY29udGFpbmVkIGluIHRoZSBjaXJjbGUuXHJcbiAgICAgKiBAcGFyYW0ge1BvaW50fE9iamVjdH0gcG9pbnQgLSBUaGUgcG9pbnQgdG8gdGVzdCBpZiBpdCBpcyBjb250YWluZWQgaW4gdGhlIGNpcmNsZS5cclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSAtIFRydWUgaWYgdGhlIHBvaW50IGlzIGNvbnRhaW5lZCBpbiB0aGUgY2lyY2xlLCBvdGhlcndpc2UgZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIGNvbnRhaW5zKHBvaW50KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V1Y2xpZGVhbkRpc3RhbmNlUG93Mihwb2ludCwgdGhpcykgPD0gdGhpcy5yUG93MjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIGEgYm94IGludGVyc2VjdHMgd2l0aCB0aGlzIGNpcmNsZS5cclxuICAgICAqIEBwYXJhbSB7Qm94fE9iamVjdH0gcmFuZ2UgLSBUaGUgYm94IHRvIHRlc3QgdGhlIGludGVyc2VjdGlvbiB3aXRoLlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IC0gVHJ1ZSBpZiBpdCBpbnRlcnNlY3RzLCBvdGhlcndpc2UgZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIGludGVyc2VjdHMocmFuZ2UpIHtcclxuXHJcbiAgICAgICAgbGV0IHhEaXN0ID0gTWF0aC5hYnMocmFuZ2UueCAtIHRoaXMueCk7XHJcbiAgICAgICAgbGV0IHlEaXN0ID0gTWF0aC5hYnMocmFuZ2UueSAtIHRoaXMueSk7XHJcblxyXG4gICAgICAgIGxldCByID0gdGhpcy5yO1xyXG4gICAgICAgIGxldCB3ID0gcmFuZ2UudyAvIDI7XHJcbiAgICAgICAgbGV0IGggPSByYW5nZS5oIC8gMjtcclxuXHJcbiAgICAgICAgaWYgKHhEaXN0ID4gKHcgKyByKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICh5RGlzdCA+IChoICsgcikpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKHhEaXN0IDw9ICh3KSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHlEaXN0IDw9IChoKSkgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIHJldHVybiAodGhpcy5fZXVjbGlkZWFuRGlzdGFuY2VQb3cyKHhEaXN0LCB3KSA8PSB0aGlzLnJQb3cyKTtcclxuICAgIH1cclxufSJdLCJmaWxlIjoiQ2lyY2xlLmpzIn0=
