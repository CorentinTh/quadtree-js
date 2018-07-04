import {Box, Point, QuadTree} from './../build/index';

function rand(max, min = 0) {
    return Math.floor(Math.random() * (max - min)) + min;
}


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
        describe('insert several single points', () => {
            const points = [], xMax = 1000, yMax = 1000;
            const qt = new QuadTree(new Box(0, 0, xMax, yMax));

            for (let i = 0; i < 100; i++) {
                const point = new Point(rand(xMax - 1, 1), rand(yMax - 1, 1));

                points.push(point);
                qt.insert(point);
            }

            const allPoints = qt.getAllPoints();

            test('Result length should be the same', () => {
                expect(allPoints.length).toBeGreaterThanOrEqual(points.length);
            });

            for (let i = 0; i < points.length; i++) {
                const point = points[i];

                test(`Point (x:${point.x}, y:${point.y}) is in the results`, () => {
                    expect(allPoints).toContainEqual(point)
                });
            }
        });


        describe('insert array of points', () => {
            const points = [], xMax = 1000, yMax = 1000;
            const qt = new QuadTree(new Box(0, 0, xMax, yMax));

            for (let i = 0; i < 100; i++) {
                const point = new Point(rand(xMax - 1, 1), rand(yMax - 1, 1));

                points.push(point);
            }

            qt.insert(points);

            const allPoints = qt.getAllPoints();

            test('Result length should be the same', () => {
                expect(allPoints.length).toBeGreaterThanOrEqual(points.length);
            });

            for (let i = 0; i < points.length; i++) {
                const point = points[i];

                test(`Point (x:${point.x}, y:${point.y}) is in the results`, () => {
                    expect(allPoints).toContainEqual(point)
                });
            }
        });
    });

    describe('query', () => {
        const xMax = 1000, yMax = 1000;
        const qt = new QuadTree(new Box(0, 0, xMax, yMax));

        const xZone = rand(xMax);
        const yZone = rand(yMax);
        const wZone = rand(xMax - xZone);
        const hZone = rand(yMax - yZone);

        const zone = new Box(xZone, yZone, wZone, hZone);

        const pointsIn = [];
        const pointsOut = [];

        for (let i = 0; i < 100; i++) {
            const point = new Point(rand(xMax - 1, 1), rand(yMax - 1, 1));

            if(zone.contains(point)){
                pointsIn.push(point);
            }else {
                pointsOut.push(point);
            }

            qt.insert(point);
        }

        const results = qt.query(zone);

        for (const point of pointsIn) {
            test(`Point (x:${point.x}, y:${point.y}) is in the results`, () => {
                expect(results).toContainEqual(point);
            });
        }
    })

});


