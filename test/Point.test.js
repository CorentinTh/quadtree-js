import {Point, Box, Circle, QuadTree} from './../build/index'

describe('Class Point', () => {

    describe('constructor', () => {
        const x = 10, y = 20, data = 'some stuff';
        const point = new Point(x, y, data);

        test('sets attribute x', () => {
            expect(point.x).toBe(x);
        });

        test('sets attribute y', () => {
            expect(point.y).toBe(y);
        });

        test('sets attribute data', () => {
            expect(point.data).toEqual(data);
        });

    });
});

