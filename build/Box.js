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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJCb3guanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEJveCBjbGFzcy5cclxuICogQGNsYXNzIEJveFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm94IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJveCBjb25zdHJ1Y3RvcjtcclxuICAgICAqIEBjb25zdHJ1Y3RzIEJveFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBYIGNvb3JkaW5hdGUgb2YgdGhlIGJveC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gWSBjb29yZGluYXRlIG9mIHRoZSBib3guXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdyAtIFdpZHRoIG9mIHRoZSBib3guXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaCAtIEhlaWdodCBvZiB0aGUgYm94LlxyXG4gICAgICogQHBhcmFtIHsqfSBbZGF0YV0gLSBEYXRhIHRvIHN0b3JlIGFsb25nIHRoZSBib3guXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHgsIHksIHcsIGgsIGRhdGEpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy53ID0gdztcclxuICAgICAgICB0aGlzLmggPSBoO1xyXG4gICAgICAgIGlmIChkYXRhKSB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgYSBwb2ludCBpcyBjb250YWluZWQgaW4gdGhlIGJveC5cclxuICAgICAqIEBwYXJhbSB7UG9pbnR8T2JqZWN0fSBwb2ludCAtIFRoZSBwb2ludCB0byB0ZXN0IGlmIGl0IGlzIGNvbnRhaW5lZCBpbiB0aGUgYm94LlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IC0gVHJ1ZSBpZiB0aGUgcG9pbnQgaXMgY29udGFpbmVkIGluIHRoZSBib3gsIG90aGVyd2lzZSBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgY29udGFpbnMocG9pbnQpIHtcclxuICAgICAgICByZXR1cm4gcG9pbnQueCA+PSB0aGlzLnggJiZcclxuICAgICAgICAgICAgcG9pbnQueCA8PSB0aGlzLnggKyB0aGlzLncgJiZcclxuICAgICAgICAgICAgcG9pbnQueSA+PSB0aGlzLnkgJiZcclxuICAgICAgICAgICAgcG9pbnQueSA8PSB0aGlzLnkgKyB0aGlzLmg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiBhIGJveCBpbnRlcnNlY3RzIHdpdGggdGhpcyBib3guXHJcbiAgICAgKiBAcGFyYW0ge0JveHxPYmplY3R9IHJhbmdlIC0gVGhlIGJveCB0byB0ZXN0IHRoZSBpbnRlcnNlY3Rpb24gd2l0aC5cclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSAtIFRydWUgaWYgaXQgaW50ZXJzZWN0cywgb3RoZXJ3aXNlIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBpbnRlcnNlY3RzKHJhbmdlKSB7XHJcbiAgICAgICAgcmV0dXJuIHJhbmdlLnggPD0gdGhpcy54ICsgdGhpcy53XHJcbiAgICAgICAgICAgICYmIHJhbmdlLnggKyByYW5nZS53ID49IHRoaXMueFxyXG4gICAgICAgICAgICAmJiByYW5nZS55IDw9IHRoaXMueSArIHRoaXMuaFxyXG4gICAgICAgICAgICAmJiByYW5nZS55ICsgcmFuZ2UuaCA+PSB0aGlzLnk7XHJcbiAgICB9XHJcblxyXG59Il0sImZpbGUiOiJCb3guanMifQ==
