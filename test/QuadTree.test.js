import {Box, Point, QuadTree} from './../build/index';


describe('Class QuadTree', () => {
    describe('constructor', () => {

        test('sets attribute container', () => {
            const container = new Box(0, 0, 1000, 2000);
            const qt = new QuadTree(container);

            expect(qt._container).toEqual(container);
        });

        test('sets optional attribute nodeCapacity', () => {
            const qt = new QuadTree(new Box(0, 0, 1000, 2000), 10);

            expect(qt._nodeCapacity).toEqual(10);
        });

        test('sets optional attribute points', () => {
            const points = [new Point(0, 0), new Point(1, 1)];
            const qt = new QuadTree(new Box(0, 0, 1000, 2000), 4, points);

            expect(qt._points).toEqual(points);
        });

        test('default value nodeCapacity', () => {
            const qt = new QuadTree(new Box(0, 0, 1000, 2000));

            expect(qt._nodeCapacity).toEqual(4);
        });

        test('default value points', () => {
            const qt = new QuadTree(new Box(0, 0, 1000, 2000));

            expect(qt._points).toEqual([]);
        });
    });

    describe('insert + getAllPoints', () => {

    });

});


