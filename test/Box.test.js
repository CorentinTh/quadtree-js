const {Point, Box} = require('..');

describe('Class Box', () => {

    describe('constructor', () => {
        const x = 10, y = 20, w = 30, h = 40, data = 'some stuff';
        const box = new Box(x, y, w, h, data);

        test('sets attribute x', () => {
            expect(box.x).toBe(x);
        });

        test('sets attribute y', () => {
            expect(box.y).toBe(y);
        });

        test('sets attribute w', () => {
            expect(box.w).toBe(w);
        });

        test('sets attribute h', () => {
            expect(box.h).toBe(h);
        });

        test('sets attribute data', () => {
            expect(box.data).toEqual(data);
        });

    });

    describe('method contains', () => {
        const x = 50, y = 100, w = 25, h = 30, data = 'some stuff';
        const left = x, right = x + w, top = y, bottom = y + h;

        let box;

        beforeEach(() => {
            box = new Box(x, y, w, h, data);
        });

        const points = [
            new Point(x, y, {contained: true, description: 'middle'}),
            new Point(x, top, {contained: true, description: 'top'}),
            new Point(x, top - 1, {contained: false, description: 'above top'}),
            new Point(x, bottom, {contained: true, description: 'bottom'}),
            new Point(x, bottom + 1, {contained: false, description: 'below bottom'}),
            new Point(left, y, {contained: true, description: 'left'}),
            new Point(left - 1, y, {contained: false, description: 'outside left'}),
            new Point(right, y, {contained: true, description: 'right'}),
            new Point(right + 1, y, {contained: false, description: 'outside right'})
        ];

        points.forEach(point => {
            test(`returns ${point.data.contained} for point at ${point.data.description} (${point.x}, ${point.y})`, () => {
                expect(box.contains(point)).toEqual(point.data.contained);
            });
        });
    });

    describe('method intersects', () => {
        const x = 50, y = 100, w = 25, h = 30, data = 'some stuff';

        let box;

        beforeEach(() => {
            box = new Box(x, y, w, h, data);
        });

        const boxes = [
            new Box(1000, 2000, 3000, 4000, {intersect: false, description: 'is too far away'}),
            new Box(5000, 100, 10, 12, {intersect: false, description: 'x coordinate is out of range'}),
            new Box(75, 1000, 12, 10, {intersect: false, description: 'y coordinate is out of range'}),
            new Box(60, 110, 13, 11, {intersect: true, description: 'is encapsulated by the box'}),
            new Box(0, 0, 1000, 2000, {intersect: true, description: 'encapsulate the box'}),
            new Box(0, 0, 60, 110, {intersect: true, description: 'is partially in the box'}),
            new Box(50, 100, 1, 1, {intersect: true, description: 'is just inside the box'}),

        ];

        boxes.forEach(range => {
            test(`returns ${range.data.intersect} when range ${range.data.description} (x:${range.x}, y:${range.y}, w:${range.w}, h:${range.h})`, () => {
                expect(box.intersects(range)).toEqual(range.data.intersect);
            });
        });
    });
});
