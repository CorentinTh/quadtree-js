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



});


test('QT - 1 - Insert', () => {
    const qt = new QuadTree(new Box(0, 0, 500, 500));

    const p = new Point(10, 10);
    qt.insert(p);

    expect(qt.query(new Box(0, 0, 15, 15))).toEqual([p]);
    expect(qt.query(new Box(0, 0, 5, 5))).toEqual([]);

});

test('QT - 2 - Insert in constructor', () => {
    const p = new Point(10, 10);

    const qt = new QuadTree(new Box(0, 0, 500, 500), 4, [p]);

    expect(qt.query(new Box(0, 0, 15, 15))).toEqual([p]);
    expect(qt.query(new Box(0, 0, 5, 5))).toEqual([]);

});

test('QT - 3 - Multiple points', () => {
    const qt = new QuadTree(new Box(0, 0, 500, 500));

    const pointsIn = [
        new Point(50, 50),
        new Point(75, 50),
        new Point(50, 75),
        new Point(100, 100)
    ];

    const pointsOut = [
        new Point(0, 0),
        new Point(200, 200),
        new Point(75, 101),
        new Point(101, 75),
    ];

    for (const point of pointsIn) {
        qt.insert(point);
    }
    for (const point of pointsOut) {
        qt.insert(point);
    }

    const res = qt.query(new Box(50, 50, 50, 50));

    for (const point of pointsIn) {
        expect(res).toContain(point);
    }

    for (const point of pointsOut) {
        expect(res).not.toContain(point);
    }

});

test('QT - 3 - Remove', () => {
    const qt = new QuadTree(new Box(0, 0, 300, 300));

});
