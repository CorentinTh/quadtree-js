import {Box, Point, Circle} from '../src';

function rand(max: number, min = 0): number {
    return Math.floor(Math.random() * (max - min)) + min;
}

describe('Class Circle', () => {

    describe('constructor', () => {
        const x = 10, y = 20, r = 30, data = 'some stuff';
        const circle = new Circle(x, y, r, data);

        test('sets attribute x', () => {
            expect(circle.x).toBe(x);
        });

        test('sets attribute y', () => {
            expect(circle.y).toBe(y);
        });

        test('sets attribute r', () => {
            expect(circle.r).toBe(r);
        });

        test('sets attribute rPow2', () => {
            expect(circle.rPow2).toBe(r * r);
        });

        test('sets attribute data', () => {
            expect(circle.data).toEqual(data);
        });

    });

    describe('method contains', () => {
        const x = rand(1000), y = rand(1000), r = rand(1000);
        let circle: Circle;

        beforeEach(() => {
            circle = new Circle(x, y, r);
        });

        const points = [
            new Point(x, y, {contained: true, description: 'middle'}),
            new Point(x, y - r, {contained: true, description: 'top'}),
            new Point(x, y - r - 1, {contained: false, description: 'above top'}),
            new Point(x, y + r, {contained: true, description: 'bottom'}),
            new Point(x, y + r + 1, {contained: false, description: 'below bottom'}),
            new Point(x - r, y, {contained: true, description: 'left'}),
            new Point(x - r - 1, y, {contained: false, description: 'outside left'}),
            new Point(x + r, y, {contained: true, description: 'right'}),
            new Point(x + r + 1, y, {contained: false, description: 'outside right'})
        ];

        points.forEach(point => {
            test(`returns ${point.data.contained} for point at ${point.data.description} (${point.x}, ${point.y})`, () => {
                expect(circle.contains(point)).toEqual(point.data.contained);
            });
        });

    });

    describe('method intersects', () => {
        const x = 100, y = 50, r = 25;
        let circle: Circle;

        beforeEach(() => {
            circle = new Circle(x, y, r);
        });

        const boxes = [
            new Box(10000, 2000, 100, 200, {intersect: false, description: 'is too far away'}),
            new Box(1000, y, 12, 10, {intersect: false, description: 'x coordinate is out of range'}),
            new Box(x, 1000, 12, 10, {intersect: false, description: 'y coordinate is out of range'}),
            new Box(x, y, 12, 10, {intersect: true, description: 'is encapsulated by the circle'}),
            new Box(x, y, r * 2, r * 2, {intersect: true, description: 'encapsulate the circle'}),
            new Box(x + 8, 50, 7, 10, {intersect: true, description: 'is partially in the circle'}),
            new Box(x + 24, y + 24, 1, 1, {
                intersect: false,
                description: 'is not inside the circle, but in the bounding box'
            }),
            new Box(x, y + r, 1, 1, {intersect: true, description: 'is just inside the circle'}),

        ];

        boxes.forEach(box => {
            test(`returns ${box.data.intersect} when range ${box.data.description} (x:${box.x}, y:${box.y}, w:${box.w}, h:${box.h})`, () => {
                expect(circle.intersects(box)).toEqual(box.data.intersect);
            });
        });
    });
});
